import { loadWebAppManifest } from '..';

describe('loadWebAppManifest', () => {
  afterEach(() => {
    document.head.querySelectorAll('link[data-triviamap-manifest]').forEach((link) => link.remove());
  });

  it('does not request the manifest when PWA metadata is disabled', () => {
    loadWebAppManifest(true);

    expect(document.head.querySelector('link[data-triviamap-manifest]')).toBeNull();
  });

  it('adds one manifest link when PWA metadata is enabled', () => {
    loadWebAppManifest(false);
    loadWebAppManifest(false);

    const links = document.head.querySelectorAll('link[data-triviamap-manifest]');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toContain('/manifest.json');
  });
});
