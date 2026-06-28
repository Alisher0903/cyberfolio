import { siteConfig } from '@/config/site';
import { socialLinks } from './contact.config';
import { SocialIcon } from './SocialIcon';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border pt-8">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-center font-mono text-xs text-text-dim md:text-left">
          © {new Date().getFullYear()} {siteConfig.name}
          <span className="hidden sm:inline"> · Tashkent, Uzbekistan</span>
        </p>

        <nav aria-label="Social and contact links">
          <ul className="flex list-none flex-wrap items-center justify-center gap-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  aria-label={link.label}
                  title={link.label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent"
                >
                  <SocialIcon name={link.icon} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
          <span className="font-mono text-xs text-text-dim">Available for work</span>
        </div>
      </div>
    </footer>
  );
}
