// Helper for internal links to handle basePath
export function getInternalLink(path) {
  const basePath = process.env.NODE_ENV === 'production' ? '/forcefoundry' : '';
  if (!path.startsWith('/')) path = '/' + path;
  return `${basePath}${path}`;
}
