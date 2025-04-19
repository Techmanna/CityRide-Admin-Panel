import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [showDefaultCredentials, setShowDefaultCredentials] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear login error when typing
    if (loginError) {
      setLoginError(null);
    }
  };

  const fillDefaultCredentials = () => {
    setFormData({
      email: 'admin@cityride.com',
      password: 'cityride@#25'
    });
    setLoginError(null);
    setErrors({
      email: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      email: !formData.email ? 'Email is required' : 
             !validateEmail(formData.email) ? 'Invalid email address' : '',
      password: !formData.password ? 'Password is required' : 
                !validatePassword(formData.password) ? 'Password must be at least 6 characters' : ''
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (newErrors.email || newErrors.password) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if credentials match default admin credentials
      if (formData.email === 'admin@cityride.com' && formData.password === 'cityride@#25') {
        // Add a slight delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const userData = {
          id: 1,
          email: formData.email,
          name: 'Admin User',
          role: 'admin'
        };
        
        login(userData);
        navigate('/admin/users');
      } else {
        // Add a slight delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoginError('Invalid credentials. Try using the default credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Image */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 bg-primary relative hidden md:block"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-6">CityRide Admin</h1>
            <p className="text-xl mb-8">Manage your transportation platform with our powerful admin dashboard</p>
            <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-lg">Streamline operations, track performance, and ensure a seamless experience for your users.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-6 left-6 text-white opacity-70">
          <p>&copy; {new Date().getFullYear()} CityRide. All rights reserved.</p>
        </div>
      </motion.div>
      
      {/* Right Side - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Please enter your credentials to continue</p>
          </motion.div>
          
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p>{loginError}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-orange-600 hover:text-orange-500">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </>
              ) : 'Sign In'}
            </motion.button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={fillDefaultCredentials}
                className="text-orange-600 hover:text-orange-500 text-sm"
              >
                Use Default Credentials
              </button>
            </div>
            
            {showDefaultCredentials && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a1 1 0 01-1.676 1.087 6 6 0 01-2.081-5.33z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 6a1 1 0 011 1v2.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 9.586V7a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">Default Credentials</p>
                </div>
                <p><strong>Email:</strong> admin@cityride.com</p>
                <p><strong>Password:</strong> cityride@#25</p>
              </motion.div>
            )}
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowDefaultCredentials(!showDefaultCredentials)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center w-full"
              >
                {showDefaultCredentials ? 'Hide credentials' : 'Show default credentials'}
                <svg 
                  className={`ml-1 w-4 h-4 transition-transform ${showDefaultCredentials ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;