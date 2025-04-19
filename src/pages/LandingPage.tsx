import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Shield, Star, ChevronDown, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

import Navigation from '../components/Navigation';
import BlobBackground from '../components/BlobBackground';
import ParticlesBackground from '../components/ParticlesBackground';
import WaveDivider from '../components/WaveDivider';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import WelcomePopup from '../components/WelcomePopup';

function LandingPage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  // FAQ data
  const faqData = [
    { 
      question: 'How do I book a ride?', 
      answer: 'Simply open our app, enter your destination, and confirm your pickup location. Our nearest driver will be assigned to you within minutes.' 
    },
    { 
      question: 'What payment methods are accepted?', 
      answer: 'We accept cash, credit/debit cards, and mobile payments including popular e-wallets for your convenience.' 
    },
    { 
      question: 'Is the service available 24/7?', 
      answer: 'Yes, our service operates 24 hours a day, 7 days a week, including holidays to ensure you can get a ride whenever you need one.' 
    },
    { 
      question: 'How are your drivers vetted?', 
      answer: 'All drivers undergo thorough background checks, regular training, and must maintain high customer ratings to continue working with us.' 
    },
    { 
      question: 'Can I schedule a ride in advance?', 
      answer: 'Yes, you can schedule rides up to 7 days in advance through our app or website for planned trips.' 
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <WelcomePopup isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <Navigation />
      
      {/* Hero Section */}
      <section 
        id="home"
        className="relative min-h-screen bg-gradient-to-r from-primary-800 to-secondary-800 text-white"
      >
        <ParticlesBackground id="hero-particles" />
        
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/2526128/pexels-photo-2526128.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="City Ride Hero"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <BlobBackground className="z-0" />
        
        <div className="relative container mx-auto px-4 min-h-screen flex items-center z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                #1 Tricycle Service
              </motion.span>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="block"
                >
                  Your Reliable Ride
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block text-accent-400"
                >
                  Through the City
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-xl mb-8 text-gray-100 max-w-lg" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Experience comfortable and affordable transportation with City Ride's tricycle service. Quick, convenient, and eco-friendly.
              </motion.p>
              
              <div className="flex flex-wrap gap-4">
                <motion.button 
                  className="btn-primary bg-accent-500 hover:bg-accent-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book a Ride
                </motion.button>
                
                <motion.button 
                  className="btn-secondary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden md:block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-3xl transform rotate-6 scale-105" />
              <img 
                src="/images/image1.png"
                alt="Nigerian Tricycle"
                className="rounded-3xl shadow-2xl relative z-10"
                loading="lazy"
              />
              
              <motion.div 
                className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg z-20 flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="bg-green-50 p-2 rounded-full">
                  <Shield size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">Safe & Secure</p>
                  <p className="text-gray-500 text-sm">Verified drivers</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <ChevronDown size={32} />
        </motion.div>
        
        <WaveDivider position="bottom" fill="fill-white" />
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
        <BlobBackground className="opacity-[0.03] z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="section-title text-primary-800 relative inline-block"
              {...fadeInUp}
            >
              About City Ride
              <motion.div 
                className="absolute -bottom-2 left-1/2 h-1 bg-accent-500 rounded-full transform -translate-x-1/2"
                initial={{ width: 0 }}
                whileInView={{ width: '50%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h2>
            <motion.p 
              className="text-gray-600 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We're revolutionizing urban transportation with modern, efficient solutions.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-gradient-to-tr from-primary-100 to-secondary-100 absolute inset-0 rounded-2xl transform -rotate-3 scale-105" />
              <img 
                src="/images/image4.png"
                alt="About City Ride"
                className="rounded-2xl shadow-xl relative z-10"
                loading="lazy"
              />
              
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white p-5 rounded-lg shadow-lg flex items-center gap-4 z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary-600">5+</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-3xl font-semibold mb-4 text-gray-800">Your Trusted Transportation Partner</h3>
              <p className="text-gray-600 mb-6">
                City Ride revolutionizes urban transportation with our fleet of modern tricycles, 
                providing safe, affordable, and efficient rides across the city. With a focus on customer 
                satisfaction and environmental sustainability, we're committed to transforming your 
                daily commute.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <motion.h4 
                    className="font-bold text-3xl text-primary-600 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    1000+
                  </motion.h4>
                  <p className="text-gray-600">Daily Rides</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <motion.h4 
                    className="font-bold text-3xl text-primary-600 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    500+
                  </motion.h4>
                  <p className="text-gray-600">Verified Drivers</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <motion.h4 
                    className="font-bold text-3xl text-primary-600 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    20+
                  </motion.h4>
                  <p className="text-gray-600">City Coverage</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <motion.h4 
                    className="font-bold text-3xl text-primary-600 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    4.8
                  </motion.h4>
                  <p className="text-gray-600">Customer Rating</p>
                </div>
              </div>
              
              <motion.button 
                className="btn-primary bg-primary-600 hover:bg-primary-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn Our Story
              </motion.button>
            </motion.div>
          </div>
        </div>
        
        <WaveDivider position="bottom" fill="fill-gray-50" />
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 bg-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 z-0" />
        <BlobBackground className="opacity-[0.03] z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="section-title text-primary-800 relative inline-block"
              {...fadeInUp}
            >
              Why Choose City Ride?
              <motion.div 
                className="absolute -bottom-2 left-1/2 h-1 bg-accent-500 rounded-full transform -translate-x-1/2"
                initial={{ width: 0 }}
                whileInView={{ width: '50%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h2>
            <motion.p 
              className="text-gray-600 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Experience the advantages that make us the preferred transportation choice.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin size={36} />, title: 'Convenient Pickup', description: 'Get picked up from your location within minutes, no matter where you are in the city.' },
              { icon: <Clock size={36} />, title: 'Time-Saving', description: 'Navigate through traffic efficiently with our experienced drivers who know the best routes.' },
              { icon: <Shield size={36} />, title: 'Safe & Secure', description: 'Travel with peace of mind with our vetted drivers and secure payment options.' },
            ].map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
          
          <motion.div 
            className="mt-16 bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full -mt-10 -mr-10 opacity-50" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-100 rounded-full -mb-10 -ml-10 opacity-50" />
            
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Download Our Mobile App</h3>
                <p className="text-gray-600 mb-6">
                  Get the full City Ride experience with our mobile app. Easy booking, real-time tracking, and exclusive promotions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5227 7.39595C17.0337 7.39595 16.5457 7.53395 16.1247 7.81195C15.7037 8.08995 15.3647 8.48295 15.1507 8.94595C14.9347 9.40895 14.8527 9.92195 14.9057 10.427C14.9597 10.931 15.1457 11.411 15.4457 11.812C15.7437 12.213 16.1457 12.518 16.6077 12.7C17.0697 12.882 17.5747 12.935 18.0647 12.852C18.5547 12.77 19.0097 12.555 19.3747 12.233C19.7397 11.91 20.0016 11.493 20.1327 11.031H20.1317C20.3137 10.4 20.3117 9.72595 20.1237 9.09595C19.9357 8.46695 19.5717 7.90995 19.0797 7.49295C18.5867 7.07495 17.9847 6.81595 17.3577 6.75095C17.4127 6.95495 17.5117 7.14495 17.6487 7.30695C17.7857 7.46995 17.9557 7.60195 18.1477 7.69495C18.3397 7.78795 18.5497 7.83895 18.7617 7.84595C18.6247 8.00995 18.4357 8.13095 18.2217 8.18995C18.0067 8.24995 17.7797 8.24295 17.5697 8.17195C17.3597 8.10095 17.1757 7.96895 17.0447 7.79395C16.9137 7.61795 16.8417 7.40695 16.8377 7.18995C16.5737 7.24195 16.3217 7.34295 16.0927 7.48695C15.8647 7.63095 15.6637 7.81595 15.5007 8.03295C15.3387 8.24995 15.2177 8.49595 15.1447 8.75795C15.0717 9.01995 15.0457 9.29395 15.0697 9.56595C15.2607 9.55995 15.4467 9.61495 15.6057 9.72395C15.7647 9.83295 15.8897 9.98895 15.9647 10.171C16.0407 10.353 16.0647 10.552 16.0337 10.746C16.0037 10.94 15.9197 11.122 15.7927 11.268C15.8937 11.581 16.0797 11.86 16.3287 12.079C16.5777 12.297 16.8817 12.448 17.2097 12.517C16.9167 12.222 16.7407 11.84 16.7097 11.437C16.6787 11.034 16.7947 10.635 17.0387 10.308C17.2837 9.98095 17.6377 9.74895 18.0327 9.65095C18.4277 9.55395 18.8417 9.59795 19.2057 9.77595C19.1917 9.38995 19.0457 9.01995 18.7947 8.72895C18.5447 8.43895 18.2057 8.24695 17.8347 8.17995C17.9167 8.77195 17.5807 9.33795 17.0207 9.48695C16.9217 9.51195 16.8197 9.52695 16.7177 9.52995C16.4617 9.52995 16.2127 9.44895 16.0047 9.30095C15.7967 9.15295 15.6407 8.94495 15.5567 8.70695C15.4717 8.46895 15.4637 8.21095 15.5327 7.96795C15.6017 7.72495 15.7447 7.50795 15.9427 7.34795C15.7027 7.37995 15.4747 7.46795 15.2767 7.60595C15.0787 7.74295 14.9167 7.92795 14.8027 8.14295C14.6887 8.35695 14.6257 8.59695 14.6207 8.84195C14.6147 9.08695 14.6667 9.33095 14.7717 9.55095C14.5117 9.05095 14.4387 8.47095 14.5697 7.91995C14.7007 7.36795 15.0257 6.89095 15.4767 6.58695C15.9277 6.28295 16.4737 6.17095 17.0097 6.27195C17.5447 6.37295 18.0317 6.67795 18.3707 7.12495H18.3717C18.6167 7.44695 18.7807 7.82895 18.8487 8.23495C18.9177 8.64095 18.8877 9.05695 18.7617 9.44995C18.6357 9.84395 18.4167 10.201 18.1237 10.493C17.8297 10.785 17.4697 11.006 17.0747 11.137C17.2477 11.467 17.5217 11.73 17.8587 11.889C18.1947 12.049 18.5757 12.096 18.9407 12.024C19.3057 11.952 19.6327 11.763 19.8737 11.487C20.1147 11.211 20.2587 10.863 20.2847 10.496C20.3137 10.087 20.2337 9.67695 20.0527 9.31095C19.8727 8.94495 19.5977 8.63295 19.2587 8.40995C19.5367 8.46995 19.7967 8.59095 20.0227 8.76295C20.2497 8.93495 20.4357 9.15595 20.5697 9.41095C20.7037 9.66595 20.7817 9.94895 20.7997 10.237C20.8167 10.527 20.7737 10.817 20.6717 11.089C20.5697 11.36 20.4127 11.608 20.2097 11.816C20.0077 12.023 19.7647 12.183 19.4977 12.288C19.2297 12.394 18.9427 12.443 18.6547 12.431C18.3667 12.42 18.0847 12.349 17.8267 12.222C17.5437 12.518 17.1797 12.73 16.7787 12.838C16.3777 12.945 15.9567 12.942 15.5577 12.83C15.1597 12.719 14.7987 12.503 14.5197 12.204C14.2407 11.905 14.0547 11.535 13.9827 11.139C13.9117 10.743 13.9577 10.336 14.1157 9.96495C14.2737 9.59395 14.5377 9.27395 14.8787 9.03995C15.2197 8.80595 15.6237 8.66795 16.0397 8.64095C16.4567 8.61395 16.8737 8.69895 17.2437 8.88695C17.3087 8.64195 17.4337 8.41895 17.6057 8.23795C17.7787 8.05695 17.9947 7.92295 18.2337 7.84795C18.4737 7.77295 18.7287 7.75995 18.9747 7.80795C19.2217 7.85595 19.4517 7.96495 19.6447 8.12495C19.8377 8.28495 19.9877 8.49195 20.0827 8.72695C20.1777 8.96095 20.2137 9.21595 20.1887 9.46795C20.1647 9.71995 20.0797 9.96295 19.9397 10.177C19.8007 10.392 19.6117 10.57 19.3867 10.698C19.1617 10.826 18.9077 10.9 18.6487 10.913C18.3897 10.926 18.1307 10.878 17.8957 10.772C17.6607 10.667 17.4577 10.509 17.3007 10.307C17.1437 10.105 17.0387 9.87095 16.9937 9.62295C16.9487 9.37595 16.9657 9.12195 17.0427 8.88395C17.1307 8.60895 17.3047 8.37095 17.5417 8.20695C17.7787 8.04295 18.0647 7.96295 18.3537 7.97895C18.3057 7.78795 18.1897 7.62095 18.0317 7.50595C17.8727 7.39095 17.6797 7.33495 17.4857 7.34595C17.2947 7.35795 17.1107 7.43695 16.9667 7.56995C16.8227 7.70295 16.7257 7.88295 16.6897 8.07995C16.6547 8.27595 16.6817 8.47995 16.7687 8.65995C16.8557 8.84095 16.9967 8.98895 17.1747 9.08495C17.1707 9.33595 17.2407 9.58095 17.3757 9.78395C17.5097 9.98695 17.7017 10.143 17.9277 10.237C18.1547 10.33 18.4047 10.357 18.6487 10.313C18.8927 10.269 19.1187 10.156 19.2997 9.98895C19.4797 9.82095 19.6067 9.60595 19.6667 9.36895C19.7267 9.13095 19.7177 8.88095 19.6377 8.64795C19.5577 8.41595 19.4127 8.21195 19.2187 8.05995C19.0247 7.90795 18.7897 7.81295 18.5437 7.78595C18.2977 7.75995 18.0487 7.80195 17.8207 7.90795C17.5927 8.01395 17.3947 8.17995 17.2467 8.38595C17.0997 8.59095 17.0077 8.83095 16.9797 9.08495C16.9487 9.37995 16.9897 9.67895 17.0977 9.95195C17.2057 10.226 17.3787 10.467 17.5987 10.659C17.8187 10.851 18.0797 10.986 18.3617 11.055C18.6437 11.124 18.9367 11.124 19.2177 11.056C19.4997 10.988 19.7597 10.854 19.9797 10.663C20.1997 10.472 20.3737 10.232 20.4817 9.95795C20.5887 9.68395 20.6307 9.38595 20.5987 9.09195C20.5677 8.79795 20.4647 8.51395 20.3007 8.26195C20.1357 8.00995 19.9137 7.79795 19.6527 7.64195C19.3927 7.48495 19.1007 7.38795 18.7997 7.35695C18.4997 7.32595 18.1957 7.36195 17.9097 7.46295C17.6237 7.56395 17.3637 7.72695 17.1527 7.93895C16.9417 8.14995 16.7857 8.40495 16.7007 8.68595C16.6147 8.96695 16.6007 9.26695 16.6587 9.55495C16.7177 9.84395 16.8487 10.112 17.0407 10.338C17.2337 10.566 17.4827 10.744 17.7647 10.863C18.0477 10.983 18.3547 11.041 18.6617 11.03C18.9687 11.02 19.2707 10.942 19.5427 10.805C19.8147 10.667 20.0477 10.474 20.2267 10.236C20.4057 9.99895 20.5267 9.72295 20.5797 9.43095C20.6327 9.13895 20.6157 8.83995 20.5317 8.55495C20.4467 8.26895 20.2977 8.00995 20.0957 7.79495C19.8947 7.57995 19.6457 7.41795 19.3707 7.32495C19.0957 7.23195 18.8027 7.20995 18.5177 7.25895C18.2317 7.30795 17.9617 7.42695 17.7317 7.60495C17.5017 7.78295 17.3177 8.01295 17.1957 8.27695C17.0737 8.53995 17.0177 8.82895 17.0317 9.11795C17.0467 9.40695 17.1327 9.68995 17.2827 9.94095C17.4327 10.192 17.6437 10.406 17.8977 10.565C18.1517 10.723 18.4407 10.822 18.7397 10.853C19.0387 10.884 19.3417 10.848 19.6257 10.745C19.9097 10.643 20.1667 10.479 20.3767 10.264C20.3067 10.538 20.1677 10.791 19.9727 11.001C19.7767 11.211 19.5307 11.372 19.2587 11.47C18.9867 11.568 18.6957 11.6 18.4087 11.565C18.1207 11.529 17.8467 11.426 17.6097 11.266C17.3737 11.106 17.1807 10.892 17.0477 10.645C16.9147 10.398 16.8457 10.122 16.8457 9.84295C16.8457 9.56295 16.9147 9.28795 17.0477 9.04095C17.1807 8.79295 17.3747 8.58095 17.6097 8.42095C17.8457 8.26095 18.1197 8.15795 18.4077 8.12195C18.6947 8.08595 18.9867 8.11795 19.2587 8.21595C19.5307 8.31395 19.7767 8.47495 19.9727 8.68495C20.1677 8.89395 20.3077 9.14695 20.3767 9.42195C20.4457 9.69595 20.4427 9.98295 20.3657 10.255C20.2897 10.528 20.1427 10.778 19.9427 10.981C19.7417 11.185 19.4927 11.338 19.2187 11.429C18.9447 11.52 18.6537 11.546 18.3677 11.505C18.0827 11.466 17.8097 11.36 17.5717 11.198C17.3347 11.036 17.1397 10.821 17.0027 10.573C16.8657 10.325 16.7907 10.048 16.7837 9.76795C16.7767 9.48695 16.8377 9.20695 16.9627 8.95295C17.0877 8.69895 17.2717 8.47795 17.5007 8.30695C17.7297 8.13595 17.9987 8.01895 18.2827 7.96595C18.5667 7.91195 18.8587 7.92495 19.1347 7.99995C19.4097 8.07495 19.6627 8.21195 19.8727 8.39795C20.0827 8.58295 20.2417 8.81495 20.3397 9.07295C20.4367 9.33095 20.4687 9.60895 20.4337 9.88295C20.3987 10.156 20.2967 10.418 20.1387 10.649C19.9797 10.879 19.7677 11.069 19.5217 11.204C19.2747 11.339 18.9997 11.416 18.7207 11.428C18.4427 11.44 18.1607 11.388 17.9047 11.275C17.6497 11.162 17.4267 10.989 17.2567 10.774C17.0867 10.558 16.9737 10.305 16.9277 10.035C16.8817 9.76595 16.9047 9.49095 16.9947 9.23295C17.0847 8.97495 17.2387 8.74295 17.4457 8.55595C17.6527 8.36895 17.8977 8.22895 18.1667 8.14995C18.4347 8.06995 18.7197 8.05295 18.9947 8.09995C19.2697 8.14695 19.5287 8.25695 19.7527 8.42095C19.9767 8.58495 20.1617 8.79895 20.2927 9.04695C20.5117 9.52495 20.5017 10.069 20.2717 10.537C20.0417 11.005 19.6157 11.35 19.1057 11.47C18.9767 11.501 18.8457 11.519 18.7137 11.525C18.5817 11.531 18.4487 11.525 18.3177 11.506C18.0577 11.465 17.8107 11.37 17.5937 11.228C17.3757 11.087 17.1937 10.902 17.0597 10.687C16.9267 10.473 16.8447 10.232 16.8217 9.98295C16.7977 9.73395 16.8337 9.48295 16.9247 9.24695C17.0157 9.01095 17.1617 8.79795 17.3517 8.62195C17.5427 8.44595 17.7747 8.31095 18.0277 8.22695C18.2807 8.14295 18.5497 8.11195 18.8137 8.13695C19.0787 8.16095 19.3347 8.23995 19.5617 8.36695C19.7887 8.49395 19.9807 8.66695 20.1257 8.87195C20.2707 9.07695 20.3637 9.31195 20.4007 9.55795C20.4367 9.80395 20.4137 10.055 20.3337 10.291C20.2537 10.528 20.1177 10.743 19.9367 10.925C19.7567 11.107 19.5357 11.253 19.2897 11.35C19.0457 11.447 18.7817 11.494 18.5167 11.489C18.2517 11.484 17.9897 11.426 17.7507 11.319C17.5097 11.213 17.2957 11.059 17.1237 10.867C16.9517 10.677 16.8267 10.453 16.7587 10.212C16.6907 9.97095 16.6807 9.71895 16.7287 9.47295C16.7767 9.22795 16.8807 8.99695 17.0347 8.79795C17.1907 8.59995 17.3937 8.43795 17.6277 8.32495C17.8617 8.21295 18.1217 8.14995 18.3847 8.14095C18.6477 8.13195 18.9107 8.17595 19.1537 8.27195C19.3957 8.36695 19.6107 8.51195 19.7847 8.69695C19.9587 8.88195 20.0857 9.10495 20.1567 9.34795C20.2277 9.59095 20.2397 9.84795 20.1927 10.097C20.1457 10.347 20.0407 10.582 19.8847 10.791C19.7297 10.999 19.5277 11.174 19.2947 11.302C19.0617 11.43 18.8027 11.507 18.5387 11.53C18.2757 11.552 18.0097 11.519 17.7587 11.434C17.5087 11.349 17.2767 11.214 17.0797 11.035C16.8827 10.856 16.7247 10.638 16.6167 10.396C16.5087 10.154 16.4537 9.89195 16.4557 9.62795C16.4577 9.36395 16.5167 9.10195 16.6297 8.86095C16.7417 8.61995 16.9037 8.40595 17.1047 8.23195C17.3057 8.05795 17.5397 7.92695 17.7937 7.85195C18.0467 7.77695 18.3157 7.75895 18.5777 7.79995C18.8397 7.83995 19.0887 7.93695 19.3067 8.08395C19.5247 8.23095 19.7057 8.42395 19.8397 8.64995C19.9727 8.87595 20.0537 9.12895 20.0767 9.39095C20.0997 9.65295 20.0647 9.91695 19.9777 10.165C19.8897 10.414 19.7457 10.64 19.5527 10.825C19.3607 11.01 19.1267 11.151 18.8687 11.237C18.6097 11.324 18.3357 11.355 18.0657 11.326C17.7977 11.298 17.5377 11.212 17.3057 11.075C17.0747 10.937 16.8757 10.752 16.7257 10.532C16.5747 10.312 16.4757 10.066 16.4347 9.80595C16.3937 9.54595 16.4107 9.28095 16.4837 9.02895C16.5577 8.77695 16.6857 8.54495 16.8597 8.34795C17.0327 8.14995 17.2487 7.99395 17.4897 7.88995C17.7317 7.78595 17.9927 7.73595 18.2557 7.74395C18.5177 7.75195 18.7747 7.81795 19.0087 7.93695C19.2427 8.05595 19.4477 8.22595 19.6067 8.43295C19.7657 8.63995 19.8757 8.87995 19.9287 9.13295C19.9817 9.38595 19.9767 9.64795 19.9127 9.89995C19.8497 10.152 19.7297 10.386 19.5617 10.587C19.3937 10.787 19.1827 10.948 18.9447 11.057C18.7067 11.166 18.4477 11.222 18.1867 11.219C17.9257 11.217 17.6687 11.156 17.4327 11.043C17.1977 10.93 16.9897 10.767 16.8247 10.564C16.6607 10.361 16.5447 10.123 16.4867 9.86895C16.4297 9.61495 16.4317 9.35195 16.4937 9.09995C16.5557 8.84695 16.6767 8.61195 16.8447 8.41195C17.0127 8.21195 17.2237 8.05395 17.4627 7.94695C17.7017 7.83995 17.9617 7.78595 18.2247 7.79095C18.4877 7.79695 18.7447 7.86095 18.9787 7.97995C19.2127 8.09895 19.4167 8.26795 19.5757 8.47495C19.7347 8.68195 19.8457 8.92495 19.8977 9.18095C19.9497 9.43795 19.9427 9.70395 19.8747 9.95695C19.8077 10.209 19.6837 10.444 19.5107 10.642C19.3377 10.84 19.1217 10.998 18.8797 11.104C18.6367 11.21 18.3737 11.262 18.1097 11.255C17.8457 11.249 17.5857 11.184 17.3477 11.069C17.1107 10.954 16.9007 10.79 16.7357 10.584C16.5707 10.38 16.4557 10.139 16.3997 9.88295C16.3427 9.62695 16.3457 9.36195 16.4077 9.10795C16.4707 8.85395 16.5917 8.62095 16.7597 8.42295C16.9277 8.22595 17.1397 8.06995 17.3797 7.96595C17.6197 7.86195 17.8797 7.81195 18.1417 7.82095C18.4047 7.82995 18.6607 7.89695 18.8937 8.01995C19.1257 8.14195 19.3277 8.31395 19.4837 8.52295C19.6387 8.73095 19.7467 8.97495 19.7927 9.23095C19.8387 9.48695 19.8237 9.75095 19.7497 10.0C19.6747 10.25 19.5427 10.48 19.3647 10.673C19.1867 10.865 18.9667 11.016 18.7217 11.115C18.4757 11.215 18.2097 11.258 18.9457 11.245" fill="currentColor"/>
                    </svg>
                    App Store
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 20.9999V2.99988C3 2.73466 3.10536 2.48031 3.29289 2.29277C3.48043 2.10523 3.73478 1.99988 4 1.99988H20C20.2652 1.99988 20.5196 2.10523 20.7071 2.29277C20.8946 2.48031 21 2.73466 21 2.99988V20.9999C21 21.2651 20.8946 21.5194 20.7071 21.707C20.5196 21.8945 20.2652 21.9999 20 21.9999H4C3.73478 21.9999 3.48043 21.8945 3.29289 21.707C3.10536 21.5194 3 21.2651 3 20.9999Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.5 6.99988L8.5 11.9999L12.5 16.9999" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 6.99988L11 11.9999L15 16.9999" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Google Play
                  </button>
                </div>
              </div>
              <div>
                <img 
                  src="/images/image3.png"
                  alt="Mobile App" 
                  className="rounded-xl shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
        
        <WaveDivider position="bottom" fill="fill-white" />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white relative">
        <BlobBackground className="opacity-[0.03] z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="section-title text-primary-800 relative inline-block"
              {...fadeInUp}
            >
              What Our Customers Say
              <motion.div 
                className="absolute -bottom-2 left-1/2 h-1 bg-accent-500 rounded-full transform -translate-x-1/2"
                initial={{ width: 0 }}
                whileInView={{ width: '50%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h2>
            <motion.p 
              className="text-gray-600 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hear from our happy customers about their experience with City Ride.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'John Doe', rating: 5, text: 'Best tricycle service in the city! Always on time and professional. The drivers are courteous and know the best routes to avoid traffic.' },
              { name: 'Jane Smith', rating: 5, text: 'Affordable and convenient way to travel around the city. The mobile app makes booking rides incredibly easy and the fare estimates are accurate.' },
              { name: 'Mike Johnson', rating: 5, text: 'Reliable service with friendly drivers. I use City Ride daily for my commute to work and have never been disappointed. Highly recommended!' },
            ].map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                name={testimonial.name}
                rating={testimonial.rating}
                text={testimonial.text}
                index={index}
              />
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button className="btn-primary bg-primary-600 hover:bg-primary-700">
              View All Reviews
            </button>
          </motion.div>
        </div>
        
        <WaveDivider position="bottom" fill="fill-gray-50" />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 z-0" />
        <BlobBackground className="opacity-[0.03] z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="section-title text-primary-800 relative inline-block"
              {...fadeInUp}
            >
              Frequently Asked Questions
              <motion.div 
                className="absolute -bottom-2 left-1/2 h-1 bg-accent-500 rounded-full transform -translate-x-1/2"
                initial={{ width: 0 }}
                whileInView={{ width: '50%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h2>
            <motion.p 
              className="text-gray-600 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Find answers to commonly asked questions about our services.
            </motion.p>
          </div>
          
          <FAQ faqs={faqData} />
        </div>
        
        <WaveDivider position="bottom" fill="fill-white" />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white relative">
        <BlobBackground className="opacity-[0.03] z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="section-title text-primary-800 relative inline-block"
              {...fadeInUp}
            >
              Get in Touch
              <motion.div 
                className="absolute -bottom-2 left-1/2 h-1 bg-accent-500 rounded-full transform -translate-x-1/2"
                initial={{ width: 0 }}
                whileInView={{ width: '50%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h2>
            <motion.p 
              className="text-gray-600 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Have questions or feedback? We'd love to hear from you.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gray-50 p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Phone className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">+1 234 567 890</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Mail className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">contact@cityride.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="bg-primary-100 p-3 rounded-full cursor-pointer"
                  >
                    <Facebook className="text-primary-600" size={20} />
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="bg-primary-100 p-3 rounded-full cursor-pointer"
                  >
                    <Twitter className="text-primary-600" size={20} />
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="bg-primary-100 p-3 rounded-full cursor-pointer"
                  >
                    <Instagram className="text-primary-600" size={20} />
                  </motion.div>
                </div>
              </div>
              
              <div className="mt-10">
                <h4 className="text-xl font-semibold mb-4">Office Hours</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monday - Friday:</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Saturday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sunday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative">
        <ParticlesBackground id="footer-particles" className="opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <motion.h3 
                className="text-2xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                City<span className="text-accent-500">Ride</span>
              </motion.h3>
              <p className="text-gray-400 mb-6">Your trusted partner for city transportation since 2020. Providing safe, affordable, and eco-friendly rides.</p>
              <div className="flex space-x-4">
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="bg-gray-800 p-2 rounded-full cursor-pointer"
                >
                  <Facebook className="text-gray-400" size={18} />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="bg-gray-800 p-2 rounded-full cursor-pointer"
                >
                  <Twitter className="text-gray-400" size={18} />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="bg-gray-800 p-2 rounded-full cursor-pointer"
                >
                  <Instagram className="text-gray-400" size={18} />
                </motion.div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'About', 'Services', 'Testimonials', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link to={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Privacy Policy', path: '/privacy' },
                  { name: 'Terms of Service', path: '/terms' },
                  { name: 'Cookie Policy', path: '/cookies' },
                  { name: 'Safety Guidelines', path: '/safety' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Download App</h4>
              <div className="space-y-4">
                <motion.button 
                  className="bg-white text-black px-6 py-3 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5227 7.39595C17.0337 7.39595 16.5457 7.53395 16.1247 7.81195C15.7037 8.08995 15.3647 8.48295 15.1507 8.94595C14.9347 9.40895 14.8527 9.92195 14.9057 10.427C14.9597 10.931 15.1457 11.411 15.4457 11.812C15.7437 12.213 16.1457 12.518 16.6077 12.7C17.0697 12.882 17.5747 12.935 18.0647 12.852C18.5547 12.77 19.0097 12.555 19.3747 12.233C19.7397 11.91 20.0016 11.493 20.1327 11.031H20.1317C20.3137 10.4 20.3117 9.72595 20.1237 9.09595C19.9357 8.46695 19.5717 7.90995 19.0797 7.49295C18.5867 7.07495 17.9847 6.81595 17.3577 6.75095C17.4127 6.95495 17.5117 7.14495 17.6487 7.30695C17.7857 7.46995 17.9557 7.60195 18.1477 7.69495C18.3397 7.78795 18.5497 7.83895 18.7617 7.84595C18.6247 8.00995 18.4357 8.13095 18.2217 8.18995C18.0067 8.24995 17.7797 8.24295 17.5697 8.17195C17.3597 8.10095 17.1757 7.96895 17.0447 7.79395C16.9137 7.61795 16.8417 7.40695 16.8377 7.18995C16.5737 7.24195 16.3217 7.34295 16.0927 7.48695C15.8647 7.63095 15.6637 7.81595 15.5007 8.03295C15.3387 8.24995 15.2177 8.49595 15.1447 8.75795C15.0717 9.01995 15.0457 9.29395 15.0697 9.56595C15.2607 9.55995 15.4467 9.61495 15.6057 9.72395C15.7647 9.83295 15.8897 9.98895 15.9647 10.171C16.0407 10.353 16.0647 10.552 16.0337 10.746C16.0037 10.94 15.9197 11.122 15.7927 11.268C15.8937 11.581 16.0797 11.86 16.3287 12.079C16.5777 12.297 16.8817 12.448 17.2097 12.517C16.9167 12.222 16.7407 11.84 16.7097 11.437C16.6787 11.034 16.7947 10.635 17.0387 10.308C17.2837 9.98095 17.6377 9.74895 18.0327 9.65095C18.4277 9.55395 18.8417 9.59795 19.2057 9.77595C19.1917 9.38995 19.0457 9.01995 18.7947 8.72895C18.5447 8.43895 18.2057 8.24695 17.8347 8.17995C17.9167 8.77195 17.5807 9.33795 17.0207 9.48695C16.9217 9.51195 16.8197 9.52695 16.7177 9.52995C16.4617 9.52995 16.2127 9.44895 16.0047 9.30095C15.7967 9.15295 15.6407 8.94495 15.5567 8.70695C15.4717 8.46895 15.4637 8.21095 15.5327 7.96795C15.6017 7.72495 15.7447 7.50795 15.9427 7.34795C15.7027 7.37995 15.4747 7.46795 15.2767 7.60595C15.0787 7.74295 14.9167 7.92795 14.8027 8.14295C14.6887 8.35695 14.6257 8.59695 14.6207 8.84195C14.6147 9.08695 14.6667 9.33095 14.7717 9.55095C14.5117 9.05095 14.4387 8.47095 14.5697 7.91995C14.7007 7.36795 15.0257 6.89095 15.4767 6.58695C15.9277 6.28295 16.4737 6.17095 17.0097 6.27195C17.5447 6.37295 18.0317 6.67795 18.3707 7.12495H18.3717C18.6167 7.44695 18.7807 7.82895 18.8487 8.23495C18.9177 8.64095 18.8877 9.05695 18.7617 9.44995C18.6357 9.84395 18.4167 10.201 18.1237 10.493C17.8297 10.785 17.4697 11.006 17.0747 11.137C17.2477 11.467 17.5217 11.73 17.8587 11.889C18.1947 12.049 18.5757 12.096 18.9407 12.024C19.3057 11.952 19.6327 11.763 19.8737 11.487C20.1147 11.211 20.2587 10.863 20.2847 10.496C20.3137 10.087 20.2337 9.67695 20.0527 9.31095C19.8727 8.94495 19.5977 8.63295 19.2587 8.40995C19.5367 8.46995 19.7967 8.59095 20.0227 8.76295C20.2497 8.93495 20.4357 9.15595 20.5697 9.41095C20.7037 9.66595 20.7817 9.94895 20.7997 10.237C20.8167 10.527 20.7737 10.817 20.6717 11.089C20.5697 11.36 20.4127 11.608 20.2097 11.816C20.0077 12.023 19.7647 12.183 19.4977 12.288C19.2297 12.394 18.9427 12.443 18.6547 12.431C18.3667 12.42 18.0847 12.349 17.8267 12.222C17.5437 12.518 17.1797 12.73 16.7787 12.838C16.3777 12.945 15.9567 12.942 15.5577 12.83C15.1597 12.719 14.7987 12.503 14.5197 12.204C14.2407 11.905 14.0547 11.535 13.9827 11.139C13.9117 10.743 13.9577 10.336 14.1157 9.96495C14.2737 9.59395 14.5377 9.27395 14.8787 9.03995C15.2197 8.80595 15.6237 8.66795 16.0397 8.64095C16.4567 8.61395 16.8737 8.69895 17.2437 8.88695C17.3087 8.64195 17.4337 8.41895 17.6057 8.23795C17.7787 8.05695 17.9947 7.92295 18.2337 7.84795C18.4737 7.77295 18.7287 7.75995 18.9747 7.80795C19.2217 7.85595 19.4517 7.96495 19.6447 8.12495C19.8377 8.28495 19.9877 8.49195 20.0827 8.72695C20.1777 8.96095 20.2137 9.21595 20.1887 9.46795C20.1647 9.71995 20.0797 9.96295 19.9397 10.177C19.8007 10.392 19.6117 10.57 19.3867 10.698C19.1617 10.826 18.9077 10.9 18.6487 10.913C18.3897 10.926 18.1307 10.878 17.8957 10.772C17.6607 10.667 17.4577 10.509 17.3007 10.307C17.1437 10.105 17.0387 9.87095 16.9937 9.62295C16.9487 9.37595 16.9657 9.12195 17.0427 8.88395C17.1307 8.60895 17.3047 8.37095 17.5417 8.20695C17.7787 8.04295 18.0647 7.96295 18.3537 7.97895C18.3057 7.78795 18.1897 7.62095 18.0317 7.50595C17.8727 7.39095 17.6797 7.33495 17.4857 7.34595C17.2947 7.35795 17.1107 7.43695 16.9667 7.56995C16.8227 7.70295 16.7257 7.88295 16.6897 8.07995C16.6547 8.27595 16.6817 8.47995 16.7687 8.65995C16.8557 8.84095 16.9967 8.98895 17.1747 9.08495C17.1707 9.33595 17.2407 9.58095 17.3757 9.78395C17.5097 9.98695 17.7017 10.143 17.9277 10.237C18.1547 10.33 18.4047 10.357 18.6487 10.313C18.8927 10.269 19.1187 10.156 19.2997 9.98895C19.4797 9.82095 19.6067 9.60595 19.6667 9.36895C19.7267 9.13095 19.7177 8.88095 19.6377 8.64795C19.5577 8.41595 19.4127 8.21195 19.2187 8.05995C19.0247 7.90795 18.7897 7.81295 18.5437 7.78595C18.2977 7.75995 18.0487 7.80195 17.8207 7.90795C17.5927 8.01395 17.3947 8.17995 17.2467 8.38595C17.0997 8.59095 17.0077 8.83095 16.9797 9.08495C16.9487 9.37995 16.9897 9.67895 17.0977 9.95195C17.2057 10.226 17.3787 10.467 17.5987 10.659C17.8187 10.851 18.0797 10.986 18.3617 11.055C18.6437 11.124 18.9367 11.124 19.2177 11.056C19.4997 10.988 19.7597 10.854 19.9797 10.663C20.1997 10.472 20.3737 10.232 20.4817 9.95795C20.5887 9.68395 20.6307 9.38595 20.5987 9.09195C20.5677 8.79795 20.4647 8.51395 20.3007 8.26195C20.1357 8.00995 19.9137 7.79795 19.6527 7.64195C19.3927 7.48495 19.1007 7.38795 18.7997 7.35695C18.4997 7.32595 18.1957 7.36195 17.9097 7.46295C17.6237 7.56395 17.3637 7.72695 17.1527 7.93895C16.9417 8.14995 16.7857 8.40495 16.7007 8.68595C16.6147 8.96695 16.6007 9.26695 16.6587 9.55495C16.7177 9.84395 16.8487 10.112 17.0407 10.338C17.2337 10.566 17.4827 10.744 17.7647 10.863C18.0477 10.983 18.3547 11.041 18.6617 11.03C18.9687 11.02 19.2707 10.942 19.5427 10.805C19.8147 10.667 20.0477 10.474 20.2267 10.236C20.4057 9.99895 20.5267 9.72295 20.5797 9.43095C20.6327 9.13895 20.6157 8.83995 20.5317 8.55495C20.4467 8.26895 20.2977 8.00995 20.0957 7.79495C19.8947 7.57995 19.6457 7.41795 19.3707 7.32495C19.0957 7.23195 18.8027 7.20995 18.5177 7.25895C18.2317 7.30795 17.9617 7.42695 17.7317 7.60495C17.5017 7.78295 17.3177 8.01295 17.1957 8.27695C17.0737 8.53995 17.0177 8.82895 17.0317 9.11795C17.0467 9.40695 17.1327 9.68995 17.2827 9.94095C17.4327 10.192 17.6437 10.406 17.8977 10.565C18.1517 10.723 18.4407 10.822 18.7397 10.853C19.0387 10.884 19.3417 10.848 19.6257 10.745C19.9097 10.643 20.1667 10.479 20.3767 10.264C20.3067 10.538 20.1677 10.791 19.9727 11.001C19.7767 11.211 19.5307 11.372 19.2587 11.47C18.9867 11.568 18.6957 11.6 18.4087 11.565C18.1207 11.529 17.8467 11.426 17.6097 11.266C17.3737 11.106 17.1807 10.892 17.0477 10.645C16.9147 10.398 16.8457 10.122 16.8457 9.84295C16.8457 9.56295 16.9147 9.28795 17.0477 9.04095C17.1807 8.79295 17.3747 8.58095 17.6097 8.42095C17.8457 8.26095 18.1197 8.15795 18.4077 8.12195C18.6947 8.08595 18.9867 8.11795 19.2587 8.21595C19.5307 8.31395 19.7767 8.47495 19.9727 8.68495C20.1677 8.89395 20.3077 9.14695 20.3767 9.42195C20.4457 9.69595 20.4427 9.98295 20.3657 10.255C20.2897 10.528 20.1427 10.778 19.9427 10.981C19.7417 11.185 19.4927 11.338 19.2187 11.429C18.9447 11.52 18.6537 11.546 18.3677 11.505C18.0827 11.466 17.8097 11.36 17.5717 11.198C17.3347 11.036 17.1397 10.821 17.0027 10.573C16.8657 10.325 16.7907 10.048 16.7837 9.76795C16.7767 9.48695 16.8377 9.20695 16.9627 8.95295C17.0877 8.69895 17.2717 8.47795 17.5007 8.30695C17.7297 8.13595 17.9987 8.01895 18.2827 7.96595C18.5667 7.91195 18.8587 7.92495 19.1347 7.99995C19.4097 8.07495 19.6627 8.21195 19.8727 8.39795C20.0827 8.58295 20.2417 8.81495 20.3397 9.07295C20.4367 9.33095 20.4687 9.60895 20.4337 9.88295C20.3987 10.156 20.2967 10.418 20.1387 10.649C19.9797 10.879 19.7677 11.069 19.5217 11.204C19.2747 11.339 18.9997 11.416 18.7207 11.428C18.4427 11.44 18.1607 11.388 17.9047 11.275C17.6497 11.162 17.4267 10.989 17.2567 10.774C17.0867 10.558 16.9737 10.305 16.9277 10.035C16.8817 9.76595 16.9047 9.49095 16.9947 9.23295C17.0847 8.97495 17.2387 8.74295 17.4457 8.55595C17.6527 8.36895 17.8977 8.22895 18.1667 8.14995C18.4347 8.06995 18.7197 8.05295 18.9947 8.09995C19.2697 8.14695 19.5287 8.25695 19.7527 8.42095C19.9767 8.58495 20.1617 8.79895 20.2927 9.04695C20.5117 9.52495 20.5017 10.069 20.2717 10.537C20.0417 11.005 19.6157 11.35 19.1057 11.47C18.9767 11.501 18.8457 11.519 18.7137 11.525C18.5817 11.531 18.4487 11.525 18.3177 11.506C18.0577 11.465 17.8107 11.37 17.5937 11.228C17.3757 11.087 17.1937 10.902 17.0597 10.687C16.9267 10.473 16.8447 10.232 16.8217 9.98295C16.7977 9.73395 16.8337 9.48295 16.9247 9.24695C17.0157 9.01095 17.1617 8.79795 17.3517 8.62195C17.5427 8.44595 17.7747 8.31095 18.0277 8.22695C18.2807 8.14295 18.5497 8.11195 18.8137 8.13695C19.0787 8.16095 19.3347 8.23995 19.5617 8.36695C19.7887 8.49395 19.9807 8.66695 20.1257 8.87195C20.2707 9.07695 20.3637 9.31195 20.4007 9.55795C20.4367 9.80395 20.4137 10.055 20.3337 10.291C20.2537 10.528 20.1177 10.743 19.9367 10.925C19.7567 11.107 19.5357 11.253 19.2897 11.35C19.0457 11.447 18.7817 11.494 18.5167 11.489C18.2517 11.484 17.9897 11.426 17.7507 11.319C17.5097 11.213 17.2957 11.059 17.1237 10.867C16.9517 10.677 16.8267 10.453 16.7587 10.212C16.6907 9.97095 16.6807 9.71895 16.7287 9.47295C16.7767 9.22795 16.8807 8.99695 17.0347 8.79795C17.1907 8.59995 17.3937 8.43795 17.6277 8.32495C17.8617 8.21295 18.1217 8.14995 18.3847 8.14095C18.6477 8.13195 18.9107 8.17595 19.1537 8.27195C19.3957 8.36695 19.6107 8.51195 19.7847 8.69695C19.9587 8.88195 20.0857 9.10495 20.1567 9.34795C20.2277 9.59095 20.2397 9.84795 20.1927 10.097C20.1457 10.347 20.0407 10.582 19.8847 10.791C19.7297 10.999 19.5277 11.174 19.2947 11.302C19.0617 11.43 18.8027 11.507 18.5387 11.53C18.2757 11.552 18.0097 11.519 17.7587 11.434C17.5087 11.349 17.2767 11.214 17.0797 11.035C16.8827 10.856 16.7247 10.638 16.6167 10.396C16.5087 10.154 16.4537 9.89195 16.4557 9.62795C16.4577 9.36395 16.5167 9.10195 16.6297 8.86095C16.7417 8.61995 16.9037 8.40595 17.1047 8.23195C17.3057 8.05795 17.5397 7.92695 17.7937 7.85195C18.0467 7.77695 18.3157 7.75895 18.5777 7.79995C18.8397 7.83995 19.0887 7.93695 19.3067 8.08395C19.5247 8.23095 19.7057 8.42395 19.8397 8.64995C19.9727 8.87595 20.0537 9.12895 20.0767 9.39095C20.0997 9.65295 20.0647 9.91695 19.9777 10.165C19.8897 10.414 19.7457 10.64 19.5527 10.825C19.3607 11.01 19.1267 11.151 18.8687 11.237C18.6097 11.324 18.3357 11.355 18.0657 11.326C17.7977 11.298 17.5377 11.212 17.3057 11.075C17.0747 10.937 16.8757 10.752 16.7257 10.532C16.5747 10.312 16.4757 10.066 16.4347 9.80595C16.3937 9.54595 16.4107 9.28095 16.4837 9.02895C16.5577 8.77695 16.6857 8.54495 16.8597 8.34795C17.0327 8.14995 17.2487 7.99395 17.4897 7.88995C17.7317 7.78595 17.9927 7.73595 18.2557 7.74395C18.5177 7.75195 18.7747 7.81795 19.0087 7.93695C19.2427 8.05595 19.4477 8.22595 19.6067 8.43295C19.7657 8.63995 19.8757 8.87995 19.9287 9.13295C19.9817 9.38595 19.9767 9.64795 19.9127 9.89995C19.8497 10.152 19.7297 10.386 19.5617 10.587C19.3937 10.787 19.1827 10.948 18.9447 11.057C18.7067 11.166 18.4477 11.222 18.1867 11.219C17.9257 11.217 17.6687 11.156 17.4327 11.043C17.1977 10.93 16.9897 10.767 16.8247 10.564C16.6607 10.361 16.5447 10.123 16.4867 9.86895C16.4297 9.61495 16.4317 9.35195 16.4937 9.09995C16.5557 8.84695 16.6767 8.61195 16.8447 8.41195C17.0127 8.21195 17.2237 8.05395 17.4627 7.94695C17.7017 7.83995 17.9617 7.78595 18.2247 7.79095C18.4877 7.79695 18.7447 7.86095 18.9787 7.97995C19.2127 8.09895 19.4167 8.26795 19.5757 8.47495C19.7347 8.68195 19.8457 8.92495 19.8977 9.18095C19.9497 9.43795 19.9427 9.70395 19.8747 9.95695C19.8077 10.209 19.6837 10.444 19.5107 10.642C19.3377 10.84 19.1217 10.998 18.8797 11.104C18.6367 11.21 18.3737 11.262 18.1097 11.255C17.8457 11.249 17.5857 11.184 17.3477 11.069C17.1107 10.954 16.9007 10.79 16.7357 10.584C16.5707 10.38 16.4557 10.139 16.3997 9.88295C16.3427 9.62695 16.3457 9.36195 16.4077 9.10795C16.4707 8.85395 16.5917 8.62095 16.7597 8.42295C16.9277 8.22595 17.1397 8.06995 17.3797 7.96595C17.6197 7.86195 17.8797 7.81195 18.1417 7.82095C18.4047 7.82995 18.6607 7.89695 18.8937 8.01995C19.1257 8.14195 19.3277 8.31395 19.4837 8.52295C19.6387 8.73095 19.7467 8.97495 19.7927 9.23095C19.8387 9.48695 19.8237 9.75095 19.7497 10.0C19.6747 10.25 19.5427 10.48 19.3647 10.673C19.1867 10.865 18.9667 11.016 18.7217 11.115C18.4757 11.215 18.2097 11.258 18.9457 11.245" fill="currentColor"/>
                  </svg>
                  App Store
                </motion.button>
                <motion.button 
                  className="bg-white text-black px-6 py-3 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 20.9999V2.99988C3 2.73466 3.10536 2.48031 3.29289 2.29277C3.48043 2.10523 3.73478 1.99988 4 1.99988H20C20.2652 1.99988 20.5196 2.10523 20.7071 2.29277C20.8946 2.48031 21 2.73466 21 2.99988V20.9999C21 21.2651 20.8946 21.5194 20.7071 21.707C20.5196 21.8945 20.2652 21.9999 20 21.9999H4C3.73478 21.9999 3.48043 21.8945 3.29289 21.707C3.10536 21.5194 3 21.2651 3 20.9999Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.5 6.99988L8.5 11.9999L12.5 16.9999" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 6.99988L11 11.9999L15 16.9999" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Google Play
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} City Ride. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;