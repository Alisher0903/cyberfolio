'use client';

import { useEffect, useState } from 'react';
import { useResumeStore, type ResumeData } from '@/store/resumeStore';
import { useI18n } from '@/lib/i18n/I18nProvider';

interface CloudResumeDialogProps {
  onClose: () => void;
}

type Status = { kind: 'idle' | 'working' | 'success' | 'error'; message: string };

export function CloudResumeDialog({ onClose }: CloudResumeDialogProps) {
  const { t, formatDate } = useI18n();
  const { data, update } = useResumeStore();
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [updateToken, setUpdateToken] = useState<string>();
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function request(path: string, method: 'POST' | 'DELETE', body: object) {
    if (!apiUrl) throw new Error(t('resume.cloud.notConfigured'));
    if (key.length < 8) throw new Error(t('resume.cloud.keyTooShort'));
    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok)
      throw new Error(
        t(
          response.status === 404
            ? 'resume.cloud.notFound'
            : response.status === 409
              ? path.endsWith('/save')
                ? 'resume.cloud.keyInUse'
                : 'resume.cloud.loadFirst'
              : response.status === 429
                ? 'resume.cloud.rateLimited'
                : 'resume.cloud.requestFailed',
        ),
      );
    return payload;
  }

  async function run(action: 'save' | 'load' | 'delete') {
    setStatus({
      kind: 'working',
      message:
        action === 'save'
          ? t('resume.cloud.saving')
          : action === 'load'
            ? t('resume.cloud.loading')
            : t('resume.cloud.deleting'),
    });
    try {
      if (action === 'save') {
        const payload = (await request('/resumes/save', 'POST', { key, data, updateToken })) as {
          updateToken?: string;
        };
        setUpdateToken(payload.updateToken);
        setStatus({ kind: 'success', message: t('resume.cloud.saved') });
      } else if (action === 'load') {
        const payload = (await request('/resumes/load', 'POST', { key })) as {
          data: ResumeData;
          updated_at: string;
          updateToken: string;
        };
        update(payload.data);
        setUpdateToken(payload.updateToken);
        setStatus({
          kind: 'success',
          message: t('resume.cloud.restored', { date: formatDate(payload.updated_at) }),
        });
      } else {
        await request('/resumes', 'DELETE', { key, updateToken });
        setStatus({ kind: 'success', message: t('resume.cloud.deleted') });
      }
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : t('resume.cloud.requestFailed'),
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-[10000] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cloud-resume-title"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 font-mono text-[10px] text-accent">{t('resume.cloud.eyebrow')}</p>
            <h2 id="cloud-resume-title" className="font-display text-xl font-bold">
              {t('resume.cloud.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="grid h-8 w-8 place-items-center rounded-md border border-border text-text-dim"
          >
            ×
          </button>
        </div>
        <label
          className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-text-dim"
          htmlFor="resume-recovery-key"
        >
          {t('resume.cloud.keyLabel')}
        </label>
        <div className="flex gap-2">
          <input
            id="resume-recovery-key"
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(event) => {
              setKey(event.target.value);
              setUpdateToken(undefined);
            }}
            placeholder={t('resume.cloud.keyPlaceholder')}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-accent/40"
          />
          <button
            type="button"
            onClick={() => setShowKey((value) => !value)}
            className="rounded-md border border-border px-3 font-mono text-[10px] text-text-secondary"
          >
            {showKey ? t('resume.cloud.hide') : t('resume.cloud.show')}
          </button>
        </div>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-text-dim">
          {t('resume.cloud.keyHint')}
        </p>
        {status.message && (
          <p
            className={`mt-4 rounded-md border px-3 py-2 font-mono text-[11px] ${status.kind === 'error' ? 'border-danger/30 bg-danger/[0.06] text-danger' : 'border-accent/20 bg-accent/[0.05] text-accent'}`}
            role="status"
          >
            {status.message}
          </p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={status.kind === 'working'}
            onClick={() => run('load')}
            className="rounded-md border border-cyan/30 px-3 py-2.5 font-mono text-xs text-cyan disabled:opacity-50"
          >
            {t('resume.cloud.load')}
          </button>
          <button
            type="button"
            disabled={status.kind === 'working'}
            onClick={() => run('save')}
            className="rounded-md bg-accent px-3 py-2.5 font-mono text-xs font-semibold text-bg disabled:opacity-50"
          >
            {t('resume.cloud.save')}
          </button>
          <button
            type="button"
            disabled={status.kind === 'working'}
            onClick={() => window.confirm(t('resume.cloud.confirmDelete')) && run('delete')}
            className="col-span-2 rounded-md border border-danger/25 px-3 py-2 font-mono text-[11px] text-danger disabled:opacity-50"
          >
            {t('resume.cloud.deleteCopy')}
          </button>
        </div>
      </div>
    </div>
  );
}
