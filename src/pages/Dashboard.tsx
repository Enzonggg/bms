import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../roles/admin/pages/AdminDashboard';
import StaffDashboard from '../roles/staff/pages/StaffDashboard';
import ResidentDashboard from '../roles/resident/pages/ResidentDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'resident':
      return <ResidentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default Dashboard;

