import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { DocumentRequest } from '../../../types';
import { getRequestsByResidentId, getRequestsByHashCode } from '../../../utils/storage';
import { getDocumentTypeLabel } from '../../../utils/documentTypes';
import { useAuth } from '../../../contexts/AuthContext';
import { getResidents } from '../../../utils/storage';

const ResidentRequestHistory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [searchHash, setSearchHash] = useState('');
  const [searchResult, setSearchResult] = useState<DocumentRequest | null>(null);

  const loadRequests = () => {
    if (user?.email) {
      const residents = getResidents();
      const resident = residents.find(r => r.email.toLowerCase() === user.email.toLowerCase());
      if (resident) {
        const residentRequests = getRequestsByResidentId(resident.id);
        setRequests(residentRequests.sort((a, b) => 
          new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
        ));
      }
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user, location.pathname]);

  const handleSearch = () => {
    if (searchHash.trim()) {
      const result = getRequestsByHashCode(searchHash.trim().toUpperCase());
      setSearchResult(result);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Request History</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">View and track your document requests</p>
          </div>
          <button
            onClick={() => navigate('/resident/request-document')}
            className="w-full sm:w-auto bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
          >
            New Request
          </button>
        </div>

        {/* Hash Code Search */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Search by Hash Code</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              placeholder="Enter request hash code (e.g., BRG-1234567890-ABC123)"
              className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base whitespace-nowrap"
            >
              Search
            </button>
          </div>
          {searchResult && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Search Result:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Hash Code:</span> <span className="font-mono">{searchResult.hashCode}</span></p>
                <p><span className="font-medium">Document:</span> {getDocumentTypeLabel(searchResult.documentType)}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(searchResult.status)}`}>
                    {searchResult.status.toUpperCase()}
                  </span>
                </p>
                <p><span className="font-medium">Requested:</span> {formatDate(searchResult.requestedAt)}</p>
                {searchResult.processedAt && (
                  <p><span className="font-medium">Processed:</span> {formatDate(searchResult.processedAt)}</p>
                )}
              </div>
            </div>
          )}
          {searchHash && !searchResult && searchHash.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              No request found with the provided hash code.
            </div>
          )}
        </div>

        {/* Request List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">My Requests</h2>
          </div>
          {requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No requests found. Submit your first document request to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hash Code
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Purpose
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Requested Date
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="font-mono text-xs sm:text-sm font-medium text-primary-600">
                          {request.hashCode}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {getDocumentTypeLabel(request.documentType)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 max-w-xs truncate hidden sm:table-cell">
                        {request.purpose}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(request.requestedAt)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <button
                          onClick={() => {
                            setSearchHash(request.hashCode);
                            handleSearch();
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
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

export default ResidentRequestHistory;

