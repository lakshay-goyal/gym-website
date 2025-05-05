import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from './ChangePassword';

const ClientDashboard = () => {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/clients/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClientData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching client data');
      }
    };

    fetchClientData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Client Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {clientData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1 text-lg">{clientData.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-lg">{clientData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-lg">{clientData.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Membership Type</label>
                  <p className="mt-1 text-lg capitalize">{clientData.membershipType.replace('month', ' Month')} Plan</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-lg">{new Date(clientData.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="mt-1 text-lg">{new Date(clientData.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Days Remaining</label>
                  <p className={`mt-1 text-lg ${clientData.daysRemaining <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                    {clientData.daysRemaining} days
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <ChangePassword />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard; 