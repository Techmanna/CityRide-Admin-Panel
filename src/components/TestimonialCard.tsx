import React from 'react';
import { Star } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

interface TestimonialCardProps {
  name: string;
  rating: number;
  text: string;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, rating, text, index }) => {
  return (
    <AnimatedCard 
      delay={index * 0.2} 
      className="bg-white p-6 rounded-xl shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 -mt-10 -mr-10 rounded-full bg-primary-100 opacity-50" />
      
      <div className="flex text-yellow-400 mb-4 relative z-10">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={20} fill="currentColor" />
        ))}
      </div>
      
      <p className="text-gray-600 mb-4 relative z-10">{text}</p>
      
      <div className="flex items-center relative z-10">
        <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
          {name.split(' ').map(word => word[0]).join('')}
        </div>
        <p className="font-semibold ml-3">{name}</p>
      </div>
    </AnimatedCard>
  );
};

export default TestimonialCard;