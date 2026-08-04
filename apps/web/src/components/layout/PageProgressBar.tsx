'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PageProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStop = () => setIsLoading(false);

    // For Next.js 13+ App Router
    router.prefetch('/');

    return () => {
      handleStop();
    };
  }, [router]);

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
