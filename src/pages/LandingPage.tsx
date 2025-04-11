import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Shield, Star, ChevronDown, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navigation from '../components/Navigation';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

function LandingPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const bounceIn = {
    initial: { scale: 0.8, opacity: 0 },
    whileInView: { scale: 1, opacity: 1 },
    viewport: { once: true },
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen bg-gradient-to-r from-primary to-secondary text-white"
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1597766200952-7b74068bc83b?auto=format&fit=crop&q=80"
            alt="City Ride Hero"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 h-screen flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold mb-6">
                Your Reliable Ride Through the City
              </h1>
              <p className="text-xl mb-8">Experience comfortable and affordable transportation with City Ride's tricycle service.</p>
              <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">
                Book a Ride
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block"
            >
              <img 
                src="/images/img.png"
                alt="Nigerian Tricycle"
                className="rounded-lg shadow-2xl animate__animated animate__backInRight"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        id="about"
        className="py-20 bg-white"
        {...fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">About City Ride</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...bounceIn}>
              <img 
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80"
                alt="About City Ride"
                className="rounded-lg shadow-xl animate__animated animate__fadeInLeft"
                loading = "lazy"
              />
            </motion.div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Your Trusted Transportation Partner</h3>
              <p className="text-gray-600 mb-6">
                City Ride revolutionizes urban transportation with our fleet of modern tricycles, 
                providing safe, affordable, and efficient rides across the city.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1000+</h4>
                  <p className="text-sm text-gray-600">Daily Rides</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">500+</h4>
                  <p className="text-sm text-gray-600">Verified Drivers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="services"
        className="py-20 bg-gray-50"
        {...fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose City Ride?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin size={32} />, title: 'Convenient Pickup', description: 'Get picked up from your location within minutes' },
              { icon: <Clock size={32} />, title: 'Time-Saving', description: 'Navigate through traffic efficiently' },
              { icon: <Shield size={32} />, title: 'Safe & Secure', description: 'Verified drivers and secure payment options' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                {...bounceIn}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials"
        className="py-20 bg-white"
        {...fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 animate__animated fadeInRight">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'John Doe', rating: 5, text: 'Best tricycle service in the city! Always on time and professional.' },
              { name: 'Jane Smith', rating: 5, text: 'Affordable and convenient way to travel around the city.' },
              { name: 'Mike Johnson', rating: 5, text: 'Reliable service with friendly drivers. Highly recommended!' },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                {...bounceIn}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 p-6 rounded-lg shadow-lg"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        className="py-20 bg-gray-50"
        {...fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            {[
              { question: 'How do I book a ride?', answer: 'Simply open our app, enter your destination, and confirm your pickup location.' },
              { question: 'What payment methods are accepted?', answer: 'We accept cash, cards, and mobile payments for your convenience.' },
              { question: 'Is the service available 24/7?', answer: 'Yes, our service operates 24 hours a day, 7 days a week.' },
            ].map((faq, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md mb-4"
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        id="contact"
        className="py-20 bg-white"
        {...fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div {...bounceIn}>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="text-primary mr-4" />
                  <p>+1 234 567 890</p>
                </div>
                <div className="flex items-center">
                  <Mail className="text-primary mr-4" />
                  <p>contact@cityride.com</p>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <Facebook className="text-primary hover:text-secondary cursor-pointer" />
                  <Twitter className="text-primary hover:text-secondary cursor-pointer" />
                  <Instagram className="text-primary hover:text-secondary cursor-pointer" />
                </div>
              </div>
            </motion.div>
            <motion.form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
              {...bounceIn}
            >
              <div>
                <input
                  {...register('name')}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                )}
              </div>
              <div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                )}
              </div>
              <div>
                <textarea
                  {...register('message')}
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message as string}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Send Message
              </button>
            </motion.form>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">City Ride</h3>
              <p className="text-gray-400">Your trusted partner for city transportation.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Download App</h4>
              <div className="space-y-4">
                <button className="bg-white text-black px-6 py-2 rounded-lg w-full">App Store</button>
                <button className="bg-white text-black px-6 py-2 rounded-lg w-full">Google Play</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} City Ride. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;