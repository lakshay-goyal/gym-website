import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaDumbbell, FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      
      login(user);

      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'client':
          navigate('/client/dashboard');
          break;
        case 'trainer':
          navigate('/trainer/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80" 
          alt="Gym background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <FaDumbbell className="h-10 w-10 text-red-500" />
            </motion.div>
            <span className="ml-2 text-3xl font-bold text-white">Myo-Plus Fitness</span>
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            UNLOCK YOUR POTENTIAL
          </h2>
          <p className="mt-2 text-center text-sm text-red-300">
            Sign in to track your progress and achieve your fitness goals
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm py-8 px-6 shadow-xl sm:rounded-lg sm:px-8 border border-gray-800">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900 bg-opacity-70 border border-red-700 text-red-100 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-red-500 hover:text-red-400">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300`}
                >
                  <FaFire className="mr-2" />
                  SIGN IN
                </motion.button>
              </div>
            </form>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 bg-opacity-80 text-gray-400">
                    NEW TO Myo-Plus Fitness?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                >
                  CREATE YOUR ACCOUNT
                </Link>
              </div>
            </div> */}
          </div>
        </motion.div>

        {/* <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mt-8 text-center text-sm text-gray-400"
        >
          <p>
            By signing in, you agree to our <Link to="/terms" className="text-red-400 hover:text-red-300">Terms of Service</Link> and <Link to="/privacy" className="text-red-400 hover:text-red-300">Privacy Policy</Link>
          </p>
        </motion.div> */}
      </div>
    </div>
  );
};

export default LoginPage;