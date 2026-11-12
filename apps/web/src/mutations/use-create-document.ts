import { CreateDocumentBody } from '@notes-app/contracts';
import { toast } from '@notes-app/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-document'],
    mutationFn: async ({ name }: CreateDocumentBody) =>
      toast.promise(
        fetch('/api/documents', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
          }),
        }),
        {
          loading: 'Creating note...',
          success: `Note ${name} created`,
          error: "Couldn't create a note",
        },
      ),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['user-documents'] });
    },
  });
}
