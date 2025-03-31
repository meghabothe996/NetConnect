import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated, switchUserRole } = useAuth();
  const navigate = useNavigate();
  
  // Mock notifications data
  const notifications = [
    { id: 1, content: 'John Doe viewed your profile', timestamp: '2023-03-29T15:30:00', read: false },
    { id: 2, content: 'You have a new connection request from Jane Smith', timestamp: '2023-03-29T13:45:00', read: false },
    { id: 3, content: 'New job matching your profile: Frontend Developer at Tech Co', timestamp: '2023-03-28T10:15:00', read: true },
  ];
  
  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  const handleSignOut = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  const handleRoleSwitch = async (newRole) => {
    // Determine internal role name
    let internalRole = newRole;
    if (newRole === 'Recruiter (Companies Only)') internalRole = 'Recruiter';
    if (newRole === 'Networking (Founder, Investor)') internalRole = 'Networker';
    
    const success = await switchUserRole(internalRole);
    if (success) {
      // Navigate to the appropriate dashboard based on the new role
      if (internalRole === 'Job Seeker') {
        navigate('/job-seeker-dashboard');
      } else if (internalRole === 'Recruiter') {
        navigate('/recruiter-dashboard');
      } else if (internalRole === 'Networker') {
        navigate('/networking-dashboard');
      } else {
        navigate('/dashboard');
      }
      setIsProfileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 text-2xl font-bold">
            NetConnect
          </Link>
          <div className="ml-10 hidden md:flex space-x-6">
            {currentUser ? (
              <>
                {currentUser.profileType === 'Job Seeker' ? (
                  <Link to="/job-seeker-dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                ) : currentUser.profileType === 'Recruiter' ? (
                  <Link to="/recruiter-dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                ) : currentUser.profileType === 'Networker' ? (
                  <Link to="/networking-dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                <Link to="/jobs" className="text-gray-700 hover:text-blue-600">
                  Jobs
                </Link>
                <Link to="/network" className="text-gray-700 hover:text-blue-600">
                  Network
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-blue-600">
                  Messages
                </Link>
              </>
            ) : (
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="text-gray-700 hover:text-blue-600 relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                    <div className="py-2 px-4 bg-gray-100 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div key={notification.id} className={`py-2 px-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                            <p className="text-sm text-gray-700">{notification.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 px-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="py-2 px-4 bg-gray-100 text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <Link to="/profile" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    
                    {/* Link to appropriate dashboard based on user type */}
                    {currentUser.profileType === 'Job Seeker' ? (
                      <Link to="/job-seeker-dashboard" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                    ) : currentUser.profileType === 'Recruiter' ? (
                      <Link to="/recruiter-dashboard" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                    ) : currentUser.profileType === 'Networker' ? (
                      <Link to="/networking-dashboard" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                    )}
                    
                    {/* Role Switcher */}
                    <div className="relative">
                      <button 
                        className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          document.getElementById('roleSwitcherMenu').classList.toggle('hidden');
                        }}
                      >
                        Switch Role
                      </button>
                      
                      <div id="roleSwitcherMenu" className="absolute hidden right-full top-0 w-48 bg-white rounded-md shadow-lg z-50">
                        <button 
                          onClick={() => handleRoleSwitch('Job Seeker')}
                          className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Job Seeker
                        </button>
                        <button 
                          onClick={() => handleRoleSwitch('Recruiter')}
                          className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Recruiter
                        </button>
                        <button 
                          onClick={() => handleRoleSwitch('Networker')}
                          className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Networker
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Register
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 border-t mt-2">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Dashboard
              </Link>
              <Link to="/jobs" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Jobs
              </Link>
              <Link to="/network" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Network
              </Link>
              <Link to="/messages" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Messages
              </Link>
              <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Profile
              </Link>
              <button 
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Home
              </Link>
              <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Login
              </Link>
              <Link to="/register" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 