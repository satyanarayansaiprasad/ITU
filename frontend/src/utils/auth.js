// LocalStorage key namespace isolation to prevent collisions between admin and other roles on the same browser
(() => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const originalGetItem = window.localStorage.getItem;
  const originalSetItem = window.localStorage.setItem;
  const originalRemoveItem = window.localStorage.removeItem;

  const targetKeys = ['accessToken', 'refreshToken', 'userData', 'stateUnionId', 'playerData'];

  const getRolePrefix = () => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type');

    if (path.startsWith('/admin') || path.startsWith('/admindashboard') || typeParam === 'admin') {
      return 'admin_';
    }
    if (path.startsWith('/stateunion') || path.startsWith('/state-union') || typeParam === 'stateunion') {
      return 'stateunion_';
    }
    if (path.startsWith('/player') || typeParam === 'player') {
      return 'player_';
    }
    return '';
  };

  window.localStorage.getItem = function(key) {
    if (targetKeys.includes(key)) {
      const prefix = getRolePrefix();
      if (prefix) {
        const val = originalGetItem.call(window.localStorage, prefix + key);
        if (val !== null) return val;
      }
    }
    return originalGetItem.call(window.localStorage, key);
  };

  window.localStorage.setItem = function(key, value) {
    if (targetKeys.includes(key)) {
      const prefix = getRolePrefix();
      if (prefix) {
        originalSetItem.call(window.localStorage, prefix + key, value);
      }
    }
    originalSetItem.call(window.localStorage, key, value);
  };

  window.localStorage.removeItem = function(key) {
    if (targetKeys.includes(key)) {
      const prefix = getRolePrefix();
      if (prefix) {
        originalRemoveItem.call(window.localStorage, prefix + key);
      }
    }
    originalRemoveItem.call(window.localStorage, key);
  };
})();

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';

/**
 * Store tokens and user data
 */
export const setAuthData = (accessToken, refreshToken, userData) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (userData) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
};

/**
 * Get access token
 */
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get user data
 */
export const getUserData = () => {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  // Also clear legacy keys
  localStorage.removeItem('playerData');
  localStorage.removeItem('stateUnionId');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-f4bn.onrender.com');

  try {
    const response = await fetch(`${API_BASE_URL}/api/user/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    if (data.success && data.accessToken) {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      return data.accessToken;
    }

    throw new Error('Invalid refresh token response');
  } catch (error) {
    clearAuthData();
    throw error;
  }
};

