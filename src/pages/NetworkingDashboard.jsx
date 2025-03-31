import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

const NetworkingDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, switchUserRole } = useAuth();
  const { darkMode } = useDarkMode();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in and is a networker
  useEffect(() => {
    if (!currentUser || currentUser.profileType !== 'Networker') {
      navigate('/login');
      return;
    }
    setLoading(false);
  }, [currentUser, navigate]);
  
  // Handle role switching
  const handleRoleSwitch = async (newRole) => {
    const success = await switchUserRole(newRole);
    if (success) {
      if (newRole === 'Job Seeker') {
        navigate('/job-seeker-dashboard');
      } else if (newRole === 'Recruiter') {
        navigate('/recruiter-dashboard');
      } else if (newRole === 'Networker') {
        navigate('/networking-dashboard');
      } else {
        navigate('/dashboard');
      }
      setShowRoleSwitcher(false);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md px-4 md:px-6 py-4 fixed w-full top-0 z-10`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">NetworkingApp</h1>
          </div>
          
          <div className="flex items-center">
            <div className="relative mr-3">
              <button 
                className="flex items-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                title="Switch Role"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="ml-1 text-sm hidden md:inline">Role: Networker</span>
              </button>
              
              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-30 dark:bg-gray-800">
                  <div className="p-2 border-b dark:border-gray-700">
                    <p className="text-sm font-medium">Switch Role</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => handleRoleSwitch('Job Seeker')}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mb-1 flex items-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      Job Seeker
                    </button>
                    <button 
                      onClick={() => handleRoleSwitch('Recruiter')}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mb-1 flex items-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      Recruiter
                    </button>
                    <button 
                      onClick={() => handleRoleSwitch('Networker')}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                      Networker
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                className="flex items-center"
                onClick={() => navigate('/profile')}
              >
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                  {currentUser?.firstName ? currentUser.firstName[0] : 'U'}
                </div>
                <span className="ml-2 hidden md:inline">{currentUser?.firstName || 'User'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="pt-16 min-h-screen p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">Networker Dashboard</h1>
          
          {/* User Type Info */}
          <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-semibold mb-4">
              Welcome, {currentUser?.firstName || 'User'}!
            </h2>
            <p className="mb-2">You are logged in as a {currentUser?.networkerType || 'Networker'}</p>
            
            {currentUser?.networkerType === 'Founder' && (
              <div className="mt-4">
                <h3 className="font-medium">Your Company</h3>
                <p className="text-sm mt-1">{currentUser?.companyName || 'Company name not provided'}</p>
                {currentUser?.companyWebsite && (
                  <p className="text-sm mt-1">
                    <a href={currentUser.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {currentUser.companyWebsite}
                    </a>
                  </p>
                )}
                <p className="text-sm mt-1">{currentUser?.companyDescription || 'Company description not provided'}</p>
              </div>
            )}
            
            {currentUser?.networkerType === 'Investor' && (
              <div className="mt-4">
                <h3 className="font-medium">Investment Details</h3>
                <p className="text-sm mt-1">Industry Focus: {currentUser?.investmentIndustry?.join(', ') || 'Not specified'}</p>
                <p className="text-sm mt-1">Companies Funded: {currentUser?.companiesFunded || 'Not specified'}</p>
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-2">Find Connections</h3>
              <p className="text-sm mb-4">Connect with other professionals in your industry</p>
              <Link to="/networking" className="text-blue-600 hover:underline">Explore network</Link>
            </div>
            
            <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-2">Events</h3>
              <p className="text-sm mb-4">Discover networking events and opportunities</p>
              <Link to="/events" className="text-blue-600 hover:underline">View events</Link>
            </div>
            
            <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-2">Messages</h3>
              <p className="text-sm mb-4">Check your conversations with connections</p>
              <Link to="/messaging" className="text-blue-600 hover:underline">Go to messages</Link>
            </div>
          </div>
          
          {/* Placeholder for remaining dashboard content */}
          <div className={`p-6 rounded-lg shadow-md text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Networker Dashboard Under Development</h2>
            <p>More features for {currentUser?.networkerType || 'Networker'} users coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkingDashboard; 