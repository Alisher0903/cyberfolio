import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { bodyLimit } from 'hono/body-limit';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { createServiceSupabaseClient } from './database.js';
import { getEnv } from './env.js';
import { requireAdmin } from './auth.js';
import {
  contactMessageSchema,
  experienceSchema,
  messageStatusSchema,
  projectDetailSchema,
  projectPatchSchema,
  projectSchema,
  skillCategorySchema,
  socialLinkSchema,
  siteSettingSchema,
  cloudResumeSchema,
  resumeKeySchema,
  resumeDeleteSchema,
} from './schemas.js';
import { sendTelegramContactNotification } from './telegram.js';

type Variables = { adminUserId: string };
export const app = new Hono<{ Variables: Variables }>().basePath('/api/v1');

app.use('*', secureHeaders());
app.use(
  '*',
  bodyLimit({
    maxSize: 512 * 1024,
    onError: (context) => context.json({ error: 'Request too large' }, 413),
  }),
);
app.use('/resumes*', async (context, next) => {
  context.header('Cache-Control', 'no-store');
  await next();
});
app.use('/admin/*', async (context, next) => {
  context.header('Cache-Control', 'no-store');
  await next();
});
app.use(
  '*',
  cors({
    origin: (origin) => {
      const env = getEnv();
      const clientOrigins = env.CLIENT_ORIGIN.split(',').map((value) => value.trim());
      const adminOrigins = env.ADMIN_ORIGIN.split(',').map((value) => value.trim());
      return [...clientOrigins, ...adminOrigins].includes(origin) ? origin : undefined;
    },
    allowHeaders: ['Authorization', 'Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

const db = () => {
  const env = getEnv();
  return createServiceSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
};

const resumeKeyHash = (key: string) =>
  createHmac('sha256', getEnv().SUPABASE_SERVICE_ROLE_KEY)
    .update(key.normalize('NFKC'))
    .digest('hex');

const resumeUpdateToken = (id: string, keyHash: string) =>
  createHmac('sha256', getEnv().SUPABASE_SERVICE_ROLE_KEY)
    .update(`resume-update:${id}:${keyHash}`)
    .digest('hex');

const tokensMatch = (actual: string | undefined, expected: string) => {
  if (!actual || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
};

async function checkResumeRateLimit(context: Context<{ Variables: Variables }>) {
  const forwardedFor = context.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = createHash('sha256').update(`resume:${forwardedFor}`).digest('hex');
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const client = db();
  const { count, error } = await client
    .from('resume_access_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', oneHourAgo);
  if (error) return { allowed: false, status: 500 as const };
  if ((count ?? 0) >= 30) return { allowed: false, status: 429 as const };
  const { error: writeError } = await client
    .from('resume_access_attempts')
    .insert({ ip_hash: ipHash });
  return { allowed: !writeError, status: writeError ? (500 as const) : (200 as const) };
}

app.get('/health', (context) =>
  context.json({ status: 'ok', service: 'alisherdev-api', timestamp: new Date().toISOString() }),
);

app.get('/portfolio', async (context) => {
  const client = db();
  const [projects, experiences, skills, socials, settings] = await Promise.all([
    client.from('projects').select('*').eq('status', 'published').order('sort_order'),
    client.from('experiences').select('*').eq('status', 'published').order('sort_order'),
    client.from('skill_categories').select('*').eq('status', 'published').order('sort_order'),
    client.from('social_links').select('*').eq('status', 'published').order('sort_order'),
    client.from('site_settings').select('key,value'),
  ]);

  const error =
    projects.error ?? experiences.error ?? skills.error ?? socials.error ?? settings.error;
  if (error) return context.json({ error: 'Could not load portfolio content' }, 500);

  return context.json({
    projects: projects.data,
    experiences: experiences.data,
    skills: skills.data,
    socials: socials.data,
    settings: Object.fromEntries((settings.data ?? []).map((item) => [item.key, item.value])),
  });
});

app.get('/projects/:slug', async (context) => {
  const client = db();
  const { data: project, error } = await client
    .from('projects')
    .select('*, project_details(*)')
    .eq('slug', context.req.param('slug'))
    .eq('status', 'published')
    .maybeSingle();

  if (error) return context.json({ error: 'Could not load project' }, 500);
  if (!project) return context.json({ error: 'Project not found' }, 404);
  return context.json(project);
});

app.post('/contact', async (context) => {
  const body = contactMessageSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid message', issues: body.error.issues }, 400);
  if (body.data.website) return context.json({ accepted: true }, 202);

  const forwardedFor = context.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = createHash('sha256').update(forwardedFor).digest('hex');
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateReadError } = await db()
    .from('contact_rate_limits')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', oneHourAgo);
  if (rateReadError) return context.json({ error: 'Could not verify request limit' }, 500);
  if ((count ?? 0) >= 5) return context.json({ error: 'Too many messages. Try again later.' }, 429);

  const { website: _honeypot, ...message } = body.data;
  const client = db();
  const [{ error }, { error: rateWriteError }] = await Promise.all([
    client
      .from('contact_messages')
      .insert({ ...message, user_agent: context.req.header('User-Agent') ?? null }),
    client.from('contact_rate_limits').insert({ ip_hash: ipHash }),
  ]);

  if (error || rateWriteError) return context.json({ error: 'Could not save message' }, 500);

  const telegramSent = await sendTelegramContactNotification(message);
  return context.json({ accepted: true, telegramSent }, 201);
});

app.post('/resumes/save', async (context) => {
  const limit = await checkResumeRateLimit(context);
  if (!limit.allowed)
    return context.json(
      {
        error:
          limit.status === 429
            ? 'Too many requests. Try again later.'
            : 'Could not verify request limit',
      },
      limit.status,
    );
  const body = cloudResumeSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid resume', issues: body.error.issues }, 400);
  const client = db();
  const keyHash = resumeKeyHash(body.data.key);
  const { data: existing, error: readError } = await client
    .from('cloud_resumes')
    .select('id')
    .eq('key_hash', keyHash)
    .maybeSingle();
  if (readError) return context.json({ error: 'Could not save resume' }, 500);

  if (existing) {
    const expectedToken = resumeUpdateToken(existing.id, keyHash);
    if (!tokensMatch(body.data.updateToken, expectedToken)) {
      return context.json(
        { error: 'This recovery key is already in use. Load the resume first to update it.' },
        409,
      );
    }
    const { data, error } = await client
      .from('cloud_resumes')
      .update({
        name: body.data.data.name,
        title: body.data.data.title,
        data: body.data.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('id,name,title,created_at,updated_at')
      .single();
    if (error) return context.json({ error: 'Could not save resume' }, 500);
    return context.json({ ...data, updateToken: expectedToken });
  }

  const { data, error } = await client
    .from('cloud_resumes')
    .insert({
      key_hash: keyHash,
      name: body.data.data.name,
      title: body.data.data.title,
      data: body.data.data,
    })
    .select('id,name,title,created_at,updated_at')
    .single();
  if (error) return context.json({ error: 'Could not save resume' }, 500);
  return context.json({ ...data, updateToken: resumeUpdateToken(data.id, keyHash) }, 201);
});

app.post('/resumes/load', async (context) => {
  const limit = await checkResumeRateLimit(context);
  if (!limit.allowed)
    return context.json(
      {
        error:
          limit.status === 429
            ? 'Too many requests. Try again later.'
            : 'Could not verify request limit',
      },
      limit.status,
    );
  const body = resumeKeySchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success) return context.json({ error: 'Invalid recovery key' }, 400);
  const { data, error } = await db()
    .from('cloud_resumes')
    .select('id,data,updated_at')
    .eq('key_hash', resumeKeyHash(body.data.key))
    .maybeSingle();
  if (error) return context.json({ error: 'Could not load resume' }, 500);
  if (!data) return context.json({ error: 'Resume not found' }, 404);
  return context.json({
    ...data,
    updateToken: resumeUpdateToken(data.id, resumeKeyHash(body.data.key)),
  });
});

app.delete('/resumes', async (context) => {
  const limit = await checkResumeRateLimit(context);
  if (!limit.allowed)
    return context.json(
      {
        error:
          limit.status === 429
            ? 'Too many requests. Try again later.'
            : 'Could not verify request limit',
      },
      limit.status,
    );
  const body = resumeDeleteSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Load the resume before deleting its cloud copy' }, 409);
  const client = db();
  const keyHash = resumeKeyHash(body.data.key);
  const { data: existing, error: readError } = await client
    .from('cloud_resumes')
    .select('id')
    .eq('key_hash', keyHash)
    .maybeSingle();
  if (readError) return context.json({ error: 'Could not delete resume' }, 500);
  if (!existing) return context.json({ error: 'Resume not found' }, 404);
  if (!tokensMatch(body.data.updateToken, resumeUpdateToken(existing.id, keyHash))) {
    return context.json({ error: 'Load the resume before deleting its cloud copy' }, 409);
  }
  const { error } = await client.from('cloud_resumes').delete().eq('id', existing.id);
  if (error) return context.json({ error: 'Could not delete resume' }, 500);
  return context.body(null, 204);
});

app.use('/admin/*', requireAdmin);

app.get('/admin/projects', async (context) => {
  const { data, error } = await db().from('projects').select('*').order('sort_order');
  if (error) return context.json({ error: error.message }, 500);
  return context.json(data);
});

app.post('/admin/projects', async (context) => {
  const body = projectSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid project', issues: body.error.issues }, 400);
  const { data, error } = await db().from('projects').insert(body.data).select().single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data, 201);
});

app.patch('/admin/projects/:id', async (context) => {
  const body = projectPatchSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid project', issues: body.error.issues }, 400);
  const { data, error } = await db()
    .from('projects')
    .update({ ...body.data, updated_at: new Date().toISOString() })
    .eq('id', context.req.param('id'))
    .select()
    .single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data);
});

app.delete('/admin/projects/:id', async (context) => {
  const { error } = await db().from('projects').delete().eq('id', context.req.param('id'));
  if (error) return context.json({ error: error.message }, 400);
  return context.body(null, 204);
});

app.get('/admin/projects/:id/detail', async (context) => {
  const { data, error } = await db()
    .from('project_details')
    .select('*')
    .eq('project_id', context.req.param('id'))
    .maybeSingle();
  if (error) return context.json({ error: error.message }, 500);
  return context.json(data);
});

app.put('/admin/projects/:id/detail', async (context) => {
  const body = projectDetailSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid project detail', issues: body.error.issues }, 400);
  const { data, error } = await db()
    .from('project_details')
    .upsert({
      project_id: context.req.param('id'),
      ...body.data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data);
});

app.get('/admin/experiences', async (context) => {
  const { data, error } = await db().from('experiences').select('*').order('sort_order');
  if (error) return context.json({ error: error.message }, 500);
  return context.json(data);
});

app.post('/admin/experiences', async (context) => {
  const body = experienceSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid experience', issues: body.error.issues }, 400);
  const { data, error } = await db().from('experiences').insert(body.data).select().single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data, 201);
});

app.patch('/admin/experiences/:id', async (context) => {
  const body = experienceSchema.partial().safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid experience', issues: body.error.issues }, 400);
  const { data, error } = await db()
    .from('experiences')
    .update({ ...body.data, updated_at: new Date().toISOString() })
    .eq('id', context.req.param('id'))
    .select()
    .single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data);
});

app.delete('/admin/experiences/:id', async (context) => {
  const { error } = await db().from('experiences').delete().eq('id', context.req.param('id'));
  if (error) return context.json({ error: error.message }, 400);
  return context.body(null, 204);
});

app.get('/admin/skills', async (context) => {
  const { data, error } = await db().from('skill_categories').select('*').order('sort_order');
  if (error) return context.json({ error: error.message }, 500);
  return context.json(data);
});

app.post('/admin/skills', async (context) => {
  const body = skillCategorySchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid skill category', issues: body.error.issues }, 400);
  const { data, error } = await db().from('skill_categories').insert(body.data).select().single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data, 201);
});

app.patch('/admin/skills/:id', async (context) => {
  const body = skillCategorySchema.partial().safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid skill category', issues: body.error.issues }, 400);
  const { data, error } = await db()
    .from('skill_categories')
    .update({ ...body.data, updated_at: new Date().toISOString() })
    .eq('id', context.req.param('id'))
    .select()
    .single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data);
});

