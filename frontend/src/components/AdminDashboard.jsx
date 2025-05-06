import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaUser, 
  FaClock, 
  FaFileExport, 
  FaDumbbell,
  FaQrcode,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaIdCard
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRGenerator from './QRGenerator';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

// Utility functions
const exportToPDF = (data, columns, title) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
  
  autoTable(doc, {
    startY: 30,
    head: [columns],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [229, 62, 62] },
    styles: { fontSize: 9 },
    margin: { top: 30 }
  });
  
  const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

const calculateDaysRemaining = (startDate, membershipType) => {
  const start = new Date(startDate);
  const now = new Date();
  const months = membershipType === '1month' ? 1 : membershipType === '3month' ? 3 : 6;
  const endDate = new Date(start);
  endDate.setMonth(start.getMonth() + months);
  const diffTime = Math.max(0, endDate - now);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateAmount = (membershipType) => {
  const monthlyRate = 500;
  const months = membershipType === '1month' ? 1 : membershipType === '3month' ? 3 : 6;
  return months * monthlyRate;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    username: '',
    email: '',
    phone: '',
    membershipType: '1month',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Fetch all data on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    fetchClients();
    fetchAttendance();
  }, []);

  // Fetch attendance when filters change
  useEffect(() => {
    fetchAttendance();
  }, [dateFilter, monthFilter]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (error) {
      setError('Failed to fetch client records');
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/qr/attendance', {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: dateFilter, month: monthFilter }
      });
      setAttendance(response.data);
    } catch (error) {
      setError('Failed to fetch attendance records');
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleExportPDF = (type) => {
    if (type === 'clients') {
      const columns = ['Username', 'Email', 'Phone', 'Membership', 'Start Date', 'Days Left', 'Status'];
      const data = clients.map(client => {
        const daysRemaining = calculateDaysRemaining(client.startDate, client.membershipType);
        return [
          client.username || 'N/A',
          client.email || 'N/A',
          client.phone || 'N/A',
          client.membershipType || 'N/A',
          new Date(client.startDate).toLocaleDateString(),
          daysRemaining,
          daysRemaining > 0 ? 'Active' : 'Expired'
        ];
      });
      exportToPDF(data, columns, 'Client Management Report');
    } else {
      const columns = ['Username', 'Check-in Date'];
      const data = attendance.map(record => [
        record.username || 'N/A',
        new Date(record.checkInDate).toLocaleString()
      ]);
      exportToPDF(data, columns, 'Attendance Records');
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/clients/add', newClient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClients();
      setActiveTab('clients');
      setNewClient({
        username: '',
        email: '',
        phone: '',
        membershipType: '1month',
        startDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding client:', error);
      alert(error.response?.data?.message || 'Failed to add client');
    }
  };

  const handleDownloadInvoice = async (clientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/clients/invoice/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${selectedClient.username}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  const filteredClients = clients.filter(client =>
    client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dashboard Stats
  const stats = [
    { title: 'Total Members', value: clients.length, icon: <FaUser className="h-6 w-6" /> },
    { title: 'Active Members', value: clients.filter(c => calculateDaysRemaining(c.startDate, c.membershipType) > 0).length, icon: <FaDumbbell className="h-6 w-6" /> },
    { title: 'Today Check-ins', value: attendance.filter(a => new Date(a.checkInDate).toDateString() === new Date().toDateString()).length, icon: <FaIdCard className="h-6 w-6" /> },
    { title: 'Monthly Revenue', value: `₹${clients.reduce((sum, c) => sum + calculateAmount(c.membershipType), 0)}`, icon: <FaMoneyBillWave className="h-6 w-6" /> }
  ];

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update-admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      setSettingsSuccess('Settings updated successfully');
      setUser(data.user);
      setIsEditing(false);
      setEditFormData({
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setSettingsError(error.message);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-black shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <FaDumbbell className="h-8 w-8 text-red-500" />
              </motion.div>
              <span className="ml-2 text-xl font-bold text-white">IRON TEMPLE ADMIN</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-300">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-gray-300 min-h-screen hidden md:block">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-6 mt-4">Admin Panel</h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'hover:bg-gray-800'}`}
                  >
                    <FaChartLine className="mr-3" /> Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('addClient')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${activeTab === 'addClient' ? 'bg-red-600 text-white' : 'hover:bg-gray-800'}`}
                  >
                    <FaUser className="mr-3" /> Add New Client
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('clients')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${activeTab === 'clients' ? 'bg-red-600 text-white' : 'hover:bg-gray-800'}`}
                  >
                    <FaUser className="mr-3" /> Client Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${activeTab === 'attendance' ? 'bg-red-600 text-white' : 'hover:bg-gray-800'}`}
                  >
                    <FaIdCard className="mr-3" /> Attendance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('qrGenerator')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${activeTab === 'qrGenerator' ? 'bg-red-600 text-white' : 'hover:bg-gray-800'}`}
                  >
                    <FaQrcode className="mr-3" /> QR Generator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${activeTab === 'settings' ? 'bg-red-600 text-white' : 'hover:bg-gray-800'}`}
                  >
                    <FaCog className="mr-3" /> Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    variants={slideUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                        {stat.icon}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('clients')}
                    className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center transition-colors duration-300"
                  >
                    <FaUser className="text-red-500 mr-3" />
                    <span>Manage Clients</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendance')}
                    className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center transition-colors duration-300"
                  >
                    <FaIdCard className="text-red-500 mr-3" />
                    <span>View Attendance</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('addClient')}
                    className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center transition-colors duration-300"
                  >
                    <FaUser className="text-red-500 mr-3" />
                    <span>Add New Client</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Check-ins</h2>
                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : error ? (
                  <div className="text-red-600 py-4">{error}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendance.slice(0, 5).map((record, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <FaUser className="h-10 w-10 text-gray-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{record.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(record.checkInDate).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setActiveTab('addClient')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <FaUser className="mr-2" /> Add Client
                  </button>
                  <button
                    onClick={() => handleExportPDF('clients')}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <FaFileExport className="mr-2" /> Export
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Invoice Preview Modal */}
              {showInvoicePreview && selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                    <h3 className="text-xl font-bold mb-4">Invoice Preview</h3>
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>Username:</strong> {selectedClient.username}</p>
                          <p><strong>Email:</strong> {selectedClient.email}</p>
                          <p><strong>Phone:</strong> {selectedClient.phone}</p>
                        </div>
                        <div>
                          <p><strong>Membership:</strong> {selectedClient.membershipType}</p>
                          <p><strong>Start Date:</strong> {new Date(selectedClient.startDate).toLocaleDateString()}</p>
                          <p><strong>End Date:</strong> {new Date(new Date(selectedClient.startDate).setMonth(
                            new Date(selectedClient.startDate).getMonth() + 
                            (selectedClient.membershipType === '1month' ? 1 : 
                             selectedClient.membershipType === '3month' ? 3 : 6)
                          )).toLocaleDateString()}</p>
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
                                {selectedClient.membershipType === '1month' ? '1 Month' :
                                 selectedClient.membershipType === '3month' ? '3 Months' : '6 Months'}
                              </td>
                              <td className="border p-2">₹500/month</td>
                              <td className="border p-2">₹{calculateAmount(selectedClient.membershipType)}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-4 text-right">
                          <p className="font-bold">Total Amount: ₹{calculateAmount(selectedClient.membershipType)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDownloadInvoice(selectedClient._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Download PDF
                      </button>
                      <button
                        onClick={() => setShowInvoicePreview(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Clients Table */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                  <p className="mt-2">Loading clients...</p>
                </div>
              ) : error ? (
                <div className="text-red-600 py-4">{error}</div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Membership</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredClients.map((client) => {
                        const daysRemaining = calculateDaysRemaining(client.startDate, client.membershipType);
                        const isActive = daysRemaining > 0;
                        
                        return (
                          <tr key={client._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <FaUser className="h-10 w-10 text-gray-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{client.username}</div>
                                  <div className="text-sm text-gray-500">
                                    Joined: {new Date(client.startDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{client.email}</div>
                              <div className="text-sm text-gray-500">{client.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 capitalize">{client.membershipType.replace('month', ' month')}</div>
                              <div className="text-sm text-gray-500">
                                {daysRemaining} days remaining
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {isActive ? 'Active' : 'Expired'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedClient(client);
                                  setShowInvoicePreview(true);
                                }}
                                className="text-red-600 hover:text-red-900 mr-3"
                              >
                                Invoice
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Add Client Tab */}
          {activeTab === 'addClient' && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Add New Client</h1>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={handleAddClient}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={newClient.username}
                      onChange={(e) => setNewClient({...newClient, username: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Membership Type</label>
                    <select
                      value={newClient.membershipType}
                      onChange={(e) => setNewClient({...newClient, membershipType: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="1month">1 Month (₹500)</option>
                      <option value="3month">3 Months (₹1,500)</option>
                      <option value="6month">6 Months (₹3,000)</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newClient.startDate}
                      onChange={(e) => setNewClient({...newClient, startDate: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('clients')}
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Add Client
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Attendance Records</h1>
                <button
                  onClick={() => handleExportPDF('attendance')}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <FaFileExport className="mr-2" /> Export
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                      />
                      <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
                    <div className="relative">
                      <input
                        type="month"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                      />
                      <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setDateFilter('');
                      setMonthFilter('');
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                  <p className="mt-2">Loading attendance...</p>
                </div>
              ) : error ? (
                <div className="text-red-600 py-4">{error}</div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Check-in Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendance.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <FaUser className="h-10 w-10 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{record.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.checkInDate).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Checked-in
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* QR Generator Tab */}
          {activeTab === 'qrGenerator' && <QRGenerator />}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Account Settings</h2>
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditFormData({
                          username: user?.username || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Edit Settings
                    </button>
                  )}
                </div>

                {settingsError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {settingsError}
                  </div>
                )}

                {settingsSuccess && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {settingsSuccess}
                  </div>
                )}

                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={isEditing ? editFormData.username : user?.username}
                      onChange={handleSettingsChange}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                    />
                  </div>

                  {isEditing && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={editFormData.currentPassword}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={editFormData.newPassword}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={editFormData.confirmPassword}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </>
                  )}

                  {isEditing && (
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditFormData({
                            username: '',
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;