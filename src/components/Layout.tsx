import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-1 sm:space-x-3 min-w-0 flex-1">
              <Link to="/dashboard" className="flex items-center space-x-1 sm:space-x-3 min-w-0">
                <img 
                  src="/logo.jfif" 
                  alt="Barangay Management System Logo" 
                  className="h-8 sm:h-10 w-auto object-contain flex-shrink-0"
                />
                <span className="text-sm sm:text-lg lg:text-xl font-bold text-primary-700 truncate">
                  <span className="hidden sm:inline">Barangay Management System</span>
                  <span className="sm:hidden">BMS</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[80px] sm:max-w-none">{user?.name}</span>
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getRoleColor(user?.role || '')}`}>
                  {user?.role.toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

