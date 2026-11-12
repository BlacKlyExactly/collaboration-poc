import {
  DocumentSchema,
  GetDocumentsResponseSchema,
  PaginationInputSchema,
} from '@notes-app/contracts';
import { createZodDto } from 'nestjs-zod';

export class GetDocumentsResponseDto extends createZodDto(
  GetDocumentsResponseSchema,
) {}

export class GetDocumentsQueryDto extends createZodDto(PaginationInputSchema) {}

export class GetDocumentResponseDto extends createZodDto(DocumentSchema) {}
