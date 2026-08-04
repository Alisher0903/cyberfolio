import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { navLinks, type NavbarViewProps } from './navbar.config';
import { cn } from '@/lib/utils';

export function MobileNavbar({ active, onNavigate }: NavbarViewProps) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border bg-bg/95 px-4 py-3 backdrop-blur-xl">
        <BrandLogo compact />
        <Link
          href="/resume"
          className="rounded border border-cyan/25 px-2.5 py-1 font-mono text-xs text-cyan"
        >
          CV Builder
        </Link>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="safe-area-pb fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/[0.97] backdrop-blur-2xl"
      >
        <div className="relative h-0.5 w-full bg-surface">
          {navLinks.map((link, index) => (
            <span
              key={link.label}
              className={cn(
                'absolute h-full w-1/5 bg-transparent transition-all duration-300',
                active === link.label && 'bg-accent shadow-[0_0_8px_#00FF87]',
              )}
              style={{ left: `${index * 20}%` }}
              aria-hidden="true"
            />
          ))}
        </div>

        <ul className="flex list-none items-stretch">
          {navLinks.map((link) => {
            const isActive = active === link.label;

            return (
              <li key={link.label} className="flex-1">
                <button
                  type="button"
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => onNavigate(link.href, link.label)}
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
                    {link.label}
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
