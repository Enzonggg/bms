import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { DocumentRequest, DocumentType } from '../../../types';
import { saveRequest, generateHashCode, getResidents } from '../../../utils/storage';
import { DOCUMENT_TYPES } from '../../../utils/documentTypes';
import { useAuth } from '../../../contexts/AuthContext';

const ResidentRequestDocument: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    documentType: '' as DocumentType | '',
    purpose: '',
    residentId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hashCode, setHashCode] = useState('');

  useEffect(() => {
    // Find resident by email
    if (user?.email) {
      const residents = getResidents();
      const resident = residents.find(r => r.email.toLowerCase() === user.email.toLowerCase());
      if (resident) {
        setFormData(prev => ({ ...prev, residentId: resident.id }));
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.documentType || !formData.purpose || !formData.residentId) {
      setError('Please fill in all required fields');
      return;
    }

    const residents = getResidents();
    const resident = residents.find(r => r.id === formData.residentId);
    
    if (!resident) {
      setError('Resident information not found. Please contact admin.');
      return;
    }

    const newHashCode = generateHashCode();
    const newRequest: DocumentRequest = {
      id: `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      hashCode: newHashCode,
      residentId: formData.residentId,
      residentName: `${resident.firstName} ${resident.lastName}`,
      documentType: formData.documentType as DocumentType,
      purpose: formData.purpose,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    saveRequest(newRequest);
    setHashCode(newHashCode);
    setSuccess(true);
    
    setTimeout(() => {
      navigate('/resident/requests');
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/resident/requests')}
            className="text-primary-600 hover:text-primary-800 mb-4"
          >
            ← Back to Requests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Request Document</h1>
          <p className="text-gray-600 mt-2">Submit a request for barangay documents</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Request submitted successfully!</p>
            <p className="mt-2">Your request hash code: <span className="font-mono font-bold text-lg">{hashCode}</span></p>
            <p className="text-sm mt-1">Please save this code for tracking your request.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select document type</option>
              {DOCUMENT_TYPES.map(doc => (
                <option key={doc.value} value={doc.value}>
                  {doc.label} - {doc.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose <span className="text-red-500">*</span>
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Please specify the purpose of this document request..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/resident/requests')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={success}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ResidentRequestDocument;

