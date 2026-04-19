import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { uploadRoutes } from './routes/uploads.js';
import { jobRoutes } from './routes/jobs.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  await app.register(multipart);

  app.get('/health', async () => ({ ok: true }));

  await app.register(async (v1) => {
    await uploadRoutes(v1);
    await jobRoutes(v1);
  }, { prefix: '/v1' });

  return app;
}
