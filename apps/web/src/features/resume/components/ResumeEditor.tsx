'use client';

import { useState } from 'react';
import { resumeTabs } from '../resume.config';
import type { ResumeTab } from '../resume.types';
import { EducationEditor } from './editors/EducationEditor';
import { PersonalEditor } from './editors/PersonalEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { SkillsEditor } from './editors/SkillsEditor';
import { StyleEditor } from './editors/StyleEditor';
import { WorkEditor } from './editors/WorkEditor';
import { TrainingEditor } from './editors/TrainingEditor';
import { LanguagesEditor } from './editors/LanguagesEditor';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/I18nProvider';

const editors: Record<ResumeTab, React.ComponentType> = {
  personal: PersonalEditor,
  work: WorkEditor,
  education: EducationEditor,
  training: TrainingEditor,
  projects: ProjectsEditor,
  skills: SkillsEditor,
  languages: LanguagesEditor,
  style: StyleEditor,
};

export function ResumeEditor() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<ResumeTab>('personal');
  const ActiveEditor = editors[activeTab];

  return (
    <aside
      className="flex h-full min-h-0 flex-col overflow-hidden border-r border-border bg-surface"
      aria-label={t('resume.editorAria')}
    >
      <nav
        className="resume-side-scroll flex overflow-x-auto border-b border-border p-2"
        aria-label={t('resume.sectionsAria')}
      >
        {resumeTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-1 whitespace-nowrap border-b-2 border-transparent px-3 py-2 font-mono text-[10px] text-text-dim transition-colors',
              activeTab === tab.id && 'border-accent text-accent',
            )}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {t(tab.labelKey)}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto p-4">
        <ActiveEditor />
      </div>
    </aside>
  );
}
