import { User } from '../../user/application/user.types';

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type Pagination<T> = PaginationParams & {
  items: T[];
  total: number;
  totalPages: number;
};

export type Document = {
  id: number;
  name: string;
  content: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedDocuments = Pagination<Document>;
