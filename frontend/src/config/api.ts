// API Configuration
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8081';

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Remove trailing slash from base URL if present
  const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${cleanBaseUrl}/${cleanEndpoint}`;
};

// Helper function to normalize avatar/image URLs
// Converts localhost URLs or relative paths to use the correct API base URL
export const normalizeImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  // If it's already a full URL with localhost, replace it with the API base URL
  if (url.includes('localhost:8081') || url.includes('127.0.0.1:8081')) {
    const relativePath = url.replace(/^https?:\/\/[^\/]+/, '');
    return getApiUrl(relativePath);
  }
  
  // If it's a relative path (starts with /), use getApiUrl
  if (url.startsWith('/')) {
    return getApiUrl(url.slice(1));
  }
  
  // If it's already a full URL (not localhost), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, treat as relative path
  return getApiUrl(url);
};

