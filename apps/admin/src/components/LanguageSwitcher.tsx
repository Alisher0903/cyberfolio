'use client';

import { useEffect, useRef, useState } from 'react';
import { LOCALES, LOCALE_META, type Locale } from '@alisherdev/shared';
import { useI18n } from '@/lib/i18n/I18nProvider';

/** Compact pill + menu so the four languages never stretch the header. */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      className="locale-switch"
      ref={rootRef}
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
        className="locale-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('common.languageSwitcher')}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{LOCALE_META[locale].short}</span>
        <span className="chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="locale-menu" role="menu">
          {LOCALES.map((option: Locale) => {
            const active = option === locale;
            return (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                lang={LOCALE_META[option].htmlLang}
                className={active ? 'active' : ''}
                onClick={() => {
                  setOpen(false);
                  setLocale(option);
                  rootRef.current?.querySelector('button')?.focus();
                }}
              >
                <span className="code">{LOCALE_META[option].short}</span>
                <span>{LOCALE_META[option].label}</span>
                {active && (
                  <span className="check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
