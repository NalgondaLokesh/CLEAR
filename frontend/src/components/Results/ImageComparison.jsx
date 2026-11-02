import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactCompareImage from 'react-compare-image';

const ImageComparison = ({ originalImage, processedImage }) => {
  const [viewMode, setViewMode] = useState('slider'); // 'slider', 'side-by-side'

  if (!originalImage || !processedImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">👁️ Before & After Comparison</h3>
        <div className="flex space-x-2">
          {['slider', 'side-by-side'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {viewMode === 'slider' && (
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
            <ReactCompareImage
              leftImage={originalImage}
              rightImage={`data:image/png;base64,${processedImage}`}
              sliderLineColor="#14b8a6"
              sliderPositionPercentage={0.5}
              handleSize={40}
            />
          </div>
        )}

        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-2 rounded">
                <p className="text-sm font-medium text-red-700">☁️ Cloudy (Original)</p>
              </div>
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-auto rounded-lg border-2 border-gray-300"
              />
            </div>
            <div>
              <div className="bg-green-50 border-l-4 border-green-500 p-2 mb-2 rounded">
                <p className="text-sm font-medium text-green-700">✨ Clear (Processed)</p>
              </div>
              <img
                src={`data:image/png;base64,${processedImage}`}
                alt="Processed"
                className="w-full h-auto rounded-lg border-2 border-green-500"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageComparison;