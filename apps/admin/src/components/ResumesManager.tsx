'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi, type CloudResume } from '@/lib/api';
import { useI18n } from '@/lib/i18n/I18nProvider';

const arrayCount = (value: unknown) => (Array.isArray(value) ? value.length : 0);

export default function ResumesManager() {
  const { t, formatDate } = useI18n();
  const [resumes, setResumes] = useState<CloudResume[]>([]);
  const [selected, setSelected] = useState<CloudResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setResumes(await adminApi.resumes());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.resumes.couldNotLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(resume: CloudResume) {
    if (
      !window.confirm(
        t('admin.resumes.deleteConfirm', {
          name: resume.name || t('admin.resumes.unnamed'),
        }),
      )
    )
      return;
    await adminApi.deleteResume(resume.id);
    if (selected?.id === resume.id) setSelected(null);
    await load();
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('admin.resumes.eyebrow')}</p>
          <h2>{t('admin.resumes.title')}</h2>
          <p className="section-copy">{t('admin.resumes.subtitle')}</p>
        </div>
        <button className="secondary-button" onClick={load}>
          ↻ {t('common.refresh')}
        </button>
      </div>
      {error && <div className="error module-error">{error}</div>}
      {loading ? (
        <div className="table-state">
          <div className="loader" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="table-state">{t('admin.resumes.empty')}</div>
      ) : (
        <div className="resume-admin-grid">
          {resumes.map((resume) => (
            <article className="resume-admin-card" key={resume.id}>
              <div>
                <strong>{resume.name || t('admin.resumes.unnamed')}</strong>
                <span>{resume.title || t('admin.resumes.noTitle')}</span>
              </div>
              <dl>
                <div>
                  <dt>{t('admin.resumes.experience')}</dt>
                  <dd>{arrayCount(resume.data.work)}</dd>
                </div>
                <div>
                  <dt>{t('admin.resumes.projects')}</dt>
                  <dd>{arrayCount(resume.data.projects)}</dd>
                </div>
                <div>
                  <dt>{t('admin.resumes.skills')}</dt>
                  <dd>{arrayCount(resume.data.skillGroups)}</dd>
                </div>
              </dl>
              <small>{t('admin.resumes.updated', { date: formatDate(resume.updated_at) })}</small>
              <footer>
                <button onClick={() => setSelected(resume)}>{t('admin.resumes.view')}</button>
                <button className="danger-button" onClick={() => remove(resume)}>
                  {t('common.delete')}
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}
      {selected && (
        <div
          className="resume-viewer-backdrop"
          onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}
        >
          <article className="resume-viewer">
            <header>
              <div>
                <p className="eyebrow">{t('admin.resumes.data')}</p>
                <h2>{selected.name}</h2>
                <span>{selected.title}</span>
              </div>
              <button className="icon-button" onClick={() => setSelected(null)}>
                ×
              </button>
            </header>
            <pre>{JSON.stringify(selected.data, null, 2)}</pre>
          </article>
        </div>
      )}
    </section>
  );
}
