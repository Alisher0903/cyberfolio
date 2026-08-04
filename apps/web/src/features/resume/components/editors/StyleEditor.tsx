import { layoutOptions } from '../../resume.config';
import { themeColors, type ColorTheme, useResumeStore } from '@/store/resumeStore';
import { cn } from '@/lib/utils';

export function StyleEditor() {
  const { data, update } = useResumeStore();

  return (
    <section aria-labelledby="style-heading">
      <h2
        id="style-heading"
        className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-dim"
      >
        Layout Style
      </h2>
      <div className="mb-6 flex flex-col gap-2">
        {layoutOptions.map((option) => {
          const active = data.layoutStyle === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => update({ layoutStyle: option.id })}
              aria-pressed={active}
              className={cn(
                'rounded-lg border border-border p-3 text-left transition-colors',
                active && 'border-accent/30 bg-accent/[0.07]',
              )}
            >
              <span
                className={cn(
                  'mb-1 block font-mono text-[11px] text-text-primary',
                  active && 'text-accent',
                )}
              >
                {active ? '● ' : '○ '}
                {option.label}
              </span>
              <span className="block text-[10px] text-text-dim">{option.description}</span>
            </button>
          );
        })}
      </div>

      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-text-dim">
        Accent Color
      </h2>
      <div className="flex flex-wrap gap-2">
        {(Object.entries(themeColors) as [ColorTheme, (typeof themeColors)[ColorTheme]][]).map(
          ([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => update({ colorTheme: key })}
              aria-label={`${key} color theme`}
              aria-pressed={data.colorTheme === key}
              className={cn(
                'h-8 w-8 rounded-full border-[3px] border-transparent transition-transform hover:scale-110',
                data.colorTheme === key && 'border-white',
              )}
              style={{ backgroundColor: value.primary }}
            />
          ),
        )}
      </div>
    </section>
  );
}
