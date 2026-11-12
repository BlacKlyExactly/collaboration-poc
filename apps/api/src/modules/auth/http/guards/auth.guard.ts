import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '../../application/session.service';
import { FastifyRequest } from 'fastify';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../../user/application/ports/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();

    const session = req.session;

    await this.sessionService.refreshSession(session);

    if (!req.session.user) {
      await this.sessionService.destroySession(session);
      throw new UnauthorizedException();
    }

    const { sub } = req.session.user;
    const user = await this.userRepository.getUser(sub);

    if (!user) {
      await this.sessionService.destroySession(session);
      throw new UnauthorizedException();
    }

    req.user = user;

    return true;
  }
}
