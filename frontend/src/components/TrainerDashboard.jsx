import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiCalendar, FiClock, FiMail, FiPhone, FiPlus, FiX, FiUsers, FiActivity } from 'react-icons/fi';
import { FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [trainerAttendance, setTrainerAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [trainerAttendanceLoading, setTrainerAttendanceLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceError, setAttendanceError] = useState('');
  const [trainerAttendanceError, setTrainerAttendanceError] = useState('');
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    username: '',
    email: '',
    phone: '',
    membershipType: '1month'
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('clients');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trainers/clients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch clients');
        setLoading(false);
      }
    };

    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trainers/clients/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAttendance(response.data);
        setAttendanceLoading(false);
      } catch (err) {
        setAttendanceError('Failed to fetch attendance records');
        setAttendanceLoading(false);
      }
    };

    const fetchTrainerAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trainers/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTrainerAttendance(response.data);
        setTrainerAttendanceLoading(false);
      } catch (err) {
        setTrainerAttendanceError('Failed to fetch your attendance records');
        setTrainerAttendanceLoading(false);
      }
    };

    fetchClients();
    fetchAttendance();
    fetchTrainerAttendance();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newClient.username || !newClient.email || !newClient.phone) {
      setFormError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newClient.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newClient.phone.replace(/\D/g, ''))) {
      setFormError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainers/clients`,
        newClient,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setFormSuccess('Client added successfully!');
      setNewClient({
        username: '',
        email: '',
        phone: '',
        membershipType: '1month'
      });
      setShowAddClientForm(false);
      
      // Refresh clients list
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trainers/clients`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClients(response.data);
    } catch (err) {
      console.error('Error adding client:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add client. Please try again.';
      setFormError(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with improved styling */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Welcome back, {user?.name || 'Trainer'}!</h1>
            <p className="text-gray-400 mt-2 text-lg">Here's what's happening with your clients today</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg shadow-blue-500/20">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Trainer'}
            </div>
          </div>
        </div>

        {/* Stats Cards with improved styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Clients</p>
                <h3 className="text-3xl font-bold text-white">{clients.length}</h3>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-xl">
                <FiUsers className="text-blue-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Your Check-ins</p>
                <h3 className="text-3xl font-bold text-white">{trainerAttendance.length}</h3>
              </div>
              <div className="bg-green-500/10 p-4 rounded-xl">
                <FiActivity className="text-green-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Client Check-ins</p>
                <h3 className="text-3xl font-bold text-white">{attendance.length}</h3>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-xl">
                <FiClock className="text-purple-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Active Since</p>
                <h3 className="text-3xl font-bold text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'N/A'}
                </h3>
              </div>
              <div className="bg-orange-500/10 p-4 rounded-xl">
                <FiCalendar className="text-orange-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with improved styling */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
          {/* Navigation with improved styling */}
          <div className="border-b border-gray-700/50">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'profile' 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                }`}
              >
                Your Profile
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'clients' 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                }`}
              >
                Your Clients
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'attendance' 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => navigate('/trainer/profile-settings')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'settings' 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                }`}
              >
                Profile Settings
              </button>
            </nav>
          </div>

          {/* Content Area with improved styling */}
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-white mb-8">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-500/10 p-3 rounded-xl">
                          <FiUser className="text-blue-400 text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Username</p>
                          <p className="font-medium text-white text-lg">{user?.username || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-500/10 p-3 rounded-xl">
                          <FiMail className="text-green-400 text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Email Address</p>
                          <p className="font-medium text-white text-lg">{user?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-500/10 p-3 rounded-xl">
                          <FiPhone className="text-purple-400 text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                          <p className="font-medium text-white text-lg">{user?.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-500/10 p-3 rounded-xl">
                          <FiCalendar className="text-orange-400 text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Account Created</p>
                          <p className="font-medium text-white text-lg">
                            {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Records with improved styling */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Your Attendance Records</h3>
                  {trainerAttendanceLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-4 text-gray-400 text-lg">Loading your attendance records...</p>
                    </div>
                  ) : trainerAttendanceError ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
                      {trainerAttendanceError}
                    </div>
                  ) : trainerAttendance.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <p className="text-gray-400 text-lg">No attendance records found</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-700/50">
                      <table className="min-w-full divide-y divide-gray-700/50">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Check-in Date</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                          {trainerAttendance.map((record) => (
                            <tr key={record._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FiClock className="flex-shrink-0 mr-3 text-gray-400" />
                                  <span className="text-gray-300">{formatDate(record.checkInDate)}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-500/10 text-green-400">
                                  {record.code}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Your Clients</h2>
                  <button
                    onClick={() => setShowAddClientForm(!showAddClientForm)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    {showAddClientForm ? (
                      <>
                        <FiX className="mr-2 text-lg" /> Cancel
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2 text-lg" /> Add New Client
                      </>
                    )}
                  </button>
                </div>

                {showAddClientForm && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 shadow-xl mb-8">
                    <h3 className="text-xl font-bold text-white mb-6">Add New Client</h3>
                    
                    {formError && (
                      <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
                        {formError}
                      </div>
                    )}
                    
                    {formSuccess && (
                      <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl">
                        {formSuccess}
                      </div>
                    )}

                    <form onSubmit={handleAddClient} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Username <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiUser className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="username"
                              value={newClient.username}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                              placeholder="john_doe"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Email <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiMail className="text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={newClient.email}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Phone <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiPhone className="text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              name="phone"
                              value={newClient.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                              placeholder="1234567890"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Membership Type <span className="text-red-400">*</span>
                          </label>
                          <select
                            name="membershipType"
                            value={newClient.membershipType}
                            onChange={(e) => setNewClient({...newClient, membershipType: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                          >
                            <option value="1month">1 Month Plan (₹2,500)</option>
                            <option value="3month">3 Month Plan (₹6,000)</option>
                            <option value="5month">5 Month Plan (₹8,000)</option>
                            <option value="6month">6 Month Plan (₹10,000)</option>
                            <option value="1year">1 Year Plan (₹14,000)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                        >
                          Add Client
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400 text-lg">Loading clients...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
                    {error}
                  </div>
                ) : clients.length === 0 ? (
                  <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-white">No clients</h3>
                    <p className="mt-2 text-gray-400">You haven't added any clients yet.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowAddClientForm(true)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                      >
                        <FiPlus className="mr-2" /> Add New Client
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-gray-700/50">
                    <table className="min-w-full divide-y divide-gray-700/50">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Membership</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Period</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                        {clients.map((client) => (
                          <tr key={client._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                  <FiUser className="text-blue-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">{client.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">{client.email}</div>
                              <div className="text-sm text-gray-400">{client.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                client.membershipType === '1month' ? 'bg-blue-500/10 text-blue-400' :
                                client.membershipType === '3month' ? 'bg-purple-500/10 text-purple-400' :
                                'bg-green-500/10 text-green-400'
                              }`}>
                                {client.membershipType === '1month' ? '1 Month' :
                                 client.membershipType === '3month' ? '3 Months' : '6 Months'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                {new Date(client.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} - {' '}
                                {new Date(client.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                              <div className="text-sm text-gray-400">
                                {Math.ceil((new Date(client.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Client Attendance Records</h3>
                  {attendanceLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-4 text-gray-400 text-lg">Loading attendance records...</p>
                    </div>
                  ) : attendanceError ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
                      {attendanceError}
                    </div>
                  ) : attendance.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <p className="text-gray-400 text-lg">No attendance records found for your clients</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-700/50">
                      <table className="min-w-full divide-y divide-gray-700/50">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Check-in Date</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">QR Code</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                          {attendance.map((record) => (
                            <tr key={record._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <FiUser className="text-blue-400" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{record.username}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FiClock className="flex-shrink-0 mr-3 text-gray-400" />
                                  <span className="text-gray-300">{formatDate(record.checkInDate)}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-500/10 text-purple-400">
                                  {record.qrCode}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Your Attendance Records</h3>
                  {trainerAttendanceLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-4 text-gray-400 text-lg">Loading your attendance records...</p>
                    </div>
                  ) : trainerAttendanceError ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
                      {trainerAttendanceError}
                    </div>
                  ) : trainerAttendance.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <p className="text-gray-400 text-lg">No attendance records found</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-700/50">
                      <table className="min-w-full divide-y divide-gray-700/50">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Check-in Date</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                          {trainerAttendance.map((record) => (
                            <tr key={record._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FiClock className="flex-shrink-0 mr-3 text-gray-400" />
                                  <span className="text-gray-300">{formatDate(record.checkInDate)}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-500/10 text-green-400">
                                  {record.code}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;