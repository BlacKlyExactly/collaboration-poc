import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@notes-app/ui';
import { useCreateDocument } from '../mutations/use-create-document';
import { SubmitEvent, useState } from 'react';

export function CreateNoteCard() {
  const [name, setName] = useState('');
  const { mutateAsync, isPending } = useCreateDocument();

  async function handleCreateDocumentSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await mutateAsync({ name });
    if (res.ok) setName('');
  }

  return (
    <Card className="w-full sticky top-4 flex-row justify-between">
      <CardHeader className="flex-1">
        <CardTitle>Create note</CardTitle>
        <CardDescription>
          Create note by entering its name and clicking the button
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form
          onSubmit={handleCreateDocumentSubmit}
          className="flex gap-2 items-end justify-end"
        >
          <div className="flex flex-col gap-2 flex-1 max-w-[400px]">
            <Label>Note name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          <Button disabled={!name.trim() || isPending} type="submit">
            Create note
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
