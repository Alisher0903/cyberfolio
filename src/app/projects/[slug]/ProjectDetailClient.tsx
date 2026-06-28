'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import type { projects as ProjectsType } from '@/lib/utils';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type Project = (typeof ProjectsType)[number];
type Props = { project: Project; prev: Project | null; next: Project | null };

// Extended detail data per project
const extraData: Record<
  string,
  {
    challenge: string;
    solution: string;
    impact: string;
    timeline: string;
    teamSize: string;
    role: string;
    highlights: string[];
    codeSnippet: string;
  }
> = {
  'cipher-shield': {
    challenge:
      'Enterprise clients needed sub-100ms threat detection with a zero-downtime requirement. Legacy SIEM tools were producing 40% false positives, causing alert fatigue.',
    solution:
      'Architected a streaming data pipeline using WebSocket + Redis Pub/Sub. Built a custom ML inference layer in Python (FastAPI) and a React dashboard with virtualized lists for 100K+ event rows.',
    impact:
      'Reduced mean time to detect (MTTD) from 8 minutes to 47 seconds. False positive rate dropped to 0.8%.',
    timeline: '6 months',
    teamSize: '4 engineers',
    role: 'Frontend Lead + Security Architect',
    highlights: [
      'Real-time WebSocket event streaming with automatic reconnection',
      'Custom rule engine with drag-and-drop threat logic builder',
      'End-to-end encrypted audit logs with tamper detection',
      'Automated compliance reports (SOC2, ISO27001)',
    ],
    codeSnippet: `// Real-time threat stream with auto-reconnect
const useThreatStream = (endpoint: string) => {
  const [threats, setThreats] = useState<Threat[]>([]);
  
  useEffect(() => {
    let ws: WebSocket;
    let retries = 0;
    
    const connect = () => {
      ws = new WebSocket(endpoint);
      ws.onmessage = ({ data }) => {
        const threat = JSON.parse(data) as Threat;
        setThreats(prev => [threat, ...prev].slice(0, 1000));
      };
      ws.onclose = () => {
        if (retries < 5) {
          setTimeout(connect, Math.pow(2, retries++) * 1000);
        }
      };
    };
    connect();
    return () => ws?.close();
  }, [endpoint]);
  
  return threats;
};`,
  },
  'nexus-ui': {
    challenge:
      "Security teams needed data-dense UIs that were still accessible. Existing component libraries weren't designed for dark environments or real-time data.",
    solution:
      'Built a design system from scratch — tokens first, components second. Every component has keyboard navigation, screen reader support, and motion preferences respected.',
    impact:
      'Adopted by 6 internal products. 14K monthly npm downloads. 98/100 Lighthouse accessibility score.',
    timeline: '4 months (ongoing)',
    teamSize: 'Solo project',
    role: 'Design System Architect',
    highlights: [
      '60+ production-grade components with full TypeScript generics',
      'Zero dependencies except React — tiny bundle footprint',
      'Automated visual regression tests with Chromatic',
      'Full Storybook documentation with accessibility annotations',
    ],
    codeSnippet: `// Type-safe composable DataTable component
interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  virtualize?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  data, columns, onRowClick, virtualize = data.length > 200
}: DataTableProps<T>) {
  const { sorted, handleSort } = useSortable(data);
  const Component = virtualize ? VirtualTable : StandardTable;
  
  return (
    <Component
      data={sorted}
      columns={columns}
      onRowClick={onRowClick}
      onSort={handleSort}
      aria-label="Data table"
      role="grid"
    />
  );
}`,
  },
  'pentest-canvas': {
    challenge:
      'Security teams used spreadsheets and markdown files to map attack surfaces. No visual tool existed that matched their workflow and integrated with existing security tooling.',
    solution:
      'Built a canvas-based visual editor using the HTML5 Canvas API. Nodes represent assets, edges represent attack paths. Integrates live with ZAP and Burp via their REST APIs.',
    impact:
      'Used by 340+ security professionals. Cut report generation time from 3 hours to 25 minutes.',
    timeline: '5 months',
    teamSize: '2 engineers',
    role: 'Full-stack Developer',
    highlights: [
      'Drag-and-drop attack graph builder with CVSS scoring',
      'Burp Suite and OWASP ZAP API integration',
      'One-click compliance report generation (PDF/DOCX)',
      'Collaborative mode with real-time cursors via WebRTC',
    ],
    codeSnippet: `// Canvas node renderer with selection and drag
class AttackNode {
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public type: 'asset' | 'vuln' | 'entry',
    public cvss: number
  ) {}
  
  render(ctx: CanvasRenderingContext2D, selected: boolean) {
    const color = this.type === 'entry' ? '#FF3B6B'
      : this.cvss > 7 ? '#FFB800' : '#00FF87';
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, 24, 0, Math.PI * 2);
    ctx.fillStyle = color + '15';
    ctx.fill();
    ctx.strokeStyle = selected ? '#fff' : color;
    ctx.lineWidth = selected ? 2 : 1;
    ctx.stroke();
  }
}`,
  },
  waveterm: {
    challenge:
      'Existing terminal emulators rendered with DOM elements, causing frame drops during fast output. SSH workflows required constant context switching.',
    solution:
      'Used WebGL for all text rendering — each glyph is a textured quad on the GPU. Implemented a custom font atlas with subpixel rendering for crisp text at any scale.',
    impact: 'Consistent 60fps at 200,000 lines of scrollback. 4.1K downloads in first 3 months.',
    timeline: '8 months',
    teamSize: 'Solo project',
    role: 'Systems + Frontend Engineer',
    highlights: [
      'WebGL text rendering with custom glyph atlas and font hinting',
      'Native SSH client built in Rust (via NAPI bindings)',
      'Plugin system with JS/WASM runtime sandboxing',
      'Split-pane layout engine with persistent sessions',
    ],
    codeSnippet: `// WebGL glyph renderer — batched draw calls
class GlyphRenderer {
  private atlas: GlyphAtlas;
  private vertexBuffer: Float32Array;
  
  constructor(gl: WebGL2RenderingContext) {
    this.atlas = new GlyphAtlas(gl, { size: 2048 });
    this.vertexBuffer = new Float32Array(MAX_GLYPHS * 6 * 4);
  }
  
  render(cells: TerminalCell[], viewport: Rect) {
    let idx = 0;
    for (const cell of cells) {
      const glyph = this.atlas.get(cell.char, cell.attrs);
      this.writeQuad(this.vertexBuffer, idx, glyph, cell);
      idx += 24;
    }
    this.gl.bufferSubData(ARRAY_BUFFER, 0, this.vertexBuffer, 0, idx);
    this.gl.drawArrays(TRIANGLES, 0, idx / 4);
  }
}`,
  },
};

