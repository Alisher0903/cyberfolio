import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';

export function LanguagesEditor() {
  const { data, updateLanguage, addLanguage, removeLanguage } = useResumeStore();

  return (
    <section aria-labelledby="languages-heading">
      <h2 id="languages-heading" className="sr-only">
        Languages
      </h2>
      {data.languages.map((item) => (
        <EditorCard key={item.id} onRemove={() => removeLanguage(item.id)}>
          <EditorField
            label="Language"
            value={item.language}
            onChange={(language) => updateLanguage(item.id, { language })}
            placeholder="English"
          />
          <EditorField
            label="Proficiency"
            value={item.proficiency}
            onChange={(proficiency) => updateLanguage(item.id, { proficiency })}
            placeholder="Native, B2, Professional..."
          />
        </EditorCard>
      ))}
      <AddButton onClick={addLanguage}>Add Language</AddButton>
    </section>
  );
}
