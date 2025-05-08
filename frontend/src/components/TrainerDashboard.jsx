import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validate form data
    if (!newClient.username || !newClient.email || !newClient.phone) {
      setFormError('All fields are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newClient.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newClient.phone.replace(/\D/g, ''))) {
      setFormError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
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
      fetchClients();
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trainer Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-medium w-32">Name:</span>
            <span>{user?.name || 'N/A'}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-medium w-32">Email:</span>
            <span>{user?.email || 'N/A'}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-medium w-32">Username:</span>
            <span>{user?.username || 'N/A'}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-medium w-32">Role:</span>
            <span className="capitalize">{user?.role || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Attendance Records</h2>
        
        {trainerAttendanceLoading ? (
          <div className="text-center py-4">Loading your attendance records...</div>
        ) : trainerAttendanceError ? (
          <div className="text-red-500 text-center py-4">{trainerAttendanceError}</div>
        ) : trainerAttendance.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No attendance records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trainerAttendance.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(record.checkInDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{record.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Client</h2>
          <button
            onClick={() => setShowAddClientForm(!showAddClientForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showAddClientForm ? 'Cancel' : 'Add New Client'}
          </button>
        </div>

        {showAddClientForm && (
          <form onSubmit={handleAddClient} className="space-y-4">
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {formSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={newClient.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={newClient.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membership Type
              </label>
              <select
                name="membershipType"
                value={newClient.membershipType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1month">1 Month</option>
                <option value="3month">3 Months</option>
                <option value="6month">6 Months</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Client
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Clients</h2>
        
        {loading ? (
          <div className="text-center py-4">Loading clients...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No clients assigned yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{client.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{client.membershipType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(client.startDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(client.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Client Attendance Records</h2>
        
        {attendanceLoading ? (
          <div className="text-center py-4">Loading attendance records...</div>
        ) : attendanceError ? (
          <div className="text-red-500 text-center py-4">{attendanceError}</div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No attendance records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{record.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(record.checkInDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{record.qrCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard; 