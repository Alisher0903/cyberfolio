'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '@/lib/utils';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type Category = keyof typeof skills;

const categories = Object.keys(skills) as Category[];

const categoryMeta: Record<
  Category,
  { color: string; code: string; eyebrow: string; description: string }
> = {
  Frontend: {
    color: '#00FF87',
    code: '</>',
    eyebrow: 'Product engineering',
    description:
      'Modern web and mobile interfaces, state management, integrations and delivery workflows.',
  },
  Security: {
    color: '#FF3B6B',
    code: '[::]',
    eyebrow: 'Systems & security',
    description: 'Operating systems, networking and scripting foundations for secure development.',
  },
  Other: {
    color: '#00D4FF',
    code: '+++',
    eyebrow: 'Supporting toolkit',
    description:
      'Productivity, design and AI-assisted tools used throughout the development process.',
  },
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<Category>('Frontend');
  const activeMeta = categoryMeta[activeTab];

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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-16 md:py-32"
      style={{ backgroundColor: '#050A0E' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex items-center gap-4 mb-10 md:mb-16">
          <p className="font-mono text-xs" style={{ color: '#00FF87' }}>
            04 / Skills
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: '#0E2030' }} />
        </div>

        <div className="skills-content">
          <div className="max-w-3xl mb-10">
            <h2
              className="font-display text-4xl lg:text-5xl font-bold mb-6"
              style={{ color: '#E8F4FD' }}
            >
              Tools I use to turn ideas into{' '}
              <span className="gradient-text">working products.</span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#7FA8C4' }}>
              A practical toolkit built through real projects — grouped by where each skill creates
              the most value.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Skill categories">
            {categories.map((category) => {
              const isActive = activeTab === category;
              const meta = categoryMeta[category];

              return (
                <button
                  key={category}
                  id={`skills-tab-${category.toLowerCase()}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="skills-panel"
                  onClick={() => setActiveTab(category)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border font-mono text-sm transition-all duration-300"
                  style={{
                    color: isActive ? meta.color : '#7FA8C4',
                    borderColor: isActive ? `${meta.color}55` : '#0E2030',
                    backgroundColor: isActive ? `${meta.color}0D` : '#0A1219',
                    boxShadow: isActive ? `inset 0 -2px 0 ${meta.color}` : 'none',
                  }}
                >
                  <span aria-hidden="true" style={{ color: isActive ? meta.color : '#3A5568' }}>
                    {meta.code}
                  </span>
                  {category}
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px]"
                    style={{
                      color: isActive ? meta.color : '#3A5568',
                      backgroundColor: isActive ? `${meta.color}12` : '#050A0E',
                    }}
                  >
                    {skills[category].length}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="skills-panel"
            key={activeTab}
            role="tabpanel"
            aria-labelledby={`skills-tab-${activeTab.toLowerCase()}`}
            className="grid lg:grid-cols-[280px_1fr] overflow-hidden rounded-2xl border"
            style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
          >
            <div
              className="relative p-7 md:p-8 border-b lg:border-b-0 lg:border-r overflow-hidden"
              style={{ borderColor: '#0E2030' }}
            >
              <div
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${activeMeta.color}12, transparent 68%)`,
                }}
                aria-hidden="true"
              />
              <p
                className="font-mono text-[10px] uppercase tracking-[0.18em] mb-5"
                style={{ color: activeMeta.color }}
              >
                {activeMeta.eyebrow}
              </p>
              <div
                className="font-mono text-4xl font-bold mb-6"
                style={{ color: activeMeta.color }}
                aria-hidden="true"
              >
                {activeMeta.code}
              </div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{ color: '#E8F4FD' }}>
                {activeTab}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#7FA8C4' }}>
                {activeMeta.description}
              </p>
            </div>

            <ul className="grid sm:grid-cols-2 xl:grid-cols-3 list-none">
              {skills[activeTab].map((skill, index) => (
                <li
                  key={skill}
                  className="group min-h-20 flex items-center gap-4 px-5 py-4 border-b sm:border-r transition-colors duration-300"
                  style={{
                    borderColor: '#0E2030',
                    backgroundColor: '#0A1219',
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.backgroundColor = `${activeMeta.color}08`;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.backgroundColor = '#0A1219';
                  }}
                >
                  <span
                    className="font-mono text-[10px] tabular-nums"
                    style={{ color: '#3A5568' }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-shadow duration-300"
                    style={{
                      backgroundColor: activeMeta.color,
                      boxShadow: `0 0 0 ${activeMeta.color}`,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-mono text-sm leading-snug transition-colors duration-300"
                    style={{ color: '#E8F4FD' }}
                  >
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
