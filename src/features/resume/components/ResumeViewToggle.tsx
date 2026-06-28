import { cn } from '@/lib/utils';

export type MobileResumeView = 'editor' | 'preview';

interface ResumeViewToggleProps {
  value: MobileResumeView;
  onChange: (view: MobileResumeView) => void;
}

export function ResumeViewToggle({ value, onChange }: ResumeViewToggleProps) {
  return (
    <div className="grid grid-cols-2 border-b border-border bg-surface p-1 md:hidden">
      {(['editor', 'preview'] as const).map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => onChange(view)}
          className={cn(
            'rounded-md py-2 font-mono text-[11px] capitalize text-text-dim transition-colors',
            value === view && 'bg-accent/10 text-accent',
          )}
        >
          {view === 'editor' ? '✎ Editor' : '◫ Preview'}
        </button>
      ))}
    </div>
  );
}
