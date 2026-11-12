import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@notes-app/ui';
import { Document } from '@notes-app/contracts';

export function NoteCard({ id, name, content }: Document) {
  const preview = content?.trim();

  return (
    <Link
      to={`/${id}`}
      className="focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2"
    >
      <Card className="hover:bg-accent/50 h-full transition-colors">
        <CardHeader>
          <CardTitle className="truncate">{name}</CardTitle>
          <CardDescription>
            {preview ? 'Preview' : 'Empty note'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-4 text-sm">
            {preview || 'No content yet.'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
