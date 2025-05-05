import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChangePassword from './ChangePassword';

const ClientDashboard = () => {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState('');
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
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
        setClientData(response.data);
      } catch (err) {
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

  const calculateAmount = (membershipType) => {
    const monthlyRate = 500; // 500 rupees per month
    let months = 0;
    switch (membershipType) {
      case '1month':
        months = 1;
        break;
      case '3month':
        months = 3;
        break;
      case '6month':
        months = 6;
        break;
      default:
        months = 1;
    }
    return months * monthlyRate;
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

      // Create a URL for the blob
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

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Client Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {clientData?.username}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div 
                className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                onClick={() => navigate('/client/qr-scanner')}
              >
                <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
                <p className="text-gray-600">Scan QR code to check in/out</p>
              </div>
              <div 
                className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                onClick={() => navigate('/client/attendance')}
              >
                <h3 className="text-lg font-semibold mb-2">Attendance History</h3>
                <p className="text-gray-600">View your attendance records</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Profile</h3>
                <p className="text-gray-600">Manage your profile information</p>
              </div>
            </div>
        
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
                    <div className="mt-4">
                      <button
                        onClick={() => setShowInvoicePreview(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        View Invoice
                      </button>
                      <button
                        onClick={handleDownloadInvoice}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Download Invoice
                      </button>
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
      </div>

      {/* Invoice Preview Modal */}
      {showInvoicePreview && clientData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Invoice Preview</h3>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Username:</strong> {clientData.username}</p>
                  <p><strong>Email:</strong> {clientData.email}</p>
                  <p><strong>Phone:</strong> {clientData.phone}</p>
                </div>
                <div>
                  <p><strong>Membership Type:</strong> {clientData.membershipType}</p>
                  <p><strong>Start Date:</strong> {new Date(clientData.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(clientData.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Duration</th>
                      <th className="border p-2">Rate</th>
                      <th className="border p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Gym Membership</td>
                      <td className="border p-2">
                        {clientData.membershipType === '1month' ? '1 Month' :
                         clientData.membershipType === '3month' ? '3 Months' : '6 Months'}
                      </td>
                      <td className="border p-2">₹500/month</td>
                      <td className="border p-2">₹{calculateAmount(clientData.membershipType)}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 text-right">
                  <p className="font-bold">Total Amount: ₹{calculateAmount(clientData.membershipType)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDownloadInvoice}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Download PDF
              </button>
              <button
                onClick={() => setShowInvoicePreview(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard; 