import { contactLinks } from './contact.config';
import { cn } from '@/lib/utils';

export function ContactLinks() {
  return (
    <div className="space-y-3">
      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors duration-300 hover:border-accent/25 hover:bg-accent/[0.03]"
        >
          <span>
            <span className="mb-0.5 block font-mono text-xs text-text-dim">{link.label}</span>
            <span className={cn('block font-mono text-sm', link.handleClass)}>{link.handle}</span>
          </span>
          <span className="text-text-dim transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      ))}
    </div>
  );
}
