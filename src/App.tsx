import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import AdminResidents from './roles/admin/pages/AdminResidents';
import AdminRegisterResident from './roles/admin/pages/AdminRegisterResident';
import AdminStaff from './roles/admin/pages/AdminStaff';
import AdminRequests from './roles/admin/pages/AdminRequests';
import AdminUserManagement from './roles/admin/pages/AdminUserManagement';
import StaffRequests from './roles/staff/pages/StaffRequests';
import StaffDocumentApproval from './roles/staff/pages/StaffDocumentApproval';
import ResidentRequests from './roles/resident/pages/ResidentRequests';
import ResidentRequestDocument from './roles/resident/pages/ResidentRequestDocument';
import ResidentRequestHistory from './roles/resident/pages/ResidentRequestHistory';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/user-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/residents"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminResidents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/register-resident"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRegisterResident />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRequests />
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/requests"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/approve/:id"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDocumentApproval />
              </ProtectedRoute>
            }
          />

          {/* Resident Routes */}
          <Route
            path="/resident/requests"
            element={
              <ProtectedRoute allowedRoles={['resident']}>
                <ResidentRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/request-document"
            element={
              <ProtectedRoute allowedRoles={['resident']}>
                <ResidentRequestDocument />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/request-history"
            element={
              <ProtectedRoute allowedRoles={['resident']}>
                <ResidentRequestHistory />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

