import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('API health endpoint', () => {
  it('returns service status', async () => {
    const response = await createApp().request('/health');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, service: 'triviamap-api' });
  });
});
