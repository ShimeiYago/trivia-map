const MANIFEST_ATTRIBUTE = 'data-triviamap-manifest';

export function loadWebAppManifest(disabled = process.env.REACT_APP_DISABLE_PWA_METADATA === 'true') {
  if (disabled || document.head.querySelector(`link[${MANIFEST_ATTRIBUTE}]`)) return;

  const manifest = document.createElement('link');
  manifest.rel = 'manifest';
  manifest.href = `${process.env.PUBLIC_URL || ''}/manifest.json`;
  manifest.setAttribute(MANIFEST_ATTRIBUTE, 'true');
  document.head.appendChild(manifest);
}
