import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { apiInventory } from '@triviamap/contracts';

describe('API health endpoint', () => {
  it('returns service status', async () => {
    const response = await createApp().request('/health');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, service: 'triviamap-api' });
  });
});

describe('guess area compatibility', () => {
  it('preserves the legacy park root and validates the request body', async () => {
    const app = createApp();
    const response = await app.request('/guess-area', { method: 'POST', body: JSON.stringify({ lat: 0, lng: 0, park: 'L' }), headers: { 'content-type': 'application/json' } });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ areaNames: ['ランド'] });
    expect((await app.request('/guess-area', { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } })).status).toBe(400);
  });
});

describe('legacy API inventory', () => {
  it('registers every frontend contract route and method', () => {
    const normalize = (path: string) => path.replace(/:[^/]+/g, ':param').replace(/\/$/, '');
    const routes = createApp().routes.map((route) => `${route.method.toUpperCase()} ${normalize(route.path)}`);
    for (const [method, path] of apiInventory) {
      expect(routes).toContain(`${method} ${normalize(path)}`);
    }
  });
});
