import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.6 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: duration, 
        delay: delay,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;