'use client'
import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useResumeStore, themeColors, ColorTheme, LayoutStyle } from '@/store/resumeStore'
import ResumePreview from '@/components/resume/ResumePreview'

type Tab = 'personal' | 'work' | 'education' | 'projects' | 'skills' | 'style'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'personal', label: 'Personal', icon: '◈' },
  { id: 'work', label: 'Work', icon: '◉' },
  { id: 'education', label: 'Education', icon: '◆' },
  { id: 'projects', label: 'Projects', icon: '⬡' },
  { id: 'skills', label: 'Skills', icon: '◇' },
  { id: 'style', label: 'Style', icon: '✦' },
]

const Field = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <label
      style={{
        display: 'block',
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: '0.65rem',
        color: '#3A5568',
        marginBottom: '0.3rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        rows={3}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          backgroundColor: '#050A0E',
          border: '1px solid #0E2030',
          borderRadius: '6px',
          padding: '8px 10px',
          color: '#E8F4FD',
          fontFamily: "'DM Sans',sans-serif",
          fontSize: '0.8rem',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.5,
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(0,255,135,0.3)')}
        onBlur={(e) => (e.target.style.borderColor = '#0E2030')}
      />
    ) : (
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          backgroundColor: '#050A0E',
          border: '1px solid #0E2030',
          borderRadius: '6px',
          padding: '8px 10px',
          color: '#E8F4FD',
          fontFamily: "'DM Sans',sans-serif",
          fontSize: '0.8rem',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(0,255,135,0.3)')}
        onBlur={(e) => (e.target.style.borderColor = '#0E2030')}
      />
    )}
  </div>
)

