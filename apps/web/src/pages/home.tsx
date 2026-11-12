import {
  cn,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Spinner,
} from '@notes-app/ui';
import { CreateNoteCard } from '../components/create-note-card';
import { NoteCard } from '../components/note-card';
import { useMemo } from 'react';
import { NotebookPen } from 'lucide-react';
import { useUserDocuments } from '../queries/use-user-documents';
import { UrlPagination } from '../components/pagination';
import { useSearchParams } from 'react-router-dom';

export function Home() {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useUserDocuments({
    page: Number(searchParams.get('page') ?? 1),
    pageSize: 15,
  });

  console.log(data);

  const documentItems = useMemo(() => {
    const documents = data?.items ?? [];

    if (isLoading) return <Spinner className="w-6 h-6" />;
    if (!documents.length)
      return (
        <Empty className="h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <NotebookPen />
            </EmptyMedia>
            <EmptyTitle>No Notes Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any notes yet. Get started by creating
              your first note.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );

    return documents.map((doc) => <NoteCard key={doc.id} {...doc} />);
  }, [data?.items, isLoading]);

  return (
    <div className="p-4 flex-1 flex flex-col">
      <CreateNoteCard />
      <div
        className={cn('mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 flex-1', {
          'block flex-1': !data?.items?.length,
        })}
      >
        {documentItems}
      </div>
      <footer className="flex flex-1 items-center bg-card mt-4 max-h-[75px]">
        <UrlPagination totalPages={data?.totalPages ?? 0} />
      </footer>
    </div>
  );
}
