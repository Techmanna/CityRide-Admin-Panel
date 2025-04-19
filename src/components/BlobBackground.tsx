import React from 'react';
import { motion } from 'framer-motion';

interface BlobBackgroundProps {
  className?: string;
}

const BlobBackground: React.FC<BlobBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] blob from-primary-300 to-primary-500"
        animate={{
          x: [0, 30, -10, 0],
          y: [0, -30, 10, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute top-[30%] left-[-5%] w-[30%] h-[30%] blob from-secondary-300 to-secondary-500"
        animate={{
          x: [0, -20, 20, 0],
          y: [0, 20, -20, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute bottom-[-10%] right-[20%] w-[35%] h-[35%] blob from-accent-300 to-accent-500"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -10, 10, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
};

export default BlobBackground;