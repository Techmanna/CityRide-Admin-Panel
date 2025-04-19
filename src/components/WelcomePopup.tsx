import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/web';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';

function Character() {
  const groupRef = useRef();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.01);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={groupRef} rotation-y={rotation}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial color="#4F46E5" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.7, 1, 2, 32]} />
        <meshPhongMaterial color="#4F46E5" />
      </mesh>
      
      {/* Arms */}
      <group position={[0, -1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh position={[1.5, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 2, 32]} />
          <meshPhongMaterial color="#4F46E5" />
        </mesh>
      </group>
      
      {/* Thumbs up */}
      <group position={[1.8, -1.2, 0]}>
        <mesh>
          <boxGeometry args={[0.4, 0.8, 0.3]} />
          <meshPhongMaterial color="#FFD700" />
        </mesh>
      </group>
    </group>
  );
}

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  const springs = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.8)',
    config: config.gentle
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <animated.div
            style={springs}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="h-64 mb-6 flex items-center justify-center overflow-hidden relative">
  <motion.img
    src="/images/image4.png" 
    alt="Animated"
    className="w-42 h-42"
    animate={{ x: [ -200, 200, -200 ] }}
    transition={{
      duration: 6,
      repeat: Infinity,
    }}
  />
</div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to City Ride!
              </h2>
              <p className="text-gray-600 mb-6">
                We're excited to have you here. Get ready for a fantastic journey with us!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors"
                onClick={onClose}
              >
                Let's Get Started
              </motion.button>
            </motion.div>
          </animated.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;