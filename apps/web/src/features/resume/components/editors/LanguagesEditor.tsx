import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function LanguagesEditor() {
  const { t } = useI18n();
  const { data, updateLanguage, addLanguage, removeLanguage } = useResumeStore();

  return (
    <section aria-labelledby="languages-heading">
      <h2 id="languages-heading" className="sr-only">
        {t('resume.heading.languages')}
      </h2>
      {data.languages.map((item) => (
        <EditorCard key={item.id} onRemove={() => removeLanguage(item.id)}>
          <EditorField
            label={t('resume.field.language')}
            value={item.language}
            onChange={(language) => updateLanguage(item.id, { language })}
            placeholder="English"
          />
          <EditorField
            label={t('resume.field.proficiency')}
            value={item.proficiency}
            onChange={(proficiency) => updateLanguage(item.id, { proficiency })}
            placeholder={t('resume.ph.proficiency')}
          />
        </EditorCard>
      ))}
      <AddButton onClick={addLanguage}>{t('resume.addLanguage')}</AddButton>
    </section>
  );
}
