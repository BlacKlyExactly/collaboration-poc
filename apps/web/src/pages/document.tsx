import { useNavigate, useParams } from 'react-router-dom';
import { useDocument } from '../queries/use-document';
import { Spinner, Textarea } from '@notes-app/ui';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { useEffect, useRef, useState } from 'react';
import { updateYText } from '../utils';

export function Document() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useDocument(id);
  const [value, setValue] = useState('');

  const providerRef = useRef<HocuspocusProvider | null>(null);
  const docRef = useRef<Y.Doc>(new Y.Doc());

  useEffect(() => {
    if (!data?.id) return;

    providerRef.current = new HocuspocusProvider({
      url: 'ws://localhost:2137',
      name: String(data?.id),
      document: docRef.current,
    });

    return () => {
      providerRef.current?.destroy();
      docRef.current?.destroy();
    };
  }, [data]);

  useEffect(() => {
    const doc = docRef.current;

    const text = doc.getText('content');

    const observer = () => {
      setValue(text.toString());
    };

    text.observe(observer);
    setValue(text.toString());

    return () => {
      text.unobserve(observer);
    };
  }, [docRef.current]);

  if (isLoading) return <Spinner className="w-6 h-6 m-4" />;
  if (isError || !data) {
    navigate('/');
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateYText(docRef.current.getText('content'), event.target.value);
  };

  return (
    <div className="p-4 flex-1 flex flex-col">
      <Textarea className="flex-1" value={value} onChange={handleChange} />
    </div>
  );
}
