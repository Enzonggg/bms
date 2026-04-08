import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { Resident } from '../../../types';
import { getResidents, deleteResident } from '../../../utils/storage';

const AdminResidents: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [residents, setResidents] = useState<Resident[]>([]);

  const loadResidents = () => {
    const allResidents = getResidents();
    setResidents(allResidents);
  };

  useEffect(() => {
    loadResidents();
  }, [location.pathname]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      deleteResident(id);
      loadResidents();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Resident Management</h1>
          <button
            onClick={() => navigate('/admin/register-resident')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Register New Resident
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {residents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No residents registered yet.</p>
              <button
                onClick={() => navigate('/admin/register-resident')}
                className="mt-4 text-primary-600 hover:text-primary-800"
              >
                Register the first resident →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {residents.map((resident) => (
                    <tr key={resident.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {resident.firstName} {resident.middleName} {resident.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {resident.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {resident.address}, {resident.barangay}, {resident.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {resident.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(resident.registeredAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(resident.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminResidents;

