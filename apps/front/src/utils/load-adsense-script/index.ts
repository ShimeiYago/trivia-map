const ADSENSE_SCRIPT_ATTRIBUTE = 'data-triviamap-adsense';

export function loadAdsenseScript(client = process.env.REACT_APP_AD_CLIENT) {
  if (!client || document.querySelector(`script[${ADSENSE_SCRIPT_ATTRIBUTE}]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  script.crossOrigin = 'anonymous';
  script.setAttribute(ADSENSE_SCRIPT_ATTRIBUTE, 'true');
  document.head.appendChild(script);
}
