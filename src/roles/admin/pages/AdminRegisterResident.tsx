import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { Resident } from '../../../types';
import { saveResident } from '../../../utils/storage';
import { createUser } from '../../../utils/userManagement';
import { useAuth } from '../../../contexts/AuthContext';

const AdminRegisterResident: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Resident>>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    address: '',
    barangay: '',
    city: '',
    province: '',
    zipCode: '',
    birthDate: '',
    gender: 'male',
    civilStatus: 'single',
    occupation: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.barangay || 
        !formData.city || !formData.province || !formData.birthDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password is required and must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create user account
      const fullName = `${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`.trim();
      createUser({
        email: formData.email!,
        password: password,
        role: 'resident',
        name: fullName,
        isActive: true,
        createdBy: user?.id
      });

      // Create resident record
      const newResident: Resident = {
        id: `RES-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        middleName: formData.middleName,
        email: formData.email!,
        phone: formData.phone!,
        address: formData.address!,
        barangay: formData.barangay!,
        city: formData.city!,
        province: formData.province!,
        zipCode: formData.zipCode || '',
        birthDate: formData.birthDate!,
        gender: formData.gender as 'male' | 'female' | 'other',
        civilStatus: formData.civilStatus as 'single' | 'married' | 'widowed' | 'divorced' | 'separated',
        occupation: formData.occupation,
        registeredAt: new Date().toISOString(),
        registeredBy: user?.id
      };

      saveResident(newResident);
      setCreatedCredentials({ email: formData.email!, password: password });
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/admin/residents');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to register resident. Email may already exist.');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/residents')}
            className="text-primary-600 hover:text-primary-800 mb-4"
          >
            ← Back to Residents
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Register New Resident</h1>
          <p className="text-gray-600 mt-2">Fill in the resident information below</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && !createdCredentials && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Resident registered successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complete Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="House/Unit No., Street"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barangay <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/Municipality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Civil Status <span className="text-red-500">*</span>
              </label>
              <select
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="divorced">Divorced</option>
                <option value="separated">Separated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Login Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          {success && createdCredentials && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
              <p className="font-semibold mb-2">Login Credentials Created:</p>
              <div className="bg-white p-4 rounded border border-blue-300 mb-3">
                <p className="mb-2"><strong>Email:</strong> {createdCredentials.email}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Password:</strong>{' '}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {showPassword ? createdCredentials.password : '••••••••'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <p className="text-sm mt-2 text-yellow-700 font-medium">⚠️ Please save these credentials. The resident can use them to log in to the system.</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/residents')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Register Resident
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminRegisterResident;

