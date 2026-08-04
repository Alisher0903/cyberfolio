'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { DesktopNavbar } from './navbar/DesktopNavbar';
import { MobileNavbar } from './navbar/MobileNavbar';
import { navLinks, type NavLabel } from './navbar/navbar.config';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<NavLabel>('Home');

  const updateActive = useCallback(() => {
    let current: NavLabel = 'Home';

    for (const link of navLinks) {
      const section = document.querySelector(link.href);
      if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.45) {
        current = link.label;
      }
    }

    setActive(current);
  }, []);

  useEffect(() => {
    if (isDesktop === undefined) return;

    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' },
    );
  }, [isDesktop]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      updateActive();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', onScroll);
  }, [updateActive]);

  const navigateTo = (href: string, label: NavLabel) => {
    setActive(label);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isDesktop === undefined) return null;

  return isDesktop ? (
    <DesktopNavbar ref={navRef} active={active} scrolled={scrolled} onNavigate={navigateTo} />
  ) : (
    <MobileNavbar active={active} onNavigate={navigateTo} />
  );
}
