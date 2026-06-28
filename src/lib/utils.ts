import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const codeLines = [
  { line: '01', code: 'const developer = {', color: '#C792EA' }, // purple

  { line: '02', code: 'name: "Alisher Sodiqov",', color: '#82AAFF' }, // blue

  { line: '03', code: 'role: "Frontend Engineer",', color: '#89DDFF' }, // cyan

  {
    line: '04',
    code: 'stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],',
    color: '#C3E88D', // green
  },

  {
    line: '05',
    code: 'learning: "Cybersecurity",',
    color: '#FFCB6B', // yellow
  },

  {
    line: '06',
    code: 'training: "Hack The Box",',
    color: '#F78C6C', // orange
  },

  {
    line: '07',
    code: 'available: true,',
    color: '#FF5370', // red
  },

  {
    line: '08',
    code: '};',
    color: '#E6EDF3',
  },
];

export const aboutCardList = [
  { icon: '📍', label: 'Location', val: 'Tashkent, Uzbekistan' },
  { icon: '💻', label: 'Core Stack', val: 'Next.js • React.js' },
  { icon: '📚', label: 'Learning', val: 'Hack The Box • CTFs' },
  { icon: '🎯', label: 'Goal', val: 'Secure & Scalable Web Apps' },
];

export const experience = [
  {
    role: 'Senior Frontend Engineer',
    company: 'SecureNet Labs',
    period: '2023 — Present',
    desc: 'Lead frontend architecture for enterprise security dashboard serving 50K+ users. Reduced TTI by 40% through code splitting and edge caching strategies.',
    tags: ['Next.js', 'TypeScript', 'WebSocket', 'Security'],
  },
  {
    role: 'Frontend Developer',
    company: 'Axiom Systems',
    period: '2021 — 2023',
    desc: 'Built React component library from scratch, adopted across 6 internal products. Implemented OAuth 2.0 / OIDC flows and led frontend security audits.',
    tags: ['React', 'OAuth', 'Storybook', 'Testing'],
  },
  {
    role: 'Security Analyst (Part-time)',
    company: 'CyberGuard Uzbekistan',
    period: '2020 — 2021',
    desc: 'Conducted web application penetration tests, authored vulnerability reports, and delivered remediation guidance to development teams.',
    tags: ['Pentesting', 'OWASP', 'Burp Suite', 'Reports'],
  },
];

export const projects = [
  {
    id: 1,
    slug: 'cipher-shield',
    title: 'CipherShield',
    subtitle: 'Real-time threat detection platform',
    description:
      'A full-stack web application that monitors network traffic, detects anomalies using ML models, and visualizes threats in real-time. Built with WebSockets for live data streaming and a custom rule engine for threat classification.',
    tech: ['Next.js', 'TypeScript', 'WebSocket', 'Python', 'TensorFlow', 'PostgreSQL', 'Redis'],
    color: '#00FF87',
    accentColor: '#00CC6A',
    category: 'Cybersecurity',
    year: '2024',
    link: '#',
    github: '#',
    metrics: [
      { label: 'Threats Blocked', value: '2.4M+' },
      { label: 'Detection Rate', value: '99.2%' },
      { label: 'Response Time', value: '<50ms' },
    ],
    featured: true,
  },
  {
    id: 2,
    slug: 'nexus-ui',
    title: 'Nexus UI',
    subtitle: 'Component library for security dashboards',
    description:
      'An open-source React component library tailored for security and data-heavy applications. Features 60+ components with dark-mode-first design, animated data visualizations, and WCAG 2.1 AA compliance.',
    tech: ['React', 'TypeScript', 'Storybook', 'Vitest', 'CSS Modules', 'Rollup'],
    color: '#00D4FF',
    accentColor: '#0099BB',
    category: 'Frontend',
    year: '2024',
    link: '#',
    github: '#',
    metrics: [
      { label: 'Components', value: '60+' },
      { label: 'npm downloads', value: '14K/mo' },
      { label: 'GitHub Stars', value: '890' },
    ],
    featured: true,
  },
  {
    id: 3,
    slug: 'pentest-canvas',
    title: 'PentestCanvas',
    subtitle: 'Visual penetration testing toolkit',
    description:
      'A browser-based tool for security professionals to map attack surfaces, document findings, and generate compliance reports. Integrates with OWASP ZAP and Burp Suite via REST API.',
    tech: ['React', 'Canvas API', 'Node.js', 'Express', 'SQLite', 'Docker'],
    color: '#FF3B6B',
    accentColor: '#CC2A55',
    category: 'Security Tools',
    year: '2023',
    link: '#',
    github: '#',
    metrics: [
      { label: 'Active Users', value: '340+' },
      { label: 'Reports Generated', value: '1.2K' },
      { label: 'Integrations', value: '8' },
    ],
    featured: true,
  },
  {
    id: 4,
    slug: 'waveterm',
    title: 'WaveTerm',
    subtitle: 'GPU-accelerated terminal emulator',
    description:
      'A high-performance terminal emulator built with WebGL rendering for smooth 60fps scrollback, native SSH integration, split panes, and a plugin system. Targets developers who live in the terminal.',
    tech: ['Electron', 'WebGL', 'TypeScript', 'Rust', 'Node.js'],
    color: '#FFB800',
    accentColor: '#CC9200',
    category: 'Developer Tools',
    year: '2023',
    link: '#',
    github: '#',
    metrics: [
      { label: 'Render FPS', value: '60' },
      { label: 'Downloads', value: '4.1K' },
      { label: 'Plugin API calls', value: '22' },
    ],
    featured: false,
  },
];

export const skills = {
  Frontend: [
    'React.js',
    'Next.js',
    'JavaScript',
    'TypeScript',
    'HTML5 & CSS3',
    'Tailwind CSS',
    'Ant Design',
    'shadcn/ui',
    'GSAP',
    'React Native',
    'Vite',
    'Zustand',
    'TanStack Query',
    'Socket.IO',
    'REST API Integration',
    'Responsive Design',
    'Web Accessibility',
    'Performance Optimization',
    'Git',
    'GitHub',
    'GitLab',
    'CI/CD · GitHub Actions',
  ],
  Security: [
    'Linux Systems',
    'Windows Systems',
    'Network Fundamentals',
    'Cybersecurity Fundamentals',
    'Web Security & OWASP',
    'Wireshark',
    'System Administration',
    'Bash Scripting',
    'Python Scripting',
  ],
  Other: [
    'Microsoft Word',
    'Microsoft Excel',
    'Microsoft PowerPoint',
    'AI Tools & Prompt Engineering',
    'Figma',
    'Technical Documentation',
  ],
} as const;
