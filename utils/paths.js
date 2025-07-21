/**
 * Utility function to get the correct base path for assets and API endpoints
 * Works correctly in both development and production (GitHub Pages)
 */
export const getBasePath = () => {
  return process.env.NODE_ENV === 'production' ? '/forcefoundry' : '';
};

/**
 * Utility function to get the full URL for a resource, taking into account the base path
 * @param {string} path - The resource path (e.g., '/data/species.json')
 * @returns {string} - The full URL with the correct base path
 */
export const getResourceUrl = (path) => {
  const basePath = getBasePath();
  // Ensure path starts with '/' and avoid double slashes
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
};
