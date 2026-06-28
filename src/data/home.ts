export const codeLines = [
  { line: '01', code: 'const developer = {', color: '#C792EA' },
  { line: '02', code: 'name: "Alisher Sodiqov",', color: '#82AAFF' },
  { line: '03', code: 'role: "Frontend Engineer",', color: '#89DDFF' },
  {
    line: '04',
    code: 'stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],',
    color: '#C3E88D',
  },
  { line: '05', code: 'learning: "Cybersecurity",', color: '#FFCB6B' },
  { line: '06', code: 'training: "Hack The Box",', color: '#F78C6C' },
  { line: '07', code: 'available: true,', color: '#FF5370' },
  { line: '08', code: '};', color: '#E6EDF3' },
] as const;

export const aboutCards = [
  { icon: '📍', label: 'Location', value: 'Tashkent, Uzbekistan' },
  { icon: '💻', label: 'Core Stack', value: 'Next.js • React.js' },
  { icon: '📚', label: 'Learning', value: 'Hack The Box • CTFs' },
  { icon: '🎯', label: 'Goal', value: 'Secure & Scalable Web Apps' },
] as const;

export const experience = [
  {
    role: 'Senior Frontend Engineer',
    company: 'SecureNet Labs',
    period: '2023 — Present',
    description:
      'Lead frontend architecture for enterprise security dashboard serving 50K+ users. Reduced TTI by 40% through code splitting and edge caching strategies.',
    tags: ['Next.js', 'TypeScript', 'WebSocket', 'Security'],
  },
  {
    role: 'Frontend Developer',
    company: 'Axiom Systems',
    period: '2021 — 2023',
    description:
      'Built React component library from scratch, adopted across 6 internal products. Implemented OAuth 2.0 / OIDC flows and led frontend security audits.',
    tags: ['React', 'OAuth', 'Storybook', 'Testing'],
  },
  {
    role: 'Security Analyst (Part-time)',
    company: 'CyberGuard Uzbekistan',
    period: '2020 — 2021',
    description:
      'Conducted web application penetration tests, authored vulnerability reports, and delivered remediation guidance to development teams.',
    tags: ['Pentesting', 'OWASP', 'Burp Suite', 'Reports'],
  },
] as const;
