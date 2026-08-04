import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';

export function SkillsEditor() {
  const { data, updateSkillGroup, addSkillGroup, removeSkillGroup } = useResumeStore();

  return (
    <section aria-labelledby="resume-skills-heading">
      <h2 id="resume-skills-heading" className="sr-only">
        Skills
      </h2>
      <p className="mb-3 font-mono text-[10px] text-text-dim">Separate skills with commas.</p>
      {data.skillGroups.map((group) => (
        <EditorCard key={group.id} onRemove={() => removeSkillGroup(group.id)}>
          <EditorField
            label="Category"
            value={group.category}
            onChange={(category) => updateSkillGroup(group.id, { category })}
            placeholder="Frontend"
          />
          <EditorField
            label="Skills"
            value={group.skills}
            onChange={(skills) => updateSkillGroup(group.id, { skills })}
            multiline
            placeholder="React, Next.js, TypeScript, GSAP"
          />
        </EditorCard>
      ))}
      <AddButton onClick={addSkillGroup}>Add Skill Group</AddButton>
    </section>
  );
}
