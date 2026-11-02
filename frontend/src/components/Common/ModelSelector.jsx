import React from 'react';
import { motion } from 'framer-motion';

const ModelSelector = ({ models, selectedModel, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <span>Model</span>
        <span>Select Model</span>
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {models.map((model) => (
          <motion.button
            key={model}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(model)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selectedModel === model
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-teal-300 bg-white'
            }`}
          >
            {selectedModel === model && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1"
              >
                ✓
              </motion.div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedModel === model ? 'bg-teal-500' : 'bg-gray-200'
              }`}>
                <span className={selectedModel === model ? 'text-white' : 'text-gray-600'}>AI</span>
              </div>
              
              <div className="text-left">
                <p className="font-semibold text-gray-800">{model}</p>
                <p className="text-xs text-gray-500">
                  {model === 'RICE1' ? 'Base Model' : 'Transfer Learning'}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ModelSelector;
