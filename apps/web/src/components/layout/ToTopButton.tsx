'use client';

import { useEffect, useState } from 'react';

export default function ToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 500);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-4 md:right-6 bottom-24 md:bottom-6 z-[60] grid h-11 w-11 place-items-center rounded border font-mono text-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
      }`}
      style={{
        color: '#00FF87',
        borderColor: 'rgba(0,255,135,0.45)',
        backgroundColor: 'rgba(5,10,14,0.9)',
        boxShadow: isVisible ? '0 0 24px rgba(0,255,135,0.12)' : 'none',
        backdropFilter: 'blur(12px)',
      }}
      aria-label="Scroll to top"
      title="Back to top"
      tabIndex={isVisible ? 0 : -1}
    >
      ↑
    </button>
  );
}
