'use client';
import { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9998] h-1 transition-all duration-300"
      style={{
        width: `${scrollProgress}%`,
        backgroundColor: '#00FF87',
        boxShadow: scrollProgress > 0 ? '0 0 20px rgba(0,255,135,0.8)' : 'none',
      }}
      aria-hidden="true"
    />
  );
}
