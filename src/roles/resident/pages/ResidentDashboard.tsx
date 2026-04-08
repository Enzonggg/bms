import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { getRequestsByResidentId } from '../../../utils/storage';
import { getResidents } from '../../../utils/storage';

const ResidentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0
  });

  const loadStats = () => {
    if (user?.email) {
      const residents = getResidents();
      const resident = residents.find(r => r.email.toLowerCase() === user.email.toLowerCase());
      if (resident) {
        const requests = getRequestsByResidentId(resident.id);
        setStats({
          total: requests.length,
          pending: requests.filter(r => r.status === 'pending').length,
          approved: requests.filter(r => r.status === 'approved').length,
          completed: requests.filter(r => r.status === 'completed').length
        });
      }
    }
  };

  useEffect(() => {
    loadStats();
  }, [user, location.pathname]);

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resident Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Welcome, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">My Requests</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-2">Total requests</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.approved + stats.completed}</p>
            <p className="text-sm text-gray-500 mt-2">Approved/Completed</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-500 mt-2">Awaiting approval</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/resident/request-document')}
              className="bg-primary-600 text-white px-4 py-2.5 sm:py-3 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
            >
              Request Document
            </button>
            <button
              onClick={() => navigate('/resident/requests')}
              className="bg-blue-600 text-white px-4 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            >
              View My Requests
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResidentDashboard;

