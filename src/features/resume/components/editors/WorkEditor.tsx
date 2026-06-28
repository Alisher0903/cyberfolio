import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';

export function WorkEditor() {
  const { data, updateWork, addWork, removeWork } = useResumeStore();

  return (
    <section aria-labelledby="work-heading">
      <h2 id="work-heading" className="sr-only">
        Work Experience
      </h2>
      {data.work.map((work, index) => (
        <EditorCard key={work.id} onRemove={() => removeWork(work.id)}>
          <p className="mb-2 font-mono text-[10px] text-text-dim">#{index + 1}</p>
          <EditorField
            label="Company"
            value={work.company}
            onChange={(company) => updateWork(work.id, { company })}
            placeholder="Acme Corp"
          />
          <EditorField
            label="Role"
            value={work.role}
            onChange={(role) => updateWork(work.id, { role })}
            placeholder="Senior Frontend Engineer"
          />
          <EditorField
            label="Period"
            value={work.period}
            onChange={(period) => updateWork(work.id, { period })}
            placeholder="2022 – Present"
          />
          <EditorField
            label="Description"
            value={work.description}
            onChange={(description) => updateWork(work.id, { description })}
            multiline
            placeholder="What did you do?"
          />
          <EditorField
            label="Highlights (semicolon-separated)"
            value={work.highlights}
            onChange={(highlights) => updateWork(work.id, { highlights })}
            multiline
            placeholder="Built X;Improved Y by 40%;Led team of 3"
          />
        </EditorCard>
      ))}
      <AddButton onClick={addWork}>Add Work Experience</AddButton>
    </section>
  );
}
