'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { usePortfolioData } from '@/features/portfolio/PortfolioDataProvider';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const isExternalUrl = (value?: string) => /^https?:\/\/\S+$/i.test(value ?? '');

const displayUrl = (value: string) => {
  if (!isExternalUrl(value)) return 'Project preview';
  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname === '/' ? '' : url.pathname}`;
  } catch {
    return 'Project preview';
  }
};

export default function Projects() {
  const { projects } = usePortfolioData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const panel = containerRef.current;
    if (!panel) return;
    const measure = () => {
      const fits =
        window.innerWidth >= 1280 &&
        window.innerHeight >= 850 &&
        panel.scrollHeight <= window.innerHeight + 1;
      setPinned(fits);
    };
    const observer = new window.ResizeObserver(measure);
    observer.observe(panel);
    Array.from(panel.children).forEach((child) => observer.observe(child));
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [projects.length, activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container || projects.length === 0 || !pinned) return;

    const ctx = gsap.context(() => {
      const total = projects.length;

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${window.innerHeight * total}`,
        pin: container,
        pinSpacing: true,
        onUpdate: (self) => {
          const idx = Math.min(Math.floor(self.progress * total), total - 1);
          setActiveIndex(idx);
          if (progressRef.current) progressRef.current.style.width = `${self.progress * 100}%`;
        },
      });

      gsap.fromTo(
        '.projects-heading',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: section, start: 'top 80%' } },
      );
    }, section);

    return () => ctx.revert();
  }, [projects.length, pinned]);

  const project = projects[Math.min(activeIndex, projects.length - 1)];

  if (!project) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      id="projects"
      style={{ height: pinned ? `${(projects.length + 1) * 100}vh` : 'auto' }}
    >
      <div
        ref={containerRef}
        className={`flex flex-col ${pinned ? 'h-screen' : 'min-h-svh pb-24 md:pb-8'}`}
        style={{ backgroundColor: '#050A0E' }}
        role="region"
        aria-label="Projects showcase"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* ── Header ───────────────────────────────── */}
        <div className="px-4 md:px-16 pt-16 md:pt-24 pb-4 flex items-end justify-between flex-shrink-0">
          <div className="projects-heading">
            <p className="font-mono text-xs mb-1" style={{ color: '#00FF87' }}>
              03 / Projects
            </p>
            <h2
              className="font-display text-3xl md:text-5xl font-bold"
              style={{ color: '#E8F4FD' }}
            >
              Selected Work
            </h2>
          </div>
          <div className="font-mono text-right" style={{ color: '#3A5568' }}>
            <span
              style={{
                color: '#E8F4FD',
                fontSize: 'clamp(1.5rem,4vw,2.5rem)',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-sm"> / {String(projects.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="mx-4 md:mx-16 mb-4 h-px flex-shrink-0"
          style={{ backgroundColor: '#0E2030' }}
        >
          <div
            ref={progressRef}
            className="h-full transition-all duration-75"
            style={{ backgroundColor: project?.color || '#00FF87', width: '0%' }}
          />
        </div>

        {/* ── Content ──────────────────────────────── */}
        <div className="flex-1 px-4 md:px-16 grid xl:grid-cols-2 gap-8 items-center min-w-0 py-6">
          {/* Left: text */}
          <div
            key={`left-${activeIndex}`}
            className="flex min-w-0 flex-col justify-center [overflow-wrap:anywhere]"
            style={{ animation: 'fadeInLeft 0.45s ease forwards' }}
          >
            <style>{`@keyframes fadeInLeft{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}`}</style>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="px-3 py-1 font-mono text-xs rounded-full border"
                style={{
                  color: project?.color,
                  borderColor: project?.color + '40',
                  backgroundColor: project?.color + '10',
                }}
              >
                {project?.category}
              </span>
              <span className="font-mono text-xs" style={{ color: '#3A5568' }}>
                {project?.year}
              </span>
            </div>

            <h3
              className="font-display font-bold mb-2"
              style={{ color: '#E8F4FD', fontSize: 'clamp(2rem,3.5vw,3.5rem)', lineHeight: 1.12 }}
            >
              {project?.title}
            </h3>
            <p className="font-display text-base md:text-xl mb-4" style={{ color: '#7FA8C4' }}>
              {project?.subtitle}
            </p>
            <p
              className="leading-relaxed mb-5 text-sm md:text-base max-w-prose"
              style={{ color: '#7FA8C4' }}
            >
              {project?.description}
            </p>

            {/* Tech */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project?.tech.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 font-mono text-xs rounded border"
                  style={{ borderColor: '#0E2030', color: '#7FA8C4', backgroundColor: '#0A1219' }}
                >
                  {t}
                </span>
              ))}
              {(project?.tech.length ?? 0) > 5 && (
                <span
                  className="px-2 py-1 font-mono text-xs rounded border"
                  style={{ borderColor: '#0E2030', color: '#3A5568', backgroundColor: '#0A1219' }}
                >
                  +{(project?.tech.length ?? 0) - 5} more
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              {project?.metrics.map((m) => (
                <div key={m.label} className="min-w-0 [overflow-wrap:anywhere]">
                  <div
                    className="font-display text-lg md:text-xl font-bold leading-snug"
                    style={{ color: project?.color }}
                  >
                    {m.value}
                  </div>
                  <div className="font-mono text-xs" style={{ color: '#3A5568' }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/projects/${project?.slug}`}
                aria-label={`View details for ${project?.title}`}
                className="flex items-center gap-2 px-5 py-2.5 font-mono text-sm rounded transition-all duration-300"
                style={{ backgroundColor: project?.color, color: '#050A0E', fontWeight: 600 }}
              >
                Details →
              </Link>
              {isExternalUrl(project.link) && (
                <a
                  href={project?.link}
                  aria-label={`Live demo of ${project?.title} (opens in new tab)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 font-mono text-sm rounded border transition-all duration-300"
                  style={{ borderColor: '#0E2030', color: '#7FA8C4' }}
                  onMouseEnter={(e) => {
                    const a = e.currentTarget;
                    a.style.borderColor = project?.color || '#00FF87';
                    a.style.color = project?.color || '#00FF87';
                  }}
                  onMouseLeave={(e) => {
                    const a = e.currentTarget;
                    a.style.borderColor = '#0E2030';
                    a.style.color = '#7FA8C4';
                  }}
                >
                  Live ↗
                </a>
              )}
              {isExternalUrl(project.github) && (
                <a
                  href={project?.github}
                  aria-label={`GitHub repository for ${project?.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 font-mono text-sm rounded border transition-all duration-300"
                  style={{ borderColor: '#0E2030', color: '#7FA8C4' }}
                  onMouseEnter={(e) => {
                    const a = e.currentTarget;
                    a.style.borderColor = '#0E2030';
                    a.style.color = '#E8F4FD';
                  }}
                  onMouseLeave={(e) => {
                    const a = e.currentTarget;
                    a.style.borderColor = '#0E2030';
                    a.style.color = '#7FA8C4';
                  }}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Right: visual card (hidden on small mobile) */}
          <div
            key={`right-${activeIndex}`}
            className="min-w-0"
            style={{ animation: 'fadeInRight 0.45s ease forwards' }}
          >
            <style>{`@keyframes fadeInRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}`}</style>

            <div
              className="rounded-2xl overflow-hidden border"
              style={{ borderColor: project?.color + '20', backgroundColor: '#0A1219' }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: '#0E2030', backgroundColor: 'rgba(5,10,14,0.8)' }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF3B6B' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFB800' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00FF87' }} />
                <div
                  className="ml-2 min-w-0 flex-1 truncate h-6 rounded font-mono text-xs px-3 leading-6"
                  style={{ backgroundColor: '#050A0E', color: '#3A5568' }}
                >
                  {displayUrl(project.link)}
                </div>
              </div>
              {project.coverImage ? (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={project.coverImage}
                    alt={`${project.title} project cover`}
                    fill
                    sizes="(min-width: 1280px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="p-5 space-y-3">
                  <div className="flex gap-3">
                    <div
                      className="h-8 rounded flex-1"
                      style={{ backgroundColor: project?.color + '15' }}
                    >
                      <div
                        className="h-full w-1/3 rounded"
                        style={{ backgroundColor: project?.color + '30' }}
                      />
                    </div>
                    {isExternalUrl(project.link) && (
                      <div
                        className="h-8 w-20 rounded flex items-center justify-center font-mono text-xs"
                        style={{ backgroundColor: project?.color, color: '#050A0E' }}
                      >
                        LIVE
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {project?.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="min-w-0 rounded-lg p-3 [overflow-wrap:anywhere]"
                        style={{ backgroundColor: '#050A0E' }}
                      >
                        <div
                          className="font-mono text-base font-bold"
                          style={{ color: project?.color }}
                        >
                          {m.value}
                        </div>
                        <div className="font-mono text-xs mt-0.5" style={{ color: '#3A5568' }}>
                          {m.label}
                        </div>
                        <div className="mt-2 h-1 rounded" style={{ backgroundColor: '#0E2030' }}>
                          <div
                            className="h-full rounded"
                            style={{
                              backgroundColor: project?.color,
                              width: `${Math.min(100, 55 + i * 15)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#050A0E' }}>
                    <div className="font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                      Activity
                    </div>
                    <div className="flex items-end gap-0.5 h-12">
                      {Array.from({ length: 24 }, (_, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t"
                          style={{
                            backgroundColor: project?.color + (i % 3 === 0 ? '80' : '20'),
                            height: `${Math.sin(i * 0.8) * 30 + 50}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dot nav */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 px-4 pb-4 flex-shrink-0"
          role="tablist"
          aria-label="Project navigation"
        >
          {projects.map((p, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to project ${i + 1}: ${p.title}`}
              onClick={() => {
                if (!pinned) {
                  setActiveIndex(i);
                  const section = sectionRef.current;
                  if (section)
                    window.scrollTo({
                      top: section.getBoundingClientRect().top + window.scrollY - 64,
                      behavior: 'smooth',
                    });
                  return;
                }
                const el = document.getElementById('projects');
                if (!el) return;
                const top =
                  el.offsetTop + (i / projects.length) * (projects.length * window.innerHeight);
                window.scrollTo({ top, behavior: 'smooth' });
              }}
              style={{
                width: i === activeIndex ? '2.5rem' : '1.75rem',
                height: '1.75rem',
                paddingBlock: '10px',
                backgroundClip: 'content-box',
                borderRadius: '9999px',
                backgroundColor: i === activeIndex ? p.color : '#0E2030',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
        <p
          className="text-center font-mono text-xs pb-3 flex-shrink-0"
          style={{ color: '#3A5568' }}
        >
          {pinned ? 'scroll ↓ to navigate' : 'Select a project above'}
        </p>
      </div>
    </div>
  );
}
