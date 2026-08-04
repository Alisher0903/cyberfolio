import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';

export function ProjectsEditor() {
  const { data, updateProject, addProject, removeProject } = useResumeStore();

  return (
    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">
        Projects
      </h2>
      {data.projects.map((project) => (
        <EditorCard key={project.id} onRemove={() => removeProject(project.id)}>
          <EditorField
            label="Project Name"
            value={project.name}
            onChange={(name) => updateProject(project.id, { name })}
            placeholder="SecureDash"
          />
          <EditorField
            label="Tech Stack"
            value={project.tech}
            onChange={(tech) => updateProject(project.id, { tech })}
            placeholder="Next.js, TypeScript, Redis"
          />
          <EditorField
            label="Description"
            value={project.description}
            onChange={(description) => updateProject(project.id, { description })}
            multiline
            placeholder="What it does and why it matters"
          />
          <EditorField
            label="Link (optional)"
            value={project.link || ''}
            onChange={(link) => updateProject(project.id, { link })}
            placeholder="github.com/you/project"
          />
        </EditorCard>
      ))}
      <AddButton onClick={addProject}>Add Project</AddButton>
    </section>
  );
}
