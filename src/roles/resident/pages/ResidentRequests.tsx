import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import ResidentRequestHistory from './ResidentRequestHistory';

const ResidentRequests: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          <button
            onClick={() => navigate('/resident/request-document')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            New Request
          </button>
        </div>
        <ResidentRequestHistory />
      </div>
    </Layout>
  );
};

export default ResidentRequests;

