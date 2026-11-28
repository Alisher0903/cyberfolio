import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function TrainingEditor() {
  const { t } = useI18n();
  const { data, updateTraining, addTraining, removeTraining } = useResumeStore();

  return (
    <section aria-labelledby="training-heading">
      <h2 id="training-heading" className="sr-only">
        {t('resume.heading.training')}
      </h2>
      {data.trainings.map((training) => (
        <EditorCard key={training.id} onRemove={() => removeTraining(training.id)}>
          <EditorField
            label={t('resume.field.course')}
            value={training.course}
            onChange={(course) => updateTraining(training.id, { course })}
            placeholder="Frontend Development"
          />
          <EditorField
            label={t('resume.field.provider')}
            value={training.provider}
            onChange={(provider) => updateTraining(training.id, { provider })}
            placeholder="Sfera Academy"
          />
          <EditorField
            label={t('resume.field.period')}
            value={training.period}
            onChange={(period) => updateTraining(training.id, { period })}
            placeholder="Jan 2023 – Jul 2023"
          />
          <EditorField
            label={t('resume.field.credential')}
            value={training.credential || ''}
            onChange={(credential) => updateTraining(training.id, { credential })}
            placeholder={t('resume.ph.credential')}
          />
        </EditorCard>
      ))}
      <AddButton onClick={addTraining}>{t('resume.addTraining')}</AddButton>
    </section>
  );
}
