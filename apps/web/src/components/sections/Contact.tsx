'use client';
import { useRef, useState } from 'react';
import { usePortfolioData } from '@/features/portfolio/PortfolioDataProvider';
import { SiteFooter } from './contact/SiteFooter';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function Contact() {
  const { t } = useI18n();
  const { socials: links, settings } = usePortfolioData();
  const contactSettings = settings.contact ?? {};
  const contactSetting = (key: string, fallback: string) =>
    typeof contactSettings[key] === 'string' ? (contactSettings[key] as string) : fallback;
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API is not configured');
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: '' }),
      });
      if (!response.ok) throw new Error('Message could not be sent');
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

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
            05 / {t('contact.label')}
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
              {contactSetting('headingPrefix', t('contact.titlePrefix'))}{' '}
              <span className="gradient-text">
                {contactSetting('headingAccent', t('contact.titleAccent'))}
              </span>
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: '#7FA8C4' }}>
              {typeof contactSettings.description === 'string'
                ? contactSettings.description
                : t('contact.description')}
            </p>

            {/* Links */}
            <nav className="space-y-3" aria-label={t('contact.linksAria')}>
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex min-w-0 items-center justify-between p-4 rounded-xl border group transition-all duration-300 [overflow-wrap:anywhere]"
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
            </nav>
          </div>

          {/* Right: Form */}
          <div
            className="p-8 rounded-2xl border"
            style={{ backgroundColor: '#0A1219', borderColor: '#0E2030' }}
          >
            <h3 className="font-mono text-sm mb-6" style={{ color: '#00FF87' }}>
              {t('contact.sendCommand')}
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
                  {t('contact.sentTitle')}
                </p>
                <p className="font-mono text-xs text-center" style={{ color: '#3A5568' }}>
                  {t('contact.sentNote')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <p
                    className="rounded-lg border px-4 py-3 font-mono text-xs"
                    style={{
                      color: '#FF8AA5',
                      borderColor: 'rgba(255,59,107,0.25)',
                      backgroundColor: 'rgba(255,59,107,0.06)',
                    }}
                    role="alert"
                  >
                    {t('contact.error')}
                  </p>
                )}
                <div>
                  <label className="block font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                    {t('contact.name')}
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
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                    {t('contact.email')}
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
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs mb-2" style={{ color: '#3A5568' }}>
                    {t('contact.message')}
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
                    placeholder={t('contact.messagePlaceholder')}
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
                  {status === 'sending' ? t('contact.sending') : t('contact.send')}
                </button>
              </form>
            )}
          </div>
        </div>

        <SiteFooter socials={links} />
      </div>
    </section>
  );
}