export default function ResumeBuilderClient() {
  const {
    data,
    update,
    updateWork,
    addWork,
    removeWork,
    updateEdu,
    addEdu,
    removeEdu,
    updateProject,
    addProject,
    removeProject,
    updateSkillGroup,
    addSkillGroup,
    removeSkillGroup,
    reset,
  } = useResumeStore()

  const [activeTab, setActiveTab] = useState<Tab>('personal')
  const [exporting, setExporting] = useState(false)
  const [previewScale, setPreviewScale] = useState(0.85)
  const printRef = useRef<HTMLDivElement>(null)

  const exportPDF = useCallback(async () => {
    setExporting(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')

      const el = document.getElementById('resume-preview')
      if (!el) return

      // 1. Vaqtincha scale ni olib tashlaymiz — 1:1 holda capture uchun
      const prevTransform = el.style.transform
      el.style.transform = 'none'
      el.style.boxShadow = 'none'
      el.style.border = 'none'

      // 2. Elementning haqiqiy o'lchamini olamiz (mm → px: 1mm ≈ 3.7795px at 96dpi)
      // A4: 210mm × 297mm → 794px × 1123px
      el.style.width = '794px'
      el.style.minHeight = '1123px'
      el.style.maxHeight = '1123px'
      el.style.overflow = 'hidden'

      // Render uchun bir frame kutamiz
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

      const canvas = await html2canvas(el, {
        scale: 2, // retina quality
        useCORS: true,
        logging: false,
        backgroundColor: data.layoutStyle === 'terminal' ? '#050A0E' : '#ffffff',
        width: 794,
        height: 1123,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (doc) => {
          // Clone ichidagi elementga ham style beramiz
          const cloned = doc.getElementById('resume-preview')
          if (cloned) {
            cloned.style.transform = 'none'
            cloned.style.width = '794px'
            cloned.style.minHeight = '1123px'
            cloned.style.maxHeight = '1123px'
            cloned.style.overflow = 'hidden'
            cloned.style.boxShadow = 'none'
            cloned.style.border = 'none'
          }
        },
      })

      // 3. Original style ni qaytaramiz
      el.style.transform = prevTransform
      el.style.boxShadow = ''
      el.style.border = ''
      el.style.width = '210mm'
      el.style.minHeight = '297mm'
      el.style.maxHeight = ''
      el.style.overflow = ''

      // 4. Exact A4 ga joylashtiramiz — canvas aniq 794×1123 bo'lgani uchun pixel perfect
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
      const imgData = canvas.toDataURL('image/png', 1.0)
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST')
      pdf.save(`${(data.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`)
    } catch (err) {
      console.error('PDF export error:', err)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }, [data])

  const btnStyle = (active: boolean) =>
    ({
      padding: '0.4rem 0.6rem',
      backgroundColor: active ? 'rgba(0,255,135,0.1)' : 'transparent',
      border: `1px solid ${active ? 'rgba(0,255,135,0.3)' : '#0E2030'}`,
      borderRadius: '6px',
      color: active ? '#00FF87' : '#7FA8C4',
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: '0.7rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
    }) as React.CSSProperties

  const removeBtn = (onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: '0.6rem',
        color: '#FF3B6B',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px 6px',
      }}
      aria-label="Remove item"
    >
      ✕
    </button>
  )

  const addBtn = (onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      style={{
        marginTop: '0.5rem',
        padding: '0.4rem 0.8rem',
        backgroundColor: 'transparent',
        border: '1px dashed #0E2030',
        borderRadius: '6px',
        color: '#3A5568',
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: '0.65rem',
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#00FF87'
        ;(e.currentTarget as HTMLButtonElement).style.color = '#00FF87'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#0E2030'
        ;(e.currentTarget as HTMLButtonElement).style.color = '#3A5568'
      }}
    >
      + {label}
    </button>
  )

  const itemCard = (children: React.ReactNode, onRemove: () => void) => (
    <div
      style={{
        padding: '0.75rem',
        backgroundColor: '#050A0E',
        border: '1px solid #0E2030',
        borderRadius: '8px',
        marginBottom: '0.75rem',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
        {removeBtn(onRemove)}
      </div>
      {children}
    </div>
  )

  return (
    <div
      style={{
        backgroundColor: '#050A0E',
        minHeight: '100vh',
        color: '#E8F4FD',
        fontFamily: "'DM Sans',sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top bar ──────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(5,10,14,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #0E2030',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '0.7rem',
            color: '#7FA8C4',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          aria-label="Back to portfolio"
        >
          ← Portfolio
        </Link>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: '#E8F4FD',
            }}
          >
            Resume Builder
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '0.6rem',
              color: '#00FF87',
              border: '1px solid rgba(0,255,135,0.3)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            v1
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Scale slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '0.6rem',
                color: '#3A5568',
              }}
            >
              zoom
            </span>
            <input
              type="range"
              min={0.5}
              max={1}
              step={0.05}
              value={previewScale}
              onChange={(e) => setPreviewScale(Number(e.target.value))}
              style={{ width: '70px', accentColor: '#00FF87' }}
              aria-label="Preview zoom level"
            />
          </div>
          <button onClick={reset} style={btnStyle(false)} aria-label="Reset to defaults">
            ↺ Reset
          </button>
          <button
            onClick={exportPDF}
            disabled={exporting}
            style={{
              ...btnStyle(false),
              backgroundColor: '#00FF87',
              color: '#050A0E',
              borderColor: '#00FF87',
              fontWeight: 600,
              opacity: exporting ? 0.7 : 1,
            }}
            aria-label="Export resume as PDF"
          >
            {exporting ? 'Exporting...' : '↓ Export PDF'}
          </button>
        </div>
      </header>

      {/* ── Main layout ──────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          overflow: 'hidden',
          height: 'calc(100vh - 56px)',
        }}
        role="main"
      >
        {/* ── LEFT: Editor panel ─────────────────── */}
        <aside
          style={{
            borderRight: '1px solid #0E2030',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#0A1219',
          }}
          aria-label="Resume editor"
        >
          {/* Tab nav */}
          <nav
            style={{
              display: 'flex',
              overflowX: 'auto',
              borderBottom: '1px solid #0E2030',
              padding: '0.5rem 0.5rem',
            }}
            className="resume-side-scroll"
            aria-label="Editor sections"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                style={{
                  flexShrink: 0,
                  padding: '0.5rem 0.75rem',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '0.65rem',
                  color: activeTab === tab.id ? '#00FF87' : '#3A5568',
                  background: 'none',
                  border: 'none',
                  borderBottom:
                    activeTab === tab.id ? '2px solid #00FF87' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                <span aria-hidden="true">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {activeTab === 'personal' && (
              <section aria-labelledby="personal-heading">
                <h2 id="personal-heading" className="sr-only">
                  Personal Information
                </h2>
                <Field
                  label="Full Name"
                  value={data.name}
                  onChange={(v) => update({ name: v })}
                  placeholder="Alisher Karimov"
                />
                <Field
                  label="Job Title"
                  value={data.title}
                  onChange={(v) => update({ title: v })}
                  placeholder="Frontend Engineer"
                />
                <Field
                  label="Email"
                  value={data.email}
                  onChange={(v) => update({ email: v })}
                  placeholder="you@example.com"
                />
                <Field
                  label="Phone"
                  value={data.phone}
                  onChange={(v) => update({ phone: v })}
                  placeholder="+1 (555) 000-0000"
                />
                <Field
                  label="Location"
                  value={data.location}
                  onChange={(v) => update({ location: v })}
                  placeholder="Tashkent, UZ"
                />
                <Field
                  label="Website"
                  value={data.website}
                  onChange={(v) => update({ website: v })}
                  placeholder="yoursite.dev"
                />
                <Field
                  label="GitHub"
                  value={data.github}
                  onChange={(v) => update({ github: v })}
                  placeholder="github.com/you"
                />
                <Field
                  label="LinkedIn"
                  value={data.linkedin}
                  onChange={(v) => update({ linkedin: v })}
                  placeholder="linkedin.com/in/you"
                />
                <Field
                  label="Summary"
                  value={data.summary}
                  onChange={(v) => update({ summary: v })}
                  multiline
                  placeholder="Brief professional summary..."
                />
              </section>
            )}

            {activeTab === 'work' && (
              <section aria-labelledby="work-heading">
                <h2 id="work-heading" className="sr-only">
                  Work Experience
                </h2>
                {data.work.map((w, i) =>
                  itemCard(
                    <>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '0.6rem',
                          color: '#3A5568',
                          marginBottom: '0.5rem',
                        }}
                      >
                        #{i + 1}
                      </p>
                      <Field
                        label="Company"
                        value={w.company}
                        onChange={(v) => updateWork(w.id, { company: v })}
                        placeholder="Acme Corp"
                      />
                      <Field
                        label="Role"
                        value={w.role}
                        onChange={(v) => updateWork(w.id, { role: v })}
                        placeholder="Senior Frontend Engineer"
                      />
                      <Field
                        label="Period"
                        value={w.period}
                        onChange={(v) => updateWork(w.id, { period: v })}
                        placeholder="2022 – Present"
                      />
                      <Field
                        label="Description"
                        value={w.description}
                        onChange={(v) => updateWork(w.id, { description: v })}
                        multiline
                        placeholder="What did you do?"
                      />
                      <Field
                        label="Highlights (semicolon-separated)"
                        value={w.highlights}
                        onChange={(v) => updateWork(w.id, { highlights: v })}
                        multiline
                        placeholder="Built X;Improved Y by 40%;Led team of 3"
                      />
                    </>,
                    () => removeWork(w.id),
                  ),
                )}
                {addBtn(addWork, 'Add Work Experience')}
              </section>
            )}

            {activeTab === 'education' && (
              <section aria-labelledby="edu-heading">
                <h2 id="edu-heading" className="sr-only">
                  Education
                </h2>
                {data.education.map((e) =>
                  itemCard(
                    <>
                      <Field
                        label="School"
                        value={e.school}
                        onChange={(v) => updateEdu(e.id, { school: v })}
                        placeholder="University of X"
                      />
                      <Field
                        label="Degree"
                        value={e.degree}
                        onChange={(v) => updateEdu(e.id, { degree: v })}
                        placeholder="B.Sc. Computer Science"
                      />
                      <Field
                        label="Year"
                        value={e.year}
                        onChange={(v) => updateEdu(e.id, { year: v })}
                        placeholder="2020"
                      />
                      <Field
                        label="GPA"
                        value={e.gpa || ''}
                        onChange={(v) => updateEdu(e.id, { gpa: v })}
                        placeholder="3.9 (optional)"
                      />
                    </>,
                    () => removeEdu(e.id),
                  ),
                )}
                {addBtn(addEdu, 'Add Education')}
              </section>
            )}

            {activeTab === 'projects' && (
              <section aria-labelledby="proj-heading">
                <h2 id="proj-heading" className="sr-only">
                  Projects
                </h2>
                {data.projects.map((p) =>
                  itemCard(
                    <>
                      <Field
                        label="Project Name"
                        value={p.name}
                        onChange={(v) => updateProject(p.id, { name: v })}
                        placeholder="SecureDash"
                      />
                      <Field
                        label="Tech Stack"
                        value={p.tech}
                        onChange={(v) => updateProject(p.id, { tech: v })}
                        placeholder="Next.js, TypeScript, Redis"
                      />
                      <Field
                        label="Description"
                        value={p.description}
                        onChange={(v) => updateProject(p.id, { description: v })}
                        multiline
                        placeholder="What it does and why it matters"
                      />
                      <Field
                        label="Link (optional)"
                        value={p.link || ''}
                        onChange={(v) => updateProject(p.id, { link: v })}
                        placeholder="github.com/you/project"
                      />
                    </>,
                    () => removeProject(p.id),
                  ),
                )}
                {addBtn(addProject, 'Add Project')}
              </section>
            )}

            {activeTab === 'skills' && (
              <section aria-labelledby="skills-heading">
                <h2 id="skills-heading" className="sr-only">
                  Skills
                </h2>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '0.65rem',
                    color: '#3A5568',
                    marginBottom: '0.75rem',
                  }}
                >
                  Separate skills with commas.
                </p>
                {data.skillGroups.map((sg) =>
                  itemCard(
                    <>
                      <Field
                        label="Category"
                        value={sg.category}
                        onChange={(v) => updateSkillGroup(sg.id, { category: v })}
                        placeholder="Frontend"
                      />
                      <Field
                        label="Skills"
                        value={sg.skills}
                        onChange={(v) => updateSkillGroup(sg.id, { skills: v })}
                        multiline
                        placeholder="React, Next.js, TypeScript, GSAP"
                      />
                    </>,
                    () => removeSkillGroup(sg.id),
                  ),
                )}
                {addBtn(addSkillGroup, 'Add Skill Group')}
              </section>
            )}

            {activeTab === 'style' && (
              <section aria-labelledby="style-heading">
                <h2
                  id="style-heading"
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '0.65rem',
                    color: '#3A5568',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '1rem',
                  }}
                >
                  Layout Style
                </h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  {(
                    [
                      { id: 'modern', label: 'Modern', desc: 'Accent bar + Syne display font' },
                      { id: 'minimal', label: 'Minimal', desc: 'Clean typography, black & white' },
                      {
                        id: 'terminal',
                        label: 'Terminal',
                        desc: 'Dark mode, monospace, hacker style',
                      },
                    ] as { id: LayoutStyle; label: string; desc: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => update({ layoutStyle: opt.id })}
                      aria-pressed={data.layoutStyle === opt.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor:
                          data.layoutStyle === opt.id ? 'rgba(0,255,135,0.07)' : 'transparent',
                        border: `1px solid ${data.layoutStyle === opt.id ? 'rgba(0,255,135,0.3)' : '#0E2030'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '0.7rem',
                          color: data.layoutStyle === opt.id ? '#00FF87' : '#E8F4FD',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {data.layoutStyle === opt.id ? '● ' : '○ '}
                        {opt.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: '0.65rem',
                          color: '#3A5568',
                        }}
                      >
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>

                <h2
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '0.65rem',
                    color: '#3A5568',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.75rem',
                  }}
                >
                  Accent Color
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(
                    Object.entries(themeColors) as [ColorTheme, (typeof themeColors)[ColorTheme]][]
                  ).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => update({ colorTheme: key })}
                      aria-label={`${key} color theme`}
                      aria-pressed={data.colorTheme === key}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        backgroundColor: val.primary,
                        border:
                          data.colorTheme === key ? '3px solid #fff' : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.15s',
                        boxShadow: data.colorTheme === key ? `0 0 12px ${val.primary}60` : 'none',
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.15)')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* ── RIGHT: Preview ──────────────────────── */}
        <div
          style={{
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            backgroundColor: '#030709',
            backgroundImage: 'radial-gradient(rgba(0,212,255,0.03) 1px,transparent 1px)',
            backgroundSize: '30px 30px',
          }}
          role="complementary"
          aria-label="Resume preview"
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '0.6rem',
              color: '#3A5568',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            Live Preview · {Math.round(previewScale * 100)}%
          </p>

          {/* Preview wrapper */}
          <div style={{ transformOrigin: 'top center' }}>
            <div ref={printRef}>
              <ResumePreview data={data} scale={previewScale} />
            </div>
          </div>

          <p
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '0.6rem',
              color: '#3A5568',
              marginTop: '1.5rem',
              textAlign: 'center',
              maxWidth: '400px',
              lineHeight: 1.6,
            }}
          >
            ↑ Live preview — changes appear instantly.
            <br />
            Exported PDF matches this design exactly.
          </p>
        </div>
      </main>
    </div>
  )
}
