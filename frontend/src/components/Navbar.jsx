import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaDumbbell, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaQrcode,
  FaHistory,
  FaUserCog,
  FaUsers,
  FaChartLine,
  FaCog
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const commonNavItems = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Profile', path: '/profile', icon: <FaUser /> },
  ];

  const clientNavItems = [
    { name: 'Dashboard', path: '/client/dashboard', icon: <FaChartLine /> },
    { name: 'Check In', path: '/client/qr-scanner', icon: <FaQrcode /> },
    { name: 'History', path: '/client/attendance', icon: <FaHistory /> },
    { name: 'Settings', path: '/client/account-settings', icon: <FaUserCog /> },
  ];

  const trainerNavItems = [
    { name: 'Dashboard', path: '/trainer/dashboard', icon: <FaChartLine /> },
    { name: 'Clients', path: '/trainer/clients', icon: <FaUsers /> },
    { name: 'Schedule', path: '/trainer/schedule', icon: <FaCalendarAlt /> },
    { name: 'Settings', path: '/trainer/settings', icon: <FaCog /> },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartLine /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  const getRoleNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'client':
        return clientNavItems;
      case 'trainer':
        return trainerNavItems;
      case 'admin':
        return adminNavItems;
      default:
        return [];
    }
  };

  const roleNavItems = getRoleNavItems();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaDumbbell className="text-red-500 text-2xl mr-2" />
              <span className="text-white text-xl font-bold">Myo-Plus Fitness</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {user ? (
                <>
                  {/* Common navigation items */}
                  {commonNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}

                  {/* Role-specific navigation items */}
                  {roleNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaSignOutAlt />
                    <span className="ml-2">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2 rounded-md"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user ? (
                <>
                  {/* Common navigation items */}
                  {commonNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}

                  {/* Role-specific navigation items */}
                  {roleNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}

                  {/* Logout button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center"
                  >
                    <FaSignOutAlt />
                    <span className="ml-2">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 