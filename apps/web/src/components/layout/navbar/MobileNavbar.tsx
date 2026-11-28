import Link from 'next/link';
import type { MessageKey } from '@alisherdev/shared';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { BrandLogo } from './BrandLogo';
import { type NavbarViewProps } from './navbar.config';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function MobileNavbar({ active, links, onNavigate }: NavbarViewProps) {
  const { t } = useI18n();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur-xl">
        <BrandLogo compact />
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <Link
            href="/resume"
            className="rounded border border-cyan/25 px-2.5 py-1 font-mono text-xs text-cyan"
          >
            {t('nav.cvBuilder')}
          </Link>
        </div>
      </header>

      <nav
        aria-label={t('nav.mobileAria')}
        className="safe-area-pb fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/[0.97] backdrop-blur-2xl"
      >
        <div className="relative h-0.5 w-full bg-surface">
          {links.map((link, index) => (
            <span
              key={link.id}
              className={cn(
                'absolute h-full bg-transparent transition-all duration-300',
                active === link.id && 'bg-accent shadow-[0_0_8px_#00FF87]',
              )}
              style={{ left: `${index * (100 / links.length)}%`, width: `${100 / links.length}%` }}
              aria-hidden="true"
            />
          ))}
        </div>

        <ul className="flex list-none items-stretch">
          {links.map((link) => {
            const isActive = active === link.id;
            const label = t(`nav.${link.id}` as MessageKey);

            return (
              <li key={link.id} className="flex-1">
                <button
                  type="button"
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => onNavigate(link.href, link.id)}
                  className={cn(
                    'flex w-full flex-col items-center justify-center gap-1 py-3 text-text-dim transition-colors duration-300',
                    isActive && 'text-accent',
                  )}
                >
                  <span
                    className={cn(
                      'text-base transition-transform duration-300',
                      isActive && 'scale-125',
                    )}
                    aria-hidden="true"
                  >
                    {link.icon}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[9px] tracking-[0.05em] opacity-70',
                      isActive && 'font-semibold opacity-100',
                    )}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span
                      className="h-1 w-1 rounded-full bg-accent shadow-[0_0_4px_#00FF87]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
