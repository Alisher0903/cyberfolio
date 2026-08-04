import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export function useProjectDetailAnimations(projectSlug: string) {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const context = gsap.context(() => {
      const entranceAnimations = [
        ['.detail-tag', { opacity: 0, y: -20 }, { opacity: 1, y: 0, delay: 0.1 }],
        ['.detail-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, delay: 0.2 }],
        ['.detail-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: 0.4 }],
        ['.detail-meta', { opacity: 0, x: -30 }, { opacity: 1, x: 0, delay: 0.5 }],
        ['.detail-hero-visual', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, delay: 0.3 }],
      ] as const;

      entranceAnimations.forEach(([target, from, to]) => {
        gsap.fromTo(target, from, { ...to, duration: 0.8, ease: 'power3.out' });
      });

      gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 85%', once: true },
          },
        );
      });
    });

    return () => context.revert();
  }, [projectSlug]);

  return { heroRef, contentRef };
}
