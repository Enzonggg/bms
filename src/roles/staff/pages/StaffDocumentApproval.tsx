import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { DocumentRequest } from '../../../types';
import { getRequestById, saveRequest, getResidentById } from '../../../utils/storage';
import { getDocumentTypeLabel } from '../../../utils/documentTypes';
import { useAuth } from '../../../contexts/AuthContext';

const StaffDocumentApproval: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [resident, setResident] = useState<any>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const loadRequestData = () => {
    if (id) {
      const requestData = getRequestById(id);
      if (requestData) {
        setRequest(requestData);
        const residentData = getResidentById(requestData.residentId);
        setResident(residentData);
      }
    }
  };

  useEffect(() => {
    loadRequestData();
  }, [id, location.pathname]);

  const handleApprove = () => {
    if (!request || !user) return;

    const updatedRequest: DocumentRequest = {
      ...request,
      status: 'approved',
      processedBy: user.id,
      processedAt: new Date().toISOString(),
      remarks: remarks || undefined
    };

    saveRequest(updatedRequest);
    navigate('/staff/requests');
  };

  const handleReject = () => {
    if (!request || !user || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    const updatedRequest: DocumentRequest = {
      ...request,
      status: 'rejected',
      processedBy: user.id,
      processedAt: new Date().toISOString(),
      rejectionReason: rejectionReason
    };

    saveRequest(updatedRequest);
    navigate('/staff/requests');
  };

  const handleComplete = () => {
    if (!request || !user) return;

    const updatedRequest: DocumentRequest = {
      ...request,
      status: 'completed',
      processedBy: user.id,
      processedAt: new Date().toISOString(),
      remarks: remarks || request.remarks
    };

    saveRequest(updatedRequest);
    navigate('/staff/requests');
  };

  if (!request) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Request not found</p>
          <button
            onClick={() => navigate('/staff/requests')}
            className="mt-4 text-primary-600 hover:text-primary-800"
          >
            ← Back to Requests
          </button>
        </div>
      </Layout>
    );
  }

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/staff/requests')}
            className="text-primary-600 hover:text-primary-800 mb-4"
          >
            ← Back to Requests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Document Approval</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Request Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Request Hash Code</p>
                  <p className="font-mono font-semibold text-primary-600">{request.hashCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Document Type</p>
                  <p className="font-semibold">{getDocumentTypeLabel(request.documentType)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requested Date</p>
                  <p>{formatDate(request.requestedAt)}</p>
                </div>
              </div>
            </div>

            {/* Resident Information */}
            {resident && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Resident Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{resident.firstName} {resident.middleName} {resident.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{resident.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{resident.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{resident.address}, {resident.barangay}, {resident.city}, {resident.province}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Purpose */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Purpose</h2>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{request.purpose}</p>
            </div>

            {/* Processing Section */}
            {request.status === 'pending' && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Process Request</h2>
                
                {action === null && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setAction('approve')}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => setAction('reject')}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                    >
                      Reject Request
                    </button>
                  </div>
                )}

                {action === 'approve' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarks (Optional)
                      </label>
                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Add any remarks or notes..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                      >
                        Confirm Approval
                      </button>
                      <button
                        onClick={() => setAction(null)}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {action === 'reject' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Please provide a reason for rejection..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleReject}
                        className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => {
                          setAction(null);
                          setRejectionReason('');
                        }}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Complete Request */}
            {request.status === 'approved' && (
              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Final Remarks (Optional)
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Add final remarks..."
                    />
                  </div>
                  <button
                    onClick={handleComplete}
                    className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                  >
                    Mark as Completed
                  </button>
                </div>
              </div>
            )}

            {/* Existing Remarks/Rejection Reason */}
            {request.remarks && (
              <div className="border-t pt-6">
                <p className="text-sm text-gray-500 mb-1">Remarks</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{request.remarks}</p>
              </div>
            )}

            {request.rejectionReason && (
              <div className="border-t pt-6">
                <p className="text-sm text-gray-500 mb-1">Rejection Reason</p>
                <p className="text-red-700 bg-red-50 p-4 rounded-lg">{request.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffDocumentApproval;

