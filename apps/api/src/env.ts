import { z } from 'zod';

export const originListSchema = z.string().refine(
  (value) =>
    value.split(',').every((origin) => {
      try {
        const url = new URL(origin.trim());
        return ['http:', 'https:'].includes(url.protocol) && url.origin === origin.trim();
      } catch {
        return false;
      }
    }),
  'Expected comma-separated HTTP(S) origins without paths',
);

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  CLIENT_ORIGIN: originListSchema.default('http://localhost:3000'),
  ADMIN_ORIGIN: originListSchema.default('http://localhost:3001'),
  TELEGRAM_BOT_TOKEN: z.string().min(20).optional(),
  TELEGRAM_CHAT_ID: z.string().min(1).optional(),
  PORT: z.coerce.number().int().positive().default(3002),
});

export type ApiEnv = z.infer<typeof envSchema>;

let cachedEnv: ApiEnv | undefined;

export function getEnv(): ApiEnv {
  cachedEnv ??= envSchema.parse(process.env);
  return cachedEnv;
}
