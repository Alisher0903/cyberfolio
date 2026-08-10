'use client';

import { useState } from 'react';
import { useResumeStore, type ResumeData } from '@/store/resumeStore';

interface CloudResumeDialogProps {
  onClose: () => void;
}

type Status = { kind: 'idle' | 'working' | 'success' | 'error'; message: string };

export function CloudResumeDialog({ onClose }: CloudResumeDialogProps) {
  const { data, update } = useResumeStore();
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function request(path: string, method: 'POST' | 'DELETE', body: object) {
    if (!apiUrl) throw new Error('Cloud storage is not configured');
    if (key.length < 8) throw new Error('Recovery key must be at least 8 characters');
    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) throw new Error(payload?.error ?? 'Request failed');
    return payload;
  }

  async function run(action: 'save' | 'load' | 'delete') {
    setStatus({
      kind: 'working',
      message: `${action === 'save' ? 'Saving' : action === 'load' ? 'Loading' : 'Deleting'}…`,
    });
    try {
      if (action === 'save') {
        await request('/resumes/save', 'POST', { key, data });
        setStatus({ kind: 'success', message: 'Resume saved to cloud.' });
      } else if (action === 'load') {
        const payload = (await request('/resumes/load', 'POST', { key })) as {
          data: ResumeData;
          updated_at: string;
        };
        update(payload.data);
        setStatus({
          kind: 'success',
          message: `Resume restored · ${new Date(payload.updated_at).toLocaleString()}`,
        });
      } else {
        await request('/resumes', 'DELETE', { key });
        setStatus({ kind: 'success', message: 'Cloud copy deleted.' });
      }
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Request failed',
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
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 font-mono text-[10px] text-accent">CLOUD BACKUP</p>
            <h2 id="cloud-resume-title" className="font-display text-xl font-bold">
              Save or restore resume
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md border border-border text-text-dim"
          >
            ×
          </button>
        </div>
        <label
          className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-text-dim"
          htmlFor="resume-recovery-key"
        >
          Recovery key
        </label>
        <div className="flex gap-2">
          <input
            id="resume-recovery-key"
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="At least 8 characters"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-accent/40"
          />
          <button
            type="button"
            onClick={() => setShowKey((value) => !value)}
            className="rounded-md border border-border px-3 font-mono text-[10px] text-text-secondary"
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-text-dim">
          Use the same key later to restore or update this resume.
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
            ↑ Load
          </button>
          <button
            type="button"
            disabled={status.kind === 'working'}
            onClick={() => run('save')}
            className="rounded-md bg-accent px-3 py-2.5 font-mono text-xs font-semibold text-bg disabled:opacity-50"
          >
            ↓ Save
          </button>
          <button
            type="button"
            disabled={status.kind === 'working'}
            onClick={() =>
              window.confirm('Delete the cloud copy for this recovery key?') && run('delete')
            }
            className="col-span-2 rounded-md border border-danger/25 px-3 py-2 font-mono text-[11px] text-danger disabled:opacity-50"
          >
            Delete cloud copy
          </button>
        </div>
      </div>
    </div>
  );
}
