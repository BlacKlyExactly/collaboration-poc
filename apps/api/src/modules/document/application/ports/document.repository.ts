import {
  Document,
  PaginatedDocuments,
  PaginationParams,
} from '../document.types';

export interface DocumentRepository {
  createDocument(name: string, userId: number): Promise<Document>;
  getDocument(id: number): Promise<Document | null>;
  getDocuments(input: PaginationParams): Promise<PaginatedDocuments>;
  getUserDocuments(
    userId: number,
    pagination: PaginationParams,
  ): Promise<PaginatedDocuments>;
  updateDocumentContent(
    documentId: number,
    newContent: string,
  ): Promise<Document | null>;
}

export const DOCUMENT_REPOSITORY = Symbol('DOCUMENT_REPOSITORY');
