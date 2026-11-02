import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

const ImageUpload = ({ onImageSelect, selectedImage, onClear }) => {
  const [preview, setPreview] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onImageSelect(file);
        
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setDimensions({ width: img.width, height: img.height });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: 10485760 // 10MB
  });

  const handleClear = () => {
    setPreview(null);
    setDimensions({ width: 0, height: 0 });
    onClear();
  };

  return (
    <div className="w-full">
      {!preview ? (
        <motion.div
          {...getRootProps()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-300 hover:border-teal-500 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ y: isDragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4 flex items-center justify-center text-3xl">📤</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse (PNG, JPG, JPEG up to 10MB)
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="border-2 border-teal-500 rounded-xl overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto object-contain"
              style={{ maxHeight: '512px' }}
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>📷</span>
              <span>{selectedImage?.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{dimensions.width} × {dimensions.height} px</span>
              <span>{(selectedImage?.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUpload;