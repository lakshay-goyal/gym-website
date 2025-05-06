import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaDumbbell, FaUser, FaLock, FaQrcode, FaRunning, 
  FaChartLine, FaUsers, FaCalendarAlt, FaUserPlus,
  FaClipboardList, FaDumbbell as FaWorkout, FaChartBar,
  FaCog, FaSignOutAlt
} from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    setActiveTab(location.pathname);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <FaDumbbell className="h-8 w-8 text-red-500" />
            </motion.div>
            <span className="ml-2 text-xl font-bold text-white">IRON TEMPLE</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!user ? (
              // Not logged in
              <>
                <button
                  onClick={() => handleNavigation('/')}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition duration-300 ${
                    activeTab === '/'
                      ? 'text-white bg-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FaRunning className="h-5 w-5" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition duration-300 shadow-lg transform hover:scale-105 flex items-center space-x-2"
                >
                  <FaLock className="h-5 w-5" />
                  <span>Login</span>
                </button>
              </>
            ) : user.role === 'admin' ? (
              // Admin navigation
              <>
                <button
                  onClick={() => handleNavigation('/admin/dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition duration-300 ${
                    activeTab === '/admin/dashboard'
                      ? 'text-white bg-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FaChartLine className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigation('/admin/qr-generator')}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition duration-300 ${
                    activeTab === '/admin/qr-generator'
                      ? 'text-white bg-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FaQrcode className="h-5 w-5" />
                  <span>QR Generator</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-300 flex items-center space-x-2"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              // Client navigation
              <>
                <button
                  onClick={() => handleNavigation('/client/dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition duration-300 ${
                    activeTab === '/client/dashboard'
                      ? 'text-white bg-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FaChartLine className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigation('/client/qr-scanner')}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition duration-300 ${
                    activeTab === '/client/qr-scanner'
                      ? 'text-white bg-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FaQrcode className="h-5 w-5" />
                  <span>Scan QR</span>
                </button>
                <button
                  onClick={() => handleNavigation('/client/attendance')}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition duration-300 ${
                    activeTab === '/client/attendance'
                      ? 'text-white bg-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FaClipboardList className="h-5 w-5" />
                  <span>Attendance</span>
                </button>
                <button
                  onClick={() => handleNavigation('/client/account-settings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition duration-300 ${
                    activeTab === '/client/account-settings'
                      ? 'text-white bg-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FaCog className="h-5 w-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-300 flex items-center space-x-2"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {!user ? (
            // Not logged in mobile menu
            <>
              <button
                onClick={() => handleNavigation('/')}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ${
                  activeTab === '/'
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FaRunning className="h-5 w-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavigation('/login')}
                className="w-full px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition duration-300 mt-2 flex items-center justify-center space-x-2"
              >
                <FaLock className="h-5 w-5" />
                <span>Login</span>
              </button>
            </>
          ) : user.role === 'admin' ? (
            // Admin mobile navigation
            <>
              <button
                onClick={() => handleNavigation('/admin/dashboard')}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ${
                  activeTab === '/admin/dashboard'
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FaChartLine className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavigation('/admin/qr-generator')}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ${
                  activeTab === '/admin/qr-generator'
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FaQrcode className="h-5 w-5" />
                <span>QR Generator</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition duration-300 flex items-center justify-center space-x-2 mt-2"
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            // Client mobile navigation
            <>
              <button
                onClick={() => handleNavigation('/client/dashboard')}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ${
                  activeTab === '/client/dashboard'
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FaChartLine className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavigation('/client/qr-scanner')}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ${
                  activeTab === '/client/qr-scanner'
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FaQrcode className="h-5 w-5" />
                <span>Scan QR</span>
              </button>
              <button
                onClick={() => handleNavigation('/client/attendance')}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ${
                  activeTab === '/client/attendance'
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FaClipboardList className="h-5 w-5" />
                <span>Attendance</span>
              </button>
              <button
                onClick={() => handleNavigation('/client/account-settings')}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ${
                  activeTab === '/client/account-settings'
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FaCog className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition duration-300 flex items-center justify-center space-x-2 mt-2"
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;