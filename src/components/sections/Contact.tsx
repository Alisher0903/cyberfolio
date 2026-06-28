'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactForm, type ContactFormData, type ContactStatus } from './contact/ContactForm';
import { ContactLinks } from './contact/ContactLinks';
import { SiteFooter } from './contact/SiteFooter';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const initialFormData: ContactFormData = { name: '', email: '', message: '' };

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState<ContactStatus>('idle');

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

  const handleSubmit = () => {
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className="bg-bg py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <div className="mb-10 flex items-center gap-4 md:mb-16">
          <p className="font-mono text-xs text-accent">05 / Contact</p>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="contact-content grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-display text-4xl font-bold text-text-primary lg:text-5xl">
              Let&apos;s build something <span className="gradient-text">worth hacking.</span>
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-text-secondary">
              Open to full-time roles, freelance projects, and security consulting. I respond to
              every message — usually within a few hours.
            </p>
            <ContactLinks />
          </div>

          <ContactForm
            data={formData}
            status={status}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
        </div>

        <SiteFooter />
      </div>
    </section>
  );
}
