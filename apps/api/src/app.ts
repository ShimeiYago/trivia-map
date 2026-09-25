import { Hono } from 'hono';

export type Health = { ok: true; service: 'triviamap-api' };

export const createApp = () => {
  const app = new Hono();
  app.get('/health', (c) => c.json<Health>({ ok: true, service: 'triviamap-api' }));
  app.notFound((c) => c.json({ detail: 'Not found' }, 404));
  return app;
};
