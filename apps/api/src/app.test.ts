import { beforeAll, describe, expect, it } from 'vitest';
import { app } from './app';
import { originListSchema } from './env';

beforeAll(() => {
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'test-public-key-1234567890';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key-1234567890';
  process.env.CLIENT_ORIGIN = 'https://example.com,http://localhost:3000';
  process.env.ADMIN_ORIGIN = 'https://admin.example.com';
});

describe('API access boundaries', () => {
  it('accepts an origin list and rejects paths or non-http protocols', () => {
    expect(originListSchema.safeParse('https://example.com,http://localhost:3000').success).toBe(
      true,
    );
    for (const origin of [
      'https://example.com/path',
      'javascript:alert(1)',
      'https://example.com,',
    ]) {
      expect(originListSchema.safeParse(origin).success).toBe(false);
    }
  });
  it('serves health with CORS for an allowed origin', async () => {
    const response = await app.request('/api/v1/health', {
      headers: { Origin: 'https://example.com' },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe('https://example.com');
  });
  it('does not send CORS permission to an untrusted origin', async () => {
    const response = await app.request('/api/v1/health', {
      headers: { Origin: 'https://evil.example' },
    });
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
  });
  it('rejects admin requests without a bearer token', async () => {
    for (const route of ['projects', 'messages', 'resumes', 'settings']) {
      const response = await app.request(`/api/v1/admin/${route}`);
      expect(response.status).toBe(401);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
  });
});
