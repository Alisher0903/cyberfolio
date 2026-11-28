import type { MessageKey } from '@alisherdev/shared';
import type { SkillCategory } from '@/data/skills';

export interface SkillCategoryMeta {
  color: string;
  code: string;
  labelKey: MessageKey;
  eyebrowKey: MessageKey;
  descriptionKey: MessageKey;
  activeClass: string;
  textClass: string;
  dotClass: string;
  glowClass: string;
}

export const skillCategoryMeta: Record<SkillCategory, SkillCategoryMeta> = {
  Frontend: {
    color: '#00FF87',
    code: '</>',
    labelKey: 'skills.category.frontend',
    eyebrowKey: 'skills.eyebrow.frontend',
    descriptionKey: 'skills.desc.frontend',
    activeClass: 'border-accent/35 bg-accent/[0.05] text-accent shadow-[inset_0_-2px_0_#00FF87]',
    textClass: 'text-accent',
    dotClass: 'bg-accent',
    glowClass: 'bg-accent/[0.07]',
  },
  Security: {
    color: '#FF3B6B',
    code: '[::]',
    labelKey: 'skills.category.security',
    eyebrowKey: 'skills.eyebrow.security',
    descriptionKey: 'skills.desc.security',
    activeClass: 'border-danger/35 bg-danger/[0.05] text-danger shadow-[inset_0_-2px_0_#FF3B6B]',
    textClass: 'text-danger',
    dotClass: 'bg-danger',
    glowClass: 'bg-danger/[0.07]',
  },
  Other: {
    color: '#00D4FF',
    code: '+++',
    labelKey: 'skills.category.other',
    eyebrowKey: 'skills.eyebrow.other',
    descriptionKey: 'skills.desc.other',
    activeClass: 'border-cyan/35 bg-cyan/[0.05] text-cyan shadow-[inset_0_-2px_0_#00D4FF]',
    textClass: 'text-cyan',
    dotClass: 'bg-cyan',
    glowClass: 'bg-cyan/[0.07]',
  },
};

/** Categories come from the CMS as free text, so match them case-insensitively. */
export function resolveSkillCategory(category: string): SkillCategory | null {
  const normalized = category.trim().toLowerCase();
  if (normalized === 'frontend') return 'Frontend';
  if (normalized === 'security') return 'Security';
  if (normalized === 'other') return 'Other';
  return null;
}

export function skillCategoryMetaFor(category: string): SkillCategoryMeta {
  const resolved = resolveSkillCategory(category);
  return resolved ? skillCategoryMeta[resolved] : skillCategoryMeta.Other;
}

export function skillCategoryLabel(category: string, t: (key: MessageKey) => string): string {
  const resolved = resolveSkillCategory(category);
  return resolved ? t(skillCategoryMeta[resolved].labelKey) : category;
}
