import { loadAdsenseScript } from '..';

describe('loadAdsenseScript', () => {
  afterEach(() => {
    document.head.querySelectorAll('script[data-triviamap-adsense]').forEach((script) => script.remove());
  });

  it('does not load an advertising script without a client ID', () => {
    loadAdsenseScript('');

    expect(document.head.querySelector('script[data-triviamap-adsense]')).toBeNull();
  });

  it('loads a single script when a client ID is configured', () => {
    loadAdsenseScript('ca-pub-test');
    loadAdsenseScript('ca-pub-test');

    const scripts = document.head.querySelectorAll('script[data-triviamap-adsense]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute('src')).toContain('client=ca-pub-test');
  });
});
