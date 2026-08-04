import type { LayoutStyle } from '@/store/resumeStore';
import type { ResumeTab } from './resume.types';

export const resumeTabs: Array<{ id: ResumeTab; label: string; icon: string }> = [
  { id: 'personal', label: 'Personal', icon: '◈' },
  { id: 'work', label: 'Work', icon: '◉' },
  { id: 'education', label: 'Education', icon: '◆' },
  { id: 'projects', label: 'Projects', icon: '⬡' },
  { id: 'skills', label: 'Skills', icon: '◇' },
  { id: 'style', label: 'Style', icon: '✦' },
];

export const layoutOptions: Array<{ id: LayoutStyle; label: string; description: string }> = [
  { id: 'modern', label: 'Modern', description: 'Accent bar + Syne display font' },
  { id: 'minimal', label: 'Minimal', description: 'Clean typography, black & white' },
  { id: 'terminal', label: 'Terminal', description: 'Dark mode, monospace, hacker style' },
];
