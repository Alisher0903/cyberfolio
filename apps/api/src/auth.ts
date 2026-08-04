import type { MiddlewareHandler } from 'hono';
import { createPublicSupabaseClient, createServiceSupabaseClient } from '@alisherdev/database';
import { getEnv } from './env.js';

export const requireAdmin: MiddlewareHandler = async (context, next) => {
  const authorization = context.req.header('Authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) {
    return context.json({ error: 'Unauthorized' }, 401);
  }

  const env = getEnv();
  const authClient = createPublicSupabaseClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const { data, error } = await authClient.auth.getUser(token);

  if (error || !data.user) {
    return context.json({ error: 'Invalid session' }, 401);
  }

  const serviceClient = createServiceSupabaseClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const { data: admin } = await serviceClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (!admin) {
    return context.json({ error: 'Forbidden' }, 403);
  }

  context.set('adminUserId', data.user.id);
  await next();
};
