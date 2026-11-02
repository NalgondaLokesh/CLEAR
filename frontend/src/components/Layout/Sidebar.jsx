import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    device: 'Loading...',
    modelsLoaded: false,
    availableModels: []
  });

  useEffect(() => {
    // Fetch system info from API
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/health`);
        const data = await response.json();
        setSystemInfo({
          device: data.device || 'Unknown',
          modelsLoaded: data.models_loaded || false,
          availableModels: ['RICE1', 'RICE2'] // This would come from /api/models
        });
      } catch (error) {
        console.error('Failed to fetch system info:', error);
      }
    };

    fetchSystemInfo();
  }, []);

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] gradient-primary text-white transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 right-4 text-white hover:text-teal-300 transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-bold mb-6 mt-4">⚙️ System Status</h3>
              
              <div className="space-y-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>💻</span>
                    <span className="text-sm font-medium">Device</span>
                  </div>
                  <p className="text-xs text-gray-300">{systemInfo.device}</p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>📦</span>
                    <span className="text-sm font-medium">Models</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${systemInfo.modelsLoaded ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-xs text-gray-300">
                      {systemInfo.modelsLoaded ? 'Loaded' : 'Not Loaded'}
                    </span>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>⚡</span>
                    <span className="text-sm font-medium">Performance</span>
                  </div>
                  <p className="text-xs text-gray-300">GPU Accelerated</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                <h4 className="text-sm font-semibold mb-3">Available Models</h4>
                <div className="space-y-2">
                  {systemInfo.availableModels.map((model) => (
                    <div key={model} className="text-xs text-gray-300">
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="flex flex-col items-center space-y-4 mt-8">
            <span className="text-2xl">💻</span>
            <span className="text-2xl">📦</span>
            <span className="text-2xl">⚡</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;