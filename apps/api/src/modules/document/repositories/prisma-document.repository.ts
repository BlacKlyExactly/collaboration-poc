import { Injectable } from '@nestjs/common';
import { type DocumentRepository } from '../application/ports/document.repository';
import { PersistenceService } from '../../../persistence/persistence.service';
import {
  PaginatedDocuments,
  PaginationParams,
  Document,
} from '../application/document.types';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prisma: PersistenceService) {}

  createDocument(name: string, userId: number) {
    return this.prisma.db.orm.public.Document.include('user').create({
      content: '',
      name,
      userId,
    });
  }

  async getDocuments({
    page,
    pageSize,
  }: PaginationParams): Promise<PaginatedDocuments> {
    const base = this.prisma.db.orm.public.Document;

    const [items, { total }] = await Promise.all([
      base
        .include('user')
        .orderBy((doc) => doc.id.desc())
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .all(),
      base.aggregate((a) => ({ total: a.count() })),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getUserDocuments(
    userId: number,
    { page, pageSize }: PaginationParams,
  ): Promise<PaginatedDocuments> {
    const base = this.prisma.db.orm.public.Document.where((doc) =>
      doc.userId.eq(userId),
    );

    const [items, { total }] = await Promise.all([
      base
        .include('user')
        .orderBy((doc) => doc.id.desc())
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .all(),
      base.aggregate((a) => ({ total: a.count() })),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getDocument(id: number): Promise<Document | null> {
    return await this.prisma.db.orm.public.Document.where((doc) =>
      doc.id.eq(id),
    )
      .include('user')
      .first();
  }

  async updateDocumentContent(
    documentId: number,
    newContent: string,
  ): Promise<Document | null> {
    return this.prisma.db.orm.public.Document.where((doc) =>
      doc.id.eq(documentId),
    )
      .include('user')
      .update({
        content: newContent,
      });
  }
}
