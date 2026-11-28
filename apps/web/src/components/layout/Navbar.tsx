'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { DesktopNavbar } from './navbar/DesktopNavbar';
import { MobileNavbar } from './navbar/MobileNavbar';
import { navLinks, type NavId } from './navbar/navbar.config';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePortfolioData } from '@/features/portfolio/PortfolioDataProvider';

export default function Navbar() {
  const { projects } = usePortfolioData();
  const visibleLinks = useMemo(
    () => (projects.length ? navLinks : navLinks.filter((link) => link.id !== 'projects')),
    [projects.length],
  );
  const navRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<NavId>('home');

  const updateActive = useCallback(() => {
    let current: NavId = 'home';

    for (const link of visibleLinks) {
      const section = document.querySelector(link.href);
      if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.45) {
        current = link.id;
      }
    }

    setActive(current);
  }, [visibleLinks]);

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

  const navigateTo = (href: string, id: NavId) => {
    setActive(id);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isDesktop === undefined) return null;

  return isDesktop ? (
    <DesktopNavbar
      ref={navRef}
      links={visibleLinks}
      active={active}
      scrolled={scrolled}
      onNavigate={navigateTo}
    />
  ) : (
    <MobileNavbar links={visibleLinks} active={active} onNavigate={navigateTo} />
  );
}
