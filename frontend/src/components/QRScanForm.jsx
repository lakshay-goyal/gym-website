import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaUserTie, FaUserFriends } from 'react-icons/fa';

const QRScanForm = ({ code }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // 'client' or 'trainer'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First verify the user credentials based on role
      const authResponse = await axios.post(`${baseURL}/api/auth/verify`, {
        username,
        password,
        role
      });

      if (!authResponse.data.isValid) {
        throw new Error('Invalid credentials');
      }

      // If credentials are valid, proceed with check-in
      const currentDate = new Date().toISOString();
      let response;
      if (role === 'trainer') {
        response = await axios.post(`${baseURL}/api/trainers/attendance`, {
          username,
          code,
          checkInDate: currentDate
        });
      } else {
        response = await axios.post(`${baseURL}/api/qr/verify`, {
          code,
          username,
          role,
          checkInDate: currentDate
        });
      }
      
      setCheckInDate(new Date(currentDate).toLocaleString());
      setSuccess(true);
      
      // Store user info with their role
      localStorage.setItem('user', JSON.stringify({ 
        username, 
        role: role
      }));
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error recording attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2">GYM CHECK-IN</h2>
        <p className="text-gray-300">Verify your identity to check in</p>
      </div>

      {success ? (
        <div className="text-center bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-green-400 text-2xl font-bold mb-2">CHECK-IN SUCCESSFUL!</div>
          <div className="text-gray-300 mb-1">Welcome to your workout,</div>
          <div className="text-yellow-400 font-medium text-lg mb-4">{username}</div>
          <div className="text-gray-400 text-sm mb-2">Role: {role === 'trainer' ? 'Trainer' : 'Client'}</div>
          <div className="text-gray-400 text-sm mb-6">Checked in at: {checkInDate}</div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            SCAN AGAIN
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SELECT ROLE
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all ${
                  role === 'client'
                    ? 'bg-yellow-500 border-yellow-600 text-gray-900'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaUserFriends className="text-lg" />
                <span>Client</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('trainer')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all ${
                  role === 'trainer'
                    ? 'bg-yellow-500 border-yellow-600 text-gray-900'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaUserTie className="text-lg" />
                <span>Trainer</span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              {role === 'trainer' ? 'TRAINER ID' : 'MEMBER ID'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 p-3"
                placeholder={`Enter your ${role === 'trainer' ? 'trainer' : 'member'} ID`}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 p-3"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                VERIFYING...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                VERIFY & CHECK IN
              </span>
            )}
          </button>

          <div className="text-center text-gray-400 text-xs mt-4">
            <p>Please verify your identity to complete check-in</p>
          </div>
        </form>
      )}
    </div>
  );
};

export default QRScanForm;