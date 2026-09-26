import { getApiBaseUrl } from '..';

describe('getApiBaseUrl', () => {
  it('uses the configured same-origin API path for a staging build', () => {
    expect(getApiBaseUrl('/api', 'production')).toBe('/api');
  });

  it('defaults production builds to the same-origin API path', () => {
    expect(getApiBaseUrl('', 'production')).toBe('/api');
  });

  it('keeps the localhost API only for the development server', () => {
    expect(getApiBaseUrl('', 'development')).toBe('http://localhost:3001');
  });
});
