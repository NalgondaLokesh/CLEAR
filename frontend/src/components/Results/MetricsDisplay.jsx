import React from 'react';
import { motion } from 'framer-motion';

const MetricsDisplay = ({ metrics }) => {
  if (!metrics) return null;

  const metricCards = [
    {
      title: 'PSNR',
      value: `${metrics.psnr?.toFixed(1)} dB`,
      icon: '📈',
      color: 'from-blue-500 to-blue-600',
      description: 'Peak Signal-to-Noise Ratio'
    },
    {
      title: 'SSIM',
      value: metrics.ssim?.toFixed(3),
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
      description: 'Structural Similarity Index'
    },
    {
      title: 'Processing Time',
      value: `${metrics.processing_time?.toFixed(2)}s`,
      icon: '⏱️',
      color: 'from-green-500 to-green-600',
      description: 'Time taken to process'
    },
    {
      title: 'Output Size',
      value: metrics.output_size || '256×256',
      icon: '📐',
      color: 'from-orange-500 to-orange-600',
      description: 'Image dimensions'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-bold text-gray-800">📊 Processing Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${metric.color} text-white rounded-xl p-4 shadow-lg`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-2xl">{metric.icon}</div>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {metric.description}
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">{metric.title}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MetricsDisplay;