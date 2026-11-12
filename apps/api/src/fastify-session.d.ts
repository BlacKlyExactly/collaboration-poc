import 'fastify';

declare module 'fastify' {
  interface Session {
    oidc?: {
      state: string;
      nonce: string;
      codeVerifier: string;
    };

    tokens?: {
      accessToken: string;
      refreshToken?: string;
      idToken?: string;
      expiresAt: number;
    };

    user?: {
      sub: string;
      email?: string;
      name?: string;
    };
  }
}
