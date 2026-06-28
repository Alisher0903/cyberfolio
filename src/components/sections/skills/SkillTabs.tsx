import { skills, type SkillCategory } from '@/data/skills';
import { skillCategoryMeta } from './skills.config';
import { cn } from '@/lib/utils';

const categories = Object.keys(skills) as SkillCategory[];

interface SkillTabsProps {
  active: SkillCategory;
  onChange: (category: SkillCategory) => void;
}

export function SkillTabs({ active, onChange }: SkillTabsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
      {categories.map((category) => {
        const isActive = active === category;
        const meta = skillCategoryMeta[category];

        return (
          <button
            key={category}
            id={`skills-tab-${category.toLowerCase()}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="skills-panel"
            onClick={() => onChange(category)}
            className={cn(
              'flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-text-secondary transition-all duration-300',
              isActive && meta.activeClass,
            )}
          >
            <span aria-hidden="true" className={cn(!isActive && 'text-text-dim')}>
              {meta.code}
            </span>
            {category}
            <span
              className={cn(
                'rounded-full bg-bg px-1.5 py-0.5 text-[10px] text-text-dim',
                isActive && meta.textClass,
              )}
            >
              {skills[category].length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
