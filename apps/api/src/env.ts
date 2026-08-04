import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:3000'),
  ADMIN_ORIGIN: z.string().url().default('http://localhost:3001'),
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
