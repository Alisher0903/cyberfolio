'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<number | null>(null);
  const previousUrl = useRef<string | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const start = () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
      setProgress((current) => (current === null ? 12 : current));
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof window.Element)) return;
      const anchor = target.closest('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      const isSameDocument =
        destination.pathname === current.pathname && destination.search === current.search;

      if (destination.origin === current.origin && !isSameDocument) start();
    };

    const handlePopState = () => start();
    const progressTimer = window.setInterval(() => {
      setProgress((current) =>
        current === null ? null : Math.min(current + Math.max((92 - current) * 0.12, 0.5), 92),
      );
    }, 180);

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      window.clearInterval(progressTimer);
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, []);

  useEffect(() => {
    const url = `${pathname}?${searchParams.toString()}`;
    if (previousUrl.current === null) {
      previousUrl.current = url;
      return;
    }
    if (previousUrl.current === url) return;

    previousUrl.current = url;
    setProgress(100);
    finishTimer.current = setTimeout(() => setProgress(null), 220);
  }, [pathname, searchParams]);

  if (progress === null) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[10000] h-[3px] w-full origin-left pointer-events-none"
      style={{
        backgroundColor: '#00FF87',
        boxShadow: '0 0 14px rgba(0,255,135,0.85)',
        transform: `scaleX(${progress / 100})`,
        transition:
          progress === 100
            ? 'transform 180ms ease-out, opacity 180ms 80ms ease-out'
            : 'transform 180ms ease-out',
        opacity: progress === 100 ? 0 : 1,
      }}
      role="progressbar"
      aria-label="Page loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    />
  );
}
