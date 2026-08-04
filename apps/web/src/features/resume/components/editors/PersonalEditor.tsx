import { useResumeStore } from '@/store/resumeStore';
import { EditorField } from '../ui/EditorField';

export function PersonalEditor() {
  const { data, update } = useResumeStore();

  return (
    <section aria-labelledby="personal-heading">
      <h2 id="personal-heading" className="sr-only">
        Personal Information
      </h2>
      <EditorField
        label="Full Name"
        value={data.name}
        onChange={(name) => update({ name })}
        placeholder="Alisher Sodiqov"
      />
      <EditorField
        label="Job Title"
        value={data.title}
        onChange={(title) => update({ title })}
        placeholder="Frontend Engineer"
      />
      <EditorField
        label="Email"
        value={data.email}
        onChange={(email) => update({ email })}
        placeholder="you@example.com"
      />
      <EditorField
        label="Phone"
        value={data.phone}
        onChange={(phone) => update({ phone })}
        placeholder="+1 (555) 000-0000"
      />
      <EditorField
        label="Location"
        value={data.location}
        onChange={(location) => update({ location })}
        placeholder="Tashkent, UZ"
      />
      <EditorField
        label="Website"
        value={data.website}
        onChange={(website) => update({ website })}
        placeholder="yoursite.dev"
      />
      <EditorField
        label="GitHub"
        value={data.github}
        onChange={(github) => update({ github })}
        placeholder="github.com/you"
      />
      <EditorField
        label="LinkedIn"
        value={data.linkedin}
        onChange={(linkedin) => update({ linkedin })}
        placeholder="linkedin.com/in/you"
      />
      <EditorField
        label="Summary"
        value={data.summary}
        onChange={(summary) => update({ summary })}
        multiline
        placeholder="Brief professional summary..."
      />
    </section>
  );
}
