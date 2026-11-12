import { z } from 'zod';
import { IdSchema, NonEmptyStringSchema } from './common';

export const UserSchema = z.object({
  id: IdSchema,
  email: z.email().min(1),
  sub: NonEmptyStringSchema,
  name: NonEmptyStringSchema,
});
export type User = z.infer<typeof UserSchema>;
