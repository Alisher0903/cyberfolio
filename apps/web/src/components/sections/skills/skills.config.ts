import type { SkillCategory } from '@/data/skills';

export interface SkillCategoryMeta {
  color: string;
  code: string;
  eyebrow: string;
  description: string;
  activeClass: string;
  textClass: string;
  dotClass: string;
  glowClass: string;
}

export const skillCategoryMeta: Record<SkillCategory, SkillCategoryMeta> = {
  Frontend: {
    color: '#00FF87',
    code: '</>',
    eyebrow: 'Product engineering',
    description:
      'Building modern, responsive, and high-performance web applications with a focus on clean architecture and user experience.',
    activeClass: 'border-accent/35 bg-accent/[0.05] text-accent shadow-[inset_0_-2px_0_#00FF87]',
    textClass: 'text-accent',
    dotClass: 'bg-accent',
    glowClass: 'bg-accent/[0.07]',
  },
  Security: {
    color: '#FF3B6B',
    code: '[::]',
    eyebrow: 'Systems & security',
    description:
      'Web application security, penetration testing, networking, operating systems, and security automation fundamentals.',
    activeClass: 'border-danger/35 bg-danger/[0.05] text-danger shadow-[inset_0_-2px_0_#FF3B6B]',
    textClass: 'text-danger',
    dotClass: 'bg-danger',
    glowClass: 'bg-danger/[0.07]',
  },
  Other: {
    color: '#00D4FF',
    code: '+++',
    eyebrow: 'Supporting toolkit',
    description:
      'Development, collaboration, documentation, design, and AI-assisted productivity tools.',
    activeClass: 'border-cyan/35 bg-cyan/[0.05] text-cyan shadow-[inset_0_-2px_0_#00D4FF]',
    textClass: 'text-cyan',
    dotClass: 'bg-cyan',
    glowClass: 'bg-cyan/[0.07]',
  },
};
