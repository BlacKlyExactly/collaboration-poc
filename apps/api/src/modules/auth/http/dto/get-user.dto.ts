import { createZodDto } from 'nestjs-zod';
import { UserSchema } from '@notes-app/contracts';

export class GetUserDto extends createZodDto(UserSchema) {}
