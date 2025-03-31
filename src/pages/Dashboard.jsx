import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileEditModal from './ProfileEditModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, profileCompletionPercentage, addNotification } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    connections: [],
    suggestedConnections: [],
    profileViews: 0,
    upcomingEvents: [],
    jobRecommendations: []
  });
  
  // If user hasn't completed enough of their profile, redirect to profile setup
  useEffect(() => {
    if (currentUser && profileCompletionPercentage < 40 && currentUser.profileCompletionRequired === true) {
      navigate('/profile-setup');
    } else if (currentUser && currentUser.profileCompletionRequired) {
      // Mark profile setup as completed when user reaches dashboard
      const updatedUser = {
        ...currentUser,
        profileCompletionRequired: false
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [currentUser, profileCompletionPercentage, navigate]);
  
  // Generate dynamic dashboard data based on user's profile
  useEffect(() => {
    if (!currentUser) return;
    
    // In a real app, this would be an API call to fetch personalized data
    // Here we simulate it by generating data based on user's profile
    const generateDashboardData = () => {
      // Generate data based on user profile type, industry, interests
      const profileType = currentUser.profileType || '';
      
      // Get skills from the user profile
      const skills = currentUser.skills || [];
      
      // Get roles from the profile (combining predefined and custom roles)
      const preferredRoles = [
        ...(currentUser.preferredRoles || []),
        ...(currentUser.customRoles || [])
      ];
      
      // Generate suggested connections based on industry and preferred roles
      const suggestedConnections = (skills.length > 0 || preferredRoles.length > 0) 
        ? generateSuggestedConnections(skills, preferredRoles)
        : [];
      
      // Generate upcoming events based on interests
      const upcomingEvents = skills.length > 0
        ? generateUpcomingEvents(skills)
        : [];
      
      // Generate job recommendations if user is a job seeker
      const jobRecommendations = currentUser.profileType === 'Job Seeker'
        ? generateJobRecommendations(preferredRoles, skills, currentUser.jobPreferences)
        : [];
      
      setDashboardData({
        connections: [], // Empty for new users
        suggestedConnections,
        profileViews: Math.floor(Math.random() * 10), // Random number for demo
        upcomingEvents,
        jobRecommendations
      });
    };
    
    generateDashboardData();
    
    // Simulate a notification after a few seconds
    const timer = setTimeout(() => {
      if (addNotification) {
        addNotification(`Welcome to your personalized dashboard, ${currentUser.firstName || currentUser.name || 'user'}!`);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [currentUser, addNotification]);
  
  // Helper functions to generate dashboard data
  const generateSuggestedConnections = (skills, preferredRoles) => {
    // Generate fictitious connections based on user's skills and roles
    const skillPeople = skills.slice(0, 2).map((skill, index) => ({
      id: index + 1,
      name: `${['Alex', 'Jordan', 'Taylor'][index]} Rivera`,
      role: `${skill} Expert`,
      mutualConnections: Math.floor(Math.random() * 5) + 1,
      profilePic: null
    }));
    
    // Generate role-based connections
    const rolePeople = preferredRoles.slice(0, 2).map((role, index) => ({
      id: 3 + index,
      name: `${['Sam', 'Casey', 'Jamie'][index]} Wilson`,
      role: role,
      mutualConnections: Math.floor(Math.random() * 8) + 1,
      profilePic: null
    }));
    
    return [...skillPeople, ...rolePeople];
  };
  
  const generateUpcomingEvents = (interests) => {
    // Generate events based on user's interests
    if (!interests || interests.length === 0) {
      return [
        { id: 1, title: 'Networking Basics Workshop', date: '2023-12-10T18:00:00', attendees: 24, virtual: true }
      ];
    }
    
    return interests.slice(0, 3).map((interest, index) => ({
      id: index + 1,
      title: `${interest} Networking Event`,
      date: new Date(Date.now() + (index + 1) * 86400000 * 3).toISOString(), // Random date in the future
      attendees: Math.floor(Math.random() * 50) + 10,
      virtual: Math.random() > 0.5
    }));
  };
  
  const generateJobRecommendations = (preferredRoles, skills, preferences) => {
    // Generate job recommendations based on user's roles, skills, and preferences
    if ((!preferredRoles || preferredRoles.length === 0) && (!skills || skills.length === 0)) {
      return [
        { id: 1, title: 'Entry Level Position', company: 'Various Companies', location: 'Remote', postedDate: new Date().toISOString() }
      ];
    }
    
    // Use preferred roles to generate job recommendations
    const roleJobs = preferredRoles.slice(0, 2).map((role, index) => {
      const remote = preferences?.remoteOnly ? 'Remote' : ['Remote', 'Hybrid', 'On-site'][Math.floor(Math.random() * 3)];
      
      return {
        id: index + 1,
        title: role,
        company: `${['Innovate', 'Tech', 'Global', 'Future', 'Smart'][Math.floor(Math.random() * 5)]} Solutions`,
        location: remote,
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000).toISOString() // Random date in the past week
      };
    });
    
    // Use skills to generate more job recommendations
    const skillJobs = skills.slice(0, 2).map((skill, index) => {
      const remote = preferences?.remoteOnly ? 'Remote' : ['Remote', 'Hybrid', 'On-site'][Math.floor(Math.random() * 3)];
      
      return {
        id: preferredRoles.length + index + 1,
        title: `${skill} ${['Specialist', 'Developer', 'Engineer'][Math.floor(Math.random() * 3)]}`,
        company: `${['Apex', 'Horizon', 'NextGen', 'Quantum', 'Elite'][Math.floor(Math.random() * 5)]} Technologies`,
        location: remote,
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000).toISOString() // Random date in the past week
      };
    });
    
    return [...roleJobs, ...skillJobs];
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format relative date (e.g., "2 days ago")
  const formatRelativeDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(dateString).split(',')[0]; // Just return the date portion
    }
  };
  
  if (!currentUser) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser.fullName || currentUser.name}!
          </h1>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <p className="text-gray-600 mb-4 md:mb-0">
              Your profile is {profileCompletionPercentage}% complete.
              {profileCompletionPercentage < 100 && (
                <Link to="/profile-setup" className="text-blue-600 hover:text-blue-800 ml-2">
                  Complete your profile
                </Link>
              )}
            </p>
            <Link
              to="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View your profile
            </Link>
          </div>
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Stats & Connections */}
          <div className="space-y-6">
            {/* Profile Stats Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Network</h2>
              
              <div className="flex justify-between text-center mb-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{dashboardData.connections.length}</div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{dashboardData.profileViews}</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
              </div>
              
              {/* User Type Information */}
              {currentUser.profileType && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">Your Profile</h3>
                  <div className="text-sm">
                    <p className="mb-1"><span className="font-medium">Profile Type:</span> {currentUser.profileType}</p>
                    
                    {currentUser.profileType === 'Job Seeker' && (
                      <>
                        {currentUser.employmentStatus && (
                          <p className="mb-1">
                            <span className="font-medium">Status:</span> {currentUser.employmentStatus === 'employed' ? 'Currently Employed' : 'Looking for Work'}
                            {currentUser.employmentStatus === 'employed' && currentUser.lookingToSwitch && (
                              <span className="text-blue-600 ml-1">- Open to opportunities</span>
                            )}
                          </p>
                        )}
                        
                        {(currentUser.preferredRoles && currentUser.preferredRoles.length > 0) || 
                         (currentUser.customRoles && currentUser.customRoles.length > 0) ? (
                          <div className="mb-1">
                            <span className="font-medium">Preferred Roles:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {[...(currentUser.preferredRoles || []), ...(currentUser.customRoles || [])].map((role, index) => (
                                <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        
                        {currentUser.locationPreference && (
                          <p className="mb-1">
                            <span className="font-medium">Location:</span> {currentUser.locationPreference === 'remote' ? 'Remote Only' : 'Open to Relocation'}
                          </p>
                        )}
                      </>
                    )}
                    
                    {currentUser.profileType === 'Recruiter (Companies Only)' && currentUser.companyName && (
                      <p className="mb-1"><span className="font-medium">Company:</span> {currentUser.companyName}</p>
                    )}
                    
                    {currentUser.profileType === 'Networking (Founder, Investor)' && (
                      <p className="mb-1">
                        <span className="font-medium">Role:</span> {currentUser.isFounder ? 'Founder' : 'Investor'}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <Link to="/networking" className="text-blue-600 text-sm hover:text-blue-800 inline-block">
                View all connections →
              </Link>
            </div>
            
            {/* Suggested Connections */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">People You May Know</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">See more</button>
              </div>
              
              {dashboardData.suggestedConnections.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.suggestedConnections.slice(0, 3).map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 font-semibold text-lg overflow-hidden">
                          {connection.profilePic ? (
                            <img src={connection.profilePic} alt={connection.name} className="w-full h-full object-cover" />
                          ) : (
                            connection.name.charAt(0)
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{connection.name}</p>
                          <p className="text-sm text-gray-600">{connection.role}</p>
                          <p className="text-xs text-gray-500">{connection.mutualConnections} mutual connections</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 border border-blue-600 rounded-md text-blue-600 text-sm hover:bg-blue-50">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">No suggestions yet</p>
                  <p className="text-sm">Complete your profile to see connection suggestions based on your industry and interests.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Middle Column - Activity Feed & Job Recommendations */}
          <div className="space-y-6">
            {/* Job Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
                <Link to="/jobs" className="text-sm text-blue-600 hover:text-blue-800">See all</Link>
              </div>
              
              {currentUser.profileType === 'Job Seeker' && dashboardData.jobRecommendations.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.jobRecommendations.slice(0, 3).map((job) => (
                    <div key={job.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <p className="text-sm text-gray-600">{job.location}</p>
                      <p className="text-xs text-gray-500 mt-1">Posted {formatRelativeDate(job.postedDate)}</p>
                    </div>
                  ))}
                </div>
              ) : currentUser.profileType === 'Job Seeker' ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">No job recommendations yet</p>
                  <p className="text-sm">Complete your profile and add your skills to see personalized job recommendations.</p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">Job recommendations are for job seekers</p>
                  <p className="text-sm">
                    {currentUser.profileType === 'Recruiter (Companies Only)' 
                      ? 'As a recruiter, you can post job openings instead.' 
                      : 'Change your profile type to Job Seeker to see job recommendations.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Activity Feed */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Feed</h2>
              
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                <p className="font-medium mb-2">No activities yet</p>
                <p className="text-sm">Connect with others and engage with content to see updates in your feed.</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Events & Quick Actions */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">See all</button>
              </div>
              
              {dashboardData.upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcomingEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="flex items-center mr-3">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          {event.attendees} attendees
                        </span>
                        <span>
                          {event.virtual ? 'Virtual Event' : 'In-Person Event'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">No events found</p>
                  <p className="text-sm">Explore or create one to connect with professionals in your field!</p>
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {currentUser.profileType === 'Job Seeker' && (
                  <>
                    <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
                      Update Job Preferences
                    </button>
                    <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
                      Browse Jobs
                    </button>
                  </>
                )}
                
                {currentUser.profileType === 'Recruiter (Companies Only)' && (
                  <>
                    <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
                      Post a Job
                    </button>
                    <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
                      Search Candidates
                    </button>
                  </>
                )}
                
                {currentUser.profileType === 'Networking (Founder, Investor)' && (
                  <>
                    <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
                      Discover Startups
                    </button>
                    <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
                      Investment Opportunities
                    </button>
                  </>
                )}
                
                <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
                  Find Connections
                </button>
                <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 