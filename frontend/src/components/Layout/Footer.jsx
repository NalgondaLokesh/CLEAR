import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="gradient-primary text-white mt-12"
    >
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🌤️ CLEAR</h3>
            <p className="text-gray-300 text-sm">
              AI-Powered Satellite Image Enhancement for a Cloud-Free Future
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/documentation" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'FastAPI', 'PyTorch', 'Tailwind CSS'].map((tech) => (
                <span key={tech} className="badge bg-white bg-opacity-20 text-white">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>Built with ❤️ using React & FastAPI | © 2026 CLEAR Project</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;