import { useState, useCallback } from 'react';
import { processImage } from '../services/api';
import toast from 'react-hot-toast';

export const useImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const processImageFile = useCallback(async (imageFile, model = 'RICE1') => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await processImage(imageFile, model);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        setResult(response);
        toast.success('Cloud removal completed successfully!');
      } else {
        setError(response.error || 'Processing failed');
        toast.error(response.error || 'Processing failed');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.error || 'Failed to process image');
      toast.error(err.error || 'Failed to process image');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    progress,
    result,
    error,
    processImage: processImageFile,
    reset
  };
};

export default useImageProcessing;