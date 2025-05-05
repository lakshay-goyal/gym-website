import React, { useState } from 'react';
import axios from 'axios';

const QRScanForm = ({ code }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const currentDate = new Date().toISOString();
      const response = await axios.post('http://localhost:5000/api/qr/verify', {
        code,
        username,
        checkInDate: currentDate
      });
      
      setCheckInDate(new Date(currentDate).toLocaleString());
      setSuccess(true);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({ username, role: 'client' }));
    } catch (error) {
      setError(error.response?.data?.message || 'Error recording attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Enter Your Details</h2>
      {success ? (
        <div className="text-center">
          <div className="text-green-600 text-xl mb-2">✓ Check-in Successful!</div>
          <div className="text-gray-600">Date: {checkInDate}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Scan Again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
};

export default QRScanForm; 