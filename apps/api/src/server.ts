import { serve } from '@hono/node-server';
import { app } from './app.js';
import { getEnv } from './env.js';

const env = getEnv();

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.info(`API listening on http://localhost:${info.port}/api/v1`);
});
