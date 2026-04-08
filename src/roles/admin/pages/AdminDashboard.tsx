import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { getResidents } from '../../../utils/storage';
import { getRequests } from '../../../utils/storage';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    residents: 0,
    requests: 0,
    pendingRequests: 0
  });

  const loadStats = () => {
    const residents = getResidents();
    const requests = getRequests();
    setStats({
      residents: residents.length,
      requests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length
    });
  };

  useEffect(() => {
    loadStats();
  }, [location.pathname]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Residents</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.residents}</p>
            <p className="text-sm text-gray-500 mt-2">Registered residents</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Requests</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.requests}</p>
            <p className="text-sm text-gray-500 mt-2">All document requests</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            <p className="text-sm text-gray-500 mt-2">Requires attention</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/user-management')}
              className="bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              User Management
            </button>
            <button
              onClick={() => navigate('/admin/register-resident')}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Register Resident
            </button>
            <button
              onClick={() => navigate('/admin/residents')}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Manage Residents
            </button>
            <button
              onClick={() => navigate('/admin/requests')}
              className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition"
            >
              View All Requests
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

