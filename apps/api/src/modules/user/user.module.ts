import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../persistence/persistence.module';
import { USER_REPOSITORY } from './application/ports/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';

@Module({
  imports: [PersistenceModule],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
