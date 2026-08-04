import { z } from 'zod';

export const metricSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(80),
});

export const projectSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(160),
  subtitle: z.string().trim().max(240).default(''),
  description: z.string().trim().max(5000).default(''),
  tech: z.array(z.string().trim().min(1).max(80)).max(40).default([]),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default('#00FF87'),
  accent_color: z.string().regex(/^#[0-9a-f]{6}$/i).default('#00CC6A'),
  category: z.string().trim().max(120).default(''),
  year: z.string().trim().max(20).default(''),
  live_url: z.string().trim().max(500).default(''),
  github_url: z.string().trim().max(500).default(''),
  metrics: z.array(metricSchema).max(12).default([]),
  cover_image_path: z.string().trim().max(500).nullable().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
  sort_order: z.number().int().min(0).default(0),
});

export const projectPatchSchema = projectSchema.partial();

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
});

export const experienceSchema = z.object({
  role: z.string().trim().min(1).max(160),
  company: z.string().trim().min(1).max(160),
  period: z.string().trim().max(120).default(''),
  description: z.string().trim().max(5000).default(''),
  tags: z.array(z.string().trim().min(1).max(80)).max(40).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  sort_order: z.number().int().min(0).default(0),
});

export const skillCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  skills: z.array(z.string().trim().min(1).max(120)).max(100).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  sort_order: z.number().int().min(0).default(0),
});

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1).max(80),
  handle: z.string().trim().max(160).default(''),
  href: z.string().trim().min(1).max(500),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default('#00FF87'),
  status: z.enum(['draft', 'published']).default('draft'),
  sort_order: z.number().int().min(0).default(0),
});

export const messageStatusSchema = z.object({
  status: z.enum(['new', 'read', 'archived']),
});

export const projectDetailSchema = z.object({
  challenge: z.string().max(10000).default(''),
  solution: z.string().max(10000).default(''),
  impact: z.string().max(10000).default(''),
  timeline: z.string().max(120).default(''),
  team_size: z.string().max(120).default(''),
  role: z.string().max(200).default(''),
  highlights: z.array(z.string().trim().min(1).max(500)).max(30).default([]),
  code_snippet: z.string().max(30000).default(''),
});

export const siteSettingSchema = z.object({
  value: z.record(z.string(), z.unknown()),
});
