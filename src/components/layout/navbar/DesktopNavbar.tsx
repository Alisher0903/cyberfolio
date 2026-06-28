import { forwardRef } from 'react';
import Link from 'next/link';
import LiveClock from '../TimeCost';
import { BrandLogo } from './BrandLogo';
import { navLinks, type NavbarViewProps } from './navbar.config';
import { cn } from '@/lib/utils';

interface DesktopNavbarProps extends NavbarViewProps {
  scrolled: boolean;
}

export const DesktopNavbar = forwardRef<HTMLElement, DesktopNavbarProps>(
  ({ active, scrolled, onNavigate }, ref) => (
    <nav
      ref={ref}
      aria-label="Main navigation"
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled && 'border-b border-border bg-bg/90 backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <BrandLogo />

        <ul className="flex list-none items-center gap-1">
          {navLinks.map((link) => {
            const isActive = active === link.label;

            return (
              <li key={link.label}>
                <button
                  type="button"
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => onNavigate(link.href, link.label)}
                  className={cn(
                    'relative rounded px-4 py-2 font-mono text-sm text-text-secondary transition-colors duration-300 hover:text-text-primary',
                    isActive && 'bg-accent/[0.06] text-accent',
                  )}
                >
                  <span className="text-accent/40">./</span>
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <LiveClock />
          <Link
            href="/resume"
            className="rounded border border-cyan/25 bg-cyan/[0.05] px-3 py-1.5 font-mono text-xs text-cyan transition-colors duration-300 hover:bg-cyan/[0.12]"
          >
            Resume Builder ↗
          </Link>
        </div>
      </div>
    </nav>
  ),
);

DesktopNavbar.displayName = 'DesktopNavbar';
