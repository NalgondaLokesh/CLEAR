import React from 'react';
import { motion } from 'framer-motion';

const ResultDisplay = ({ processedImage, metrics, onDownload }) => {
  if (!processedImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-gray-800">✨ Cloud-Free Result</h3>
        
        <div className="relative rounded-lg overflow-hidden border-2 border-green-500">
          <img
            src={`data:image/png;base64,${processedImage}`}
            alt="Processed Image"
            className="w-full h-auto"
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => window.open(`data:image/png;base64,${processedImage}`, '_blank')}
              className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors"
              title="Open in new tab"
            >
              🔍
            </button>
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownload}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <span>📥</span>
            <span>Download Image</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <span>🔗</span>
            <span>Share</span>
          </motion.button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Processing Time"
            value={`${metrics.processing_time?.toFixed(2)}s`}
            icon="⏱️"
            color="blue"
          />
          <MetricCard
            title="Output Size"
            value={metrics.output_size || "256×256"}
            icon="📐"
            color="purple"
          />
          <MetricCard
            title="PSNR"
            value={`${metrics.psnr?.toFixed(1)} dB`}
            icon="📊"
            color="green"
          />
        </div>
      )}
    </motion.div>
  );
};

const MetricCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-r ${colorClasses[color]} text-white rounded-xl p-4 shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;