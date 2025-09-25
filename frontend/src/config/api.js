// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  GET_CONTACT: `${API_BASE_URL}/api/admin/getContact`,
  GET_GALLERY: `${API_BASE_URL}/api/admin/getGallery`,
  UPLOAD_GALLERY: `${API_BASE_URL}/api/admin/uploadGallery`,
  DELETE_GALLERY: (id) => `${API_BASE_URL}/api/admin/deleteGallery/${id}`,
  GET_SLIDER: `${API_BASE_URL}/api/admin/getSlider`,
  UPLOAD_SLIDER: `${API_BASE_URL}/api/admin/uploadSlider`,
  DELETE_SLIDER: (id) => `${API_BASE_URL}/api/admin/deleteSlider/${id}`,
  GET_ALL_NEWS: `${API_BASE_URL}/api/admin/getallNews`,
  ADD_NEWS: `${API_BASE_URL}/api/admin/addNews`,
  EDIT_NEWS: (id) => `${API_BASE_URL}/api/admin/editNews/${id}`,
  DELETE_NEWS: (id) => `${API_BASE_URL}/api/admin/deleteNews/${id}`,
  GET_FORM: `${API_BASE_URL}/api/admin/getForm`,
  APPROVE_FORM: `${API_BASE_URL}/api/admin/approveForm`,
  
  // User endpoints
  CONTACT_US: `${API_BASE_URL}/api/user/contactus`,
  SUBMIT_FORM: (endpoint) => `${API_BASE_URL}/api/user/${endpoint}`,
  STATE_UNION_LOGIN: `${API_BASE_URL}/api/user/stateunionlogin`,
  
  // Player endpoints
  PLAYER_LOGIN: `${API_BASE_URL}/api/player/login`,
  
  // Blog endpoints
  BLOG_POSTS: `${API_BASE_URL}/api/admin/blog/posts`,
  BLOG_FEATURED: `${API_BASE_URL}/api/admin/blog/featured`,
  BLOG_CATEGORIES: `${API_BASE_URL}/api/admin/blog/categories`,
  BLOG_TAGS: `${API_BASE_URL}/api/admin/blog/tags`,
  BLOG_POST: (slug) => `${API_BASE_URL}/api/admin/blog/post/${slug}`,
  BLOG_RELATED: (slug) => `${API_BASE_URL}/api/admin/blog/related/${slug}`,
  
  // Analytics endpoints
  DASHBOARD_ANALYTICS: `${API_BASE_URL}/api/admin/analytics/dashboard`,
  ENGAGEMENT_ANALYTICS: `${API_BASE_URL}/api/admin/analytics/engagement`,
  CONTENT_ANALYTICS: `${API_BASE_URL}/api/admin/analytics/content`,
  
  // Uploads
  UPLOADS: `${API_BASE_URL}/uploads`,
};

// Helper function for upload URLs
export const GET_UPLOAD_URL = (filename) => `${API_BASE_URL}/uploads/${filename}`;

export default API_BASE_URL;
