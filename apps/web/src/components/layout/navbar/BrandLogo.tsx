'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/I18nProvider';

interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  const { t } = useI18n();

  return (
    <Link href="/" aria-label={t('nav.brandAria')} className="group flex items-center gap-3">
      <div className={cn('relative', compact ? 'h-7 w-7' : 'h-8 w-8')}>
        <div className="absolute inset-0 rotate-45 rounded-sm border border-accent transition-colors duration-300 group-hover:border-cyan" />
        {!compact && <div className="absolute inset-1 rotate-45 rounded-sm bg-accent/10" />}
        <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-accent">
          AS
        </span>
      </div>
      <span
        className={cn(
          'font-mono text-text-secondary',
          compact ? 'text-xs' : 'hidden text-sm lg:block',
        )}
      >
        <span className="text-accent">@</span>sodiqoff
      </span>
    </Link>
  );
}
