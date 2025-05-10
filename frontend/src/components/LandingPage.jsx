import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaDumbbell, FaUser, FaLock, FaQrcode, FaRunning, 
  FaHeartbeat, FaApple, FaRegCreditCard, FaFire, 
  FaTrophy, FaMedal, FaQuoteLeft, FaQuoteRight, FaClock,
  FaEnvelope
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import QRScanner from './QRScanner';
import ContactForm from './ContactForm';

const LandingPage = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showSubscription, setShowSubscription] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  // Gym background images for hero section rotation
  const gymImages = [
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80"
  ];

  // Motivational quotes for gym
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    "Success starts with self-discipline.",
    "The body achieves what the mind believes.",
    "Don't stop when you're tired. Stop when you're done.",
    "Your health is an investment, not an expense.",
    "Sweat is just fat crying.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Discipline is choosing between what you want now and what you want most.",
    "A one-hour workout is 4% of your day. No excuses.",
    "The hardest lift of all is lifting your ass off the couch.",
    "You don't have to be extreme, just consistent.",
    "Rome wasn't built in a day, but they were laying bricks every hour.",
    "The only place where success comes before work is in the dictionary.",
    "You're only one workout away from a good mood.",
    "Train like a beast, look like a beauty.",
    "Your limitation—it's only your imagination.",
    "Push yourself because no one else is going to do it for you.",
    "The secret of getting ahead is getting started."
  ];

  // Daily motivational tips
  const dailyTips = [
    "Today's Tip: Focus on progressive overload - increase weight or reps each session.",
    "Tip: Stay hydrated! Drink at least 3 liters of water today.",
    "Tip: Prioritize protein intake to support muscle recovery.",
    "Tip: Get 7-9 hours of sleep for optimal recovery and performance.",
    "Tip: Warm up properly to prevent injuries and improve performance.",
    "Tip: Track your workouts to monitor progress over time.",
    "Tip: Don't skip leg day - it's the foundation of your physique.",
    "Tip: Focus on form over weight to maximize results and prevent injury.",
    "Tip: Incorporate mobility work to improve range of motion.",
    "Tip: Challenge yourself with new exercises to avoid plateaus."
  ];

  useEffect(() => {
    // Set a random quote on component mount
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Change quote every 10 seconds
    const quoteInterval = setInterval(() => {
      setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);

    // Rotate background images every 8 seconds
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === gymImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(imageInterval);
    };
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Lost 30 lbs in 6 months",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      quote: "Myo-Plus Fitness transformed my life! The trainers are amazing and the community is so supportive."
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Bodybuilding Champion",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      quote: "I've been to many gyms, but the equipment and atmosphere at Myo-Plus Fitness is unmatched. It's my second home!"
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Fitness Enthusiast",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      quote: "The classes are incredible and the 24/7 access fits perfectly with my busy schedule."
    }
  ];

  // Membership plans data
  const membershipPlans = [
    {
      name: "1 Month",
      price: "₹2,500",
      features: [
        "Access to all gym equipment",
        "Standard gym hours",
        "Locker facility",
        "Basic amenities"
      ],
      popular: false
    },
    {
      name: "3 Months",
      price: "₹6,000",
      features: [
        "Access to all gym equipment",
        "Standard gym hours",
        "Locker facility",
        "Basic amenities"
      ],
      popular: true
    },
    {
      name: "5 Months",
      price: "₹8,000",
      features: [
        "Access to all gym equipment",
        "Standard gym hours",
        "Locker facility",
        "Basic amenities"
      ],
      popular: false
    },
    {
      name: "6 Months",
      price: "₹10,000",
      features: [
        "Access to all gym equipment",
        "Standard gym hours",
        "Locker facility",
        "Basic amenities"
      ],
      popular: false
    },
    {
      name: "1 Year",
      price: "₹14,000",
      features: [
        "Access to all gym equipment",
        "Standard gym hours",
        "Locker facility",
        "Basic amenities"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {showScanner ? (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QRScanner />
        </div>
      ) : showSubscription ? (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Choose Your Membership Plan
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                Invest in yourself with our flexible membership options
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    selectedPlan === 'monthly'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('quarterly')}
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedPlan === 'quarterly'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setSelectedPlan('annual')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    selectedPlan === 'annual'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {membershipPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${
                    plan.popular ? 'border-red-500' : 'border-gray-200'
                  } relative`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 transform rotate-45 translate-x-8 -translate-y-1">
                      POPULAR
                    </div>
                  )}
                  <div className={`px-6 py-8 text-center ${
                    plan.popular ? 'bg-red-50' : 'bg-gray-50'
                  }`}>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4 flex justify-center">
                      <span className="text-5xl font-extrabold text-gray-900">
                        {plan.price}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg 
                            className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-3 text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <a 
                        href="#" 
                        className={`block w-full text-center rounded-md px-4 py-3 font-medium hover:bg-red-700 transition-colors duration-300 ${
                          plan.popular 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        Select Plan
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="w-full overflow-x-hidden">
          {showContactForm && (
            <ContactForm onClose={() => setShowContactForm(false)} />
          )}
          
          {/* Hero Section with Background Image */}
          <div className="relative bg-black overflow-hidden h-screen w-full">
            <div className="absolute inset-0 z-0 opacity-70 transition-opacity duration-1000 ease-in-out">
              <img
                src={gymImages[currentImageIndex]}
                alt="Gym background"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
              <div className="py-20 md:py-28 lg:py-32 w-full">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                  className="text-center"
                >
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">FORGE YOUR</span>
                    <span className="block text-red-500">ULTIMATE PHYSIQUE</span>
                  </h1>
                  <div className="mt-6 max-w-lg mx-auto bg-black bg-opacity-60 p-4 rounded-lg">
                    <p className="text-xl text-white font-medium">
                      <FaQuoteLeft className="inline text-red-500 mr-2" />
                      {motivationalQuote}
                      <FaQuoteRight className="inline text-red-500 ml-2" />
                    </p>
                  </div>
                  <div className="mt-10 sm:flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-md shadow"
                    >
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-red-500 hover:bg-red-600 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                      >
                        JOIN NOW
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                      >
                        <FaEnvelope className="mr-2" />
                        Contact Us
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Daily Motivation Tip */}
            <div className="absolute bottom-4 left-0 right-0 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl mx-auto bg-red-600 text-white text-center p-3 rounded-lg shadow-lg"
              >
                <p className="font-medium">
                  {dailyTips[Math.floor(Math.random() * dailyTips.length)]}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Gym Timings Section */}
          <div className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  GYM TIMINGS
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
                  Plan your workout schedule with our convenient timings
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-red-900/30 rounded-full mr-4">
                      <FaClock className="text-red-400 text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Weekdays</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-lg font-medium text-gray-300">Monday - Saturday</span>
                      <span className="text-lg text-white font-semibold">6:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg font-medium text-gray-300">Sunday</span>
                      <span className="text-lg text-red-400 font-semibold">Closed</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-blue-900/30 rounded-full mr-4">
                      <FaDumbbell className="text-blue-400 text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Facilities</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-300">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      State-of-the-art equipment
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Clean and spacious workout areas
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Professional trainers available
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-4"
                >
                  <div className="text-4xl font-bold text-red-500">500+</div>
                  <div className="text-gray-300 mt-2">ACTIVE MEMBERS</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="p-4"
                >
                  <div className="text-4xl font-bold text-red-500">24/7</div>
                  <div className="text-gray-300 mt-2">GYM ACCESS</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="p-4"
                >
                  <div className="text-4xl font-bold text-red-500">50+</div>
                  <div className="text-gray-300 mt-2">FITNESS CLASSES</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="p-4"
                >
                  <div className="text-4xl font-bold text-red-500">10</div>
                  <div className="text-gray-300 mt-2">PRO TRAINERS</div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Membership Plans Preview */}
          <div className="py-20 bg-gradient-to-b from-gray-50 to-white w-full overflow-x-hidden">
            <div className="w-full max-w-[95%] mx-auto px-2 sm:px-4 lg:px-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">MEMBERSHIP PLANS</h2>
                <p className="text-lg sm:text-xl text-gray-600">Choose the perfect plan for your fitness journey</p>
              </motion.div>

              <div className="space-y-12">
                {/* First Row - 3 Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {membershipPlans.slice(0, 3).map((plan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-100"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
                      <div className="p-4 sm:p-6 lg:p-8">
                        <div className="text-center mb-6 sm:mb-8">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                          <div className="flex items-center justify-center">
                            <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">per month</p>
                        </div>
                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-start text-gray-600">
                              <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowSubscription(true)}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Get Started
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Second Row - 2 Centered Plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
                  {membershipPlans.slice(3, 5).map((plan, index) => (
                    <motion.div
                      key={index + 3}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                      viewport={{ once: true }}
                      className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-100"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
                      <div className="p-4 sm:p-6 lg:p-8">
                        <div className="text-center mb-6 sm:mb-8">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                          <div className="flex items-center justify-center">
                            <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">per month</p>
                        </div>
                        <div className="space-y-4 mb-8">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-start text-gray-600">
                              <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowSubscription(true)}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Get Started
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Motivation Section */}
          <div className="py-16 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  FUEL YOUR MOTIVATION
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
                  Words to push you beyond your limits
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg p-6 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                    <FaFire className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">PUSH HARDER</h3>
                  <p className="text-gray-300">
                    "When you feel like quitting, remember why you started. The pain you feel today will be the strength you feel tomorrow."
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg p-6 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                    <FaTrophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">SET GOALS</h3>
                  <p className="text-gray-300">
                    "A goal without a plan is just a wish. Write down your targets, track your progress, and celebrate every small victory."
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg p-6 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                    <FaMedal className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">STAY CONSISTENT</h3>
                  <p className="text-gray-300">
                    "Consistency is the key. It's not about being perfect every day, but about showing up even when you don't feel like it."
                  </p>
                </motion.div>
              </div>

              <div className="mt-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-8 text-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <h3 className="text-2xl font-bold mb-4">TODAY'S CHALLENGE</h3>
                  <p className="text-xl mb-6">
                    Complete 100 push-ups, 100 squats, and 100 sit-ups before the day ends!
                  </p>
                  <div className="flex justify-center space-x-4">
                    <span className="inline-block bg-white text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Push-ups: 0/100
                    </span>
                    <span className="inline-block bg-white text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Squats: 0/100
                    </span>
                    <span className="inline-block bg-white text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Sit-ups: 0/100
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Features Section with Icons and Animations */}
          <div className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="lg:text-center"
              >
                <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">WHY CHOOSE US</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Everything you need to achieve your fitness goals
                </p>
              </motion.div>

              <div className="mt-16">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="relative bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="absolute -top-6 left-6 flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                      <FaDumbbell className="h-6 w-6" />
                    </div>
                    <p className="mt-6 text-lg leading-6 font-medium text-gray-900">World-Class Equipment</p>
                    <p className="mt-2 text-base text-gray-500">
                      State-of-the-art fitness equipment from top brands to help you achieve your goals. From cardio machines to free weights and everything in between.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="relative bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="absolute -top-6 left-6 flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                      <FaUser className="h-6 w-6" />
                    </div>
                    <p className="mt-6 text-lg leading-6 font-medium text-gray-900">Expert Trainers</p>
                    <p className="mt-2 text-base text-gray-500">
                      Certified professional trainers to guide you through your fitness journey with personalized programs tailored to your specific needs and goals.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="relative bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="absolute -top-6 left-6 flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                      <FaHeartbeat className="h-6 w-6" />
                    </div>
                    <p className="mt-6 text-lg leading-6 font-medium text-gray-900">Diverse Classes</p>
                    <p className="mt-2 text-base text-gray-500">
                      Group classes including HIIT, yoga, spinning, boxing, and more to keep your workout routine exciting and challenging.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Transformation Stories */}
          <div className="py-16 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  REAL TRANSFORMATIONS
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
                  See what our members have achieved
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                      alt="Transformation before"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                      alt="Transformation after"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg">John's 12-Week Journey</h3>
                    <p className="text-gray-400">Lost 25lbs of fat, gained 10lbs of muscle</p>
                    <div className="mt-4">
                      <FaTrophy className="text-yellow-400 inline-block mr-2" />
                      <span className="text-sm text-gray-300">Member of the Month - June 2023</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                      alt="Transformation before"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                      alt="Transformation after"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg">Sarah's Fitness Journey</h3>
                    <p className="text-gray-400">Went from beginner to marathon runner</p>
                    <div className="mt-4">
                      <FaMedal className="text-yellow-400 inline-block mr-2" />
                      <span className="text-sm text-gray-300">Completed 5 marathons</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                      alt="Transformation before"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1521805103424-d8f8430e8933?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                      alt="Transformation after"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg">Mike's Strength Gains</h3>
                    <p className="text-gray-400">Increased bench press by 100lbs in 6 months</p>
                    <div className="mt-4">
                      <FaFire className="text-yellow-400 inline-block mr-2" />
                      <span className="text-sm text-gray-300">Competitive Powerlifter</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center mb-12"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-extrabold text-gray-900">OUR WORLD-CLASS FACILITIES</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Train in an environment designed for success
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="rounded-lg overflow-hidden shadow-lg relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                    alt="Weight training area"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-2xl font-bold">LIFT HEAVY</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-lg">Weight Training Area</h3>
                    <p className="text-gray-600">Full range of free weights and machines</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="rounded-lg overflow-hidden shadow-lg relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                    alt="Cardio section"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-2xl font-bold">PUSH LIMITS</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-lg">Cardio Section</h3>
                    <p className="text-gray-600">Latest treadmills, bikes, and ellipticals</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="rounded-lg overflow-hidden shadow-lg relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                    alt="Group fitness studio"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-2xl font-bold">TRAIN TOGETHER</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-lg">Group Fitness Studio</h3>
                    <p className="text-gray-600">Spacious area for various fitness classes</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-extrabold text-gray-900">WHAT OUR MEMBERS SAY</h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                  Real results from real people in our community
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: testimonial.id * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-lg p-6 shadow-lg border-t-4 border-red-500"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                    <div className="mt-4 flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="relative bg-black py-16">
            <div className="absolute inset-0 z-0 opacity-70">
              <img
                src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=500&q=80"
                alt="Fitness background"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center"
              >
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  READY TO TRANSFORM YOUR BODY?
                </h2>
                <p className="mt-4 text-xl text-red-300 max-w-2xl mx-auto">
                  Join Myo-Plus Fitness today and experience the difference. Your first workout session is on us!
                </p>
                <div className="mt-8 sm:flex sm:justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-md shadow"
                  >
                    <button
                      onClick={() => setShowSubscription(true)}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-red-500 hover:bg-red-600 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                    >
                      SIGN UP NOW
                    </button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 sm:mt-0 sm:ml-3"
                  >
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black bg-opacity-70 hover:bg-opacity-80 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                    >
                      BOOK A TOUR
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Fitness App Integration */}
          <div className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    TRACK YOUR PROGRESS WITH OUR MOBILE APP
                  </h2>
                  <p className="mt-3 max-w-3xl text-lg text-gray-500">
                    Download our mobile app to track your workouts, set goals, monitor your progress, and connect with our community. Available for iOS and Android.
                  </p>
                  <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                    <a href="#" className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors duration-300">
                      <FaApple className="h-5 w-5 mr-2" />
                      App Store
                    </a>
                    <a href="#" className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors duration-300">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
                      </svg>
                      Google Play
                    </a>
                  </div>
                  <div className="mt-6">
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-gray-600">Workout plans tailored to your goals</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-gray-600">Progress tracking and analytics</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-gray-600">Virtual trainer and exercise guides</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="mt-10 lg:mt-0"
                >
                  <div className="relative mx-auto w-full max-w-xs rounded-xl shadow-2xl overflow-hidden border-4 border-black">
                    <img
                      src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=600&q=80"
                      alt="Mobile app screenshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <FaDumbbell className="h-8 w-8 text-red-500" />
                    <span className="ml-2 text-xl font-bold">Myo-Plus Fitness</span>
                  </div>
                  <p className="text-gray-300">
                    Where champions are made. Transforming lives through fitness since 2010.
                  </p>
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.058 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">About</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">Careers</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">Blog</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">Press</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">Contact</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">Help Center</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">Privacy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">Terms</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Visit Us</h3>
                  <address className="mt-4 not-italic text-gray-400">
                    <p>2nd Floor, Wedding Mall</p>
                    <p>Saraswati Vihar, Pitampura</p>
                    <p>Delhi, 110034</p>
                    <p className="mt-4">Email: myoplusgym@gmail.com</p>
                  </address>
                </div>
              </div>

              <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-base text-gray-400">&copy; 2025 Myo-Plus Fitness. All rights reserved.</p>
                <div className="mt-4 md:mt-0 flex space-x-6">
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                    <FaRegCreditCard className="h-6 w-6" />
                    <span className="sr-only">Payment Methods</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    <span className="sr-only">Health and Safety</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default LandingPage;