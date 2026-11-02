/**
 * Image validation utilities
 */

export const validateImageFile = (file) => {
  const errors = [];

  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }

  // Check file type
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    errors.push('Invalid file type. Only PNG, JPG, and JPEG are allowed.');
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    errors.push('File size exceeds 10MB limit.');
  }

  // Check file name
  if (!file.name || file.name.trim() === '') {
    errors.push('Invalid file name.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateModelSelection = (model, availableModels) => {
  if (!model) {
    return { valid: false, error: 'No model selected' };
  }

  if (!availableModels.includes(model)) {
    return { valid: false, error: 'Invalid model selected' };
  }

  return { valid: true, error: null };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};