import { z } from 'zod';

export const LogoutResponseSchema = z.object({
  url: z.url().min(1),
});
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
