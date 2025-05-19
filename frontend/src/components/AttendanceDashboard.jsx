import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaDumbbell, FaFire, FaRunning, FaCheckCircle, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AttendanceDashboard = ({ username }) => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [stats, setStats] = useState({
    totalVisits: 0,
    currentMonthVisits: 0,
    lastMonthVisits: 0
  });

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchAttendance();
    fetchStats();
  }, [username]);

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter, monthFilter]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/api/qr/attendance`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          username,
          date: dateFilter,
          month: monthFilter
        }
      });
      setAttendance(response.data);
    } catch (error) {
      setError('Failed to fetch attendance records');
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const response = await axios.get(`${baseURL}/api/qr/attendance/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { username }
      });

      if (response.data) {
        setStats({
          totalVisits: response.data.totalVisits || 0,
          currentMonthVisits: response.data.currentMonthVisits || 0,
          lastMonthVisits: response.data.lastMonthVisits || 0
        });
        setError('');
      } else {
        setError('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching stats:', error.response || error);
      if (error.response) {
        setError(`Server error: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
      setStats({
        totalVisits: 0,
        currentMonthVisits: 0,
        lastMonthVisits: 0
      });
    }
  };

  const clearFilters = () => {
    setDateFilter('');
    setMonthFilter('');
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Every rep counts! Keep pushing!",
      "Strength doesn't come from what you can do. It comes from overcoming what you once thought you couldn't.",
      "The only bad workout is the one that didn't happen!",
      "Your future self will thank you for today's effort!",
      "Sweat is just fat crying! Keep going!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/client/dashboard')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft className="text-white text-xl" />
          </motion.button>
          <h1 className="text-3xl font-bold text-white">Workout History</h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6 shadow-xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center">
              <FaDumbbell className="text-red-400 text-2xl mr-3" />
              <h3 className="text-white text-lg font-semibold">Total Visits</h3>
            </div>
            <p className="text-white text-4xl font-bold mt-3">{stats.totalVisits}</p>
            <p className="text-gray-400 text-sm mt-2">Since you joined</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 shadow-xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center">
              <FaFire className="text-yellow-400 text-2xl mr-3" />
              <h3 className="text-white text-lg font-semibold">This Month</h3>
            </div>
            <p className="text-white text-4xl font-bold mt-3">{stats.currentMonthVisits}</p>
            <p className="text-gray-400 text-sm mt-2">Workout sessions</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 shadow-xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center">
              <FaRunning className="text-blue-400 text-2xl mr-3" />
              <h3 className="text-white text-lg font-semibold">Last Month</h3>
            </div>
            <p className="text-white text-4xl font-bold mt-3">{stats.lastMonthVisits}</p>
            <p className="text-gray-400 text-sm mt-2">
              {stats.lastMonthVisits > stats.currentMonthVisits ? "You can do better!" : "Great progress!"}
            </p>
          </div>
        </div>
        
        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-xl p-6 mb-8 shadow-xl border border-red-800/50">
          <p className="text-white text-center font-medium italic text-lg">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-xl mb-8 border border-gray-700/50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FaFilter className="mr-2 text-red-400" />
            Filter Attendance
          </h2>
            {(dateFilter || monthFilter) && (
              <button
                onClick={clearFilters}
                className="text-red-400 hover:text-red-300 text-sm flex items-center"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full bg-gray-700/50 text-white rounded-lg border border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500 p-3"
                />
                <button
                  onClick={() => setDateFilter('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  <FaCalendarAlt />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Month
              </label>
              <div className="relative">
                <input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="w-full bg-gray-700/50 text-white rounded-lg border border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500 p-3"
                />
                <button
                  onClick={() => setMonthFilter('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  <FaCalendarAlt />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-gray-800/50 rounded-xl shadow-xl overflow-hidden border border-gray-700/50 backdrop-blur-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-300">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p>Loading your workout history...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => {
                  fetchAttendance();
                  fetchStats();
                }}
                className="mt-4 bg-red-900/50 hover:bg-red-900 text-white px-6 py-3 rounded-lg transition-all"
              >
                Retry
              </button>
            </div>
          ) : attendance.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <GiWeightLiftingUp className="text-5xl mx-auto text-gray-600 mb-4" />
              <p className="text-xl">No workout sessions found</p>
              <p className="mt-2">Hit the gym and check in to see your records here!</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-700/50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Your Workout Sessions ({attendance.length})
                </h3>
                <span className="text-sm text-gray-400">
                  Showing {dateFilter || monthFilter ? 'filtered' : 'all'} records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Session Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                    {attendance.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-700/30 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {new Date(record.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(record.checkInDate).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaCheckCircle className="text-green-400 mr-2" />
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-300">
                              Checked In
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        
        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Every drop of sweat brings you closer to your goals. Keep grinding!</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;