import { PaginatedDocuments, PaginationInput } from '@notes-app/contracts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useUserDocuments({
  page = 1,
  pageSize = 15,
}: Partial<PaginationInput> = {}) {
  return useQuery({
    queryKey: ['user-documents', page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const res = await fetch(`/api/documents/user-documents?${params}`);

      if (!res.ok) {
        throw new Error('Failed to fetch documents');
      }

      return (await res.json()) as PaginatedDocuments;
    },
    placeholderData: keepPreviousData,
  });
}
