import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.jfif" 
              alt="Barangay Management System Logo" 
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-700 mb-2">Barangay Management System</h1>
          <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg shadow-md"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
          
          <div className="text-center mt-4 space-y-2">
            <div>
              <Link 
                to="/register" 
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Don't have an account? Register here
              </Link>
            </div>
            <div>
              <Link 
                to="/" 
                className="text-primary-600 hover:text-primary-800 text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </form>

        {/* <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-2">Test Credentials:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Admin: admin@gmail.com / admin123</p>
            <p>Staff: staff@gmail.com / staff123</p>
            <p>Resident: resident@gmail.com / resident123</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;

