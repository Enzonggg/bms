import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-1 sm:space-x-3 min-w-0 flex-1">
              <img 
                src="/logo.jfif" 
                alt="Barangay Management System Logo" 
                className="h-8 sm:h-10 w-auto object-contain flex-shrink-0"
              />
              <span className="text-sm sm:text-lg lg:text-xl font-bold text-primary-700 truncate">
                <span className="hidden sm:inline">Barangay Management System</span>
                <span className="sm:hidden">BMS</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-primary-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-primary-700 transition text-xs sm:text-sm whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Go to Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-700 transition text-xs sm:text-sm whitespace-nowrap"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="bg-primary-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-primary-700 transition text-xs sm:text-sm whitespace-nowrap"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <img 
              src="/logo.jfif" 
              alt="Barangay Management System Logo" 
              className="h-24 sm:h-32 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Barangay Management System
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Streamline your barangay operations with our comprehensive management system designed for efficient resident and document handling. 
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition text-base sm:text-lg font-semibold shadow-lg"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-primary-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-primary-700 transition text-base sm:text-lg font-semibold shadow-lg"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-primary-600 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Resident Management</h3>
            <p className="text-gray-600">
              Efficiently manage resident information, including personal details, family composition, and residency status. 
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-primary-600 text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Document Requests</h3>
            <p className="text-gray-600">
              Process document requests including indigency clearance, barangay clearance, and certificates.Track request status and history for residents and officials.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-primary-600 text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Access</h3>
            <p className="text-gray-600">
              Role-based access control ensures secure and organized management of barangay operations.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8 px-4">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Indigency Clearance</h4>
              <p className="text-sm text-gray-600">Certificate for indigent residents</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Barangay Clearance</h4>
              <p className="text-sm text-gray-600">General barangay clearance certificate</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Residency Certificate</h4>
              <p className="text-sm text-gray-600">Proof of residency in the barangay</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Business Permit</h4>
              <p className="text-sm text-gray-600">Permit to operate business in barangay</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="mt-12 sm:mt-16 lg:mt-20 bg-primary-600 rounded-lg p-6 sm:p-8 text-center text-white mx-4 sm:mx-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
            <p className="text-base sm:text-lg mb-4 sm:mb-6">Register as a resident or sign in to access your account and manage your barangay services.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-block bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition text-base sm:text-lg font-semibold shadow-lg"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-block bg-white text-primary-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 transition text-base sm:text-lg font-semibold shadow-lg"
              >
                Login Now
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">© 2024 Barangay Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

