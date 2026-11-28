'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi, type CollectionItem } from '@/lib/api';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function MessagesManager() {
  const { t, formatDate } = useI18n();
  const [messages, setMessages] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setMessages(await adminApi.collection<CollectionItem>('messages'));
    setLoading(false);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  async function status(id: string, value: string) {
    await adminApi.updateItem('messages', id, { status: value });
    await load();
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('admin.messages.eyebrow')}</p>
          <h2>{t('admin.messages.title')}</h2>
          <p className="section-copy">{t('admin.messages.subtitle')}</p>
        </div>
        <button className="secondary-button" onClick={load}>
          ↻ {t('common.refresh')}
        </button>
      </div>
      {loading ? (
        <div className="table-state">
          <div className="loader" />
        </div>
      ) : (
        <div className="message-list">
          {messages.map((message) => (
            <article className="message-card" key={message.id}>
              <header>
                <div>
                  <strong>{String(message.name)}</strong>
                  <a href={`mailto:${String(message.email)}`}>{String(message.email)}</a>
                </div>
                <select
                  value={String(message.status)}
                  onChange={(e) => status(message.id, e.target.value)}
                >
                  <option value="new">{t('admin.messages.new')}</option>
                  <option value="read">{t('admin.messages.read')}</option>
                  <option value="archived">{t('admin.messages.archived')}</option>
                </select>
              </header>
              <p>{String(message.message)}</p>
              <small>{formatDate(String(message.created_at))}</small>
            </article>
          ))}
          {!messages.length && <div className="table-state">{t('admin.messages.empty')}</div>}
        </div>
      )}
    </section>
  );
}
