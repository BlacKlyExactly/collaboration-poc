import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oidc from 'openid-client';

export class SessionExpiredError extends Error {
  constructor() {
    super('Session expired');
  }
}

@Injectable()
export class OidcService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private oidcConfig!: oidc.Configuration;
  private issuer!: string;
  private clientId!: string;
  private secret!: string;
  private callback!: string;
  private returnUrl!: string;

  async onModuleInit() {
    this.issuer = this.configService.getOrThrow('OIDC_ISSUER');
    this.clientId = this.configService.getOrThrow('OIDC_CLIENT_ID');
    this.secret = this.configService.getOrThrow('OIDC_SECRET');
    this.callback = this.configService.getOrThrow('OIDC_CALLBACK');
    this.returnUrl = this.configService.getOrThrow('OIDC_RETURN_URL');

    this.oidcConfig = await oidc.discovery(
      new URL(this.issuer),
      this.clientId,
      this.secret,
      undefined,
      {
        execute: [oidc.allowInsecureRequests],
      },
    );
  }

  getConfig(): oidc.Configuration {
    return this.oidcConfig;
  }

  getReturnUrl() {
    return this.returnUrl;
  }

  async buildAuthorizationUrl() {
    const state = oidc.randomState();
    const nonce = oidc.randomNonce();
    const codeVerifier = oidc.randomPKCECodeVerifier();

    const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);

    const authorizationUrl = oidc.buildAuthorizationUrl(this.oidcConfig, {
      redirect_uri: this.callback,
      scope: 'openid profile email',
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
      nonce,
    });

    return {
      state,
      nonce,
      codeVerifier,
      authorizationUrl,
    };
  }

  exchangeTokens(
    currentUrl: URL,
    state: string,
    nonce: string,
    codeVerifier: string,
  ) {
    return oidc.authorizationCodeGrant(this.oidcConfig, currentUrl, {
      pkceCodeVerifier: codeVerifier,
      expectedState: state,
      expectedNonce: nonce,
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const tokens = await oidc.refreshTokenGrant(
        this.oidcConfig,
        refreshToken,
      );

      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? refreshToken,
        idToken: tokens.id_token,
        expiresAt: Date.now() + (tokens.expiresIn() ?? 0) * 1000,
        claims: tokens.claims(),
      };
    } catch (err) {
      if (
        err instanceof oidc.ResponseBodyError &&
        err.error === 'invalid_grant'
      ) {
        throw new SessionExpiredError();
      }
      throw err;
    }
  }

  async revokeTokens(refreshToken: string, accessToken: string) {
    await Promise.all([
      oidc.tokenRevocation(this.oidcConfig, refreshToken),
      oidc.tokenRevocation(this.oidcConfig, accessToken),
    ]);
  }

  getLogoutUrl() {
    return this.oidcConfig.serverMetadata().end_session_endpoint;
  }
}
