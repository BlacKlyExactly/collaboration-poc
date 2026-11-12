import { FastifySessionObject } from '@fastify/session';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OidcService, SessionExpiredError } from './oidc.service';

@Injectable()
export class SessionService {
  constructor(private readonly oidc: OidcService) {}

  async initializeSession(
    session: FastifySessionObject,
    {
      url,
      state,
      nonce,
      codeVerifier,
    }: {
      url: string;
      state: string;
      nonce: string;
      codeVerifier: string;
    },
  ) {
    const tokens = await this.oidc.exchangeTokens(
      new URL(url, 'http://localhost:3000'),
      state,
      nonce,
      codeVerifier,
    );

    if (!tokens) {
      throw new UnauthorizedException();
    }

    const expiresIn = tokens.expiresIn();

    if (!expiresIn) {
      throw new UnauthorizedException();
    }

    delete session.oidc;

    const expiresAt = Date.now() + expiresIn * 1000;

    session.tokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiresAt,
    };

    const claims = tokens.claims();

    if (!claims) {
      throw new UnauthorizedException();
    }

    const { sub, email, name } = claims;

    session.user = {
      sub,
      email: String(email),
      name: String(name),
    };

    return claims;
  }

  async refreshSession(session: FastifySessionObject) {
    const current = session.tokens;
    if (!current) {
      throw new UnauthorizedException();
    }

    if (current.expiresAt > Date.now() + 30000) {
      return current.accessToken;
    }

    if (!current.refreshToken) {
      await this.destroySession(session);
      throw new UnauthorizedException();
    }

    let result: Awaited<ReturnType<OidcService['refreshTokens']>>;
    try {
      result = await this.oidc.refreshTokens(current.refreshToken);
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        await this.destroySession(session);
        throw new UnauthorizedException('Session expired');
      }
      throw err;
    }

    const { claims, ...refreshed } = result;

    if (!claims) {
      throw new UnauthorizedException();
    }

    session.tokens = {
      ...current,
      ...refreshed,
      accessToken: refreshed.accessToken ?? current.accessToken,
      refreshToken: refreshed.refreshToken ?? current.refreshToken,
      idToken: refreshed.idToken ?? current.idToken,
    };

    const { sub, email, name } = claims;

    session.user = {
      sub,
      email: String(email),
      name: String(name),
    };

    return refreshed.accessToken;
  }

  async destroySession(session: FastifySessionObject) {
    delete session.user;
    delete session.tokens;
    await session.destroy();
  }
}
