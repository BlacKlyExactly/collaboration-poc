import { Module } from '@nestjs/common';
import { DocumentController } from './http/document.controller';
import { PersistenceModule } from '../../persistence/persistence.module';
import { AuthModule } from '../auth/auth.module';
import { DOCUMENT_REPOSITORY } from './application/ports/document.repository';
import { PrismaDocumentRepository } from './repositories/prisma-document.repository';

@Module({
  imports: [PersistenceModule, AuthModule],
  providers: [
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: PrismaDocumentRepository,
    },
  ],
  controllers: [DocumentController],
  exports: [DOCUMENT_REPOSITORY],
})
export class DocumentModule {}
