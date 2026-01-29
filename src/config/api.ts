export const API_BASE_URL = 'https://dev.codeleap.co.uk/careers';

export function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export function buildApiUrl(path: string = ''): string {
  const base = ensureTrailingSlash(API_BASE_URL);
  if (!path) {
    return base;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const finalPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${base}${finalPath}`;
}

