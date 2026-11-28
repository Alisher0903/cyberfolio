'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { MessageKey } from '@alisherdev/shared';
import { adminApi, type CollectionItem, type CollectionName } from '@/lib/api';
import { useI18n } from '@/lib/i18n/I18nProvider';

interface Field {
  key: string;
  labelKey: MessageKey;
  kind?: 'text' | 'textarea' | 'list' | 'color' | 'number' | 'status';
  required?: boolean;
}

const configs: Record<
  Exclude<CollectionName, 'messages'>,
  {
    titleKey: MessageKey;
    subtitleKey: MessageKey;
    primary: string;
    secondary: string;
    fields: Field[];
    defaults: Record<string, unknown>;
  }
> = {
  experiences: {
    titleKey: 'admin.collection.experiences.title',
    subtitleKey: 'admin.collection.experiences.subtitle',
    primary: 'role',
    secondary: 'company',
    fields: [
      { key: 'role', labelKey: 'admin.field.role', required: true },
      { key: 'company', labelKey: 'admin.field.company', required: true },
      { key: 'period', labelKey: 'admin.field.period' },
      { key: 'description', labelKey: 'admin.field.description', kind: 'textarea' },
      { key: 'tags', labelKey: 'admin.field.tags', kind: 'list' },
      { key: 'status', labelKey: 'common.status', kind: 'status' },
      { key: 'sort_order', labelKey: 'common.sortOrder', kind: 'number' },
    ],
    defaults: {
      role: '',
      company: '',
      period: '',
      description: '',
      tags: [],
      status: 'draft',
      sort_order: 0,
    },
  },
  skills: {
    titleKey: 'admin.collection.skills.title',
    subtitleKey: 'admin.collection.skills.subtitle',
    primary: 'name',
    secondary: 'slug',
    fields: [
      { key: 'name', labelKey: 'admin.field.name', required: true },
      { key: 'slug', labelKey: 'admin.field.slug', required: true },
      { key: 'skills', labelKey: 'admin.field.skills', kind: 'list' },
      { key: 'status', labelKey: 'common.status', kind: 'status' },
      { key: 'sort_order', labelKey: 'common.sortOrder', kind: 'number' },
    ],
    defaults: { name: '', slug: '', skills: [], status: 'draft', sort_order: 0 },
  },
  socials: {
    titleKey: 'admin.collection.socials.title',
    subtitleKey: 'admin.collection.socials.subtitle',
    primary: 'label',
    secondary: 'handle',
    fields: [
      { key: 'label', labelKey: 'admin.field.label', required: true },
      { key: 'handle', labelKey: 'admin.field.handle' },
      { key: 'href', labelKey: 'admin.field.url', required: true },
      { key: 'color', labelKey: 'admin.field.color', kind: 'color' },
      { key: 'status', labelKey: 'common.status', kind: 'status' },
      { key: 'sort_order', labelKey: 'common.sortOrder', kind: 'number' },
    ],
    defaults: { label: '', handle: '', href: '', color: '#00FF87', status: 'draft', sort_order: 0 },
  },
};

export default function CollectionManager({ name }: { name: Exclude<CollectionName, 'messages'> }) {
  const { t } = useI18n();
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
      setError(caught instanceof Error ? caught.message : t('admin.collection.couldNotLoad'));
    } finally {
      setLoading(false);
    }
  }, [name, t]);

  useEffect(() => {
    void load();
  }, [load]);

  function open(item: CollectionItem | null) {
    setEditing(item);
    setValue(item ?? config.defaults);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = { ...value };
    for (const field of config.fields) {
      if (field.kind === 'list' && typeof normalized[field.key] === 'string') {
        normalized[field.key] = (normalized[field.key] as string)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
      if (field.kind === 'number') normalized[field.key] = Number(normalized[field.key] ?? 0);
    }
    try {
      if (editing) await adminApi.updateItem(name, editing.id, normalized);
      else await adminApi.createItem(name, normalized);
      setEditing(undefined);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.collection.couldNotSave'));
    }
  }

  async function remove(item: CollectionItem) {
    if (
      !window.confirm(t('admin.collection.deleteConfirm', { name: String(item[config.primary]) }))
    )
      return;
    await adminApi.deleteItem(name, item.id);
    await load();
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('admin.collection.eyebrow')}</p>
          <h2>{t(config.titleKey)}</h2>
          <p className="section-copy">{t(config.subtitleKey)}</p>
        </div>
        <button className="primary-button compact" onClick={() => open(null)}>
          {t('admin.collection.addItem')}
        </button>
      </div>
      {error && <div className="error module-error">{error}</div>}
      {loading ? (
        <div className="table-state">
          <div className="loader" /> {t('common.loading')}
        </div>
      ) : (
        <div className="module-list">
          {items.map((item) => (
            <article className="module-row" key={item.id}>
              <div>
                <strong>{String(item[config.primary] ?? '')}</strong>
                <small>{String(item[config.secondary] ?? '')}</small>
              </div>
              <b className={`badge ${item.status}`}>
                {item.status === 'published' ? t('common.published') : t('common.draft')}
              </b>
              <div className="row-actions">
                <button onClick={() => open(item)}>{t('common.edit')}</button>
                <button className="danger-button" onClick={() => remove(item)}>
                  {t('common.delete')}
                </button>
              </div>
            </article>
          ))}
          {!items.length && <div className="table-state">{t('admin.collection.noContent')}</div>}
        </div>
      )}
      {editing !== undefined && (
        <div className="editor-backdrop" onMouseDown={() => setEditing(undefined)}>
          <aside className="editor-panel" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div>
                <p className="eyebrow">
                  {editing ? t('admin.collection.editItem') : t('admin.collection.newItem')}
                </p>
                <h2>{t(config.titleKey)}</h2>
              </div>
              <button className="icon-button" onClick={() => setEditing(undefined)}>
                ×
              </button>
            </header>
            <form onSubmit={submit}>
              <div className="form-grid">
                {config.fields.map((field) => (
                  <label
                    className={field.kind === 'textarea' || field.kind === 'list' ? 'wide' : ''}
                    key={field.key}
                  >
                    <span>{t(field.labelKey)}</span>
                    {field.kind === 'textarea' ? (
                      <textarea
                        rows={5}
                        required={field.required}
                        value={String(value[field.key] ?? '')}
                        onChange={(e) =>
                          setValue((current) => ({ ...current, [field.key]: e.target.value }))
                        }
                      />
                    ) : field.kind === 'status' ? (
                      <select
                        value={String(value[field.key] ?? 'draft')}
                        onChange={(e) =>
                          setValue((current) => ({ ...current, [field.key]: e.target.value }))
                        }
                      >
                        <option value="draft">{t('common.draft')}</option>
                        <option value="published">{t('common.published')}</option>
                      </select>
                    ) : (
                      <input
                        type={
                          field.kind === 'color'
                            ? 'color'
                            : field.kind === 'number'
                              ? 'number'
                              : 'text'
                        }
                        required={field.required}
                        value={
                          field.kind === 'list' && Array.isArray(value[field.key])
                            ? (value[field.key] as string[]).join(', ')
                            : String(value[field.key] ?? '')
                        }
                        onChange={(e) =>
                          setValue((current) => ({ ...current, [field.key]: e.target.value }))
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
              <footer>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditing(undefined)}
                >
                  {t('common.cancel')}
                </button>
                <button className="primary-button">{t('common.saveChanges')}</button>
              </footer>
            </form>
          </aside>
        </div>
      )}
    </section>
  );
}
