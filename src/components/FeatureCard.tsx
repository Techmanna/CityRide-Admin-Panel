import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from './AnimatedCard';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  return (
    <AnimatedCard 
      delay={index * 0.2} 
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <motion.div 
        className="text-primary-600 mb-4 flex justify-center"
        whileHover={{ 
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 }
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </AnimatedCard>
  );
};

export default FeatureCard;