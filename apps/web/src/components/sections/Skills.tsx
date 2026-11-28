'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioData } from '@/features/portfolio/PortfolioDataProvider';
import { SkillTabs } from './skills/SkillTabs';
import { SkillsPanel } from './skills/SkillsPanel';
import { useI18n } from '@/lib/i18n/I18nProvider';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const { t } = useI18n();
  const { skills } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState('Frontend');
  const categories = Object.keys(skills);

  useEffect(() => {
    if (categories.length > 0 && !skills[activeCategory]) {
      setActiveCategory(categories[0]);
    }
  }, [activeCategory, categories, skills]);

  useEffect(() => {
    if (!sectionRef.current) return;
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
  }, [categories.length]);

  if (categories.length === 0) return null;

  return (
    <section id="skills" ref={sectionRef} className="bg-bg py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <div className="mb-10 flex items-center gap-4 md:mb-16">
          <p className="font-mono text-xs text-accent">04 / {t('skills.label')}</p>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="skills-content">
          <div className="mb-10 max-w-3xl">
            <h2 className="mb-6 font-display text-4xl font-bold text-text-primary lg:text-5xl">
              {t('skills.titlePrefix')}{' '}
              <span className="gradient-text">{t('skills.titleAccent')}</span>
            </h2>
            <p className="text-lg leading-relaxed text-text-secondary">{t('skills.description')}</p>
          </div>

          <SkillTabs skills={skills} active={activeCategory} onChange={setActiveCategory} />
          <SkillsPanel skills={skills} category={activeCategory} />
        </div>
      </div>
    </section>
  );
}
