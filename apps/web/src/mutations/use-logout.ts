import { useMutation } from '@tanstack/react-query';
import { LogoutResponse } from '@notes-app/contracts';

export function useLogout() {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
        method: 'PATCH',
      });

      if (!res.ok) {
        throw new Error('Failed to logout');
      }

      const { url } = (await res.json()) as LogoutResponse;
      window.location.href = url;
    },
  });
}
