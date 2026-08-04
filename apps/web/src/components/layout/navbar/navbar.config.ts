export const navLinks = [
  { label: 'Home', href: '#hero', icon: '⌂' },
  { label: 'About', href: '#about', icon: '◈' },
  { label: 'Projects', href: '#projects', icon: '◉' },
  { label: 'Skills', href: '#skills', icon: '◆' },
  { label: 'Contact', href: '#contact', icon: '✉' },
] as const;

export type NavLabel = (typeof navLinks)[number]['label'];

export interface NavbarViewProps {
  active: NavLabel;
  onNavigate: (href: string, label: NavLabel) => void;
}
