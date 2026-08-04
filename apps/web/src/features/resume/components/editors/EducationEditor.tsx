import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';

export function EducationEditor() {
  const { data, updateEdu, addEdu, removeEdu } = useResumeStore();

  return (
    <section aria-labelledby="education-heading">
      <h2 id="education-heading" className="sr-only">
        Education
      </h2>
      {data.education.map((education) => (
        <EditorCard key={education.id} onRemove={() => removeEdu(education.id)}>
          <EditorField
            label="School"
            value={education.school}
            onChange={(school) => updateEdu(education.id, { school })}
            placeholder="University of X"
          />
          <EditorField
            label="Degree"
            value={education.degree}
            onChange={(degree) => updateEdu(education.id, { degree })}
            placeholder="B.Sc. Computer Science"
          />
          <EditorField
            label="Year"
            value={education.year}
            onChange={(year) => updateEdu(education.id, { year })}
            placeholder="2020"
          />
          <EditorField
            label="GPA"
            value={education.gpa || ''}
            onChange={(gpa) => updateEdu(education.id, { gpa })}
            placeholder="3.9 (optional)"
          />
        </EditorCard>
      ))}
      <AddButton onClick={addEdu}>Add Education</AddButton>
    </section>
  );
}
