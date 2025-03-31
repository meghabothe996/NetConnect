import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

const NotFoundPage = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useDarkMode();
  
  // Determine where to redirect the user based on their profile type
  const getDashboardPath = () => {
    if (!currentUser) return '/';
    
    switch (currentUser.profileType) {
      case 'Job Seeker':
        return '/job-seeker-dashboard';
      case 'Recruiter':
        return '/recruiter-dashboard';
      case 'Networker':
        return '/networking-dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 text-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`max-w-md p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-6xl font-bold mb-4 text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="mb-6">The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to={getDashboardPath()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md border transition duration-300 ${
              darkMode 
                ? 'border-gray-600 hover:bg-gray-700' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 