app.delete('/admin/skills/:id', async (context) => {
  const { error } = await db().from('skill_categories').delete().eq('id', context.req.param('id'));
  if (error) return context.json({ error: error.message }, 400);
  return context.body(null, 204);
});

app.get('/admin/socials', async (context) => {
  const { data, error } = await db().from('social_links').select('*').order('sort_order');
  if (error) return context.json({ error: error.message }, 500);
  return context.json(data);
});

app.post('/admin/socials', async (context) => {
  const body = socialLinkSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid social link', issues: body.error.issues }, 400);
  const { data, error } = await db().from('social_links').insert(body.data).select().single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data, 201);
});

app.patch('/admin/socials/:id', async (context) => {
  const body = socialLinkSchema.partial().safeParse(await context.req.json().catch(() => null));
  if (!body.success)
    return context.json({ error: 'Invalid social link', issues: body.error.issues }, 400);
  const { data, error } = await db()
    .from('social_links')
    .update({ ...body.data, updated_at: new Date().toISOString() })
    .eq('id', context.req.param('id'))
    .select()
    .single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data);
});

app.delete('/admin/socials/:id', async (context) => {
  const { error } = await db().from('social_links').delete().eq('id', context.req.param('id'));
  if (error) return context.json({ error: error.message }, 400);
  return context.body(null, 204);
});

