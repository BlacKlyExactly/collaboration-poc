import { z, ZodType } from 'zod';

export const IdSchema = z.coerce.number().nonnegative();
export const NonEmptyStringSchema = z.string().trim().min(1);

export const PaginationInputSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type PaginationInput = z.infer<typeof PaginationInputSchema>;

export function createPaginationSchema<T extends ZodType>(base: T) {
  return z.object({
    items: z.array(base),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });
}
