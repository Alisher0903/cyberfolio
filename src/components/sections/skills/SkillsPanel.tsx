import { skills, type SkillCategory } from '@/data/skills';
import { skillCategoryMeta } from './skills.config';
import { cn } from '@/lib/utils';

export function SkillsPanel({ category }: { category: SkillCategory }) {
  const meta = skillCategoryMeta[category];

  return (
    <div
      id="skills-panel"
      key={category}
      role="tabpanel"
      aria-labelledby={`skills-tab-${category.toLowerCase()}`}
      className="grid overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-[280px_1fr]"
    >
      <div className="relative overflow-hidden border-b border-border p-7 md:p-8 lg:border-b-0 lg:border-r">
        <div
          className={cn(
            'pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl',
            meta.glowClass,
          )}
          aria-hidden="true"
        />
        <p className={cn('mb-5 font-mono text-[10px] uppercase tracking-[0.18em]', meta.textClass)}>
          {meta.eyebrow}
        </p>
        <div className={cn('mb-6 font-mono text-4xl font-bold', meta.textClass)} aria-hidden="true">
          {meta.code}
        </div>
        <h3 className="mb-3 font-display text-2xl font-bold text-text-primary">{category}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">{meta.description}</p>
      </div>

      <ul className="grid list-none sm:grid-cols-2 xl:grid-cols-3">
        {skills[category].map((skill, index) => (
          <li
            key={skill}
            className="group flex min-h-20 items-center gap-4 border-b border-border bg-surface px-5 py-4 transition-colors duration-300 hover:bg-white/[0.02] sm:border-r"
          >
            <span className="font-mono text-[10px] tabular-nums text-text-dim" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className={cn('h-1.5 w-1.5 shrink-0 rounded-full', meta.dotClass)}
              aria-hidden="true"
            />
            <span className="font-mono text-sm leading-snug text-text-primary">{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
