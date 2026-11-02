import React from 'react';
import { motion } from 'framer-motion';

const DragDropZone = ({ isDragActive, isDragReject, children }) => {
  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
        isDragActive
          ? 'border-teal-500 bg-teal-50 scale-105'
          : isDragReject
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 hover:border-teal-500 hover:bg-gray-50'
      }`}
      animate={{
        scale: isDragActive ? 1.05 : 1,
        borderColor: isDragActive ? '#14b8a6' : isDragReject ? '#ef4444' : '#d1d5db'
      }}
      transition={{ duration: 0.2 }}
    >
      {isDragActive ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-xl"
        >
          <div className="text-6xl">☁️</div>
        </motion.div>
      ) : isDragReject ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-10 rounded-xl"
        >
          <div className="text-6xl">⚠️</div>
        </motion.div>
      ) : null}

      <div className="relative z-10">
        <motion.div
          animate={{ y: isDragActive ? -10 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4 flex items-center justify-center text-6xl">📷</div>
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DragDropZone;