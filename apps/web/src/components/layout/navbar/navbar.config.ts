export const navLinks = [
  { id: 'home', href: '#hero', icon: '⌂' },
  { id: 'about', href: '#about', icon: '◈' },
  { id: 'projects', href: '#projects', icon: '◉' },
  { id: 'skills', href: '#skills', icon: '◆' },
  { id: 'contact', href: '#contact', icon: '✉' },
] as const;

export type NavId = (typeof navLinks)[number]['id'];
export type NavLink = (typeof navLinks)[number];

export interface NavbarViewProps {
  active: NavId;
  links: readonly NavLink[];
  onNavigate: (href: string, id: NavId) => void;
}
