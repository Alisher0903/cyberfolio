import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';

export function TrainingEditor() {
  const { data, updateTraining, addTraining, removeTraining } = useResumeStore();

  return (
    <section aria-labelledby="training-heading">
      <h2 id="training-heading" className="sr-only">
        Training and courses
      </h2>
      {data.trainings.map((training) => (
        <EditorCard key={training.id} onRemove={() => removeTraining(training.id)}>
          <EditorField
            label="Course / Program"
            value={training.course}
            onChange={(course) => updateTraining(training.id, { course })}
            placeholder="Frontend Development"
          />
          <EditorField
            label="Training Center / Provider"
            value={training.provider}
            onChange={(provider) => updateTraining(training.id, { provider })}
            placeholder="Sfera Academy"
          />
          <EditorField
            label="Period"
            value={training.period}
            onChange={(period) => updateTraining(training.id, { period })}
            placeholder="Jan 2023 – Jul 2023"
          />
          <EditorField
            label="Credential / Link (optional)"
            value={training.credential || ''}
            onChange={(credential) => updateTraining(training.id, { credential })}
            placeholder="Certificate ID or URL"
          />
        </EditorCard>
      ))}
      <AddButton onClick={addTraining}>Add Training</AddButton>
    </section>
  );
}
