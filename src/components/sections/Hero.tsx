'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const codeLines = [
  { line: '01', code: 'const engineer = {', color: '#E8F4FD' },
  { line: '02', code: '  name: "Alisher Karimov",', color: '#00FF87' },
  { line: '03', code: '  focus: ["Frontend", "Security"],', color: '#00D4FF' },
  { line: '04', code: '  stack: ["Next.js", "TypeScript", "GSAP"],', color: '#00D4FF' },
  { line: '05', code: '  clearance: "Ethical Hacker",', color: '#FFB800' },
  { line: '06', code: '  available: true,', color: '#00FF87' },
  { line: '07', code: '  mission: "Build secure, fast UIs",', color: '#E8F4FD' },
  { line: '08', code: '};', color: '#E8F4FD' },
]

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Particle canvas
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
    }> = []
    const colors = ['#00FF87', '#00D4FF', '#FF3B6B']

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = '#00D4FF'
            ctx.globalAlpha = (1 - dist / 120) * 0.08
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
        ctx.globalAlpha = 1
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // GSAP entrance
    const tl = gsap.timeline({ delay: 0.2 })

    tl.fromTo(
      '.hero-tag',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    )
      .fromTo(
        '.hero-title-1',
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.2',
      )
      .fromTo(
        '.hero-title-2',
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6',
      )
      .fromTo(
        '.hero-desc',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3',
      )
      .fromTo(
        '.hero-btn',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' },
        '-=0.2',
      )
      .fromTo(
        codeRef.current,
        { opacity: 0, x: 60, rotateY: -15 },
        { opacity: 1, x: 0, rotateY: 0, duration: 1, ease: 'power3.out' },
        '-=0.8',
      )
      .fromTo(
        '.code-line',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' },
        '-=0.6',
      )

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden grid-bg"
    >
      {/* Canvas bg */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blob"
        style={{ background: 'radial-gradient(circle,rgba(0,255,135,0.06) 0%,transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blob"
        style={{
          background: 'radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%)',
          animationDelay: '3s',
        }}
      />

      {/* Scanline */}
      <div className="scanline" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full" style={{ zIndex: 1 }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            {/* Tag */}
            <div
              className="hero-tag inline-flex items-center gap-2 mb-6 px-3 py-1.5 border rounded-full font-mono text-xs"
              style={{
                borderColor: 'rgba(0,255,135,0.2)',
                color: '#00FF87',
                backgroundColor: 'rgba(0,255,135,0.05)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#00FF87' }}
              />
              Frontend SWE &amp; Cybersecurity Specialist
            </div>

            {/* Headline */}
            <h1 ref={headlineRef} className="font-display mb-6" style={{ lineHeight: 1.05 }}>
              <div
                className="hero-title-1 text-4xl sm:text-5xl lg:text-7xl font-bold mb-2"
                style={{ color: '#E8F4FD' }}
              >
                Building
              </div>
              <div
                className="hero-title-2 text-4xl sm:text-5xl lg:text-7xl font-bold gradient-text"
                style={{ display: 'block' }}
              >
                Secure UIs
              </div>
              <div
                className="hero-title-1 text-2xl sm:text-4xl lg:text-5xl font-light mt-1"
                style={{ color: '#7FA8C4' }}
              >
                from the <span style={{ color: '#00D4FF' }}>ground up.</span>
              </div>
            </h1>

            <p
              className="hero-desc text-lg mb-8 max-w-lg leading-relaxed"
              style={{ color: '#7FA8C4' }}
            >
              I craft high-performance web interfaces with security baked in. 4+ years bridging the
              gap between exceptional UX and robust application security.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                className="hero-btn group px-6 py-3 font-mono text-sm font-medium rounded transition-all duration-300 relative overflow-hidden"
                style={{ backgroundColor: '#00FF87', color: '#050A0E' }}
                onClick={() => {
                  const el = document.querySelector('#projects')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Projects
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </span>
              </button>
              <button
                className="hero-btn px-6 py-3 font-mono text-sm font-medium rounded border transition-all duration-300"
                style={{
                  borderColor: 'rgba(0,212,255,0.3)',
                  color: '#00D4FF',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'rgba(0,212,255,0.08)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                }}
                onClick={() => {
                  const el = document.querySelector('#contact')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Get in Touch
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center gap-8">
              {[
                { val: '4+', label: 'Years XP' },
                { val: '20+', label: 'Projects' },
                { val: '99.2%', label: 'Uptime SLA' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold" style={{ color: '#00FF87' }}>
                    {s.val}
                  </div>
                  <div className="font-mono text-xs" style={{ color: '#3A5568' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Code card */}
          <div ref={codeRef} className="relative">
            {/* Decorative ring */}
            <div
              className="absolute -inset-4 rounded-2xl rotate-slow"
              style={{
                background:
                  'conic-gradient(from 0deg,rgba(0,255,135,0.1),rgba(0,212,255,0.1),rgba(0,255,135,0.1))',
                zIndex: -1,
              }}
            />

            <div
              className="rounded-2xl overflow-hidden border"
              style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
            >
              {/* Window bar */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: '#0E2030', backgroundColor: 'rgba(5,10,14,0.8)' }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF3B6B' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFB800' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00FF87' }} />
                <span className="ml-2 font-mono text-xs" style={{ color: '#3A5568' }}>
                  profile.ts
                </span>
              </div>

              {/* Code */}
              <div className="p-6 font-mono text-sm" style={{ lineHeight: 1.8 }}>
                {codeLines.map((l, i) => (
                  <div key={i} className="code-line flex gap-4">
                    <span
                      className="select-none w-6 text-right shrink-0"
                      style={{ color: '#1A3A4A' }}
                    >
                      {l.line}
                    </span>
                    <span style={{ color: l.color }}>{l.code}</span>
                  </div>
                ))}
                <div className="code-line flex gap-4 mt-1">
                  <span className="select-none w-6" style={{ color: '#1A3A4A' }}>
                    09
                  </span>
                  <span className="blink" style={{ color: '#E8F4FD' }}>
                    ▋
                  </span>
                </div>
              </div>

              {/* Status bar */}
              <div
                className="px-4 py-2 flex items-center justify-between border-t font-mono text-xs"
                style={{ borderColor: '#0E2030', backgroundColor: 'rgba(0,255,135,0.05)' }}
              >
                <span style={{ color: '#00FF87' }}>● TypeScript</span>
                <span style={{ color: '#3A5568' }}>UTF-8 · LF · ts</span>
                <span style={{ color: '#3A5568' }}>Ln 9, Col 1</span>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-5 -left-5 px-4 py-3 rounded-xl border float"
              style={{ backgroundColor: '#0A1219', borderColor: 'rgba(0,212,255,0.2)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
                  style={{ backgroundColor: 'rgba(0,212,255,0.1)', color: '#00D4FF' }}
                >
                  SEC
                </div>
                <div>
                  <div className="font-mono text-xs font-medium" style={{ color: '#00D4FF' }}>
                    OWASP Certified
                  </div>
                  <div className="font-mono text-xs" style={{ color: '#3A5568' }}>
                    Web Security Pro
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -top-5 -right-5 px-4 py-3 rounded-xl border float"
              style={{
                backgroundColor: '#0A1219',
                borderColor: 'rgba(255,184,0,0.2)',
                animationDelay: '2s',
              }}
            >
              <div className="font-mono text-xs font-medium" style={{ color: '#FFB800' }}>
                ◈ CTF Top 5%
              </div>
              <div className="font-mono text-xs" style={{ color: '#3A5568' }}>
                HackTheBox ranking
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-xs" style={{ color: '#3A5568' }}>
          scroll
        </span>
        <div className="w-px h-12 overflow-hidden" style={{ backgroundColor: '#0E2030' }}>
          <div className="w-px h-6 animate-bounce" style={{ backgroundColor: '#00FF87' }} />
        </div>
      </div>
    </section>
  )
}
