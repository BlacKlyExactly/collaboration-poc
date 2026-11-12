import { User } from '@notes-app/contracts';
import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');

      if (res.status === 401) {
        window.location.href = 'http://localhost:3000/api/auth/login';
        throw new Error('Unauthorized');
      }

      if (!res.ok) {
        window.location.href = 'http://localhost:3000/api/auth/login';
        throw new Error('Failed to fetch user');
      }

      return (await res.json()) as User | null;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });
}
