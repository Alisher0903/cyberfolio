'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '#hero', icon: '⌂', mobileIcon: '⌂' },
  { label: 'About', href: '#about', icon: '◈', mobileIcon: '◈' },
  { label: 'Projects', href: '#projects', icon: '◉', mobileIcon: '◉' },
  { label: 'Skills', href: '#skills', icon: '◆', mobileIcon: '◆' },
  { label: 'Contact', href: '#contact', icon: '✉', mobileIcon: '✉' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)

  // ── Scroll spy ──────────────────────────────────────────────
  const updateActive = useCallback(() => {
    const ids = ['hero', 'about', 'projects', 'skills', 'contact']
    let current = 'Home'
    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const { top } = el.getBoundingClientRect()
      if (top <= window.innerHeight * 0.45) {
        current = id.charAt(0).toUpperCase() + id.slice(1)
        if (id === 'hero') current = 'Home'
      }
    }
    setActive(current)
  }, [])

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' },
    )
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      updateActive()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    updateActive()
    return () => window.removeEventListener('scroll', onScroll)
  }, [updateActive])

  const scrollTo = (href: string, label: string) => {
    setActive(label)
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // ── Desktop nav ─────────────────────────────────────────────
  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-500 ${
          scrolled ? 'backdrop-blur-xl border-b' : ''
        }`}
        style={scrolled ? { backgroundColor: 'rgba(5,10,14,0.92)', borderColor: '#0E2030' } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Alisher Karimov — home"
            className="flex items-center gap-3 group"
          >
            <div className="relative w-8 h-8">
              <div
                className="absolute inset-0 border rotate-45 rounded-sm transition-colors duration-300 group-hover:border-cyan-400"
                style={{ borderColor: '#00FF87' }}
              />
              <div
                className="absolute inset-1 rotate-45 rounded-sm"
                style={{ backgroundColor: 'rgba(0,255,135,0.1)' }}
              />
              <span
                className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold"
                style={{ color: '#00FF87' }}
              >
                AK
              </span>
            </div>
            <span className="font-mono text-sm hidden lg:block" style={{ color: '#7FA8C4' }}>
              <span style={{ color: '#00FF87' }}>@</span>Alisher.karimov
            </span>
          </Link>

          {/* Links */}
          <ul className="flex items-center gap-1 list-none" role="menubar">
            {navLinks.map((link) => (
              <li key={link.label} role="none">
                <button
                  role="menuitem"
                  aria-current={active === link.label ? 'page' : undefined}
                  onClick={() => scrollTo(link.href, link.label)}
                  className="relative px-4 py-2 font-mono text-sm transition-all duration-300 rounded"
                  style={{ color: active === link.label ? '#00FF87' : '#7FA8C4' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E8F4FD')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active === link.label ? '#00FF87' : '#7FA8C4')
                  }
                >
                  {active === link.label && (
                    <span
                      className="absolute inset-0 rounded"
                      style={{ backgroundColor: 'rgba(0,255,135,0.06)' }}
                    />
                  )}
                  <span className="relative" style={{ color: 'rgba(0,255,135,0.4)' }}>
                    ./
                  </span>
                  <span className="relative">{link.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/resume"
              className="font-mono text-xs px-3 py-1.5 rounded border transition-all duration-300"
              style={{
                borderColor: 'rgba(0,212,255,0.25)',
                color: '#00D4FF',
                backgroundColor: 'rgba(0,212,255,0.05)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'rgba(0,212,255,0.12)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'rgba(0,212,255,0.05)'
              }}
            >
              Resume Builder ↗
            </Link>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#00FF87' }}
                aria-hidden="true"
              />
              <span className="font-mono text-xs" style={{ color: '#7FA8C4' }}>
                Available
              </span>
            </div>
            <button
              onClick={() => scrollTo('#contact', 'Contact')}
              className="px-4 py-2 font-mono text-xs rounded border transition-all duration-300"
              style={{ borderColor: '#00FF87', color: '#00FF87' }}
              onMouseEnter={(e) => {
                const b = e.currentTarget
                b.style.backgroundColor = '#00FF87'
                b.style.color = '#050A0E'
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget
                b.style.backgroundColor = 'transparent'
                b.style.color = '#00FF87'
              }}
            >
              Hire Me
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile top bar (logo only) ──────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: 'rgba(5,10,14,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #0E2030',
        }}
      >
        <Link href="/" aria-label="Home" className="flex items-center gap-2">
          <div className="relative w-7 h-7">
            <div
              className="absolute inset-0 border rotate-45 rounded-sm"
              style={{ borderColor: '#00FF87' }}
            />
            <span
              className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold"
              style={{ color: '#00FF87' }}
            >
              AK
            </span>
          </div>
          <span className="font-mono text-xs" style={{ color: '#7FA8C4' }}>
            Alisher.karimov
          </span>
        </Link>
        <Link
          href="/resume"
          className="font-mono text-xs px-2.5 py-1 rounded border"
          style={{ borderColor: 'rgba(0,212,255,0.25)', color: '#00D4FF' }}
        >
          CV Builder
        </Link>
      </div>

      {/* ── Mobile bottom tab bar ───────────────────────────── */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
        style={{
          backgroundColor: 'rgba(5,10,14,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #0E2030',
        }}
      >
        {/* Indicator bar */}
        <div className="relative h-0.5 w-full" style={{ backgroundColor: '#0A1219' }}>
          {navLinks.map((link, i) => (
            <div
              key={link.label}
              className="absolute h-full transition-all duration-300"
              style={{
                left: `${i * 20}%`,
                width: '20%',
                backgroundColor: active === link.label ? '#00FF87' : 'transparent',
                boxShadow: active === link.label ? '0 0 8px #00FF87' : 'none',
              }}
            />
          ))}
        </div>

        <ul className="flex items-stretch list-none" role="menubar">
          {navLinks.map((link) => {
            const isActive = active === link.label
            return (
              <li key={link.label} className="flex-1" role="none">
                <button
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => scrollTo(link.href, link.label)}
                  className="w-full flex flex-col items-center justify-center gap-1 py-3 transition-all duration-300"
                  style={{ color: isActive ? '#00FF87' : '#3A5568' }}
                >
                  {/* Icon */}
                  <span
                    className="text-base transition-transform duration-300"
                    style={{ transform: isActive ? 'scale(1.2)' : 'scale(1)' }}
                    aria-hidden="true"
                  >
                    {link.icon}
                  </span>
                  {/* Label */}
                  <span
                    className="font-mono transition-all duration-300"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.05em',
                      fontWeight: isActive ? 600 : 400,
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {link.label}
                  </span>
                  {/* Active dot */}
                  {isActive && (
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: '#00FF87', boxShadow: '0 0 4px #00FF87' }}
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        {/* iOS home indicator spacer */}
        <div style={{ height: 'env(safe-area-inset-bottom,0px)' }} />
      </nav>
    </>
  )
}
