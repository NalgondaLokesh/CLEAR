import React from 'react';
import { motion } from 'framer-motion';

const Documentation = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Documentation</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Complete guide to using CLEAR for cloud removal from satellite imagery
        </p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">🚀 Getting Started</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">1. Upload Your Image</h4>
              <p className="text-gray-600 mb-2">
                Drag and drop a cloudy satellite image or click to browse. Supported formats: PNG, JPG, JPEG (max 10MB).
              </p>
              <div className="bg-gray-100 p-3 rounded-lg text-sm">
                <strong>Tip:</strong> Images with visible cloud cover work best for optimal results.
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">2. Select Model</h4>
              <p className="text-gray-600 mb-2">
                Choose between RICE1 (base model) or RICE2 (transfer learning model) based on your use case.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li><strong>RICE1:</strong> General-purpose cloud removal</li>
                <li><strong>RICE2:</strong> Better for diverse cloud patterns and new imagery</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">3. Process Image</h4>
              <p className="text-gray-600">
                Click the "Remove Clouds" button to start processing. The AI will remove clouds in 1-2 seconds.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">4. Download Results</h4>
              <p className="text-gray-600">
                Once processing is complete, you can view the results, compare before/after, and download the cloud-free image.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">🧠 Model Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">U-Net Generator</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Parameters: 41.8M</li>
                <li>• Architecture: Encoder-Decoder with skip connections</li>
                <li>• Input: 256×256 RGB images</li>
                <li>• Output: 256×256 RGB images</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">PatchGAN Discriminator</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Parameters: 2.8M</li>
                <li>• Architecture: 5-layer convolutional network</li>
                <li>• Purpose: Realistic texture generation</li>
                <li>• Patch-based discrimination</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">📊 Dataset Details</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">RICE1 Dataset</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Images: 500 paired cloudy-clear images</li>
                <li>• Split: 400 training, 100 testing</li>
                <li>• Purpose: Initial model training</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">RICE2 Dataset</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Images: 736 paired images</li>
                <li>• Purpose: Transfer learning target</li>
                <li>• Benefit: Improved generalization</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">💡 Tips for Best Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Optimal Input</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Use RGB format images</li>
                <li>• Recommended size: 512×512 to 2048×2048</li>
                <li>• File size under 10MB</li>
                <li>• Images with visible cloud cover</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">⚡ Performance</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• GPU processing is 10-50x faster</li>
                <li>• RICE2 model for diverse scenes</li>
                <li>• Consistent lighting conditions</li>
                <li>• Batch processing for multiple images</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">🔧 Troubleshooting</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Common Issues</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <strong>Model not loading:</strong> Ensure .pth files are in the models directory and check PyTorch compatibility.
                </li>
                <li>
                  <strong>Out of memory:</strong> Reduce batch size or use smaller image dimensions.
                </li>
                <li>
                  <strong>Poor output quality:</strong> Verify RGB format, check image resolution, try different models.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Documentation;