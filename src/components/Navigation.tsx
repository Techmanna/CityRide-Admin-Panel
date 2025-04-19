import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuVariants = {
    open: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } 
    },
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };

  const menuItemVariants = {
    open: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
    closed: { 
      y: 20, 
      opacity: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <a href="#" className={`text-2xl font-bold ${scrolled ? 'text-primary-800' : 'text-white'}`}>
              City<span className="text-accent-500">Ride</span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center space-x-8"
          >
            {['Home', 'About', 'Services', 'Testimonials', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`${
                  scrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-accent-300'
                } font-medium transition-colors`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
            <motion.button 
              className={`${
                scrolled ? 'bg-primary-600 text-white' : 'bg-white text-primary-800'
              } px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
          </motion.div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled ? 'text-gray-800' : 'text-white'} focus:outline-none`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          variants={menuVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
        >
          <div className="flex flex-col space-y-4 py-4">
            {['Home', 'About', 'Services', 'Testimonials', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`${
                  scrolled ? 'text-gray-800' : 'text-white'
                } font-medium px-4 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-600`}
                variants={menuItemVariants}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </motion.a>
            ))}
            <motion.button 
              className={`${
                scrolled ? 'bg-primary-600 text-white' : 'bg-white text-primary-800'
              } px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 mx-4`}
              variants={menuItemVariants}
            >
              Book Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;