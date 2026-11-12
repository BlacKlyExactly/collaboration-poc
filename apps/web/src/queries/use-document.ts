import { Document, User } from '@notes-app/contracts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useDocument(documentId: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const data: User | null | undefined = queryClient.getQueryData(['user']);

      if (!data) {
        window.location.href = 'http://localhost:3000/api/auth/login';
        throw new Error('Failed to authenticate an user');
      }

      const res = await fetch(`/api/documents/${documentId}`);

      if (!res.ok) {
        throw new Error('Failed to fetch documents');
      }

      return (await res.json()) as Document;
    },
  });
}
