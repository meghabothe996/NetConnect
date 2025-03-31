import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import ProfileEditModal from './ProfileEditModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, switchUserRole } = useAuth();
  const { darkMode } = useDarkMode();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    connections: [],
    suggestedConnections: [],
    profileViews: 0,
    upcomingEvents: [],
    jobRecommendations: []
  });
  
  // State for job seeker dashboard
  const [recentJobs, setRecentJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Hello! I\'m your AI career assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  
  // If user hasn't completed profile, redirect to profile setup
  useEffect(() => {
    if (currentUser && currentUser.profileCompletionRequired === true) {
      navigate('/profile-setup');
    }
  }, [currentUser, navigate]);
  
  // Generate dynamic dashboard data based on user's profile
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    
    // Different data based on user profile type
    if (currentUser.profileType === 'Job Seeker') {
      initializeJobSeekerData();
    } else if (currentUser.profileType === 'Recruiter') {
      initializeRecruiterData();
    } else if (currentUser.profileType === 'Networker') {
      initializeNetworkerData();
    } else {
      // Generic data for other profile types
      initializeGenericData();
    }
    
    setLoading(false);
  }, [currentUser]);
  
  // Initialize data for Job Seeker profile
  const initializeJobSeekerData = () => {
    // Dummy data for job seeker dashboard
    const dummyEvents = [
      {
        id: 1,
        title: "Virtual Tech Career Fair",
        date: "2023-12-15T10:00:00",
        isVirtual: true,
        location: "",
        attendees: 325,
        description: "Connect with top tech companies looking to hire talented professionals."
      },
      {
        id: 2,
        title: "Frontend Developer Workshop",
        date: "2023-12-20T14:00:00",
        isVirtual: true,
        location: "",
        attendees: 128,
        description: "Learn the latest trends and techniques in frontend development."
      }
    ];

    const dummyJobs = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechGrowth Inc.",
        location: "Remote",
        skills: ["React", "TypeScript", "GraphQL"],
        postedDate: "2023-12-01",
        salary: "$120,000 - $150,000"
      },
      {
        id: 2,
        title: "Full Stack Engineer",
        company: "InnovateX",
        location: "New York, NY",
        skills: ["Node.js", "React", "MongoDB"],
        postedDate: "2023-12-03",
        salary: "$130,000 - $160,000"
      }
    ];

    const dummyApplications = [
      {
        id: 1,
        title: "Mobile Developer",
        company: "AppWorks Inc.",
        status: "Interview",
        appliedDate: "Nov 25, 2023"
      },
      {
        id: 2,
        title: "Backend Engineer",
        company: "DataSystems Corp",
        status: "Applied",
        appliedDate: "Dec 1, 2023"
      }
    ];

    const dummySavedJobs = [
      {
        id: 4,
        title: "DevOps Engineer",
        company: "CloudNative Solutions",
        location: "Remote",
        postedDate: "2023-12-04"
      },
      {
        id: 5,
        title: "Product Manager",
        company: "ProductLaunch Inc.",
        location: "Boston, MA",
        postedDate: "2023-12-02"
      }
    ];

    setEvents(dummyEvents);
    setRecentJobs(dummyJobs);
    setAppliedJobs(dummyApplications);
    setSavedJobs(dummySavedJobs);
  };
  
  // Initialize data for Recruiter profile
  const initializeRecruiterData = () => {
    const dummyJobPostings = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: currentUser.companyName || "Your Company",
        location: "Remote",
        applications: 12,
        status: "Active",
        postedDate: "2023-12-01",
        skills: ["React", "TypeScript", "GraphQL"]
      },
      {
        id: 2,
        title: "Full Stack Engineer",
        company: currentUser.companyName || "Your Company",
        location: "New York, NY",
        applications: 8,
        status: "Active",
        postedDate: "2023-12-03",
        skills: ["Node.js", "React", "MongoDB"]
      }
    ];

    const dummyApplicants = [
      {
        id: 1,
        name: "Alex Johnson",
        role: "Senior Frontend Developer",
        skills: ["React", "TypeScript", "Node.js"],
        status: "Shortlisted",
        applicationDate: "Dec 5, 2023"
      },
      {
        id: 2,
        name: "Sarah Williams",
        role: "Full Stack Engineer",
        skills: ["Python", "Django", "React"],
        status: "In Review",
        applicationDate: "Dec 7, 2023"
      }
    ];

    setDashboardData({
      ...dashboardData,
      jobPostings: dummyJobPostings,
      applicants: dummyApplicants
    });
  };
  
  // Initialize data for Networker profile
  const initializeNetworkerData = () => {
    // For Networkers (Founders/Investors)
    const dummyStartups = [
      {
        id: 1,
        name: "InnovateTech",
        industry: "Software/AI",
        stage: "Seed",
        description: "AI-powered project management platform",
        foundedYear: 2022
      },
      {
        id: 2,
        name: "GreenEnergy Solutions",
        industry: "CleanTech",
        stage: "Series A",
        description: "Sustainable energy solutions for residential buildings",
        foundedYear: 2021
      }
    ];
    
    const dummyInvestors = [
      {
        id: 1,
        name: "Venture Capital Partners",
        focus: "Early Stage Tech",
        investments: 24,
        averageInvestment: "$500K - $2M"
      },
      {
        id: 2,
        name: "Growth Equity Fund",
        focus: "Series B+ Technology Companies",
        investments: 18,
        averageInvestment: "$5M - $20M"
      }
    ];
    
    const dummyConnections = [
      {
        id: 1,
        name: "Michael Chen",
        role: "Angel Investor",
        mutualConnections: 3
      },
      {
        id: 2,
        name: "Lisa Rodriguez",
        role: "Startup Founder",
        company: "FinTech Solutions",
        mutualConnections: 5
      }
    ];
    
    setDashboardData({
      ...dashboardData,
      startups: dummyStartups,
      investors: dummyInvestors,
      connections: dummyConnections,
      events: [
        {
          id: 1,
          title: "Startup Pitch Night",
          date: "2023-12-18T18:00:00",
          location: "Tech Innovation Hub"
        },
        {
          id: 2,
          title: "Investor Networking Breakfast",
          date: "2023-12-22T08:30:00",
          location: "Financial District Conference Center"
        }
      ]
    });
  };
  
  // Generic data for other profile types
  const initializeGenericData = () => {
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
    
    setDashboardData({
      connections: [], // Empty for new users
      suggestedConnections,
      profileViews: Math.floor(Math.random() * 10), // Random number for demo
      upcomingEvents
    });
  };
  
  // Handle role switching
  const handleRoleSwitch = async (newRole) => {
    const success = await switchUserRole(newRole);
    if (success) {
      setShowRoleSwitcher(false);
      
      // Navigate to the appropriate dashboard based on the new role
      if (newRole === 'Job Seeker') {
        navigate('/job-seeker-dashboard');
      } else if (newRole === 'Recruiter') {
        navigate('/recruiter-dashboard');
      } else if (newRole === 'Networker') {
        navigate('/networking-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };
  
  // Helper functions from original Dashboard component
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
    if (!interests || interests.length === 0) {
      return [
        { id: 1, title: 'Networking Basics Workshop', date: '2023-12-10T18:00:00', attendees: 24, virtual: true }
      ];
    }
    
    return interests.slice(0, 3).map((interest, index) => ({
      id: index + 1,
      title: `${interest} Networking Event`,
      date: new Date(Date.now() + (index + 1) * 86400000 * 3).toISOString(),
      attendees: Math.floor(Math.random() * 50) + 10,
      virtual: Math.random() > 0.5
    }));
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
  
  // Handle chat submission
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    const userInput = chatInput;
    setChatInput('');
    
    // Simulate AI response - in a real app, this would be an API call
    setTimeout(() => {
      // Example response - would come from API in real app
      const response = "That's a great question! I recommend tailoring your resume to each job application by highlighting relevant skills and experiences. Also, use quantifiable achievements when possible.";
      setChatMessages(prev => [...prev, { sender: 'assistant', text: response }]);
    }, 1000);
  };
  
  if (!currentUser) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  // Return appropriate dashboard based on user profile type
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Role Switcher */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {currentUser.firstName ? `Welcome, ${currentUser.firstName}!` : 'Welcome!'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              You're currently viewing as a {currentUser.profileType}
            </p>
          </div>
          
          <div className="relative">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            >
              <span>Switch Role</span>
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
        </div>
        
        {/* Render appropriate dashboard content based on user type */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {currentUser.profileType === 'Job Seeker' && renderJobSeekerDashboard()}
            {currentUser.profileType === 'Recruiter' && renderRecruiterDashboard()}
            {currentUser.profileType === 'Networker' && renderNetworkerDashboard()}
            {!['Job Seeker', 'Recruiter', 'Networker'].includes(currentUser.profileType) && renderGenericDashboard()}
          </>
        )}
      </div>
    </div>
  );
  
  // Function to render Job Seeker specific dashboard
  function renderJobSeekerDashboard() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Your Profile</h2>
              <Link to="/profile" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Edit
              </Link>
            </div>
            
            {/* Profile Summary */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Summary</h3>
                <p className="text-sm mt-1">{currentUser.summary || "No summary provided yet"}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentUser.skills && currentUser.skills.length > 0 ? (
                    currentUser.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No skills added yet</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Employment Status</h3>
                <p className="text-sm mt-1">
                  {currentUser.employmentStatus === 'employed' ? (
                    <>
                      Currently Employed 
                      {currentUser.lookingToSwitch && <span className="text-blue-600 ml-1">- Open to opportunities</span>}
                    </>
                  ) : "Looking for Work"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Job Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
            {appliedJobs.length > 0 ? (
              <div className="space-y-4">
                {appliedJobs.map(job => (
                  <div key={job.id} className="border-b dark:border-gray-700 pb-3 last:border-0">
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                    <div className="flex justify-between mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        job.status === 'Interview' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        job.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Applied {job.appliedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">You haven't applied to any jobs yet</p>
            )}
          </div>
        </div>
        
        {/* Middle Column - Job Feed & Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <form onSubmit={(e) => e.preventDefault()} className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search for jobs..."
                  className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </form>
            
            <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map(job => (
                  <div key={job.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <h3 className="font-medium text-lg">{job.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{job.company} • {job.location}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Posted {formatRelativeDate(job.postedDate)}</span>
                      <div className="space-x-2">
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                          Save
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Link to="/jobs" className="text-blue-600 hover:underline dark:text-blue-400">
                    View all jobs
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recent jobs available</p>
            )}
          </div>
          
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="border dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {formatDate(event.date)} • {event.isVirtual ? 'Virtual Event' : event.location}
                    </p>
                    <p className="mt-2 text-sm">{event.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{event.attendees} attendees</span>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                        Register
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard; 