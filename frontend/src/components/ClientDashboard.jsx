import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaDumbbell,
  FaQrcode,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaFileDownload,
  FaSignOutAlt,
  FaHistory,
  FaUserCog,
  FaRunning,
  FaChartLine,
  FaFire,
  FaTrophy,
  FaHeartbeat,
  FaMedal,
  FaArrowLeft,
  FaInfoCircle,
  FaShower,
  FaParking
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MOTIVATIONAL_QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "Success starts with self-discipline.",
  "The body achieves what the mind believes.",
  "Don't stop when you're tired. Stop when you're done.",
  "Your health is an investment, not an expense.",
  "Discipline is choosing between what you want now and what you want most.",
  "The secret of getting ahead is getting started.",
  "You don't have to be extreme, just consistent.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "A one-hour workout is 4% of your day. No excuses.",
  "Rome wasn't built in a day, but they were laying bricks every hour."
];

const ClientDashboard = () => {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [attendanceStats, setAttendanceStats] = useState({
    totalVisits: 0,
    currentMonthVisits: 0,
    lastWeekVisits: 0
  });
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState('');
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/clients/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Client Data:', response.data);
        setClientData(response.data);
        setMotivationalQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching client data');
      }
    };

    const fetchAttendanceStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/qr/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: clientData?.username }
        });

        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastWeek = new Date(now);
        startOfLastWeek.setDate(now.getDate() - 7);

        const stats = {
          totalVisits: response.data.length,
          currentMonthVisits: response.data.filter(record => 
            new Date(record.checkInDate) >= startOfCurrentMonth
          ).length,
          lastWeekVisits: response.data.filter(record => 
            new Date(record.checkInDate) >= startOfLastWeek
          ).length
        };

        setAttendanceStats(stats);
        setAttendanceLoading(false);
      } catch (err) {
        console.error('Error fetching attendance stats:', err);
        setAttendanceError('Failed to fetch attendance statistics');
        setAttendanceLoading(false);
      }
    };

    fetchClientData();
    if (clientData?.username) {
      fetchAttendanceStats();
    }
  }, [clientData?.username]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/api/clients/my-invoice`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${clientData.username}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">     
      {/* Hero Section with Membership Status */}
      <div className="relative bg-gradient-to-r from-red-900 to-black">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  Welcome Back, <span className="text-red-400">{clientData?.username}</span>
                </h1>
                <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                  <p><span className="text-gray-400">Email:</span> {clientData?.email}</p>
                  <p><span className="text-gray-400">Phone:</span> {clientData?.phone || 'Not provided'}</p>
                  <p><span className="text-gray-400">Membership:</span> {clientData?.membershipType?.replace('month', ' Month')} Plan</p>
                </div>
              </div>
              <div className="bg-red-900/50 p-4 rounded-lg border-l-4 border-red-500 mb-6">
                <p className="text-lg sm:text-xl italic">"{motivationalQuote}"</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/client/qr-scanner')}
                  className="flex items-center justify-center px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all"
                >
                  <FaQrcode className="mr-2" /> Check In Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/client/attendance')}
                  className="flex items-center justify-center px-4 sm:px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-all"
                >
                  <FaChartLine className="mr-2" /> View Progress
                </motion.button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Fitness Motivation"
                className="rounded-lg shadow-2xl border-4 border-red-500 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Membership Status Banner */}
      {clientData && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full mr-4 shadow-lg">
                  <FaCalendarAlt className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Membership Status</h3>
                  <p className="text-gray-300 text-sm sm:text-lg">Valid until {new Date(clientData.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="text-center">
                  <p className={`text-3xl sm:text-4xl font-bold mb-1 transition-colors duration-300 ${
                    clientData.daysRemaining <= 7 ? 'text-red-400 animate-pulse' : 
                    clientData.daysRemaining <= 14 ? 'text-yellow-400' : 
                    'text-white'
                  }`}>
                    {clientData.daysRemaining}
                  </p>
                  <p className={`text-base sm:text-lg transition-colors duration-300 ${
                    clientData.daysRemaining <= 7 ? 'text-red-300' : 
                    clientData.daysRemaining <= 14 ? 'text-yellow-300' : 
                    'text-gray-400'
                  }`}>
                    Days Remaining
                    {clientData.daysRemaining <= 7 && (
                      <span className="ml-2 text-sm text-red-400">(Renew Soon!)</span>
                    )}
                  </p>
                </div>
                <div className="w-full sm:w-80">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Membership Progress</span>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      clientData.daysRemaining <= 7 ? 'text-red-400' : 
                      clientData.daysRemaining <= 14 ? 'text-yellow-400' : 
                      'text-gray-400'
                    }`}>
                      {Math.round((clientData.daysRemaining / (clientData.membershipType === '6month' ? 180 : 
                                                              clientData.membershipType === '3month' ? 90 : 30)) * 100)}%
                    </span>
                  </div>
                  <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20"></div>
                    
                    {/* Progress overlay */}
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
                        clientData.daysRemaining <= 7 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        clientData.daysRemaining <= 14 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-green-500 to-green-400'
                      }`}
                      style={{ 
                        width: `${(clientData.daysRemaining / (clientData.membershipType === '6month' ? 180 : 
                                                              clientData.membershipType === '3month' ? 90 : 30)) * 100}%`,
                        boxShadow: clientData.daysRemaining <= 7 ? 
                          '0 0 15px rgba(239, 68, 68, 0.4)' : 
                          clientData.daysRemaining <= 14 ? 
                          '0 0 15px rgba(234, 179, 8, 0.4)' :
                          '0 0 10px rgba(34, 197, 94, 0.3)'
                      }}
                    ></div>
                    
                    {/* Progress markers */}
                    <div className="absolute inset-0 flex justify-between px-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-px h-full bg-gray-600"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time markers */}
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Start</span>
                    <span>{clientData.membershipType === '6month' ? '3 Months' : 
                           clientData.membershipType === '3month' ? '1.5 Months' : '15 Days'}</span>
                    <span>{clientData.membershipType === '6month' ? '6 Months' : 
                           clientData.membershipType === '3month' ? '3 Months' : '1 Month'}</span>
                  </div>
                  
                  {/* Plan type */}
                  <div className="mt-2 text-center">
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${
                      clientData.daysRemaining <= 7 ? 'text-red-400 bg-red-900/20' :
                      clientData.daysRemaining <= 14 ? 'text-yellow-400 bg-yellow-900/20' :
                      'text-green-400 bg-green-900/20'
                    }`}>
                      {clientData.membershipType === '6month' ? '6 Month Plan' : 
                       clientData.membershipType === '3month' ? '3 Month Plan' : '1 Month Plan'}
                      {clientData.daysRemaining <= 7 && ' - Expiring Soon!'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gym Timings Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Timings Card */}
            <div className="md:col-span-2 bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full mr-4 shadow-lg">
                  <FaClock className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Gym Timings</h3>
                  <p className="text-gray-400 text-sm sm:text-base">Plan your workout schedule</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-300 font-medium">Weekdays</span>
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 text-sm rounded-full">Open</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Monday - Saturday</span>
                      <span className="text-white font-semibold">6:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Sunday</span>
                      <span className="text-red-400 font-semibold">Closed</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-300 font-medium">Current Status</span>
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 text-sm rounded-full">Open Now</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Today's Hours</span>
                      <span className="text-white font-semibold">6:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Next Holiday</span>
                      <span className="text-white font-semibold">Sunday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-4 shadow-lg">
                  <FaInfoCircle className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Quick Info</h3>
                  <p className="text-gray-400 text-sm sm:text-base">Important details</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center text-gray-300">
                  <FaDumbbell className="text-blue-400 mr-3" />
                  <span>State-of-the-art equipment</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaUser className="text-blue-400 mr-3" />
                  <span>Professional trainers available</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaShower className="text-blue-400 mr-3" />
                  <span>Clean shower facilities</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaParking className="text-blue-400 mr-3" />
                  <span>Free parking available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-white">
          <FaChartLine className="inline mr-2 text-red-500" /> Your Fitness Journey
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Total Workouts */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full mr-4 shadow-lg">
                <FaDumbbell className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">Total Workouts</h3>
            </div>
            {attendanceLoading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <p className="text-5xl font-bold text-white mb-4">{attendanceStats.totalVisits}</p>
                <p className="text-gray-300 text-lg">
                  {attendanceStats.totalVisits > 10 ? 
                    "🌟 You're a fitness warrior!" : 
                    "Keep pushing! Every workout counts."}
                </p>
              </>
            )}
          </motion.div>

          {/* This Month's Workouts */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-4 shadow-lg">
                <FaCalendarAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">This Month</h3>
            </div>
            {attendanceLoading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <p className="text-5xl font-bold text-white mb-4">{attendanceStats.currentMonthVisits}</p>
                <p className="text-gray-300 text-lg">
                  {attendanceStats.currentMonthVisits >= 12 ? 
                    "🔥 Amazing consistency!" : 
                    "Aim for 12+ workouts this month."}
                </p>
              </>
            )}
          </motion.div>

          {/* Last Week's Workouts */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full mr-4 shadow-lg">
                <FaClock className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">Last Week</h3>
            </div>
            {attendanceLoading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <p className="text-5xl font-bold text-white mb-4">{attendanceStats.lastWeekVisits}</p>
                <p className="text-gray-300 text-lg">
                  {attendanceStats.lastWeekVisits >= 4 ? 
                    "💪 You're crushing it!" : 
                    "Aim for 4+ workouts per week."}
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* User Profile and Membership Details */}
        {clientData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-2xl shadow-xl overflow-hidden border border-gray-700/50 backdrop-blur-sm"
            >
              <div className="bg-gradient-to-r from-red-900 to-black p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-4 bg-white/10 rounded-full mr-4">
                      <FaUser className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Your Profile</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/client/account-settings')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                  >
                    Edit Profile
                  </motion.button>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Name:</span>
                    <span className="w-2/3 font-medium text-white">{clientData.username}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Email:</span>
                    <span className="w-2/3 font-medium text-white">{clientData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Phone:</span>
                    <span className="w-2/3 font-medium text-white">{clientData.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Membership:</span>
                    <span className="w-2/3 font-medium text-white capitalize">
                      {clientData.membershipType.replace('month', ' Month')} Plan
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Member Since:</span>
                    <span className="w-2/3 font-medium text-white">
                      {new Date(clientData.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Status:</span>
                    <span className={`w-2/3 font-medium ${
                      clientData.daysRemaining > 7 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {clientData.daysRemaining > 7 ? 'Active' : 'Expiring Soon'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Membership Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 rounded-2xl shadow-xl overflow-hidden border border-gray-700/50 backdrop-blur-sm"
            >
              <div className="bg-gradient-to-r from-gray-900 to-black p-8">
                <div className="flex items-center">
                  <div className="p-4 bg-white/10 rounded-full mr-4">
                    <FaDumbbell className="text-white text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Membership Details</h2>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Start Date:</span>
                    <span className="w-2/3 font-medium text-white">
                      {new Date(clientData.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">End Date:</span>
                    <span className="w-2/3 font-medium text-white">
                      {new Date(clientData.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Days Remaining:</span>
                    <span className={`w-2/3 font-medium ${
                      clientData.daysRemaining > 7 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {clientData.daysRemaining} days
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">Actions:</span>
                    <div className="w-2/3 flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownloadInvoice}
                        className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-300 rounded-lg text-sm transition-all"
                      >
                        Download Invoice
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-white">
          <FaDumbbell className="inline mr-2 text-red-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800/50 p-8 rounded-2xl shadow-xl text-center cursor-pointer border border-gray-700/50 backdrop-blur-sm"
            onClick={() => navigate('/client/qr-scanner')}
          >
            <div className="bg-red-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaQrcode className="text-red-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Check In/Out</h3>
            <p className="text-gray-300 mb-4">Scan your QR code to track your workout</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-red-400 font-medium text-lg">Go to Scanner →</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800/50 p-8 rounded-2xl shadow-xl text-center cursor-pointer border border-gray-700/50 backdrop-blur-sm"
            onClick={() => navigate('/client/attendance')}
          >
            <div className="bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHistory className="text-blue-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Workout History</h3>
            <p className="text-gray-300 mb-4">View your attendance and progress</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-blue-400 font-medium text-lg">View History →</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800/50 p-8 rounded-2xl shadow-xl text-center cursor-pointer border border-gray-700/50 backdrop-blur-sm"
            onClick={() => navigate('/client/account-settings')}
          >
            <div className="bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserCog className="text-green-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Account Settings</h3>
            <p className="text-gray-300 mb-4">Update your profile and password</p>
            <span className="text-green-400 font-medium text-lg">Manage Account →</span>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start">
                <FaDumbbell className="text-red-400 mr-3 text-2xl" />
                <span className="text-2xl font-bold">Myo-Plus Fitness</span>
              </div>
              <p className="text-gray-400 mt-2">Transform your body, transform your life.</p>
            </div>
            <div className="flex space-x-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-red-900/50 hover:bg-red-900 rounded-lg transition-all"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </motion.button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-base sm:text-lg">© {new Date().getFullYear()} Myo-Plus Fitness Gym. All rights reserved.</p>
            <p className="mt-2 italic text-gray-500">"Discipline is the bridge between goals and accomplishment."</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;