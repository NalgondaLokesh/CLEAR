/**
 * Application constants
 */

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
  MAX_FILE_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10485760, // 10MB
};

export const IMAGE_CONFIG = {
  MAX_WIDTH: 2048,
  MAX_HEIGHT: 2048,
  MIN_WIDTH: 256,
  MIN_HEIGHT: 256,
  ACCEPTED_FORMATS: ['image/png', 'image/jpeg', 'image/jpg'],
  MAX_SIZE_MB: 10,
};

export const MODEL_CONFIG = {
  DEFAULT_MODEL: 'RICE1',
  AVAILABLE_MODELS: ['RICE1', 'RICE2'],
  MODEL_INFO: {
    RICE1: {
      name: 'RICE1',
      description: 'Base model trained on RICE1 dataset',
      dataset: 'RICE1 (500 images)',
      bestFor: 'General-purpose cloud removal'
    },
    RICE2: {
      name: 'RICE2',
      description: 'Transfer learning model fine-tuned on RICE2',
      dataset: 'RICE2 (736 images)',
      bestFor: 'Diverse cloud patterns and new imagery'
    }
  }
};

export const THEME_COLORS = {
  primary: {
    main: '#1a365d',
    light: '#2c5282',
    dark: '#1a365d',
  },
  secondary: {
    main: '#2c7a7b',
    light: '#38b2ac',
    dark: '#285e61',
  },
  accent: {
    main: '#ed8936',
    light: '#f6ad55',
    dark: '#c05621',
  },
  background: {
    main: '#f7fafc',
    light: '#ffffff',
    dark: '#edf2f7',
  },
  text: {
    primary: '#2d3748',
    secondary: '#718096',
    disabled: '#a0aec0',
  },
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DOCUMENTATION: '/documentation',
};

export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#ffffff',
    color: '#2d3748',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  success: {
    iconTheme: {
      primary: '#48bb78',
      secondary: '#ffffff',
    },
  },
  error: {
    iconTheme: {
      primary: '#f56565',
      secondary: '#ffffff',
    },
  },
};