'use client';

import Link from 'next/link';
import { projectDetails } from '@/data/project-details';
import { useProjectDetailAnimations } from '@/features/projects/hooks/useProjectDetailAnimations';
import type { Project } from '@/types/project';

interface ProjectDetailClientProps {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function ProjectDetailClient({ project, prev, next }: ProjectDetailClientProps) {
  const detail = projectDetails[project.slug] ?? projectDetails['cipher-shield'];
  const { heroRef, contentRef } = useProjectDetailAnimations(project.slug);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <nav
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-4 backdrop-blur-xl md:px-8"
        aria-label="Project navigation"
      >
        <Link
          href="/#projects"
          className="group flex items-center gap-2 font-mono text-sm text-text-secondary transition-colors hover:text-accent"
          aria-label="Back to all projects"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          All Projects
        </Link>
        <span className="flex items-center gap-2 font-mono text-xs text-text-dim">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
          {project.category}
        </span>
      </nav>

      <header
        ref={heroRef}
        className="grid-bg relative flex min-h-screen items-center overflow-hidden pt-16"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle,${project.color}08 0%,transparent 65%)`,
          }}
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-24 md:px-16 lg:grid-cols-2">
          <div>
            <p
              className="detail-tag mb-6 inline-flex rounded-full border px-3 py-1.5 font-mono text-xs"
              style={{ color: project.color, borderColor: `${project.color}35` }}
            >
              ◈ {project.category} · {project.year}
            </p>
            <h1 className="detail-title mb-5 font-display text-5xl font-bold lg:text-7xl">
              {project.title}
            </h1>
            <p className="detail-sub mb-8 text-xl text-text-secondary">{project.subtitle}</p>
            <div className="detail-meta mb-8 flex flex-wrap gap-3">
              {project.tech.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a
                href={project.link}
                className="rounded px-5 py-2.5 font-mono text-sm font-semibold text-bg"
                style={{ backgroundColor: project.color }}
              >
                Live demo ↗
              </a>
              <a
                href={project.github}
                className="rounded border border-border px-5 py-2.5 font-mono text-sm text-text-secondary"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          <div className="detail-hero-visual rounded-2xl border border-border bg-surface p-6">
            <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-danger" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="ml-3 font-mono text-xs text-text-dim">project.metrics</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border bg-bg p-4">
                  <strong className="block font-display text-2xl" style={{ color: project.color }}>
                    {metric.value}
                  </strong>
                  <span className="font-mono text-[10px] text-text-dim">{metric.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 leading-relaxed text-text-secondary">{project.description}</p>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        ref={contentRef}
        className="mx-auto max-w-7xl space-y-20 px-4 py-24 md:px-16"
      >
        <section className="scroll-reveal">
          <p className="mb-4 font-mono text-xs" style={{ color: project.color }}>
            // tech stack
          </p>
          <div className="flex flex-wrap gap-3">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-border bg-surface px-4 py-2 font-mono text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <DetailBlock label="// the challenge" text={detail.challenge} color="#FF3B6B" />
          <DetailBlock label="// the solution" text={detail.solution} color="#00D4FF" />
        </div>

        <section className="scroll-reveal rounded-2xl border border-accent/20 bg-accent/[0.04] p-8">
          <p className="mb-3 font-mono text-xs text-accent">// measurable impact</p>
          <p className="text-2xl font-medium leading-relaxed">{detail.impact}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['Timeline', detail.timeline],
              ['Team', detail.teamSize],
              ['Role', detail.role],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[10px] text-text-dim">{label}</dt>
                <dd className="mt-1 text-sm text-text-secondary">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="scroll-reveal">
          <p className="mb-5 font-mono text-xs" style={{ color: project.color }}>
            // key highlights
          </p>
          <ul className="grid list-none gap-4 sm:grid-cols-2">
            {detail.highlights.map((highlight) => (
              <li key={highlight} className="rounded-xl border border-border bg-surface p-5">
                <span className="mr-3" style={{ color: project.color }}>
                  ◆
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </section>

        <section className="scroll-reveal">
          <p className="mb-5 font-mono text-xs" style={{ color: project.color }}>
            // implementation sample
          </p>
          <pre className="overflow-x-auto rounded-2xl border border-border bg-[#030709] p-6 text-sm leading-relaxed text-text-secondary">
            <code>{detail.codeSnippet}</code>
          </pre>
        </section>

        <nav
          className="grid gap-4 border-t border-border pt-10 sm:grid-cols-2"
          aria-label="Navigate between projects"
        >
          <ProjectLink project={prev} direction="previous" />
          <ProjectLink project={next} direction="next" />
        </nav>
      </main>
    </div>
  );
}

function DetailBlock({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <section className="scroll-reveal rounded-2xl border border-border bg-surface p-7">
      <p className="mb-4 font-mono text-xs" style={{ color }}>
        {label}
      </p>
      <p className="leading-relaxed text-text-secondary">{text}</p>
    </section>
  );
}

function ProjectLink({
  project,
  direction,
}: {
  project: Project | null;
  direction: 'previous' | 'next';
}) {
  if (!project) return <span />;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/30 ${
        direction === 'next' ? 'text-right' : ''
      }`}
    >
      <span className="block font-mono text-[10px] text-text-dim">
        {direction === 'previous' ? '← Previous' : 'Next →'}
      </span>
      <strong className="mt-2 block">{project.title}</strong>
    </Link>
  );
}
