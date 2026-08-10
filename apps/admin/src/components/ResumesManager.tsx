'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi, type CloudResume } from '@/lib/api';

const arrayCount = (value: unknown) => (Array.isArray(value) ? value.length : 0);

export default function ResumesManager() {
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
      setError(caught instanceof Error ? caught.message : 'Could not load resumes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(resume: CloudResume) {
    if (!window.confirm(`Delete ${resume.name || 'this resume'}?`)) return;
    await adminApi.deleteResume(resume.id);
    if (selected?.id === resume.id) setSelected(null);
    await load();
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">RESUME LIBRARY</p>
          <h2>Cloud resumes</h2>
          <p className="section-copy">Optional backups created in the public Resume Builder.</p>
        </div>
        <button className="secondary-button" onClick={load}>
          ↻ Refresh
        </button>
      </div>
      {error && <div className="error module-error">{error}</div>}
      {loading ? (
        <div className="table-state">
          <div className="loader" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="table-state">No cloud resumes yet.</div>
      ) : (
        <div className="resume-admin-grid">
          {resumes.map((resume) => (
            <article className="resume-admin-card" key={resume.id}>
              <div>
                <strong>{resume.name || 'Unnamed resume'}</strong>
                <span>{resume.title || 'No title'}</span>
              </div>
              <dl>
                <div>
                  <dt>Experience</dt>
                  <dd>{arrayCount(resume.data.work)}</dd>
                </div>
                <div>
                  <dt>Projects</dt>
                  <dd>{arrayCount(resume.data.projects)}</dd>
                </div>
                <div>
                  <dt>Skills</dt>
                  <dd>{arrayCount(resume.data.skillGroups)}</dd>
                </div>
              </dl>
              <small>Updated {new Date(resume.updated_at).toLocaleString()}</small>
              <footer>
                <button onClick={() => setSelected(resume)}>View resume</button>
                <button className="danger-button" onClick={() => remove(resume)}>
                  Delete
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
                <p className="eyebrow">RESUME DATA</p>
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
