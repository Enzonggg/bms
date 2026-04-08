import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { UserAccount, UserRole } from '../../../types';
import { getAllUsers, createUser, deleteUser, updateUser } from '../../../utils/userManagement';
import { useAuth } from '../../../contexts/AuthContext';

const AdminUserManagement: React.FC = () => {
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [filter, setFilter] = useState<'all' | 'admin' | 'staff' | 'resident'>('all');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident' as UserRole,
    name: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        updateUser(editingUser.id, {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          name: formData.name,
          isActive: formData.isActive
        });
        setSuccess('User updated successfully!');
      } else {
        // Create new user
        createUser({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          name: formData.name,
          isActive: formData.isActive,
          createdBy: currentUser?.id
        });
        setSuccess('User created successfully!');
      }

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'resident',
        name: '',
        isActive: true
      });
      setShowAddForm(false);
      setEditingUser(null);
      loadUsers();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    }
  };

  const handleEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      name: user.name,
      isActive: user.isActive
    });
    setShowAddForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      setError('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
      loadUsers();
      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'resident',
      name: '',
      isActive: true
    });
    setError('');
    setSuccess('');
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      case 'resident':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage staff and resident accounts</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Add New User
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={!!editingUser}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {!editingUser && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUser}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password {!editingUser && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!editingUser}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="resident">Resident</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Active Account
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setFilter('staff')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'staff' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Staff ({users.filter(u => u.role === 'staff').length})
            </button>
            <button
              onClick={() => setFilter('resident')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'resident' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Residents ({users.filter(u => u.role === 'resident').length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No users found.</p>
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
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          Edit
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
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

export default AdminUserManagement;

