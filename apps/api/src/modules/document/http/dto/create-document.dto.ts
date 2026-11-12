import { CreateDocumentBodySchema, DocumentSchema } from '@notes-app/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateDocumentBodyDto extends createZodDto(
  CreateDocumentBodySchema,
) {}

export class CreateDocumentResponseDto extends createZodDto(DocumentSchema) {}
