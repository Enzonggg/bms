import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.jfif" 
            alt="Barangay Management System Logo" 
            className="h-24 w-auto object-contain"
          />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

