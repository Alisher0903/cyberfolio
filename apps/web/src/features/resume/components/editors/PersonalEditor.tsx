import { useResumeStore } from '@/store/resumeStore';
import { EditorField } from '../ui/EditorField';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function PersonalEditor() {
  const { t } = useI18n();
  const { data, update } = useResumeStore();

  return (
    <section aria-labelledby="personal-heading">
      <h2 id="personal-heading" className="sr-only">
        {t('resume.heading.personal')}
      </h2>
      <EditorField
        label={t('resume.field.fullName')}
        value={data.name}
        onChange={(name) => update({ name })}
        placeholder="Alisher Sodiqov"
      />
      <EditorField
        label={t('resume.field.jobTitle')}
        value={data.title}
        onChange={(title) => update({ title })}
        placeholder="Frontend Engineer"
      />
      <EditorField
        label={t('resume.field.email')}
        value={data.email}
        onChange={(email) => update({ email })}
        placeholder="you@example.com"
      />
      <EditorField
        label={t('resume.field.phone')}
        value={data.phone}
        onChange={(phone) => update({ phone })}
        placeholder="+998 (90) 000-00-00"
      />
      <EditorField
        label={t('resume.field.location')}
        value={data.location}
        onChange={(location) => update({ location })}
        placeholder="Tashkent, UZ"
      />
      <EditorField
        label={t('resume.field.website')}
        value={data.website}
        onChange={(website) => update({ website })}
        placeholder="yoursite.dev"
      />
      <EditorField
        label={t('resume.field.github')}
        value={data.github}
        onChange={(github) => update({ github })}
        placeholder="github.com/you"
      />
      <EditorField
        label={t('resume.field.linkedin')}
        value={data.linkedin}
        onChange={(linkedin) => update({ linkedin })}
        placeholder="linkedin.com/in/you"
      />
      <EditorField
        label={t('resume.field.summary')}
        value={data.summary}
        onChange={(summary) => update({ summary })}
        multiline
        placeholder={t('resume.ph.summary')}
      />
    </section>
  );
}
