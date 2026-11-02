import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-800 to-teal-600 text-white hover:from-blue-900 hover:to-teal-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-800 border-2 border-gray-300 hover:border-teal-600 hover:text-teal-600',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl'
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="mr-2 animate-spin">⏳</span>
          Processing...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;