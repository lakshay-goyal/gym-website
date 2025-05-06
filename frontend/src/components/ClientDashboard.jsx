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
  FaMedal
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Motivational quotes
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/clients/me', {
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

    fetchClientData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/clients/my-invoice', {
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

  // Calculate progress metrics (mock data for demo)
  const progressMetrics = {
    workoutsThisWeek: Math.floor(Math.random() * 5) + 2,
    workoutsThisMonth: Math.floor(Math.random() * 15) + 5,
    lastWorkout: "Yesterday"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">     

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 p-4 rounded-lg text-xs text-white z-50">
          <pre>{JSON.stringify(clientData, null, 2)}</pre>
        </div>
      )}

      {/* Hero Section with Membership Status */}
      <div className="relative bg-gradient-to-r from-red-900 to-black">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome Back, <span className="text-red-400">{clientData?.username}</span>
                </h1>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-gray-400">Email:</span> {clientData?.email}</p>
                  <p><span className="text-gray-400">Phone:</span> {clientData?.phone || 'Not provided'}</p>
                  <p><span className="text-gray-400">Membership:</span> {clientData?.membershipType?.replace('month', ' Month')} Plan</p>
                </div>
              </div>
              <div className="bg-red-900/50 p-4 rounded-lg border-l-4 border-red-500 mb-6">
                <p className="text-xl italic">"{motivationalQuote}"</p>
              </div>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/client/qr-scanner')}
                  className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all"
                >
                  <FaQrcode className="mr-2" /> Check In Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/client/attendance')}
                  className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-all"
                >
                  <FaChartLine className="mr-2" /> View Progress
                </motion.button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-3 bg-red-900/30 rounded-full mr-4">
                  <FaCalendarAlt className="text-red-400 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Membership Status</h3>
                  <p className="text-gray-300">Valid until {new Date(clientData.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-center md:text-right">
                  <p className="text-3xl font-bold text-white mb-1">{clientData.daysRemaining}</p>
                  <p className="text-gray-400">Days Remaining</p>
                </div>
                <div className="ml-6 w-48">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        clientData.daysRemaining <= 7 ? 'bg-red-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${Math.min(100, (clientData.daysRemaining / 30) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          <FaChartLine className="inline mr-2 text-red-500" /> Your Fitness Journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Workouts This Week */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 bg-red-900/30 rounded-full mr-4">
                <FaRunning className="text-red-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">Workouts This Week</h3>
            </div>
            <p className="text-5xl font-bold text-white mb-4">{progressMetrics.workoutsThisWeek}</p>
            <p className="text-gray-300 text-lg">
              {progressMetrics.workoutsThisWeek >= 4 ? 
                "🔥 You're on fire! Keep it up!" : 
                "You're making progress! Aim for 4+ workouts this week."}
            </p>
          </motion.div>

          {/* Last Workout */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 bg-green-900/30 rounded-full mr-4">
                <FaClock className="text-green-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">Last Workout</h3>
            </div>
            <p className="text-5xl font-bold text-white mb-4">{progressMetrics.lastWorkout}</p>
            <p className="text-gray-300 text-lg">
              {progressMetrics.lastWorkout === "Today" ? 
                "Great job staying active today!" : 
                "Ready for your next session?"}
            </p>
          </motion.div>
        </div>

        {/* User Profile and Membership Details */}
        {clientData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
                      {new Date(clientData.startDate).toLocaleDateString()}
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
                      {new Date(clientData.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-400 font-medium">End Date:</span>
                    <span className="w-2/3 font-medium text-white">
                      {new Date(clientData.endDate).toLocaleDateString()}
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
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          <FaDumbbell className="inline mr-2 text-red-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
            <span className="text-red-400 font-medium text-lg">Go to Scanner →</span>
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
            <span className="text-blue-400 font-medium text-lg">View History →</span>
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
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <FaDumbbell className="text-red-400 mr-3 text-2xl" />
                <span className="text-2xl font-bold">IRON TEMPLE</span>
              </div>
              <p className="text-gray-400 mt-2">Transform your body, transform your life.</p>
            </div>
            <div className="flex space-x-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-6 py-3 bg-red-900/50 hover:bg-red-900 rounded-lg transition-all"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </motion.button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p className="text-lg">© {new Date().getFullYear()} Iron Temple Gym. All rights reserved.</p>
            <p className="mt-2 italic text-gray-500">"Discipline is the bridge between goals and accomplishment."</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;