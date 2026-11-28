'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  CONTENT_LOCALES,
  LOCALE_META,
  type ContentLocale,
  type DetailTranslation,
  type ProjectTranslation,
} from '@alisherdev/shared';
import { adminApi, type AdminProject, type ProjectDetailInput, type ProjectInput } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n/I18nProvider';

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
  onSave: (
    value: ProjectInput,
    detail: ProjectDetailInput,
    savedId?: string,
  ) => Promise<AdminProject>;
}

const emptyDetail: ProjectDetailInput = {
  challenge: '',
  solution: '',
  impact: '',
  timeline: '',
  team_size: '',
  role: '',
  highlights: [],
  code_snippet: '',
};

/** Drops empty fields so the site falls back to the English base text. */
function cleanTranslation<T extends object>(entry: Partial<Record<ContentLocale, T>>) {
  const result: Partial<Record<ContentLocale, Partial<T>>> = {};
  for (const locale of CONTENT_LOCALES) {
    const patch = entry[locale];
    if (!patch) continue;
    const fields = Object.entries(patch as Record<string, unknown>).filter(([, value]) =>
      Array.isArray(value)
        ? value.some((item) => String(item).trim() !== '')
        : typeof value === 'string'
          ? value.trim() !== ''
          : false,
    );
    if (fields.length) result[locale] = Object.fromEntries(fields) as Partial<T>;
  }
  return Object.keys(result).length ? result : null;
}

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProjectEditor({ project, onClose, onSave }: Props) {
  const { t } = useI18n();
  const [value, setValue] = useState<ProjectInput>(project ?? emptyProject);
  const [tech, setTech] = useState(project?.tech.join(', ') ?? '');
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<ProjectDetailInput>(emptyDetail);
  const [highlights, setHighlights] = useState('');
  const [metrics, setMetrics] = useState('');
  const [uploading, setUploading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(project?.slug));
  const [error, setError] = useState('');
  const [trLocale, setTrLocale] = useState<ContentLocale>('uz');
  const savedProject = useRef<AdminProject | null>(project);
  const [translationsReady, setTranslationsReady] = useState(false);
  const [trProjects, setTrProjects] = useState<Partial<Record<ContentLocale, ProjectTranslation>>>(
    {},
  );
  const [trDetails, setTrDetails] = useState<Partial<Record<ContentLocale, DetailTranslation>>>({});

  useEffect(() => {
    savedProject.current = project;
    setTranslationsReady(false);
    setValue(project ?? emptyProject);
    setSlugEdited(Boolean(project?.slug));
    setError('');
    setTech(project?.tech.join(', ') ?? '');
    setMetrics(
      project?.metrics.map((metric) => `${metric.label}: ${metric.value}`).join('\n') ?? '',
    );
    setDetail(emptyDetail);
    setHighlights('');

    let cancelled = false;
    Promise.all([
      adminApi.translations(),
      project ? adminApi.projectDetail(project.id) : Promise.resolve(emptyDetail),
    ])
      .then(([store, result]) => {
        if (cancelled) return;
        const next = result ?? emptyDetail;
        setDetail(next);
        setHighlights(next.highlights.join('\n'));
        setTranslationsReady(true);
        setTrProjects(
          ((project ? store.projects?.[project.slug] : undefined) as Partial<
            Record<ContentLocale, ProjectTranslation>
          >) ?? {},
        );
        setTrDetails(
          ((project ? store.details?.[project.slug] : undefined) as Partial<
            Record<ContentLocale, DetailTranslation>
          >) ?? {},
        );
      })
      .catch((caught) => {
        if (!cancelled) setError(String(caught));
      });
    return () => {
      cancelled = true;
    };
  }, [project]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (!translationsReady) return;
      savedProject.current = await onSave(
        {
          ...value,
          slug: slugify(value.slug || value.title),
          tech: tech
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          metrics: metrics
            .split('\n')
            .map((line) => {
              const separator = line.indexOf(':');
              return separator > 0
                ? {
                    label: line.slice(0, separator).trim(),
                    value: line.slice(separator + 1).trim(),
                  }
                : null;
            })
            .filter((item): item is { label: string; value: string } =>
              Boolean(item?.label && item.value),
            ),
        },
        {
          ...detail,
          highlights: highlights
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
        },
        savedProject.current?.id,
      );

      await adminApi.saveProjectDetail(savedProject.current.id, {
        ...detail,
        highlights: highlights
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      });

      // Content translations live in the `translations` site setting, keyed by slug.
      const slug = slugify(value.slug || value.title);
      const store = await adminApi.translations();
      const nextProjects = { ...(store.projects ?? {}) };
      const nextDetails = { ...(store.details ?? {}) };
      if (project && project.slug !== slug) {
        delete nextProjects[project.slug];
        delete nextDetails[project.slug];
      }
      const cleanedProjects = cleanTranslation(trProjects);
      const cleanedDetails = cleanTranslation(trDetails);
      if (cleanedProjects) nextProjects[slug] = cleanedProjects;
      else delete nextProjects[slug];
      if (cleanedDetails) nextDetails[slug] = cleanedDetails;
      else delete nextDetails[slug];
      await adminApi.saveTranslations({
        ...store,
        projects: nextProjects,
        details: nextDetails,
      });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.editor.couldNotSave'));
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof ProjectInput, next: string | boolean | number) =>
    setValue((current) => ({ ...current, [key]: next }));
  const detailField = (key: keyof ProjectDetailInput, next: string) =>
    setDetail((current) => ({ ...current, [key]: next }));
  const currentProjectTr = trProjects[trLocale] ?? {};
  const currentDetailTr = trDetails[trLocale] ?? {};
  const setProjectTr = (key: keyof ProjectTranslation, next: string | string[]) =>
    setTrProjects((current) => ({
      ...current,
      [trLocale]: { ...(current[trLocale] ?? {}), [key]: next },
    }));
  const setDetailTr = (key: keyof DetailTranslation, next: string | string[]) =>
    setTrDetails((current) => ({
      ...current,
      [trLocale]: { ...(current[trLocale] ?? {}), [key]: next },
    }));
  const updateTitle = (title: string) =>
    setValue((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : slugify(title),
    }));

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
            <p className="eyebrow">{project ? t('admin.editor.edit') : t('admin.editor.new')}</p>
            <h2>{project?.title || t('admin.editor.untitled')}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </header>
        <form onSubmit={submit}>
          {error ? <div className="error">{error}</div> : null}
          <div className="form-grid">
            <label>
              <span>{t('admin.editor.title')}</span>
              <input required value={value.title} onChange={(e) => updateTitle(e.target.value)} />
            </label>
            <label>
              <span>{t('admin.editor.slug')}</span>
              <input
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title={t('admin.editor.slugHint')}
                value={value.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  field('slug', slugify(e.target.value));
                }}
              />
              <small className="upload-path">
                {t('admin.editor.url', { slug: value.slug || 'project-slug' })}
              </small>
            </label>
            <label className="wide">
              <span>{t('admin.editor.subtitle')}</span>
              <input value={value.subtitle} onChange={(e) => field('subtitle', e.target.value)} />
            </label>
            <label className="wide">
              <span>{t('admin.editor.description')}</span>
              <textarea
                rows={5}
                value={value.description}
                onChange={(e) => field('description', e.target.value)}
              />
            </label>
            <label>
              <span>{t('admin.editor.category')}</span>
              <input value={value.category} onChange={(e) => field('category', e.target.value)} />
            </label>
            <label>
              <span>{t('admin.editor.year')}</span>
              <input value={value.year} onChange={(e) => field('year', e.target.value)} />
            </label>
            <label className="wide">
              <span>{t('admin.editor.tech')}</span>
              <input value={tech} onChange={(e) => setTech(e.target.value)} />
            </label>
            <label>
              <span>{t('admin.editor.liveUrl')}</span>
              <input value={value.live_url} onChange={(e) => field('live_url', e.target.value)} />
            </label>
            <label>
              <span>{t('admin.editor.githubUrl')}</span>
              <input
                value={value.github_url}
                onChange={(e) => field('github_url', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.metrics')}</span>
              <textarea rows={4} value={metrics} onChange={(e) => setMetrics(e.target.value)} />
            </label>
            <label className="wide">
              <span>
                {t('admin.editor.cover')} {uploading ? t('admin.editor.uploading') : ''}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(e) => e.target.files?.[0] && void uploadCover(e.target.files[0])}
              />
              {value.cover_image_path ? (
                <small className="upload-path">{value.cover_image_path}</small>
              ) : null}
            </label>
            <label>
              <span>{t('admin.editor.primaryColor')}</span>
              <input
                type="color"
                value={value.color}
                onChange={(e) => field('color', e.target.value)}
              />
            </label>
            <label>
              <span>{t('admin.editor.accentColor')}</span>
              <input
                type="color"
                value={value.accent_color}
                onChange={(e) => field('accent_color', e.target.value)}
              />
            </label>
            <label>
              <span>{t('common.status')}</span>
              <select value={value.status} onChange={(e) => field('status', e.target.value)}>
                <option value="draft">{t('admin.editor.draft')}</option>
                <option value="published">{t('admin.editor.published')}</option>
              </select>
            </label>
            <label>
              <span>{t('common.sortOrder')}</span>
              <input
                type="number"
                min="0"
                value={value.sort_order}
                onChange={(e) => field('sort_order', Number(e.target.value))}
              />
            </label>
            <div className="wide form-divider">
              <span>{t('admin.editor.caseStudy')}</span>
            </div>
            <label className="wide">
              <span>{t('admin.editor.challenge')}</span>
              <textarea
                rows={4}
                value={detail.challenge}
                onChange={(e) => detailField('challenge', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.solution')}</span>
              <textarea
                rows={4}
                value={detail.solution}
                onChange={(e) => detailField('solution', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.impact')}</span>
              <textarea
                rows={3}
                value={detail.impact}
                onChange={(e) => detailField('impact', e.target.value)}
              />
            </label>
            <label>
              <span>{t('admin.editor.timeline')}</span>
              <input
                value={detail.timeline}
                onChange={(e) => detailField('timeline', e.target.value)}
              />
            </label>
            <label>
              <span>{t('admin.editor.teamSize')}</span>
              <input
                value={detail.team_size}
                onChange={(e) => detailField('team_size', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.role')}</span>
              <input value={detail.role} onChange={(e) => detailField('role', e.target.value)} />
            </label>
            <label className="wide">
              <span>{t('admin.editor.highlights')}</span>
              <textarea
                rows={5}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.codeSnippet')}</span>
              <textarea
                rows={9}
                value={detail.code_snippet}
                onChange={(e) => detailField('code_snippet', e.target.value)}
                spellCheck={false}
              />
            </label>

            <div className="wide form-divider">
              <span>{t('admin.editor.translations')}</span>
            </div>
            <div className="wide">
              <small className="upload-path">{t('admin.editor.translationsHint')}</small>
              <div className="tr-tabs" role="tablist">
                {CONTENT_LOCALES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="tab"
                    aria-selected={trLocale === option}
                    lang={LOCALE_META[option].htmlLang}
                    className={trLocale === option ? 'active' : ''}
                    onClick={() => setTrLocale(option)}
                  >
                    {LOCALE_META[option].short}
                  </button>
                ))}
              </div>
            </div>
            <label className="wide">
              <span>
                {t('admin.editor.title')} · {LOCALE_META[trLocale].label}
              </span>
              <input
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={value.title}
                value={currentProjectTr.title ?? ''}
                onChange={(e) => setProjectTr('title', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.subtitle')}</span>
              <input
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={value.subtitle}
                value={currentProjectTr.subtitle ?? ''}
                onChange={(e) => setProjectTr('subtitle', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.description')}</span>
              <textarea
                rows={4}
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={value.description}
                value={currentProjectTr.description ?? ''}
                onChange={(e) => setProjectTr('description', e.target.value)}
              />
            </label>
            <label>
              <span>{t('admin.editor.category')}</span>
              <input
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={value.category}
                value={currentProjectTr.category ?? ''}
                onChange={(e) => setProjectTr('category', e.target.value)}
              />
            </label>
            <label>
              <span>{t('admin.editor.metricLabels')}</span>
              <textarea
                rows={4}
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={value.metrics.map((metric) => metric.label).join('\n')}
                value={(currentProjectTr.metricLabels ?? []).join('\n')}
                onChange={(e) => setProjectTr('metricLabels', e.target.value.split('\n'))}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.challenge')}</span>
              <textarea
                rows={3}
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={detail.challenge}
                value={currentDetailTr.challenge ?? ''}
                onChange={(e) => setDetailTr('challenge', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.solution')}</span>
              <textarea
                rows={3}
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={detail.solution}
                value={currentDetailTr.solution ?? ''}
                onChange={(e) => setDetailTr('solution', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.impact')}</span>
              <textarea
                rows={3}
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={detail.impact}
                value={currentDetailTr.impact ?? ''}
                onChange={(e) => setDetailTr('impact', e.target.value)}
              />
            </label>
            <label>
              <span>{t('admin.editor.timeline')}</span>
              <input
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={detail.timeline}
                value={currentDetailTr.timeline ?? ''}
                onChange={(e) => setDetailTr('timeline', e.target.value)}
              />
            </label>
            <label>
              <span>{t('admin.editor.teamSize')}</span>
              <input
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={detail.team_size}
                value={currentDetailTr.teamSize ?? ''}
                onChange={(e) => setDetailTr('teamSize', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.role')}</span>
              <input
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={detail.role}
                value={currentDetailTr.role ?? ''}
                onChange={(e) => setDetailTr('role', e.target.value)}
              />
            </label>
            <label className="wide">
              <span>{t('admin.editor.highlights')}</span>
              <textarea
                rows={4}
                lang={LOCALE_META[trLocale].htmlLang}
                placeholder={highlights}
                value={(currentDetailTr.highlights ?? []).join('\n')}
                onChange={(e) => setDetailTr('highlights', e.target.value.split('\n'))}
              />
            </label>
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={value.featured}
              onChange={(e) => field('featured', e.target.checked)}
            />{' '}
            {t('admin.editor.featured')}
          </label>
          <footer>
            <button type="button" className="secondary-button" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button className="primary-button" disabled={saving || uploading || !translationsReady}>
              {saving ? t('common.saving') : t('common.saveChanges')}
            </button>
          </footer>
        </form>
      </aside>
    </div>
  );
}
