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