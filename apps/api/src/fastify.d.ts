import { type Models } from '@notes-app/prisma';
import { User } from './modules/user/application/user.types';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}
