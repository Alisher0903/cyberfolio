'use client';

import { useEffect, useRef, useState } from 'react';
import { LOCALES, LOCALE_META, type Locale } from '@alisherdev/shared';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  /** Smaller variant for dense headers. */
  compact?: boolean;
}

/**
 * A single pill that opens the language list. Four side-by-side cells made the
 * header feel stretched and clipped the two-letter codes, so the codes now live
 * in a narrow menu and the trigger keeps its width in every language.
 */
export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn('relative z-50', className)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false);
          rootRef.current?.querySelector('button')?.focus();
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        setOpen(true);
        const key = event.key;
        requestAnimationFrame(() => {
          const options = Array.from(
            rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
          );
          const index = options.findIndex((option) => option === document.activeElement);
          const next =
            key === 'Home'
              ? 0
              : key === 'End'
                ? options.length - 1
                : key === 'ArrowDown'
                  ? (index + 1) % options.length
                  : index < 0
                    ? options.length - 1
                    : (index - 1 + options.length) % options.length;
          options[next]?.focus();
        });
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('common.languageSwitcher')}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border border-border bg-surface/60 font-mono uppercase tracking-wider text-text-secondary transition-colors duration-200 hover:border-accent/40 hover:text-accent',
          compact ? 'h-7 gap-1 pl-2 pr-1.5 text-[10px]' : 'h-8 gap-2 pl-2.5 pr-2 text-[11px]',
          open && 'border-accent/40 text-accent',
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={cn('shrink-0 opacity-70', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M2 8h12M8 2c1.8 2 1.8 10 0 12M8 2c-1.8 2-1.8 10 0 12" />
        </svg>
        <span className="leading-none">{LOCALE_META[locale].short}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className={cn(
            'h-2.5 w-2.5 shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M1 1.5 5 4.5 9 1.5" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-44 overflow-hidden rounded-xl border border-border bg-bg/95 p-1 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75)] backdrop-blur-xl"
        >
          {LOCALES.map((option: Locale) => {
            const active = option === locale;
            return (
              <li key={option}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  lang={LOCALE_META[option].htmlLang}
                  onClick={() => {
                    setOpen(false);
                    setLocale(option);
                    rootRef.current?.querySelector('button')?.focus();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors duration-150',
                    active
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary',
                  )}
                >
                  <span className="w-6 shrink-0 font-mono text-[10px] uppercase tracking-wider text-text-dim">
                    {LOCALE_META[option].short}
                  </span>
                  <span className="flex-1 truncate">{LOCALE_META[option].label}</span>
                  {active && (
                    <span aria-hidden="true" className="text-accent">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
