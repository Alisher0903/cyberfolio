import { forwardRef } from 'react';
import Link from 'next/link';
import type { MessageKey } from '@alisherdev/shared';
import LiveClock from '../TimeCost';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { BrandLogo } from './BrandLogo';
import { type NavbarViewProps } from './navbar.config';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/I18nProvider';

interface DesktopNavbarProps extends NavbarViewProps {
  scrolled: boolean;
}

export const DesktopNavbar = forwardRef<HTMLElement, DesktopNavbarProps>(
  ({ active, links, scrolled, onNavigate }, ref) => {
    const { t } = useI18n();

    return (
      <nav
        ref={ref}
        aria-label={t('nav.mainAria')}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled && 'border-b border-border bg-bg/90 backdrop-blur-xl',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <BrandLogo />

          <ul className="flex list-none items-center gap-1">
            {links.map((link) => {
              const isActive = active === link.id;
              const label = t(`nav.${link.id}` as MessageKey);

              return (
                <li key={link.id}>
                  <button
                    type="button"
                    aria-current={isActive ? 'location' : undefined}
                    onClick={() => onNavigate(link.href, link.id)}
                    className={cn(
                      'relative rounded px-4 py-2 font-mono text-sm text-text-secondary transition-colors duration-300 hover:text-text-primary',
                      isActive && 'bg-accent/[0.06] text-accent',
                    )}
                  >
                    <span className="text-accent/40">./</span>
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <LiveClock />
            <Link
              href="/resume"
              className="rounded border border-cyan/25 bg-cyan/[0.05] px-3 py-1.5 font-mono text-xs text-cyan transition-colors duration-300 hover:bg-cyan/[0.12]"
            >
              {t('nav.resumeBuilder')}
            </Link>
          </div>
        </div>
      </nav>
    );
  },
);

DesktopNavbar.displayName = 'DesktopNavbar';
