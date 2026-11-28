'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { MessageKey } from '@alisherdev/shared';
import { adminApi, type AdminProject, type ProjectDetailInput, type ProjectInput } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import LoginScreen from './LoginScreen';
import ProjectEditor from './ProjectEditor';
import CollectionManager from './CollectionManager';
import MessagesManager from './MessagesManager';
import SettingsManager from './SettingsManager';
import ResumesManager from './ResumesManager';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '@/lib/i18n/I18nProvider';

type Section =
  | 'overview'
  | 'projects'
  | 'experiences'
  | 'skills'
  | 'socials'
  | 'messages'
  | 'resumes'
  | 'settings';

export default function AdminShell() {
  const { t } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [selected, setSelected] = useState<AdminProject | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [section, setSection] = useState<Section>('overview');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProjects(await adminApi.projects());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.couldNotLoadProjects'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const listener = supabase?.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener?.data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) void loadProjects();
  }, [session, loadProjects]);

  if (!authReady)
    return (
      <main className="center-screen">
        <div className="loader" />
      </main>
    );
  if (!session) return <LoginScreen />;

  async function saveProject(input: ProjectInput, _detail: ProjectDetailInput, savedId?: string) {
    const id = savedId ?? selected?.id;
    const project = id
      ? await adminApi.updateProject(id, input)
      : await adminApi.createProject(input);
    await loadProjects();
    return project;
  }

  async function removeProject(project: AdminProject) {
    if (!window.confirm(t('admin.deleteProjectConfirm', { title: project.title }))) return;
    await adminApi.deleteProject(project.id);
    await loadProjects();
  }

  const sectionLabel = (key: Section) => t(`admin.nav.${key}` as MessageKey);
  const published = projects.filter((project) => project.status === 'published').length;
  const featured = projects.filter((project) => project.featured).length;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>&gt;_</span>
          <div>
            <strong>{t('admin.brand')}</strong>
            <small>{t('admin.brandSub')}</small>
          </div>
        </div>
        <nav>
          <button
            className={section === 'overview' ? 'active' : ''}
            onClick={() => setSection('overview')}
          >
            <span>⌂</span> {t('admin.nav.overview')}
          </button>
          <button
            className={section === 'projects' ? 'active' : ''}
            onClick={() => setSection('projects')}
          >
            <span>◉</span> {t('admin.nav.projects')} <b>{projects.length}</b>
          </button>
          <button
            className={section === 'experiences' ? 'active' : ''}
            onClick={() => setSection('experiences')}
          >
            <span>◇</span> {t('admin.nav.experiences')}
          </button>
          <button
            className={section === 'skills' ? 'active' : ''}
            onClick={() => setSection('skills')}
          >
            <span>◆</span> {t('admin.nav.skills')}
          </button>
          <button
            className={section === 'socials' ? 'active' : ''}
            onClick={() => setSection('socials')}
          >
            <span>↗</span> {t('admin.nav.socials')}
          </button>
          <button
            className={section === 'messages' ? 'active' : ''}
            onClick={() => setSection('messages')}
          >
            <span>✉</span> {t('admin.nav.messages')}
          </button>
          <button
            className={section === 'resumes' ? 'active' : ''}
            onClick={() => setSection('resumes')}
          >
            <span>▤</span> {t('admin.nav.resumes')}
          </button>
          <button
            className={section === 'settings' ? 'active' : ''}
            onClick={() => setSection('settings')}
          >
            <span>⚙</span> {t('admin.nav.settings')}
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="status-dot">
            <i /> {t('admin.apiConnected')}
          </div>
          <button onClick={() => supabase?.auth.signOut()}>{t('admin.signOut')}</button>
        </div>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              {t('admin.eyebrow', { section: sectionLabel(section).toUpperCase() })}
            </p>
            <h1>{section === 'overview' ? t('admin.greeting') : sectionLabel(section)}</h1>
          </div>
          <div className="topbar-actions">
            <LanguageSwitcher />
            {(section === 'overview' || section === 'projects') && (
              <button className="primary-button compact" onClick={() => setSelected(null)}>
                {t('admin.newProject')}
              </button>
            )}
          </div>
        </header>

        {error && <div className="error">{error}</div>}
        {section === 'overview' && (
          <section className="stats-grid">
            <article>
              <span>{t('admin.stat.allProjects')}</span>
              <strong>{projects.length.toString().padStart(2, '0')}</strong>
              <small>{t('admin.stat.entries')}</small>
            </article>
            <article>
              <span>{t('admin.stat.published')}</span>
              <strong className="green">{published.toString().padStart(2, '0')}</strong>
              <small>{t('admin.stat.visible')}</small>
            </article>
            <article>
              <span>{t('admin.stat.featured')}</span>
              <strong className="cyan">{featured.toString().padStart(2, '0')}</strong>
              <small>{t('admin.stat.highlights')}</small>
            </article>
            <article>
              <span>{t('admin.stat.system')}</span>
              <strong className="system-ok">{t('admin.stat.online')}</strong>
              <small>{t('admin.stat.operational')}</small>
            </article>
          </section>
        )}

        {(section === 'overview' || section === 'projects') && (
          <section className="content-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t('admin.content')}</p>
                <h2>{t('admin.nav.projects')}</h2>
              </div>
              <button className="secondary-button" onClick={loadProjects}>
                ↻ {t('common.refresh')}
              </button>
            </div>
            {loading ? (
              <div className="table-state">
                <div className="loader" /> {t('admin.loadingContent')}
              </div>
            ) : projects.length === 0 ? (
              <div className="table-state">{t('admin.noProjects')}</div>
            ) : (
              <div className="project-table">
                <div className="table-row table-head">
                  <span>{t('admin.table.project')}</span>
                  <span>{t('admin.table.category')}</span>
                  <span>{t('admin.table.year')}</span>
                  <span>{t('admin.table.status')}</span>
                  <span />
                </div>
                {projects.map((project) => (
                  <div className="table-row" key={project.id}>
                    <span className="project-cell">
                      <i style={{ background: project.color }} />
                      <span>
                        <strong>{project.title}</strong>
                        <small>/{project.slug}</small>
                      </span>
                    </span>
                    <span>{project.category || '—'}</span>
                    <span>{project.year || '—'}</span>
                    <span>
                      <b className={`badge ${project.status}`}>
                        {project.status === 'published' ? t('common.published') : t('common.draft')}
                      </b>
                    </span>
                    <span className="row-actions">
                      <button onClick={() => setSelected(project)}>{t('common.edit')}</button>
                      <button className="danger-button" onClick={() => removeProject(project)}>
                        {t('common.delete')}
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {section === 'experiences' && <CollectionManager name="experiences" />}
        {section === 'skills' && <CollectionManager name="skills" />}
        {section === 'socials' && <CollectionManager name="socials" />}
        {section === 'messages' && <MessagesManager />}
        {section === 'resumes' && <ResumesManager />}
        {section === 'settings' && <SettingsManager />}
      </main>
      {selected !== undefined && (
        <ProjectEditor
          project={selected}
          onClose={() => setSelected(undefined)}
          onSave={saveProject}
        />
      )}
    </div>
  );
}
