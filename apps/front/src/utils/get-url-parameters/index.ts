export function getUrlParameters(params: Params) {
  const urlParmas: string[] = [];
  Object.keys(params).forEach((key) => {
    if (params[key] || params[key] === 0) {
      const paramText = `${params[key]}`;
      paramText && urlParmas.push(`${key}=${paramText}`);
    }
  });

  if (urlParmas.length > 0) {
    return `?${urlParmas.join('&')}`;
  }
  return '';
}

interface Params {
  [key: string]: unknown;
}
