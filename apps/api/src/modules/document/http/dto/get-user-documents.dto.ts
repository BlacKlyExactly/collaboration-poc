import { GetUserDocumentsParamsSchema } from '@notes-app/contracts';
import { createZodDto } from 'nestjs-zod';

export class GetUserDocumentsParamsDto extends createZodDto(
  GetUserDocumentsParamsSchema,
) {}
