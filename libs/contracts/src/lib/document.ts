import { z } from 'zod';
import {
  createPaginationSchema,
  IdSchema,
  NonEmptyStringSchema,
} from './common';
import { UserSchema } from './user';

export const DocumentSchema = z.object({
  id: IdSchema,
  name: NonEmptyStringSchema,
  content: z.coerce.string(),
  userId: IdSchema,
  user: UserSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Document = z.infer<typeof DocumentSchema>;

export const CreateDocumentBodySchema = z.object({
  name: NonEmptyStringSchema,
});
export type CreateDocumentBody = z.infer<typeof CreateDocumentBodySchema>;

export const GetDocumentsResponseSchema =
  createPaginationSchema(DocumentSchema);
export type PaginatedDocuments = z.infer<typeof GetDocumentsResponseSchema>;

export const GetUserDocumentsParamsSchema = z.object({
  id: IdSchema,
});
export type GetUserDocumentsParams = z.infer<
  typeof GetUserDocumentsParamsSchema
>;

export const GetDocumentParamsSchema = z.object({
  id: IdSchema,
});
export type GetDocumentParams = z.infer<typeof GetDocumentParamsSchema>;

export const UpdateDocumentContentParamsSchema = z.object({
  id: IdSchema,
});

export type UpdateDocumentContentParams = z.infer<
  typeof UpdateDocumentContentParamsSchema
>;

export const UpdateDocumentContentBodySchema = z.object({
  newContent: z.string(),
});

export type UpdateDocumentContentBody = z.infer<
  typeof UpdateDocumentContentBodySchema
>;
