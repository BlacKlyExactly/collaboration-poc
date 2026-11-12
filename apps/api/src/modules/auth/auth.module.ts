import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './http/auth.controller';
import { OidcService } from './application/oidc.service';
import { UserModule } from '../user/user.module';
import { SessionService } from './application/session.service';
import { AuthGuard } from './http/guards/auth.guard';

@Module({
  imports: [UserModule],
  providers: [AuthService, OidcService, SessionService, AuthGuard],
  controllers: [AuthController],
  exports: [UserModule, OidcService, SessionService, AuthGuard],
})
export class AuthModule {}
