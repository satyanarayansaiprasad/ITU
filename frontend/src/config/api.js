// API Configuration
// Auto-detect production vs localhost
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Check if we're running on localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3001';
  }
  // Default to production URL
  return 'https://itu-r1qa.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  GET_CONTACT: `${API_BASE_URL}/api/admin/getContact`,
  DELETE_CONTACT: (id) => `${API_BASE_URL}/api/admin/deleteContact/${id}`,
  GET_GALLERY: `${API_BASE_URL}/api/admin/getGallery`,
  UPLOAD_GALLERY: `${API_BASE_URL}/api/admin/uploadGallery`,
  DELETE_GALLERY: (id) => `${API_BASE_URL}/api/admin/deleteGallery/${id}`,
  GET_SLIDER: `${API_BASE_URL}/api/admin/getSlider`,
  UPLOAD_SLIDER: `${API_BASE_URL}/api/admin/uploadSlider`,
  DELETE_SLIDER: (id) => `${API_BASE_URL}/api/admin/deleteSlider/${id}`,
  GET_SELF_DEFENCE_SLIDER: `${API_BASE_URL}/api/admin/getSelfDefenceSlider`,
  UPLOAD_SELF_DEFENCE_SLIDER: `${API_BASE_URL}/api/admin/uploadSelfDefenceSlider`,
  DELETE_SELF_DEFENCE_SLIDER: (id) => `${API_BASE_URL}/api/admin/deleteSelfDefenceSlider/${id}`,
  GET_CATEGORY_SLIDER: `${API_BASE_URL}/api/admin/getCategorySlider`,
  UPLOAD_CATEGORY_SLIDER: `${API_BASE_URL}/api/admin/uploadCategorySlider`,
  UPDATE_CATEGORY_SLIDER: (id) => `${API_BASE_URL}/api/admin/editCategorySlider/${id}`,
  DELETE_CATEGORY_SLIDER: (id) => `${API_BASE_URL}/api/admin/deleteCategorySlider/${id}`,
  GET_ALL_NEWS: `${API_BASE_URL}/api/admin/getallNews`,
  ADD_NEWS: `${API_BASE_URL}/api/admin/addNews`,
  EDIT_NEWS: (id) => `${API_BASE_URL}/api/admin/editNews/${id}`,
  DELETE_NEWS: (id) => `${API_BASE_URL}/api/admin/deleteNews/${id}`,
  GET_FORM: `${API_BASE_URL}/api/admin/getForm`,
  APPROVE_FORM: `${API_BASE_URL}/api/admin/approveForm`,
  REJECT_FORM: `${API_BASE_URL}/api/admin/rejectForm`,
  DELETE_USER: `${API_BASE_URL}/api/admin/deleteUser`,
  SET_DISTRICT_HEAD: `${API_BASE_URL}/api/admin/set-district-head`,
  SET_STATE_HEAD: `${API_BASE_URL}/api/admin/set-state-head`,
  REMOVE_DISTRICT_HEAD: `${API_BASE_URL}/api/admin/remove-district-head`,
  REMOVE_STATE_HEAD: `${API_BASE_URL}/api/admin/remove-state-head`,
  GET_ORGANIZATIONS_BY_STATE: (stateName) => `${API_BASE_URL}/api/admin/organizations/${encodeURIComponent(stateName)}`,
  
  // User endpoints
  CONTACT_US: `${API_BASE_URL}/api/user/contactus`,
  SUBMIT_FORM: (endpoint) => `${API_BASE_URL}/api/user/${endpoint}`,
  STATE_UNION_LOGIN: `${API_BASE_URL}/api/user/stateunionlogin`,
  
  // Player endpoints
  PLAYER_LOGIN: `${API_BASE_URL}/api/user/player/login`,
  REGISTER_PLAYERS: `${API_BASE_URL}/api/user/playerregistration`,
  GET_PLAYER_PROFILE: (id) => `${API_BASE_URL}/api/user/players/${id}`,
  UPDATE_PLAYER_PROFILE: (id) => `${API_BASE_URL}/api/user/players/${id}`,
  UPLOAD_PLAYER_PHOTO: (id) => `${API_BASE_URL}/api/user/players/${id}/photo`,
  GET_PLAYERS_BY_UNION: (unionId) => `${API_BASE_URL}/api/user/unions/${unionId}/players`,
  
  // Admin player endpoints
  GET_PLAYERS: `${API_BASE_URL}/api/admin/getPlayers`,
  APPROVE_PLAYERS: `${API_BASE_URL}/api/admin/approvePlayers`,
  REJECT_PLAYERS: `${API_BASE_URL}/api/admin/rejectPlayers`,
  DELETE_PLAYERS: `${API_BASE_URL}/api/admin/deletePlayers`,
  
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
  
  // States and Districts endpoints
  GET_ALL_STATES: `${API_BASE_URL}/api/states`,
  GET_STATES_ONLY: `${API_BASE_URL}/api/states/states-only`,
  GET_UNION_TERRITORIES: `${API_BASE_URL}/api/states/union-territories`,
  GET_STATE: (stateName) => `${API_BASE_URL}/api/states/${encodeURIComponent(stateName)}`,
  GET_DISTRICTS: (stateName) => `${API_BASE_URL}/api/states/${encodeURIComponent(stateName)}/districts`,
  CREATE_STATE: `${API_BASE_URL}/api/states`,
  UPDATE_STATE_STATUS: (stateName) => `${API_BASE_URL}/api/states/${encodeURIComponent(stateName)}/status`,
  UPDATE_DISTRICTS: (stateName) => `${API_BASE_URL}/api/states/${encodeURIComponent(stateName)}/districts`,
  DELETE_STATE: (stateName) => `${API_BASE_URL}/api/states/${encodeURIComponent(stateName)}`,
  
  // Organization endpoints
  GET_ORGANIZATIONS_BY_DISTRICT: (stateName, districtName) => `${API_BASE_URL}/api/user/organizations/${encodeURIComponent(stateName)}/${encodeURIComponent(districtName)}`,
  GET_STATE_UNION: (id) => `${API_BASE_URL}/api/user/stateunions/${id}`,
  UPDATE_STATE_UNION: (id) => `${API_BASE_URL}/api/user/stateunions/${id}`,
  UPLOAD_GENERAL_SECRETARY_IMAGE: (id) => `${API_BASE_URL}/api/user/stateunions/${id}/general-secretary-image`,
};

// Helper function for upload URLs
export const GET_UPLOAD_URL = (filename) => `${API_BASE_URL}/uploads/${filename}`;

export default API_BASE_URL;
