'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-content',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: '.contact-content', start: 'top 80%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1500)
  }

  const links = [
    { label: 'GitHub', handle: '@Alisher-karimov', href: '#', color: '#E8F4FD' },
    { label: 'LinkedIn', handle: 'in/Alisher-karimov', href: '#', color: '#0A66C2' },
    { label: 'HackTheBox', handle: 'karimov_', href: '#', color: '#9FEF00' },
    {
      label: 'Email',
      handle: 'Alisher@karimov.dev',
      href: 'mailto:Alisher@karimov.dev',
      color: '#00FF87',
    },
  ]

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-16 md:py-32"
      style={{ backgroundColor: '#050A0E' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex items-center gap-4 mb-10 md:mb-16">
          <p className="font-mono text-xs" style={{ color: '#00FF87' }}>
            05 / Contact
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: '#0E2030' }} />
        </div>

        <div className="contact-content grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <h2
              className="font-display text-4xl lg:text-5xl font-bold mb-6"
              style={{ color: '#E8F4FD' }}
            >
              Let&apos;s build something <span className="gradient-text">worth hacking.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: '#7FA8C4' }}>
              Open to full-time roles, freelance projects, and security consulting. I respond to
              every message — usually within a few hours.
            </p>

            {/* Links */}
            <div className="space-y-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-xl border group transition-all duration-300"
                  style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = link.color + '40'
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      link.color + '08'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#0E2030'
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0A1219'
                  }}
                >
                  <div>
                    <div className="font-mono text-xs mb-0.5" style={{ color: '#3A5568' }}>
                      {link.label}
                    </div>
                    <div className="font-mono text-sm" style={{ color: link.color }}>
                      {link.handle}
                    </div>
                  </div>
                  <span
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: '#3A5568' }}
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div
            className="p-8 rounded-2xl border"
            style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
          >
            <h3 className="font-mono text-sm mb-6" style={{ color: '#00FF87' }}>
              $ send_message --encrypted
            </h3>

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: 'rgba(0,255,135,0.1)',
                    border: '1px solid rgba(0,255,135,0.3)',
                  }}
                >
                  ✓
                </div>
                <p className="font-mono text-lg" style={{ color: '#00FF87' }}>
                  Message sent!
                </p>
                <p className="font-mono text-xs text-center" style={{ color: '#3A5568' }}>
                  I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                    name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all duration-300"
                    style={{
                      backgroundColor: '#050A0E',
                      border: '1px solid #0E2030',
                      color: '#E8F4FD',
                    }}
                    onFocus={(e) => {
                      ;(e.target as HTMLInputElement).style.borderColor = 'rgba(0,255,135,0.3)'
                    }}
                    onBlur={(e) => {
                      ;(e.target as HTMLInputElement).style.borderColor = '#0E2030'
                    }}
                    placeholder="Alisher Karimov"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                    email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all duration-300"
                    style={{
                      backgroundColor: '#050A0E',
                      border: '1px solid #0E2030',
                      color: '#E8F4FD',
                    }}
                    onFocus={(e) => {
                      ;(e.target as HTMLInputElement).style.borderColor = 'rgba(0,255,135,0.3)'
                    }}
                    onBlur={(e) => {
                      ;(e.target as HTMLInputElement).style.borderColor = '#0E2030'
                    }}
                    placeholder="hello@company.dev"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                    message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all duration-300 resize-none"
                    style={{
                      backgroundColor: '#050A0E',
                      border: '1px solid #0E2030',
                      color: '#E8F4FD',
                    }}
                    onFocus={(e) => {
                      ;(e.target as HTMLTextAreaElement).style.borderColor = 'rgba(0,255,135,0.3)'
                    }}
                    onBlur={(e) => {
                      ;(e.target as HTMLTextAreaElement).style.borderColor = '#0E2030'
                    }}
                    placeholder="I'd love to work together on..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 font-mono text-sm font-medium rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: '#00FF87',
                    color: '#050A0E',
                    opacity: status === 'sending' ? 0.7 : 1,
                  }}
                >
                  {status === 'sending' ? 'Encrypting...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: '#0E2030' }}
        >
          <div className="font-mono text-xs" style={{ color: '#3A5568' }}>
            © 2024 Alisher Karimov. Built with Next.js + GSAP.
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#00FF87' }}
            />
            <span className="font-mono text-xs" style={{ color: '#3A5568' }}>
              All systems operational
            </span>
          </div>
          <div className="font-mono text-xs" style={{ color: '#3A5568' }}>
            Tashkent, Uzbekistan 🇺🇿
          </div>
        </div>
      </div>
    </section>
  )
}
