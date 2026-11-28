import { useResumeStore } from '@/store/resumeStore';
import { AddButton, EditorCard } from '../ui/EditorControls';
import { EditorField } from '../ui/EditorField';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function ProjectsEditor() {
  const { t } = useI18n();
  const { data, updateProject, addProject, removeProject } = useResumeStore();

  return (
    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">
        {t('resume.heading.projects')}
      </h2>
      {data.projects.map((project) => (
        <EditorCard key={project.id} onRemove={() => removeProject(project.id)}>
          <EditorField
            label={t('resume.field.projectName')}
            value={project.name}
            onChange={(name) => updateProject(project.id, { name })}
            placeholder="SecureDash"
          />
          <EditorField
            label={t('resume.field.techStack')}
            value={project.tech}
            onChange={(tech) => updateProject(project.id, { tech })}
            placeholder="Next.js, TypeScript, Redis"
          />
          <EditorField
            label={t('resume.field.description')}
            value={project.description}
            onChange={(description) => updateProject(project.id, { description })}
            multiline
            placeholder={t('resume.ph.description')}
          />
          <EditorField
            label={t('resume.field.link')}
            value={project.link || ''}
            onChange={(link) => updateProject(project.id, { link })}
            placeholder="github.com/you/project"
          />
        </EditorCard>
      ))}
      <AddButton onClick={addProject}>{t('resume.addProject')}</AddButton>
    </section>
  );
}
