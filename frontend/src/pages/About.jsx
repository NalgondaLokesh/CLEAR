import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About CLEAR</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cloud-Less Earth Observation & Reconstruction - An AI-powered solution for removing clouds from satellite imagery
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">🎯 Our Mission</h3>
          <p className="text-gray-600 mb-4">
            CLEAR aims to solve one of the biggest challenges in satellite imagery: cloud coverage. 
            By leveraging advanced deep learning techniques, we transform cloudy satellite images into 
            clear, actionable data.
          </p>
          <p className="text-gray-600">
            Our solution enables researchers, farmers, disaster response teams, and urban planners 
            to access critical ground information regardless of weather conditions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">🏗️ Architecture</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span><strong>U-Net Generator:</strong> 41.8M parameters with skip connections</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span><strong>PatchGAN Discriminator:</strong> 2.8M parameters for realistic textures</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span><strong>Transfer Learning:</strong> Pre-trained on RICE1, fine-tuned on RICE2</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span><strong>Input/Output:</strong> 256×256 RGB images</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800">🛠️ Tech Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'React', color: 'bg-blue-500' },
            { name: 'FastAPI', color: 'bg-green-500' },
            { name: 'PyTorch', color: 'bg-orange-500' },
            { name: 'Tailwind CSS', color: 'bg-teal-500' },
            { name: 'Framer Motion', color: 'bg-purple-500' },
            { name: 'U-Net GAN', color: 'bg-red-500' },
            { name: 'Streamlit', color: 'bg-pink-500' },
            { name: 'CUDA', color: 'bg-green-600' }
          ].map((tech) => (
            <div key={tech.name} className="text-center">
              <div className={`${tech.color} text-white rounded-lg p-3 mb-2`}>
                <span className="font-semibold">{tech.name}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800">📊 Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">25+ dB</div>
            <p className="text-gray-600">PSNR Score</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">0.68+</div>
            <p className="text-gray-600">SSIM Score</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">1-2s</div>
            <p className="text-gray-600">Processing Time</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;