app.get('/admin/messages', async (context) => {
  const { data, error } = await db()
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return context.json({ error: error.message }, 500);
  return context.json(data);
});

app.patch('/admin/messages/:id', async (context) => {
  const body = messageStatusSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success) return context.json({ error: 'Invalid message status' }, 400);
  const { data, error } = await db()
    .from('contact_messages')
    .update(body.data)
    .eq('id', context.req.param('id'))
    .select()
    .single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data);
});

app.delete('/admin/messages/:id', async (context) => {
  const { error } = await db().from('contact_messages').delete().eq('id', context.req.param('id'));
  if (error) return context.json({ error: error.message }, 400);
  return context.body(null, 204);
});

app.get('/admin/settings', async (context) => {
  const { data, error } = await db().from('site_settings').select('*').order('key');
  if (error) return context.json({ error: error.message }, 500);
  return context.json(data);
});

app.get('/admin/resumes', async (context) => {
  const { data, error } = await db()
    .from('cloud_resumes')
    .select('id,name,title,data,created_at,updated_at')
    .order('updated_at', { ascending: false });
  if (error) return context.json({ error: error.message }, 500);
  return context.json(data);
});

app.delete('/admin/resumes/:id', async (context) => {
  const { error } = await db().from('cloud_resumes').delete().eq('id', context.req.param('id'));
  if (error) return context.json({ error: error.message }, 400);
  return context.body(null, 204);
});

app.put('/admin/settings/:key', async (context) => {
  const body = siteSettingSchema.safeParse(await context.req.json().catch(() => null));
  if (!body.success) return context.json({ error: 'Invalid setting value' }, 400);
  const { data, error } = await db()
    .from('site_settings')
    .upsert({
      key: context.req.param('key'),
      value: body.data.value,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) return context.json({ error: error.message }, 400);
  return context.json(data);
});

app.notFound((context) => context.json({ error: 'Not found' }, 404));
