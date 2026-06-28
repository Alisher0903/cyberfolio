'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type SkillCategory } from '@/data/skills';
import { SkillTabs } from './skills/SkillTabs';
import { SkillsPanel } from './skills/SkillsPanel';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('Frontend');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skills-content',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="bg-bg py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <div className="mb-10 flex items-center gap-4 md:mb-16">
          <p className="font-mono text-xs text-accent">04 / Skills</p>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="skills-content">
          <div className="mb-10 max-w-3xl">
            <h2 className="mb-6 font-display text-4xl font-bold text-text-primary lg:text-5xl">
              Tools I use to turn ideas into{' '}
              <span className="gradient-text">working products.</span>
            </h2>
            <p className="text-lg leading-relaxed text-text-secondary">
              A practical toolkit built through real projects — grouped by where each skill creates
              the most value.
            </p>
          </div>

          <SkillTabs active={activeCategory} onChange={setActiveCategory} />
          <SkillsPanel category={activeCategory} />
        </div>
      </div>
    </section>
  );
}
