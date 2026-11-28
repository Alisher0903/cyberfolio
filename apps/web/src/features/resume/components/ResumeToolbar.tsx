import Link from 'next/link';
import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { CloudResumeDialog } from './CloudResumeDialog';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

interface ResumeToolbarProps {
  previewScale: number;
  exporting: boolean;
  onScaleChange: (scale: number) => void;
  onExport: () => void;
}

const actionClass =
  'flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-accent/30 hover:text-accent';

export function ResumeToolbar({
  previewScale,
  exporting,
  onScaleChange,
  onExport,
}: ResumeToolbarProps) {
  const { t } = useI18n();
  const reset = useResumeStore((state) => state.reset);
  const [cloudOpen, setCloudOpen] = useState(false);

  return (
    <>
      <header className="z-50 flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-bg/95 px-3 py-2 backdrop-blur-xl sm:gap-4 sm:px-6 sm:py-3">
        <Link
          href="/"
          aria-label={t('resume.backAria')}
          className="flex items-center gap-1 font-mono text-[10px] text-text-secondary sm:text-[11px]"
        >
          {t('resume.backToPortfolio')}
        </Link>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="font-display text-sm font-bold sm:text-base">{t('resume.title')}</span>
          <LanguageSwitcher compact />
          <span className="rounded border border-accent/30 px-1.5 py-0.5 font-mono text-[10px] text-accent">
            v1
          </span>
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <label className="mr-auto flex items-center gap-1.5 font-mono text-[10px] text-text-dim sm:mr-0">
            {t('resume.zoom')}
            <input
              type="range"
              min={0.35}
              max={1}
              step={0.05}
              value={previewScale}
              onChange={(event) => onScaleChange(Number(event.target.value))}
              className="w-[70px] accent-accent"
              aria-label={t('resume.zoomAria')}
            />
          </label>
          <button type="button" onClick={reset} className={actionClass}>
            {t('resume.reset')}
          </button>
          <button type="button" onClick={() => setCloudOpen(true)} className={actionClass}>
            {t('resume.cloud')}
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={exporting}
            className="rounded-md border border-accent bg-accent px-2.5 py-1.5 font-mono text-[11px] font-semibold text-bg disabled:opacity-70"
          >
            {exporting ? t('resume.opening') : t('resume.export')}
          </button>
        </div>
      </header>
      {cloudOpen && <CloudResumeDialog onClose={() => setCloudOpen(false)} />}
    </>
  );
}
