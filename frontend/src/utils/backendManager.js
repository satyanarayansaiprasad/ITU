// Backend Manager for Automatic Failover/Switching
import axios from 'axios';

const URLS = [
  'https://itu-f4bn.onrender.com',
  'https://itu-bqhr.onrender.com'
];

/**
 * Checks if the application is running on localhost
 */
export const isLocalhost = () => {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
};

/**
 * Gets the currently stored active backend URL
 */
export const getActiveBackendUrl = () => {
  if (typeof window === 'undefined') return URLS[0];

  // If running on localhost, use localhost backend (unless overridden by env)
  if (isLocalhost()) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  }

  // Check if we have a persisted active backend URL
  let activeUrl = localStorage.getItem('active_backend_url');
  if (!activeUrl || !URLS.includes(activeUrl)) {
    activeUrl = URLS[0];
    localStorage.setItem('active_backend_url', activeUrl);
  }
  return activeUrl;
};

/**
 * Switches the active backend URL to the alternate one
 */
export const switchBackendUrl = () => {
  if (typeof window === 'undefined') return URLS[0];

  if (isLocalhost()) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  }

  const current = getActiveBackendUrl();
  const next = URLS.find(url => url !== current) || URLS[0];
  localStorage.setItem('active_backend_url', next);
  console.warn(`[BackendManager] Switched active backend URL from ${current} to ${next}`);
  return next;
};

/**
 * Helper to check if a URL belongs to our Render backend servers
 */
export const isBackendUrl = (urlStr) => {
  if (!urlStr) return false;
  return URLS.some(url => urlStr.includes(url));
};

/**
 * Replaces the backend domain in a URL string with the active one
 */
export const rewriteUrl = (urlStr, targetBaseUrl) => {
  if (!urlStr) return urlStr;
  let updatedUrl = urlStr;
  for (const url of URLS) {
    if (updatedUrl.includes(url)) {
      updatedUrl = updatedUrl.replace(url, targetBaseUrl);
    }
  }
  return updatedUrl;
};

/**
 * Set up request and response interceptors on an Axios instance
 */
export const setupAxiosInterceptors = (axiosInstance) => {
  if (!axiosInstance || !axiosInstance.interceptors) return;

  // Request Interceptor: Rewrite URL to point to active backend URL
  axiosInstance.interceptors.request.use(
    (config) => {
      const activeUrl = getActiveBackendUrl();

      // If baseURL is set, ensure it uses the active backend URL
      if (config.baseURL && isBackendUrl(config.baseURL)) {
        config.baseURL = rewriteUrl(config.baseURL, activeUrl);
      }

      // If URL is absolute, ensure it uses the active backend URL
      if (config.url && isBackendUrl(config.url)) {
        config.url = rewriteUrl(config.url, activeUrl);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Catch errors and failover if necessary
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;

      // Avoid infinite retries
      if (!config || config._retryWithFallback) {
        return Promise.reject(error);
      }

      // Detect network failure or gateway error (502, 503, 504)
      const isNetworkError = !error.response;
      const isServerError = error.response && [502, 503, 504].includes(error.response.status);

      // Only switch backend if we are not on localhost and the request targeted a backend URL
      const targetIsBackend = (config.url && isBackendUrl(config.url)) || 
                             (config.baseURL && isBackendUrl(config.baseURL));

      if (!isLocalhost() && targetIsBackend && (isNetworkError || isServerError)) {
        // Toggle active backend URL
        const newBaseUrl = switchBackendUrl();
        config._retryWithFallback = true;

        // Re-write baseURL and url for retry
        if (config.baseURL && isBackendUrl(config.baseURL)) {
          config.baseURL = rewriteUrl(config.baseURL, newBaseUrl);
        }
        if (config.url && isBackendUrl(config.url)) {
          config.url = rewriteUrl(config.url, newBaseUrl);
        }

        console.log(`[BackendManager] Retrying request ${config.url || ''} with fallback backend ${newBaseUrl}`);
        
        // Wait 1.5 seconds before retrying to allow fallback backend to accept connections if waking up
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return axiosInstance(config);
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Patch global window.fetch to support backend switching
 */
export const patchGlobalFetch = () => {
  if (typeof window === 'undefined' || window._fetchPatched) return;
  window._fetchPatched = true;

  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    let url = typeof input === 'string' ? input : (input && input.url ? input.url : '');

    if (isBackendUrl(url) && !isLocalhost()) {
      const activeUrl = getActiveBackendUrl();
      const targetUrl = rewriteUrl(url, activeUrl);

      let newInput = input;
      if (typeof input === 'string') {
        newInput = targetUrl;
      } else if (input instanceof Request) {
        // Clone Request with new URL
        newInput = new Request(targetUrl, input);
      }

      try {
        const response = await originalFetch(newInput, init);

        // If gateway error (502, 503, 504), switch and retry
        if ([502, 503, 504].includes(response.status)) {
          const newBaseUrl = switchBackendUrl();
          const fallbackUrl = rewriteUrl(url, newBaseUrl);
          
          let retryInput = typeof input === 'string' ? fallbackUrl : new Request(fallbackUrl, input);
          console.warn(`[BackendManager] Fetch returned ${response.status}. Retrying with fallback backend ${newBaseUrl}`);
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          return originalFetch(retryInput, init);
        }

        return response;
      } catch (error) {
        // Network error/timeout
        const newBaseUrl = switchBackendUrl();
        const fallbackUrl = rewriteUrl(url, newBaseUrl);

        let retryInput = typeof input === 'string' ? fallbackUrl : new Request(fallbackUrl, input);
        console.warn(`[BackendManager] Fetch failed (${error.message || 'NetworkError'}). Retrying with fallback backend ${newBaseUrl}`);

        await new Promise(resolve => setTimeout(resolve, 1500));
        return originalFetch(retryInput, init);
      }
    }

    return originalFetch(input, init);
  };
};
