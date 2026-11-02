import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-3xl"
            >
              🌤️
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CLEAR</h1>
              <p className="text-xs text-gray-600">Cloud-Less Earth Observation</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
              { name: 'Documentation', path: '/documentation' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-sm"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;