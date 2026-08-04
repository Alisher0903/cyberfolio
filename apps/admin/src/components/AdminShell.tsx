'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { adminApi, type AdminProject, type ProjectDetailInput, type ProjectInput } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import LoginScreen from './LoginScreen';
import ProjectEditor from './ProjectEditor';
import CollectionManager from './CollectionManager';
import MessagesManager from './MessagesManager';
import SettingsManager from './SettingsManager';

type Section = 'overview' | 'projects' | 'experiences' | 'skills' | 'socials' | 'messages' | 'settings';

export default function AdminShell() {
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
      setError(caught instanceof Error ? caught.message : 'Could not load projects');
    } finally {
      setLoading(false);
    }
  }, []);

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

  if (!authReady) return <main className="center-screen"><div className="loader" /></main>;
  if (!session) return <LoginScreen />;

  async function saveProject(input: ProjectInput, detail: ProjectDetailInput) {
    const project = selected
      ? await adminApi.updateProject(selected.id, input)
      : await adminApi.createProject(input);
    await adminApi.saveProjectDetail(project.id, detail);
    setSelected(undefined);
    await loadProjects();
  }

  async function removeProject(project: AdminProject) {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    await adminApi.deleteProject(project.id);
    await loadProjects();
  }

  const published = projects.filter((project) => project.status === 'published').length;
  const featured = projects.filter((project) => project.featured).length;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand"><span>&gt;_</span><div><strong>AlisherDev</strong><small>CONTROL PLANE</small></div></div>
        <nav>
          <button className={section === 'overview' ? 'active' : ''} onClick={() => setSection('overview')}><span>⌂</span> Overview</button>
          <button className={section === 'projects' ? 'active' : ''} onClick={() => setSection('projects')}><span>◉</span> Projects <b>{projects.length}</b></button>
          <button className={section === 'experiences' ? 'active' : ''} onClick={() => setSection('experiences')}><span>◇</span> Experience</button>
          <button className={section === 'skills' ? 'active' : ''} onClick={() => setSection('skills')}><span>◆</span> Skills</button>
          <button className={section === 'socials' ? 'active' : ''} onClick={() => setSection('socials')}><span>↗</span> Social links</button>
          <button className={section === 'messages' ? 'active' : ''} onClick={() => setSection('messages')}><span>✉</span> Messages</button>
          <button className={section === 'settings' ? 'active' : ''} onClick={() => setSection('settings')}><span>⚙</span> Site settings</button>
        </nav>
        <div className="sidebar-footer">
          <div className="status-dot"><i /> API connected</div>
          <button onClick={() => supabase?.auth.signOut()}>Sign out ↗</button>
        </div>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div><p className="eyebrow">PORTFOLIO CMS / {section.toUpperCase()}</p><h1>{section === 'overview' ? 'Good to see you.' : section[0].toUpperCase() + section.slice(1)}</h1></div>
          {(section === 'overview' || section === 'projects') && <button className="primary-button compact" onClick={() => setSelected(null)}>+ New project</button>}
        </header>

        {error && <div className="error">{error}</div>}
        {section === 'overview' && <section className="stats-grid">
          <article><span>ALL PROJECTS</span><strong>{projects.length.toString().padStart(2, '0')}</strong><small>Portfolio entries</small></article>
          <article><span>PUBLISHED</span><strong className="green">{published.toString().padStart(2, '0')}</strong><small>Visible to everyone</small></article>
          <article><span>FEATURED</span><strong className="cyan">{featured.toString().padStart(2, '0')}</strong><small>Homepage highlights</small></article>
          <article><span>SYSTEM</span><strong className="system-ok">ONLINE</strong><small>All services operational</small></article>
        </section>}

        {(section === 'overview' || section === 'projects') && <section className="content-card">
          <div className="section-heading"><div><p className="eyebrow">CONTENT</p><h2>Projects</h2></div><button className="secondary-button" onClick={loadProjects}>↻ Refresh</button></div>
          {loading ? <div className="table-state"><div className="loader" /> Loading content…</div> :
            projects.length === 0 ? <div className="table-state">No projects yet.</div> : (
              <div className="project-table">
                <div className="table-row table-head"><span>Project</span><span>Category</span><span>Year</span><span>Status</span><span /></div>
                {projects.map((project) => (
                  <div className="table-row" key={project.id}>
                    <span className="project-cell"><i style={{ background: project.color }} /><span><strong>{project.title}</strong><small>/{project.slug}</small></span></span>
                    <span>{project.category || '—'}</span><span>{project.year || '—'}</span>
                    <span><b className={`badge ${project.status}`}>{project.status}</b></span>
                    <span className="row-actions"><button onClick={() => setSelected(project)}>Edit</button><button className="danger-button" onClick={() => removeProject(project)}>Delete</button></span>
                  </div>
                ))}
              </div>
            )}
        </section>}
        {section === 'experiences' && <CollectionManager name="experiences" />}
        {section === 'skills' && <CollectionManager name="skills" />}
        {section === 'socials' && <CollectionManager name="socials" />}
        {section === 'messages' && <MessagesManager />}
        {section === 'settings' && <SettingsManager />}
      </main>
      {selected !== undefined && <ProjectEditor project={selected} onClose={() => setSelected(undefined)} onSave={saveProject} />}
    </div>
  );
}
