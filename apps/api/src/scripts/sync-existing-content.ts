import { createServiceSupabaseClient } from '../database.js';
import { projects } from '../../../web/src/data/projects';
import { projectDetails } from '../../../web/src/data/project-details';
import { experience } from '../../../web/src/data/home';
import { skills } from '../../../web/src/data/skills';
import { siteConfig } from '../../../web/src/config/site';
import { getEnv } from '../env';

const env = getEnv();
const client = createServiceSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function assertNoError(error: { message: string } | null, operation: string) {
  if (error) throw new Error(`${operation}: ${error.message}`);
}

const projectRows = projects.map((project, index) => ({
  slug: project.slug,
  title: project.title,
  subtitle: project.subtitle,
  description: project.description,
  tech: project.tech,
  color: project.color,
  accent_color: project.accentColor,
  category: project.category,
  year: project.year,
  live_url: project.link,
  github_url: project.github,
  metrics: project.metrics,
  featured: project.featured,
  status: 'published' as const,
  sort_order: index,
  updated_at: new Date().toISOString(),
}));

const { data: syncedProjects, error: projectsError } = await client
  .from('projects')
  .upsert(projectRows, { onConflict: 'slug' })
  .select('id,slug');
assertNoError(projectsError, 'projects sync');

const projectIdBySlug = new Map((syncedProjects ?? []).map((project) => [project.slug, project.id]));
const detailRows = Object.entries(projectDetails).map(([slug, detail]) => ({
  project_id: projectIdBySlug.get(slug),
  challenge: detail.challenge,
  solution: detail.solution,
  impact: detail.impact,
  timeline: detail.timeline,
  team_size: detail.teamSize,
  role: detail.role,
  highlights: detail.highlights,
  code_snippet: detail.codeSnippet,
  updated_at: new Date().toISOString(),
}));

if (detailRows.some((detail) => !detail.project_id)) {
  throw new Error('project detail sync: project id mapping is incomplete');
}
const { error: detailsError } = await client.from('project_details').upsert(detailRows);
assertNoError(detailsError, 'project details sync');

const { error: experienceDeleteError } = await client.from('experiences').delete().neq('id', crypto.randomUUID());
assertNoError(experienceDeleteError, 'old experiences cleanup');
const { error: experienceInsertError } = await client.from('experiences').insert(
  experience.map((item, index) => ({
    ...item,
    status: 'published',
    sort_order: index,
  })),
);
assertNoError(experienceInsertError, 'experiences sync');

const { error: skillsError } = await client.from('skill_categories').upsert(
  Object.entries(skills).map(([name, items], index) => ({
    name,
    slug: name.toLowerCase(),
    skills: items,
    status: 'published',
    sort_order: index,
    updated_at: new Date().toISOString(),
  })),
  { onConflict: 'slug' },
);
assertNoError(skillsError, 'skills sync');

const { error: socialsDeleteError } = await client.from('social_links').delete().neq('id', crypto.randomUUID());
assertNoError(socialsDeleteError, 'old social links cleanup');
const { error: socialsInsertError } = await client.from('social_links').insert([
  { label: 'GitHub', handle: '@Alisher0903', href: siteConfig.github, color: '#E8F4FD', status: 'published', sort_order: 0 },
  { label: 'LinkedIn', handle: 'in/alisher-sodiqov', href: siteConfig.linkedin, color: '#0A66C2', status: 'published', sort_order: 1 },
  { label: 'Twitter', handle: '@ascyber777', href: siteConfig.twitter, color: '#1DA1F2', status: 'published', sort_order: 2 },
  { label: 'Email', handle: siteConfig.email, href: `mailto:${siteConfig.email}`, color: '#00FF87', status: 'published', sort_order: 3 },
]);
assertNoError(socialsInsertError, 'social links sync');

const { error: settingsError } = await client.from('site_settings').upsert([
  {
    key: 'hero',
    value: {
      name: 'Alisher Sodiqov',
      role: 'Frontend Engineer',
      availability: true,
      stack: '["Next.js", "React", "TypeScript", "Tailwind CSS"]',
      learning: 'Cybersecurity',
      training: 'Hack The Box',
      tagline: 'Frontend • Cybersecurity Learner',
      titleLine1: 'Building Fast,',
      titleAccent: 'Secure &',
      titleLine3: 'Modern',
      titleLine3Accent: 'Web Apps.',
      description: 'Frontend Engineer specializing in Next.js, React and TypeScript. Currently expanding into Cybersecurity through hands-on labs and Hack The Box.',
      stat1Value: '2+',
      stat1Label: 'Years Experience',
      stat2Value: '15+',
      stat2Label: 'Projects Built',
      stat3Value: 'HTB',
      stat3Label: 'Learning',
      badge1Title: 'Security-First UI',
      badge1Subtitle: 'Frontend + Cybersecurity',
      badge2Title: 'Hack The Box',
      badge2Subtitle: 'Active Learner',
    },
  },
  {
    key: 'contact',
    value: {
      headingPrefix: "Let's build something",
      headingAccent: 'worth hacking.',
      description: 'Open to full-time roles, freelance projects, and security consulting. I respond to every message — usually within a few hours.',
      email: siteConfig.email,
      location: 'Tashkent, Uzbekistan',
    },
  },
]);
assertNoError(settingsError, 'site settings sync');

console.info(
  JSON.stringify({
    projects: projectRows.length,
    projectDetails: detailRows.length,
    experiences: experience.length,
    skillCategories: Object.keys(skills).length,
    socialLinks: 4,
    settings: 2,
  }),
);
