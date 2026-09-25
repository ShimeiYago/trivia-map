export function getDomain(window: Window) {
  const uri = new URL(window.location.href);
  return uri.origin;
}
