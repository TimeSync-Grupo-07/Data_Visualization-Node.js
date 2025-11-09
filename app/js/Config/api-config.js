// api-config.js

const API_CONFIG = {
  baseURL: window.ENV?.API_BASE_URL || 'http://localhost/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default API_CONFIG;
