'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutCardList, experience } from '@/lib/utils';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-left',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: { trigger: '.about-left', start: 'top 80%' },
        },
      );
      gsap.fromTo(
        '.about-right',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: { trigger: '.about-right', start: 'top 80%' },
        },
      );
      gsap.fromTo(
        '.exp-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          scrollTrigger: { trigger: '.exp-item', start: 'top 85%' },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 md:py-32 grid-bg"
      style={{ backgroundColor: '#050A0E' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-10 md:mb-16">
          <p className="font-mono text-xs" style={{ color: '#00FF87' }}>
            02 / About
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: '#0E2030' }} />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Left */}
          <div className="about-left">
            <h2
              className="font-display text-4xl lg:text-5xl font-bold mb-6"
              style={{ color: '#E8F4FD' }}
            >
              Frontend Engineer <span className="gradient-text">with a Security-First Mindset</span>
            </h2>
            <p className="text-lg leading-relaxed mb-3" style={{ color: '#7FA8C4' }}>
              Frontend Developer specializing in Next.js, React, and TypeScript, focused on building
              high-performance web applications.
            </p>
            <p className="text-lg leading-relaxed mb-8" style={{ color: '#7FA8C4' }}>
              Alongside frontend development, I'm expanding into cybersecurity through hands-on
              labs, Hack The Box, and CTF challenges. <br />
              My goal is to combine modern frontend engineering with a security-first mindset to
              build applications that are fast, reliable, and secure.
            </p>

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-4">
              {aboutCardList.map((f) => (
                <div
                  key={f.label}
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
                >
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="font-mono text-xs mb-0.5" style={{ color: '#3A5568' }}>
                    {f.label}
                  </div>
                  <div className="font-mono text-sm font-medium" style={{ color: '#E8F4FD' }}>
                    {f.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Avatar/Visual */}
          <div className="about-right flex items-center justify-center">
            <div className="relative">
              {/* Rotating ring */}
              <div
                className="absolute -inset-6 rotate-slow rounded-full"
                style={{
                  border: '1px solid transparent',
                  borderTopColor: '#00FF87',
                  borderRightColor: 'transparent',
                  borderBottomColor: '#00D4FF',
                  borderLeftColor: 'transparent',
                }}
              />
              <div
                className="absolute -inset-12 rounded-full"
                style={{
                  border: '1px dashed rgba(0,255,135,0.1)',
                  animation: 'rotate 30s linear infinite reverse',
                }}
              />

              {/* Avatar placeholder */}
              <div
                className="relative w-64 h-64 rounded-full overflow-hidden flex items-center justify-center font-display text-7xl font-bold"
                style={{
                  backgroundColor: '#0A1219',
                  border: '2px solid #0E2030',
                  color: '#00FF87',
                }}
              >
                AS
                {/* Overlay shimmer */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg,rgba(0,255,135,0.05),rgba(0,212,255,0.05))',
                  }}
                />
              </div>

              {/* Floating tags */}
              <div
                className="absolute -right-8 top-1/4 px-3 py-2 rounded-lg border font-mono text-xs"
                style={{
                  backgroundColor: '#0A1219',
                  borderColor: 'rgba(0,255,135,0.2)',
                  color: '#00FF87',
                  animation: 'float 4s ease-in-out infinite',
                }}
              >
                &lt;/web-security&gt;
              </div>
              <div
                className="absolute -left-8 bottom-1/4 px-3 py-2 rounded-lg border font-mono text-xs"
                style={{
                  backgroundColor: '#0A1219',
                  borderColor: 'rgba(0,212,255,0.2)',
                  color: '#00D4FF',
                  animation: 'float 4s ease-in-out infinite 2s',
                }}
              >
                const secureUI = true;
              </div>
            </div>
          </div>
        </div>

        {/* Experience timeline */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-8" style={{ color: '#E8F4FD' }}>
            Experience
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ backgroundColor: '#0E2030' }}
            />

            <div className="space-y-0">
              {experience.map((exp, i) => (
                <div key={i} className="exp-item relative pl-8 pb-10">
                  {/* Dot */}
                  <div
                    className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-1/2"
                    style={{
                      backgroundColor: i === 0 ? '#00FF87' : '#0E2030',
                      border: i === 0 ? '2px solid #00FF87' : '1px solid #3A5568',
                    }}
                  />

                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h4
                        className="font-display text-xl font-semibold mb-1"
                        style={{ color: '#E8F4FD' }}
                      >
                        {exp.role}
                      </h4>
                      <p
                        className="font-mono text-sm"
                        style={{ color: i === 0 ? '#00FF87' : '#7FA8C4' }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="font-mono text-xs px-3 py-1 rounded"
                      style={{ backgroundColor: '#0A1219', color: '#3A5568' }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <p className="mb-4 leading-relaxed" style={{ color: '#7FA8C4' }}>
                    {exp.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 font-mono text-xs rounded"
                        style={{
                          backgroundColor: 'rgba(0,212,255,0.06)',
                          color: '#00D4FF',
                          border: '1px solid rgba(0,212,255,0.15)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
