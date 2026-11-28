import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function WorkEditor() {
  const { t } = useI18n();
  const { data, updateWork, addWork, removeWork } = useResumeStore();

  return (
    <section aria-labelledby="work-heading">
      <h2 id="work-heading" className="sr-only">
        {t('resume.heading.work')}
      </h2>
      {data.work.map((work, index) => (
        <EditorCard key={work.id} onRemove={() => removeWork(work.id)}>
          <p className="mb-2 font-mono text-[10px] text-text-dim">#{index + 1}</p>
          <EditorField
            label={t('resume.field.company')}
            value={work.company}
            onChange={(company) => updateWork(work.id, { company })}
            placeholder="Acme Corp"
          />
          <EditorField
            label={t('resume.field.role')}
            value={work.role}
            onChange={(role) => updateWork(work.id, { role })}
            placeholder="Senior Frontend Engineer"
          />
          <EditorField
            label={t('resume.field.period')}
            value={work.period}
            onChange={(period) => updateWork(work.id, { period })}
            placeholder="2022 – Present"
          />
          <EditorField
            label={t('resume.field.description')}
            value={work.description}
            onChange={(description) => updateWork(work.id, { description })}
            multiline
            placeholder={t('resume.ph.description')}
          />
          <EditorField
            label={t('resume.field.highlights')}
            value={work.highlights}
            onChange={(highlights) => updateWork(work.id, { highlights })}
            multiline
            placeholder={t('resume.ph.highlights')}
          />
        </EditorCard>
      ))}
      <AddButton onClick={addWork}>{t('resume.addWork')}</AddButton>
    </section>
  );
}
