'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config/site';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type SocialIconName =
  | 'telegram'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'email'
  | 'phone';

function SocialIcon({ name }: { name: SocialIconName }) {
  const paths: Record<SocialIconName, React.ReactNode> = {
    telegram: (
      <path d="m21 3-3.6 17.1c-.3 1.2-1 1.5-2 .9l-5.5-4.1-2.7 2.6c-.3.3-.5.5-1.1.5l.4-5.6L16.7 5c.4-.4-.1-.6-.7-.2L3.4 12.7c-1.1.7-1.1 1.6.2 2l3.2 1 7.5-4.7c.4-.2.7-.1.4.2l-6.1 5.5-.2 3.2c.4 0 .6-.2.8-.4l1.6-1.5 3.4 2.5c.6.4 1.1.2 1.3-.6L22 4.2C22.3 3.1 21.6 2.6 21 3Z" />
    ),
    github: (
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.1-4.7-5A3.9 3.9 0 0 1 6.7 8.6a3.6 3.6 0 0 1 .1-2.7s.9-.3 2.8 1A9.7 9.7 0 0 1 12 6.6a9.7 9.7 0 0 1 2.5.3c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1.1 2.8c0 3.8-2.4 4.6-4.7 4.9.4.3.7 1 .7 2V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    ),
    linkedin: (
      <path d="M6.5 8.2H3.2V21h3.3V8.2ZM4.9 3A1.9 1.9 0 1 0 5 6.8 1.9 1.9 0 0 0 5 3ZM21 13.7c0-3.9-2.1-5.7-4.9-5.7a4.2 4.2 0 0 0-3.8 2.1V8.2H9V21h3.3v-6.3c0-1.7.3-3.3 2.4-3.3s2.1 1.9 2.1 3.4V21H21v-7.3Z" />
    ),
    twitter: (
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.2L6.7 22H3.5l7.1-8.2L3 2h6.3l4.3 5.7L18.9 2Zm-1.1 17.9h1.7L8.4 4H6.6l11.2 15.9Z" />
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    phone: (
      <path d="M7.2 3H4.8A1.8 1.8 0 0 0 3 4.9 16.2 16.2 0 0 0 19.1 21a1.8 1.8 0 0 0 1.9-1.8v-2.4l-4.5-1-1.1 2a13 13 0 0 1-9.2-9.2l2-1.1L7.2 3Z" />
    ),
  };

  const filled = ['telegram', 'github', 'linkedin', 'twitter'].includes(name);

  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

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
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  const links = [
    {
      label: 'GitHub',
      handle: '@Alisher0903',
      href: siteConfig.github,
      color: '#E8F4FD',
    },
    {
      label: 'LinkedIn',
      handle: 'in/alisher-sodiqov',
      href: siteConfig.linkedin,
      color: '#0A66C2',
    },
    { label: 'Twitter', handle: '@ascyber777', href: siteConfig.twitter, color: '#1DA1F2' },
    {
      label: 'Email',
      handle: 'info@alisherdev.uz',
      href: `mailto:${siteConfig.email}`,
      color: '#00FF87',
    },
  ];

  const socialLinks: Array<{
    label: string;
    href: string;
    icon: SocialIconName;
    external?: boolean;
  }> = [
    { label: 'Telegram', href: siteConfig.telegram, icon: 'telegram', external: true },
    { label: 'GitHub', href: siteConfig.github, icon: 'github', external: true },
    { label: 'LinkedIn', href: siteConfig.linkedin, icon: 'linkedin', external: true },
    { label: 'X / Twitter', href: siteConfig.twitter, icon: 'twitter', external: true },
    { label: 'Instagram', href: siteConfig.instagram, icon: 'instagram', external: true },
    { label: 'Email', href: `mailto:${siteConfig.email}`, icon: 'email' },
    { label: 'Phone', href: 'tel:+998908800313', icon: 'phone' },
  ];

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
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = link.color + '40';
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      link.color + '08';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0E2030';
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0A1219';
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
                      (e.target as HTMLInputElement).style.borderColor = 'rgba(0,255,135,0.3)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = '#0E2030';
                    }}
                    placeholder="Alisher Sodiqov"
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
                      (e.target as HTMLInputElement).style.borderColor = 'rgba(0,255,135,0.3)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = '#0E2030';
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
                      (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(0,255,135,0.3)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor = '#0E2030';
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
        <footer className="mt-20 pt-8 border-t" style={{ borderColor: '#0E2030' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div
              className="font-mono text-xs text-center md:text-left"
              style={{ color: '#3A5568' }}
            >
              © {new Date().getFullYear()} {siteConfig.name}
              <span className="hidden sm:inline"> · Tashkent, Uzbekistan</span>
            </div>

            <nav aria-label="Social and contact links">
              <ul className="flex flex-wrap items-center justify-center gap-2 list-none">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noreferrer' : undefined}
                      aria-label={link.label}
                      title={link.label}
                      className="group grid h-10 w-10 place-items-center rounded-lg border transition-all duration-300"
                      style={{
                        color: '#7FA8C4',
                        borderColor: '#0E2030',
                        backgroundColor: '#0A1219',
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.color = '#00FF87';
                        event.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)';
                        event.currentTarget.style.backgroundColor = 'rgba(0,255,135,0.06)';
                        event.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.color = '#7FA8C4';
                        event.currentTarget.style.borderColor = '#0E2030';
                        event.currentTarget.style.backgroundColor = '#0A1219';
                        event.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <SocialIcon name={link.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#00FF87' }}
                aria-hidden="true"
              />
              <span className="font-mono text-xs" style={{ color: '#3A5568' }}>
                Available for work
              </span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
