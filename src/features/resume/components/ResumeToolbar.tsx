import Link from 'next/link';
import { useResumeStore } from '@/store/resumeStore';

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
  const reset = useResumeStore((state) => state.reset);

  return (
    <header className="z-50 flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-bg/95 px-3 py-2 backdrop-blur-xl sm:gap-4 sm:px-6 sm:py-3">
      <Link
        href="/"
        aria-label="Back to portfolio"
        className="flex items-center gap-1 font-mono text-[10px] text-text-secondary sm:text-[11px]"
      >
        ← Portfolio
      </Link>
      <div className="flex flex-1 items-center gap-2">
        <span className="font-display text-sm font-bold sm:text-base">Resume Builder</span>
        <span className="rounded border border-accent/30 px-1.5 py-0.5 font-mono text-[10px] text-accent">
          v1
        </span>
      </div>
      <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
        <label className="mr-auto flex items-center gap-1.5 font-mono text-[10px] text-text-dim sm:mr-0">
          zoom
          <input
            type="range"
            min={0.35}
            max={1}
            step={0.05}
            value={previewScale}
            onChange={(event) => onScaleChange(Number(event.target.value))}
            className="w-[70px] accent-accent"
            aria-label="Preview zoom level"
          />
        </label>
        <button type="button" onClick={reset} className={actionClass}>
          ↺ Reset
        </button>
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="rounded-md border border-accent bg-accent px-2.5 py-1.5 font-mono text-[11px] font-semibold text-bg disabled:opacity-70"
        >
          {exporting ? 'Exporting...' : '↓ Export PDF'}
        </button>
      </div>
    </header>
  );
}
