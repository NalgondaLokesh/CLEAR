import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      return Promise.reject({ error: 'Network error. Please check your connection.' });
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
      return Promise.reject({ error: error.message });
    }
  }
);

// API functions
export const healthCheck = async () => {
  return await api.get('/api/health');
};

export const getModels = async () => {
  return await api.get('/api/models');
};

export const processImage = async (imageFile, model = 'RICE1') => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('model', model);

  return await api.post('/api/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const batchProcessImages = async (imageFiles, model = 'RICE1') => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });
  formData.append('model', model);

  return await api.post('/api/batch-process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;