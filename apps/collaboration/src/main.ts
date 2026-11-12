#!/usr/bin/env tsx
// @nx-target-name: serve

import { Server } from '@hocuspocus/server';
import { Document } from '@notes-app/contracts';

const API = 'http://localhost:3000';

type Ctx = { docId: string; cookie: string };

const server = new Server({
  port: 2137,
  async onAuthenticate({ requestHeaders, documentName }) {
    const cookie = requestHeaders.get('cookie');
    if (!cookie) throw new Error('Unauthenticated');

    const res = await fetch(`${API}/api/documents/${documentName}`, {
      headers: { cookie },
    });
    if (!res.ok) {
      throw new Error(res.status === 401 ? 'Unauthenticated' : 'Forbidden');
    }

    return { docId: documentName, cookie } satisfies Ctx;
  },
  async onLoadDocument({ document: yDoc, context }) {
    const ctx = context as Ctx;
    const yText = yDoc.getText('content');
    if (yText.length > 0) return;

    const res = await fetch(`${API}/api/documents/${ctx.docId}`, {
      headers: { cookie: ctx.cookie },
    });
    if (!res.ok) throw new Error('Note not found');

    const document = (await res.json()) as Document | null;
    if (!document) throw new Error('Note not found');

    yText.insert(0, document.content);
  },
  async onStoreDocument({ lastContext: context, document: yDoc }) {
    const ctx = context as Ctx;

    const res = await fetch(
      `${API}/api/documents/update-content/${ctx.docId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          cookie: ctx.cookie,
        },
        body: JSON.stringify({
          newContent: yDoc.getText('content').toString(),
        }),
      },
    );

    if (!res.ok) {
      throw new Error('Failed to store document');
    }
  },
});

server.listen();
