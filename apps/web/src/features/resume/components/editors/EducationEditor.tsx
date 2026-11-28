import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function EducationEditor() {
  const { t } = useI18n();
  const { data, updateEdu, addEdu, removeEdu } = useResumeStore();

  return (
    <section aria-labelledby="education-heading">
      <h2 id="education-heading" className="sr-only">
        {t('resume.heading.education')}
      </h2>
      {data.education.map((education) => (
        <EditorCard key={education.id} onRemove={() => removeEdu(education.id)}>
          <EditorField
            label={t('resume.field.school')}
            value={education.school}
            onChange={(school) => updateEdu(education.id, { school })}
            placeholder="University of X"
          />
          <EditorField
            label={t('resume.field.degree')}
            value={education.degree}
            onChange={(degree) => updateEdu(education.id, { degree })}
            placeholder="B.Sc. Computer Science"
          />
          <EditorField
            label={t('resume.field.year')}
            value={education.year}
            onChange={(year) => updateEdu(education.id, { year })}
            placeholder="2020"
          />
          <EditorField
            label={t('resume.field.gpa')}
            value={education.gpa || ''}
            onChange={(gpa) => updateEdu(education.id, { gpa })}
            placeholder={t('resume.ph.gpa')}
          />
        </EditorCard>
      ))}
      <AddButton onClick={addEdu}>{t('resume.addEducation')}</AddButton>
    </section>
  );
}
