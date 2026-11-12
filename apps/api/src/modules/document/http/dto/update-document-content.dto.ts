import {
  UpdateDocumentContentBodySchema,
  UpdateDocumentContentParamsSchema,
} from '@notes-app/contracts';
import { createZodDto } from 'nestjs-zod';

export class UpdateDocumentContentBodyDto extends createZodDto(
  UpdateDocumentContentBodySchema,
) {}

export class UpdateDocumentContentParamsDto extends createZodDto(
  UpdateDocumentContentParamsSchema,
) {}
