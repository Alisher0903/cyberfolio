import { describe, expect, it } from 'vitest';
import {
  contactMessageSchema,
  experienceSchema,
  projectSchema,
  skillCategorySchema,
} from './schemas';

describe('API input schemas', () => {
  it('rejects invalid project slugs', () => {
    const result = projectSchema.safeParse({ slug: 'Bad Slug', title: 'Project' });
    expect(result.success).toBe(false);
  });

  it('accepts a valid project with defaults', () => {
    const result = projectSchema.safeParse({ slug: 'valid-project', title: 'Project' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe('draft');
  });

  it('rejects contact spam honeypot values', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      message: 'A sufficiently long test message',
      website: 'spam.example',
    });
    expect(result.success).toBe(false);
  });

  it('normalizes experience and skill defaults', () => {
    expect(experienceSchema.parse({ role: 'Engineer', company: 'Company' }).tags).toEqual([]);
    expect(skillCategorySchema.parse({ name: 'Frontend', slug: 'frontend' }).skills).toEqual([]);
  });
});
