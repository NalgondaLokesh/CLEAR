import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ImageUpload from '../components/Upload/ImageUpload';
import Button from '../components/Common/Button';
import ResultDisplay from '../components/Results/ResultDisplay';
import ImageComparison from '../components/Results/ImageComparison';
import MetricsDisplay from '../components/Results/MetricsDisplay';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { processImage } from '../services/api';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedModel] = useState('RICE2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
  };

  const handleProcess = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await processImage(selectedImage, selectedModel);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (response.success) {
        setResult(response);
        toast.success('Cloud removal completed successfully!');
      } else {
        toast.error(response.error || 'Processing failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      toast.error('Failed to process image. Please try again.');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingProgress(0), 1000);
    }
  };

  const handleDownload = () => {
    if (result?.processed_image) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${result.processed_image}`;
      link.download = `clear_output_${Date.now()}.png`;
      link.click();
      toast.success('Image downloaded successfully!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🌤️ Transform Cloudy Satellite Imagery
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          AI-powered cloud removal using advanced U-Net GAN architecture. 
          Upload your cloudy satellite images and get clear, actionable results in seconds.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload and Controls */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">📤 Upload Image</h3>
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClear={handleClear}
            />
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleProcess}
              loading={isProcessing}
              disabled={!selectedImage || isProcessing}
              className="w-full"
              size="large"
            >
              🌤️ Remove Clouds
            </Button>

            {isProcessing && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Processing... {processingProgress}%
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {isProcessing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card flex items-center justify-center h-96"
            >
              <LoadingSpinner size="large" text="Processing your image with AI..." />
            </motion.div>
          ) : result ? (
            <>
              <ResultDisplay
                processedImage={result.processed_image}
                metrics={result.metrics}
                onDownload={handleDownload}
              />
              
              {imagePreview && (
                <ImageComparison
                  originalImage={imagePreview}
                  processedImage={result.processed_image}
                />
              )}
              
              <MetricsDisplay metrics={result.metrics} />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card flex items-center justify-center h-96 border-2 border-dashed border-gray-300"
            >
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-lg font-medium">No results yet</p>
                <p className="text-sm">Upload an image and click "Remove Clouds" to get started</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { icon: '🚀', title: 'Fast Processing', desc: 'AI-powered cloud removal in seconds' },
          { icon: '🎯', title: 'High Quality', desc: 'U-Net GAN for superior results' },
          { icon: '🌍', title: 'Real-world Ready', desc: 'Trained on satellite datasets' }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="card card-hover text-center"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;