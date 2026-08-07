'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor || anchor.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      const sameDocument =
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search;

      if (destination.origin === window.location.origin && !sameDocument) {
        setIsLoading(true);
      }
    };

    const handlePopState = () => setIsLoading(true);

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div
          className="fixed top-0 left-0 right-0 h-1 z-[9999] origin-left"
          style={{
            backgroundColor: '#00FF87',
            boxShadow: '0 0 20px rgba(0,255,135,0.6)',
            animation: 'pageProgress 2s ease-in-out forwards',
          }}
        />
      )}

      <style>{`
        @keyframes pageProgress {
          0% {
            width: 0%;
            opacity: 1;
          }
          50% {
            width: 70%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
