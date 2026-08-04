'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminApi, type AdminProject, type ProjectDetailInput, type ProjectInput } from '@/lib/api';
import { supabase } from '@/lib/supabase';

const emptyProject: ProjectInput = {
  slug: '',
  title: '',
  subtitle: '',
  description: '',
  category: '',
  year: new Date().getFullYear().toString(),
  tech: [],
  color: '#00FF87',
  accent_color: '#00CC6A',
  live_url: '',
  github_url: '',
  metrics: [],
  featured: false,
  status: 'draft',
  sort_order: 0,
};

interface Props {
  project: AdminProject | null;
  onClose: () => void;
  onSave: (value: ProjectInput, detail: ProjectDetailInput) => Promise<void>;
}

const emptyDetail: ProjectDetailInput = {
  challenge: '', solution: '', impact: '', timeline: '', team_size: '', role: '',
  highlights: [], code_snippet: '',
};

export default function ProjectEditor({ project, onClose, onSave }: Props) {
  const [value, setValue] = useState<ProjectInput>(project ?? emptyProject);
  const [tech, setTech] = useState(project?.tech.join(', ') ?? '');
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<ProjectDetailInput>(emptyDetail);
  const [highlights, setHighlights] = useState('');
  const [metrics, setMetrics] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setValue(project ?? emptyProject);
    setTech(project?.tech.join(', ') ?? '');
    setMetrics(project?.metrics.map((metric) => `${metric.label}: ${metric.value}`).join('\n') ?? '');
    if (project) {
      adminApi.projectDetail(project.id).then((result) => {
        const next = result ?? emptyDetail;
        setDetail(next);
        setHighlights(next.highlights.join('\n'));
      });
    } else {
      setDetail(emptyDetail);
      setHighlights('');
    }
  }, [project]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    await onSave(
      {
        ...value,
        tech: tech.split(',').map((item) => item.trim()).filter(Boolean),
        metrics: metrics.split('\n').map((line) => {
          const separator = line.indexOf(':');
          return separator > 0
            ? { label: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() }
            : null;
        }).filter((item): item is { label: string; value: string } => Boolean(item?.label && item.value)),
      },
      { ...detail, highlights: highlights.split('\n').map((item) => item.trim()).filter(Boolean) },
    ).finally(() => setSaving(false));
  }

  const field = (key: keyof ProjectInput, next: string | boolean | number) =>
    setValue((current) => ({ ...current, [key]: next }));
  const detailField = (key: keyof ProjectDetailInput, next: string) =>
    setDetail((current) => ({ ...current, [key]: next }));

  async function uploadCover(file: File) {
    if (!supabase) return;
    setUploading(true);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const path = `projects/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
    });
    if (!error) field('cover_image_path', path);
    setUploading(false);
  }

  return (
    <div className="editor-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="editor-panel" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p className="eyebrow">{project ? 'EDIT PROJECT' : 'NEW PROJECT'}</p>
            <h2>{project?.title || 'Untitled project'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">×</button>
        </header>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label><span>Title</span><input required value={value.title} onChange={(e) => field('title', e.target.value)} /></label>
            <label><span>Slug</span><input required pattern="[a-z0-9-]+" value={value.slug} onChange={(e) => field('slug', e.target.value)} /></label>
            <label className="wide"><span>Subtitle</span><input value={value.subtitle} onChange={(e) => field('subtitle', e.target.value)} /></label>
            <label className="wide"><span>Description</span><textarea rows={5} value={value.description} onChange={(e) => field('description', e.target.value)} /></label>
            <label><span>Category</span><input value={value.category} onChange={(e) => field('category', e.target.value)} /></label>
            <label><span>Year</span><input value={value.year} onChange={(e) => field('year', e.target.value)} /></label>
            <label className="wide"><span>Technologies — comma separated</span><input value={tech} onChange={(e) => setTech(e.target.value)} /></label>
            <label><span>Live URL</span><input value={value.live_url} onChange={(e) => field('live_url', e.target.value)} /></label>
            <label><span>GitHub URL</span><input value={value.github_url} onChange={(e) => field('github_url', e.target.value)} /></label>
            <label className="wide"><span>Metrics — “Label: Value”, one per line</span><textarea rows={4} value={metrics} onChange={(e) => setMetrics(e.target.value)} /></label>
            <label className="wide"><span>Cover image {uploading ? '— uploading…' : ''}</span><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(e) => e.target.files?.[0] && void uploadCover(e.target.files[0])} />{value.cover_image_path ? <small className="upload-path">{value.cover_image_path}</small> : null}</label>
            <label><span>Primary color</span><input type="color" value={value.color} onChange={(e) => field('color', e.target.value)} /></label>
            <label><span>Accent color</span><input type="color" value={value.accent_color} onChange={(e) => field('accent_color', e.target.value)} /></label>
            <label><span>Status</span><select value={value.status} onChange={(e) => field('status', e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
            <label><span>Sort order</span><input type="number" min="0" value={value.sort_order} onChange={(e) => field('sort_order', Number(e.target.value))} /></label>
            <div className="wide form-divider"><span>PROJECT CASE STUDY</span></div>
            <label className="wide"><span>Challenge</span><textarea rows={4} value={detail.challenge} onChange={(e) => detailField('challenge', e.target.value)} /></label>
            <label className="wide"><span>Solution</span><textarea rows={4} value={detail.solution} onChange={(e) => detailField('solution', e.target.value)} /></label>
            <label className="wide"><span>Impact</span><textarea rows={3} value={detail.impact} onChange={(e) => detailField('impact', e.target.value)} /></label>
            <label><span>Timeline</span><input value={detail.timeline} onChange={(e) => detailField('timeline', e.target.value)} /></label>
            <label><span>Team size</span><input value={detail.team_size} onChange={(e) => detailField('team_size', e.target.value)} /></label>
            <label className="wide"><span>Role</span><input value={detail.role} onChange={(e) => detailField('role', e.target.value)} /></label>
            <label className="wide"><span>Highlights — one per line</span><textarea rows={5} value={highlights} onChange={(e) => setHighlights(e.target.value)} /></label>
            <label className="wide"><span>Code snippet</span><textarea rows={9} value={detail.code_snippet} onChange={(e) => detailField('code_snippet', e.target.value)} spellCheck={false} /></label>
          </div>
          <label className="check"><input type="checkbox" checked={value.featured} onChange={(e) => field('featured', e.target.checked)} /> Featured project</label>
          <footer>
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button className="primary-button" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          </footer>
        </form>
      </aside>
    </div>
  );
}
