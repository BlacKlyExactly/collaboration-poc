import { DocumentSchema, GetDocumentParamsSchema } from '@notes-app/contracts';
import { createZodDto } from 'nestjs-zod';

export class GetDocumentParamsDto extends createZodDto(
  GetDocumentParamsSchema,
) {}

export class GetDocumentResponseDto extends createZodDto(DocumentSchema) {}
