'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi, type CollectionItem } from '@/lib/api';

export default function MessagesManager() {
  const [messages, setMessages] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setMessages(await adminApi.collection<CollectionItem>('messages'));
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function status(id: string, value: string) {
    await adminApi.updateItem('messages', id, { status: value });
    await load();
  }

  return (
    <section className="content-card">
      <div className="section-heading"><div><p className="eyebrow">INBOX</p><h2>Messages</h2><p className="section-copy">Messages submitted from the public contact form.</p></div><button className="secondary-button" onClick={load}>↻ Refresh</button></div>
      {loading ? <div className="table-state"><div className="loader" /></div> : (
        <div className="message-list">
          {messages.map((message) => (
            <article className="message-card" key={message.id}>
              <header><div><strong>{String(message.name)}</strong><a href={`mailto:${String(message.email)}`}>{String(message.email)}</a></div><select value={String(message.status)} onChange={(e) => status(message.id, e.target.value)}><option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option></select></header>
              <p>{String(message.message)}</p><small>{new Date(String(message.created_at)).toLocaleString()}</small>
            </article>
          ))}
          {!messages.length && <div className="table-state">Inbox is empty.</div>}
        </div>
      )}
    </section>
  );
}
