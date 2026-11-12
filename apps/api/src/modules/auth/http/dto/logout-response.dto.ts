import { LogoutResponseSchema } from '@notes-app/contracts';
import { createZodDto } from 'nestjs-zod';

export class LogoutResponseDto extends createZodDto(LogoutResponseSchema) {}
