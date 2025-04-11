import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [showDefaultCredentials, setShowDefaultCredentials] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Set default login credentials when "Use Default Credentials" is clicked
  const fillDefaultCredentials = () => {
    setValue('email', 'admin@cityride.com');
    setValue('password', 'cityride@#25');
    setLoginError(null);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoginError(null);
      // Check if credentials match default admin credentials
      if (data.email === 'admin@cityride.com' && data.password === 'cityride@#25') {
        // Instead of using JWT token validation, we'll use a user object
        const userData = {
          id: 1,
          email: data.email,
          name: 'Admin User',
          role: 'admin'
        };
        
        // Pass the user data to the login function
        login(userData);
        navigate('/admin');
      } else {
        // Here you would normally check against your backend
        setLoginError('Invalid credentials. Try using the default credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        {loginError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {loginError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#FF8C00] text-white py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            Login
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="text-[#008C44] hover:underline text-sm"
            >
              Use Default Credentials
            </button>
          </div>
          
          {showDefaultCredentials && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-gray-100 rounded-md text-sm"
            >
              <p><strong>Default Email:</strong> admin@cityride.com</p>
              <p><strong>Default Password:</strong> cityride@#25</p>
            </motion.div>
          )}
          
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setShowDefaultCredentials(!showDefaultCredentials)}
              className="text-gray-500 hover:underline text-sm"
            >
              {showDefaultCredentials ? 'Hide credentials' : 'Show default credentials'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;