export default function ProjectDetailClient({ project, prev, next }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const extra = extraData[project.slug] ?? extraData['cipher-shield'];

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        '.detail-tag',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1 },
      );
      gsap.fromTo(
        '.detail-title',
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' },
      );
      gsap.fromTo(
        '.detail-sub',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.5 },
      );
      gsap.fromTo(
        '.detail-meta',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.6, stagger: 0.1 },
      );
      gsap.fromTo(
        '.detail-hero-visual',
        { opacity: 0, scale: 0.92, rotateY: 8 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1.1, delay: 0.3, ease: 'power3.out' },
      );

      // Scroll reveals
      gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          },
        );
      });
    });
    return () => ctx.revert();
  }, [project.slug]);

  return (
    <div style={{ backgroundColor: '#050A0E', minHeight: '100vh', color: '#E8F4FD' }}>
      {/* ── Back nav ─────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(5,10,14,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #0E2030',
        }}
        aria-label="Project navigation"
      >
        <Link
          href="/#projects"
          className="flex items-center gap-2 font-mono text-sm transition-colors duration-200 group"
          style={{ color: '#7FA8C4' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#00FF87')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#7FA8C4')}
          aria-label="Back to all projects"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          All Projects
        </Link>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs" style={{ color: '#3A5568' }}>
            {project.category}
          </span>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <header
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-16 grid-bg"
      >
        {/* Color orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle,${project.color}08 0%,transparent 65%)`,
            zIndex: 0,
          }}
        />

        {/* Animated corner brackets */}
        {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-8 h-8 opacity-20`}
            aria-hidden="true"
            style={{
              borderTop: i < 2 ? `1px solid ${project.color}` : 'none',
              borderBottom: i >= 2 ? `1px solid ${project.color}` : 'none',
              borderLeft: i % 2 === 0 ? `1px solid ${project.color}` : 'none',
              borderRight: i % 2 === 1 ? `1px solid ${project.color}` : 'none',
            }}
          />
        ))}

        <div
          className="relative max-w-7xl mx-auto px-4 md:px-16 py-24 w-full grid lg:grid-cols-2 gap-12 items-center"
          style={{ zIndex: 1 }}
        >
          {/* Left: text */}
          <div>
            <div
              className="detail-tag inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border font-mono text-xs"
              style={{
                color: project.color,
                borderColor: project.color + '30',
                backgroundColor: project.color + '08',
              }}
            >
              <span aria-hidden="true">◈</span> {project.category} · {project.year}
            </div>

            <h1
              className="detail-title font-display font-bold mb-4 overflow-hidden"
              style={{ fontSize: 'clamp(3rem,8vw,7rem)', lineHeight: 0.95, color: '#E8F4FD' }}
            >
              {project.title}
            </h1>
            <p
              className="detail-sub font-display text-xl md:text-2xl mb-8"
              style={{ color: '#7FA8C4' }}
            >
              {project.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-meta flex items-center gap-2 px-6 py-3 rounded font-mono text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: project.color, color: '#050A0E' }}
                aria-label={`Live demo for ${project.title}`}
              >
                Live Demo ↗
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-meta flex items-center gap-2 px-6 py-3 rounded font-mono text-sm border transition-all duration-300 hover:bg-white/5"
                style={{ borderColor: '#0E2030', color: '#7FA8C4' }}
                aria-label={`GitHub repository for ${project.title}`}
              >
                GitHub
              </a>
            </div>

            {/* Meta pills */}
            <dl className="flex flex-wrap gap-3">
              {[
                { dt: 'Timeline', dd: extra.timeline },
                { dt: 'Team', dd: extra.teamSize },
                { dt: 'My Role', dd: extra.role },
              ].map((m) => (
                <div
                  key={m.dt}
                  className="detail-meta px-4 py-2 rounded-lg border"
                  style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
                >
                  <dt className="font-mono text-xs mb-0.5" style={{ color: '#3A5568' }}>
                    {m.dt}
                  </dt>
                  <dd className="font-mono text-sm" style={{ color: '#E8F4FD' }}>
                    {m.dd}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: metrics visual */}
          <div className="detail-hero-visual">
            <div
              className="rounded-2xl overflow-hidden border"
              style={{ backgroundColor: '#0A1219', borderColor: project.color + '25' }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: '#0E2030' }}
              >
                {['#FF3B6B', '#FFB800', '#00FF87'].map((c) => (
                  <div
                    key={c}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: c }}
                    aria-hidden="true"
                  />
                ))}
                <code className="ml-2 font-mono text-xs" style={{ color: '#3A5568' }}>
                  ~ {project.slug} <span style={{ color: project.color }}>●</span>
                </code>
              </div>

              <div className="p-6">
                {/* Big metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {project.metrics.map((m, i) => (
                    <article
                      key={i}
                      className="rounded-xl p-4 text-center"
                      style={{ backgroundColor: '#050A0E' }}
                    >
                      <div
                        className="font-display text-2xl font-bold mb-1"
                        style={{ color: project.color }}
                      >
                        {m.value}
                      </div>
                      <div className="font-mono text-xs leading-tight" style={{ color: '#3A5568' }}>
                        {m.label}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Activity graph */}
                <div className="rounded-xl p-4" style={{ backgroundColor: '#050A0E' }}>
                  <p className="font-mono text-xs mb-3" style={{ color: '#3A5568' }}>
                    system activity
                  </p>
                  <div className="flex items-end gap-px h-16" aria-hidden="true">
                    {Array.from({ length: 36 }, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t"
                        style={{
                          backgroundColor: project.color + (i % 4 === 0 ? '90' : '25'),
                          height: `${Math.abs(Math.sin(i * 0.45) * 65) + 20}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Status row */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: '#00FF87' }}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs" style={{ color: '#00FF87' }}>
                      All systems operational
                    </span>
                  </div>
                  <span className="font-mono text-xs" style={{ color: '#3A5568' }}>
                    v2.4.1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────── */}
      <main
        id="main-content"
        tabIndex={-1}
        ref={contentRef}
        className="max-w-7xl mx-auto px-4 md:px-16 py-24 space-y-24"
      >
        {/* Tech stack */}
        <section aria-labelledby="tech-heading" className="scroll-reveal">
          <h2 id="tech-heading" className="font-mono text-xs mb-4" style={{ color: project.color }}>
            // tech stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-4 py-2 font-mono text-sm rounded-lg border transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: '#0A1219',
                  borderColor: project.color + '20',
                  color: '#E8F4FD',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Challenge / Solution */}
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              id: 'challenge-heading',
              label: '// the challenge',
              text: extra.challenge,
              border: '#FF3B6B',
            },
            {
              id: 'solution-heading',
              label: '// the solution',
              text: extra.solution,
              border: project.color,
            },
          ].map((block) => (
            <section
              key={block.id}
              aria-labelledby={block.id}
              className="scroll-reveal p-6 md:p-8 rounded-2xl border"
              style={{
                backgroundColor: '#0A1219',
                borderColor: '#0E2030',
                borderLeft: `3px solid ${block.border}`,
              }}
            >
              <h2 id={block.id} className="font-mono text-xs mb-4" style={{ color: block.border }}>
                {block.label}
              </h2>
              <p className="leading-relaxed" style={{ color: '#7FA8C4' }}>
                {block.text}
              </p>
            </section>
          ))}
        </div>

        {/* Impact */}
        <section
          aria-labelledby="impact-heading"
          className="scroll-reveal text-center py-16 rounded-2xl relative overflow-hidden"
          style={{ backgroundColor: '#0A1219', border: `1px solid ${project.color}20` }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background: `radial-gradient(ellipse at 50% 50%,${project.color}06 0%,transparent 70%)`,
            }}
          />
          <h2
            id="impact-heading"
            className="font-mono text-xs mb-6"
            style={{ color: project.color }}
          >
            // impact
          </h2>
          <p
            className="font-display text-2xl md:text-3xl font-bold max-w-2xl mx-auto px-4"
            style={{ color: '#E8F4FD', lineHeight: 1.4 }}
          >
            {extra.impact}
          </p>
        </section>

        {/* Highlights */}
        <section aria-labelledby="highlights-heading" className="scroll-reveal">
          <h2
            id="highlights-heading"
            className="font-mono text-xs mb-6"
            style={{ color: project.color }}
          >
            // key features
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4 list-none" role="list">
            {extra.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl border"
                style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
              >
                <span
                  className="mt-0.5 font-mono text-lg shrink-0"
                  style={{ color: project.color }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ color: '#7FA8C4' }}>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Code snippet */}
        <section aria-labelledby="code-heading" className="scroll-reveal">
          <h2 id="code-heading" className="font-mono text-xs mb-4" style={{ color: project.color }}>
            // code highlight
          </h2>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: '#0E2030', backgroundColor: '#0A1219' }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: '#0E2030' }}
            >
              {['#FF3B6B', '#FFB800', '#00FF87'].map((c) => (
                <div
                  key={c}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: c }}
                  aria-hidden="true"
                />
              ))}
              <code className="ml-2 font-mono text-xs" style={{ color: '#3A5568' }}>
                {project.slug}.ts
              </code>
            </div>
            <pre className="p-6 overflow-x-auto" style={{ fontSize: '0.8rem', lineHeight: 1.7 }}>
              <code className="font-mono" style={{ color: '#E8F4FD' }}>
                {extra.codeSnippet}
              </code>
            </pre>
          </div>
        </section>

        {/* ── Prev / Next ─────────────────────────────── */}
        <nav aria-label="Navigate between projects">
          <div className="border-t pt-12" style={{ borderColor: '#0E2030' }}>
            <p className="font-mono text-xs text-center mb-8" style={{ color: '#3A5568' }}>
              more projects
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {prev ? (
                <Link
                  href={`/projects/${prev.slug}`}
                  className="group flex flex-col p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02]"
                  style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = prev.color + '40')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#0E2030')}
                  aria-label={`Previous project: ${prev.title}`}
                >
                  <span className="font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                    ← previous
                  </span>
                  <span className="font-display text-xl font-bold" style={{ color: '#E8F4FD' }}>
                    {prev.title}
                  </span>
                  <span className="font-mono text-sm mt-1" style={{ color: prev.color }}>
                    {prev.category}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/projects/${next.slug}`}
                  className="group flex flex-col items-end p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02]"
                  style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = next.color + '40')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#0E2030')}
                  aria-label={`Next project: ${next.title}`}
                >
                  <span className="font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                    next →
                  </span>
                  <span className="font-display text-xl font-bold" style={{ color: '#E8F4FD' }}>
                    {next.title}
                  </span>
                  <span className="font-mono text-sm mt-1" style={{ color: next.color }}>
                    {next.category}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </nav>
      </main>
    </div>
  );
}
