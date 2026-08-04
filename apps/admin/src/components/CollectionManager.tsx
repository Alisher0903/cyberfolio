'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  adminApi,
  type CollectionItem,
  type CollectionName,
} from '@/lib/api';

interface Field {
  key: string;
  label: string;
  kind?: 'text' | 'textarea' | 'list' | 'color' | 'number' | 'status';
  required?: boolean;
}

const configs: Record<Exclude<CollectionName, 'messages'>, {
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
  fields: Field[];
  defaults: Record<string, unknown>;
}> = {
  experiences: {
    title: 'Experience',
    subtitle: 'Career timeline shown in the About section.',
    primary: 'role',
    secondary: 'company',
    fields: [
      { key: 'role', label: 'Role', required: true },
      { key: 'company', label: 'Company', required: true },
      { key: 'period', label: 'Period' },
      { key: 'description', label: 'Description', kind: 'textarea' },
      { key: 'tags', label: 'Tags', kind: 'list' },
      { key: 'status', label: 'Status', kind: 'status' },
      { key: 'sort_order', label: 'Sort order', kind: 'number' },
    ],
    defaults: { role: '', company: '', period: '', description: '', tags: [], status: 'draft', sort_order: 0 },
  },
  skills: {
    title: 'Skill categories',
    subtitle: 'Technology groups and individual skills.',
    primary: 'name',
    secondary: 'slug',
    fields: [
      { key: 'name', label: 'Category name', required: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'skills', label: 'Skills', kind: 'list' },
      { key: 'status', label: 'Status', kind: 'status' },
      { key: 'sort_order', label: 'Sort order', kind: 'number' },
    ],
    defaults: { name: '', slug: '', skills: [], status: 'draft', sort_order: 0 },
  },
  socials: {
    title: 'Social links',
    subtitle: 'Public contact channels and profile URLs.',
    primary: 'label',
    secondary: 'handle',
    fields: [
      { key: 'label', label: 'Label', required: true },
      { key: 'handle', label: 'Handle' },
      { key: 'href', label: 'URL', required: true },
      { key: 'color', label: 'Accent color', kind: 'color' },
      { key: 'status', label: 'Status', kind: 'status' },
      { key: 'sort_order', label: 'Sort order', kind: 'number' },
    ],
    defaults: { label: '', handle: '', href: '', color: '#00FF87', status: 'draft', sort_order: 0 },
  },
};

export default function CollectionManager({ name }: { name: Exclude<CollectionName, 'messages'> }) {
  const config = configs[name];
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [editing, setEditing] = useState<CollectionItem | null | undefined>(undefined);
  const [value, setValue] = useState<Record<string, unknown>>(config.defaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await adminApi.collection<CollectionItem>(name));
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load content');
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => { void load(); }, [load]);

  function open(item: CollectionItem | null) {
    setEditing(item);
    setValue(item ?? config.defaults);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = { ...value };
    for (const field of config.fields) {
      if (field.kind === 'list' && typeof normalized[field.key] === 'string') {
        normalized[field.key] = (normalized[field.key] as string).split(',').map((item) => item.trim()).filter(Boolean);
      }
      if (field.kind === 'number') normalized[field.key] = Number(normalized[field.key] ?? 0);
    }
    try {
      if (editing) await adminApi.updateItem(name, editing.id, normalized);
      else await adminApi.createItem(name, normalized);
      setEditing(undefined);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save content');
    }
  }

  async function remove(item: CollectionItem) {
    if (!window.confirm(`Delete “${String(item[config.primary])}”?`)) return;
    await adminApi.deleteItem(name, item.id);
    await load();
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div><p className="eyebrow">CONTENT MODULE</p><h2>{config.title}</h2><p className="section-copy">{config.subtitle}</p></div>
        <button className="primary-button compact" onClick={() => open(null)}>+ Add item</button>
      </div>
      {error && <div className="error module-error">{error}</div>}
      {loading ? <div className="table-state"><div className="loader" /> Loading…</div> : (
        <div className="module-list">
          {items.map((item) => (
            <article className="module-row" key={item.id}>
              <div><strong>{String(item[config.primary] ?? '')}</strong><small>{String(item[config.secondary] ?? '')}</small></div>
              <b className={`badge ${item.status}`}>{item.status}</b>
              <div className="row-actions"><button onClick={() => open(item)}>Edit</button><button className="danger-button" onClick={() => remove(item)}>Delete</button></div>
            </article>
          ))}
          {!items.length && <div className="table-state">No content yet.</div>}
        </div>
      )}
      {editing !== undefined && (
        <div className="editor-backdrop" onMouseDown={() => setEditing(undefined)}>
          <aside className="editor-panel" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><p className="eyebrow">{editing ? 'EDIT ITEM' : 'NEW ITEM'}</p><h2>{config.title}</h2></div><button className="icon-button" onClick={() => setEditing(undefined)}>×</button></header>
            <form onSubmit={submit}>
              <div className="form-grid">
                {config.fields.map((field) => (
                  <label className={field.kind === 'textarea' || field.kind === 'list' ? 'wide' : ''} key={field.key}>
                    <span>{field.label}</span>
                    {field.kind === 'textarea' ? (
                      <textarea rows={5} required={field.required} value={String(value[field.key] ?? '')} onChange={(e) => setValue((current) => ({ ...current, [field.key]: e.target.value }))} />
                    ) : field.kind === 'status' ? (
                      <select value={String(value[field.key] ?? 'draft')} onChange={(e) => setValue((current) => ({ ...current, [field.key]: e.target.value }))}><option value="draft">Draft</option><option value="published">Published</option></select>
                    ) : (
                      <input type={field.kind === 'color' ? 'color' : field.kind === 'number' ? 'number' : 'text'} required={field.required} value={field.kind === 'list' && Array.isArray(value[field.key]) ? (value[field.key] as string[]).join(', ') : String(value[field.key] ?? '')} onChange={(e) => setValue((current) => ({ ...current, [field.key]: e.target.value }))} />
                    )}
                  </label>
                ))}
              </div>
              <footer><button type="button" className="secondary-button" onClick={() => setEditing(undefined)}>Cancel</button><button className="primary-button">Save changes</button></footer>
            </form>
          </aside>
        </div>
      )}
    </section>
  );
}
