import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function SkillsEditor() {
  const { t } = useI18n();
  const { data, updateSkillGroup, addSkillGroup, removeSkillGroup } = useResumeStore();

  return (
    <section aria-labelledby="resume-skills-heading">
      <h2 id="resume-skills-heading" className="sr-only">
        {t('resume.heading.skills')}
      </h2>
      <p className="mb-3 font-mono text-[10px] text-text-dim">{t('resume.commaHint')}</p>
      {data.skillGroups.map((group) => (
        <EditorCard key={group.id} onRemove={() => removeSkillGroup(group.id)}>
          <EditorField
            label={t('resume.field.category')}
            value={group.category}
            onChange={(category) => updateSkillGroup(group.id, { category })}
            placeholder="Frontend"
          />
          <EditorField
            label={t('resume.field.skills')}
            value={group.skills}
            onChange={(skills) => updateSkillGroup(group.id, { skills })}
            multiline
            placeholder="React, Next.js, TypeScript, GSAP"
          />
        </EditorCard>
      ))}
      <AddButton onClick={addSkillGroup}>{t('resume.addSkillGroup')}</AddButton>
    </section>
  );
}
