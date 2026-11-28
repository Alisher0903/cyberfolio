import type { MessageKey } from '@alisherdev/shared';
import type { LayoutStyle } from '@/store/resumeStore';
import type { ResumeTab } from './resume.types';

export const resumeTabs: Array<{ id: ResumeTab; labelKey: MessageKey; icon: string }> = [
  { id: 'personal', labelKey: 'resume.tab.personal', icon: '◈' },
  { id: 'work', labelKey: 'resume.tab.work', icon: '◉' },
  { id: 'education', labelKey: 'resume.tab.education', icon: '◆' },
  { id: 'training', labelKey: 'resume.tab.training', icon: '▣' },
  { id: 'projects', labelKey: 'resume.tab.projects', icon: '⬡' },
  { id: 'skills', labelKey: 'resume.tab.skills', icon: '◇' },
  { id: 'languages', labelKey: 'resume.tab.languages', icon: '◎' },
  { id: 'style', labelKey: 'resume.tab.style', icon: '✦' },
];

export const layoutOptions: Array<{
  id: LayoutStyle;
  labelKey: MessageKey;
  descriptionKey: MessageKey;
}> = [
  { id: 'modern', labelKey: 'resume.layout.modern', descriptionKey: 'resume.layout.modernDesc' },
  { id: 'minimal', labelKey: 'resume.layout.minimal', descriptionKey: 'resume.layout.minimalDesc' },
  {
    id: 'terminal',
    labelKey: 'resume.layout.terminal',
    descriptionKey: 'resume.layout.terminalDesc',
  },
];
