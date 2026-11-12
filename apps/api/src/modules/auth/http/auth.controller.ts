import {
  Controller,
  Get,
  Patch,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { OidcService } from '../application/oidc.service';
import { AuthService } from '../application/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetUserDto } from './dto/get-user.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly oidc: OidcService,
    private readonly auth: AuthService,
  ) {}

  @Get('login')
  async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const { state, nonce, codeVerifier, authorizationUrl } =
      await this.oidc.buildAuthorizationUrl();

    req.session.oidc = {
      state,
      nonce,
      codeVerifier,
    };

    return reply.redirect(authorizationUrl.href, 302);
  }

  @Get('callback')
  async callback(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const session = req.session;

    if (!session.oidc) {
      throw new UnauthorizedException('OIDC Session is missing');
    }

    const { state, nonce, codeVerifier } = session.oidc;

    await this.auth.handleCallback({
      session,
      url: req.url,
      state,
      nonce,
      codeVerifier,
    });

    reply.redirect(this.oidc.getReturnUrl(), 302);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ZodSerializerDto(GetUserDto)
  me(@Req() req: FastifyRequest) {
    return req.user;
  }

  @Patch('logout')
  @ZodSerializerDto(LogoutResponseDto)
  async logout(@Req() req: FastifyRequest) {
    const url = await this.auth.logout(req.session);
    return {
      url,
    };
  }
}
