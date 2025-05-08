import React from 'react';
import { useAuth } from '../context/AuthContext';

const TrainerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trainer Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
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
    </div>
  );
};

export default TrainerDashboard; 