import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';
import AttendanceDashboard from './components/AttendanceDashboard';
import AccountSettings from './components/AccountSettings';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/qr-generator"
          element={
            <PrivateRoute role="admin">
              <QRGenerator />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/dashboard"
          element={
            <PrivateRoute role="client">
              <ClientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/qr-scanner"
          element={
            <PrivateRoute role="client">
              <QRScanner />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/attendance"
          element={
            <PrivateRoute role="client">
              <AttendanceDashboard username={user?.username} />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/account-settings"
          element={
            <PrivateRoute role="client">
              <AccountSettings />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
