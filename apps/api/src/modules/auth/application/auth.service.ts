import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../user/application/ports/user.repository';
import { SessionService } from './session.service';
import { FastifySessionObject } from '@fastify/session';
import { OidcService } from './oidc.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    private readonly sessionService: SessionService,
    private readonly oidcService: OidcService,
  ) {}

  async handleCallback({
    session,
    url,
    state,
    nonce,
    codeVerifier,
  }: {
    session: FastifySessionObject;
    url: string;
    state: string;
    nonce: string;
    codeVerifier: string;
  }) {
    const claims = await this.sessionService.initializeSession(session, {
      url,
      state,
      nonce,
      codeVerifier,
    });

    const { sub, name, email } = claims;

    await this.userRepo.upsertUser({
      sub,
      name: String(name),
      email: String(email),
    });

    return claims;
  }

  async logout(session: FastifySessionObject) {
    const logoutUrl = new URL(this.oidcService.getLogoutUrl());
    logoutUrl.searchParams.set('id_token_hint', session.tokens.idToken);
    logoutUrl.searchParams.set(
      'post_logout_redirect_uri',
      'http://localhost:3000/api/auth/login',
    );

    await this.sessionService.destroySession(session);
    return String(logoutUrl);
  }
}
