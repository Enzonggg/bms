import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { getRequests } from '../../../utils/storage';

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    completed: 0,
    total: 0
  });

  const loadStats = () => {
    const requests = getRequests();
    setStats({
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      completed: requests.filter(r => r.status === 'completed').length,
      total: requests.length
    });
  };

  useEffect(() => {
    loadStats();
  }, [location.pathname]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-500 mt-2">Requires processing</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-gray-500 mt-2">Approved requests</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Requests</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-2">All document requests</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/staff/requests')}
              className="bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Process Requests
            </button>
            <button
              onClick={() => navigate('/staff/requests')}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              View All Requests
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffDashboard;

