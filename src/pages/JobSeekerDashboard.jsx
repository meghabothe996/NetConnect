import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import ProfileSection from '../components/ProfileSection';
import Avatar from '../components/common/Avatar';
import { BiEdit } from 'react-icons/bi';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, profileCompletionPercentage, switchUserRole } = useAuth();
  const { darkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  
  // State for job data
  const [recentJobs, setRecentJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  
  // Dummy data for events
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Hello! I\'m your AI career assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // Fetch user data and job information when component mounts
  useEffect(() => {
    // Check if user is logged in and is a job seeker
    if (!currentUser || currentUser.profileType !== 'Job Seeker') {
      navigate('/login');
      return;
    }
    
    // Initialize dummy data
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
      },
      {
        id: 3,
        title: "Networking Mixer - Tech Professionals",
        date: "2023-12-28T18:30:00",
        isVirtual: false,
        location: "TechHub Conference Center",
        attendees: 75,
        description: "An evening of networking with professionals from various tech companies."
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
      },
      {
        id: 3,
        title: "UI/UX Designer",
        company: "DesignForward",
        location: "San Francisco, CA",
        skills: ["Figma", "UI Design", "Prototyping"],
        postedDate: "2023-12-02",
        salary: "$115,000 - $140,000"
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
      },
      {
        id: 3,
        title: "Frontend Architect",
        company: "WebSolutions Ltd",
        status: "Rejected",
        appliedDate: "Nov 15, 2023"
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
      },
      {
        id: 6,
        title: "Data Scientist",
        company: "AnalyticsPro",
        location: "Austin, TX",
        postedDate: "2023-12-01"
      }
    ];

    setEvents(dummyEvents);
    fetchRecentJobs(dummyJobs);
    fetchAppliedJobs(dummyApplications);
    fetchSavedJobs(dummySavedJobs);
  }, [currentUser, navigate]);
  
  // Fetch job recommendations, applied jobs, and saved jobs from API
  const fetchRecentJobs = (dummyJobs) => {
    // Use dummy data instead of API call
    setRecentJobs(dummyJobs);
    setLoading(false);
  };
  
  const fetchAppliedJobs = (dummyApplications) => {
    // Use dummy data instead of API call
    setAppliedJobs(dummyApplications);
  };
  
  const fetchSavedJobs = (dummySavedJobs) => {
    // Use dummy data instead of API call
    setSavedJobs(dummySavedJobs);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/job-search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  const handleSaveJob = (jobId) => {
    console.log(`Saving job with ID: ${jobId}`);
    // Implementation would go here
  };
  
  const handleApplyJob = (jobId) => {
    console.log(`Applying to job with ID: ${jobId}`);
    // Implementation would go here
  };
  
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    
    // Simulate AI response - in a real app, this would be an API call
    setTimeout(() => {
      // Example response - would come from API in real app
      const response = "That's a great question! I recommend tailoring your resume to each job application by highlighting relevant skills and experiences. Also, use quantifiable achievements when possible.";
      setChatMessages(prev => [...prev, { sender: 'assistant', text: response }]);
    }, 1000);
    
    setChatInput('');
  };
  
  const toggleDarkMode = () => {
    // In a real app, you would also apply dark mode classes to the body or a container
  };
  
  const getIncompleteProfileSections = () => {
    const sections = [];
    
    if (!currentUser.skills || currentUser.skills.length === 0) sections.push('skills');
    if (!currentUser.educations || currentUser.educations.length === 0) sections.push('education');
    if (!currentUser.workExperience || currentUser.workExperience.length === 0) sections.push('work experience');
    if (!currentUser.preferredRoles || currentUser.preferredRoles.length === 0) sections.push('preferred roles');
    
    return sections;
  };
  
  // Add the function to handle role switching
  const handleRoleSwitch = async (newRole) => {
    const success = await switchUserRole(newRole);
    if (success) {
      // Navigate to the appropriate dashboard based on the new role
      if (newRole === 'Job Seeker') {
        navigate('/job-seeker-dashboard');
      } else if (newRole === 'Recruiter (Companies Only)') {
        navigate('/recruiter-dashboard');
      } else if (newRole === 'Networking (Founder, Investor)') {
        navigate('/networking-dashboard');
      } else {
        navigate('/dashboard');
      }
      setShowRoleSwitcher(false);
    }
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md px-4 md:px-6 py-4 fixed w-full top-0 z-10`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">NetworkingApp</h1>
          </div>
          
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-10">
            <div className="relative w-full max-w-xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for jobs..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              />
              <div className="absolute left-3 top-2.5">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
          </form>
          
          <div className="flex items-center">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-3"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <div className="relative mr-3">
              <button 
                className="flex items-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                title="Switch Role"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="ml-1 text-sm hidden md:inline">Role: Job Seeker</span>
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
                      onClick={() => handleRoleSwitch('Recruiter (Companies Only)')}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mb-1 flex items-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      Recruiter
                    </button>
                    <button 
                      onClick={() => handleRoleSwitch('Networking (Founder, Investor)')}
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
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {currentUser?.firstName ? currentUser.firstName[0] : 'U'}
                </div>
                <span className="ml-2 hidden md:inline">{currentUser?.firstName || 'User'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="pt-16 flex min-h-screen">
        {/* Sidebar - visible on desktop or when menu is open on mobile */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:static z-20 w-64 h-full md:h-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Welcome, {currentUser?.firstName || 'User'}!
            </h2>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="/job-seeker-dashboard" className={`flex items-center p-2 rounded-lg ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/job-applications" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Applications
                  </Link>
                </li>
                <li>
                  <Link to="/saved-jobs" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Saved Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/job-search" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Job Search
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        
        {/* Main Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
          <div className="container mx-auto">
            {/* Search bar - visible only on mobile */}
            <form onSubmit={handleSearch} className="mb-4 md:hidden">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for jobs..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button type="submit" className="absolute right-2 top-2 p-1 rounded-full">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
            
            {/* Profile Completion Progress */}
            <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-lg font-semibold mb-2">Profile Completion</h2>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${profileCompletionPercentage}%` }}></div>
              </div>
              <p className="mt-2 text-sm">Your profile is {profileCompletionPercentage}% complete</p>
              
              {profileCompletionPercentage < 100 && (
                <div className="mt-2">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Please complete your {getIncompleteProfileSections().join(', ')} to improve job matches.
                    <Link to="/profile" className="ml-2 text-blue-600 hover:underline">Update Profile</Link>
                  </p>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
              
              {/* Summary */}
              {currentUser.summary ? (
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Summary</h3>
                  <p className="text-sm">{currentUser.summary}</p>
                </div>
              ) : (
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Summary</h3>
                  <p className="text-sm text-gray-500">No summary added yet</p>
                </div>
              )}
              
              {/* Employment Status */}
              {currentUser.employmentStatus ? (
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Employment Status</h3>
                  <p className="text-sm">{currentUser.employmentStatus === 'employed' ? 'Currently Employed' : 'Currently Unemployed'}</p>
                  {currentUser.employmentStatus === 'employed' && (
                    <p className="text-sm mt-1">
                      {currentUser.lookingToSwitch 
                        ? 'Looking for new opportunities' 
                        : 'Not actively looking, just networking'}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Employment Status</h3>
                  <p className="text-sm text-gray-500">No employment status added yet</p>
                </div>
              )}
              
              {/* Education */}
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Education</h3>
                {currentUser.educations && currentUser.educations.length > 0 ? (
                  currentUser.educations.map((edu, index) => (
                    <div key={index} className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <p className="text-sm font-medium">{edu.degree} in {edu.fieldOfStudy}</p>
                      <p className="text-sm">{edu.institution}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No education added yet</p>
                )}
              </div>
              
              {/* Work Experience */}
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Work Experience</h3>
                {currentUser.workExperience && currentUser.workExperience.length > 0 ? (
                  currentUser.workExperience.map((exp, index) => (
                    <div key={index} className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <p className="text-sm font-medium">{exp.position}</p>
                      <p className="text-sm">{exp.company}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                      {exp.description && <p className="text-xs mt-1">{exp.description}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No work experience added yet</p>
                )}
              </div>
              
              {/* Certifications - New Section */}
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Certifications</h3>
                {currentUser.certifications && currentUser.certifications.length > 0 ? (
                  currentUser.certifications.map((cert, index) => (
                    <div key={index} className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <p className="text-sm font-medium">{cert.name}</p>
                      <p className="text-sm">Issued by: {cert.issuer}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {cert.issueDate} {cert.expiryDate ? `- Expires: ${cert.expiryDate}` : '- No Expiration'}
                      </p>
                      {cert.credentialID && <p className="text-xs mt-1">Credential ID: {cert.credentialID}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No certifications added yet</p>
                )}
              </div>
              
              {/* Achievements - New Section */}
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Achievements</h3>
                {currentUser.achievements && currentUser.achievements.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {currentUser.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm mb-1">{achievement}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No achievements added yet</p>
                )}
              </div>
              
              {/* Skills */}
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Skills</h3>
                {currentUser.skills && currentUser.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {currentUser.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No skills added yet</p>
                )}
              </div>
              
              {/* Job Preferences */}
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Job Preferences</h3>
                {currentUser.jobPreferences && currentUser.jobPreferences.jobType ? (
                  <>
                    <p className="text-sm"><span className="font-medium">Job Type:</span> {currentUser.jobPreferences.jobType}</p>
                    
                    {currentUser.preferredRoles && currentUser.preferredRoles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Preferred Roles:</p>
                        <div className="flex flex-wrap gap-1">
                          {currentUser.preferredRoles.map((role, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentUser.locationPreference && (
                      <p className="text-sm mt-2"><span className="font-medium">Location:</span> {currentUser.locationPreference}</p>
                    )}
                    
                    {currentUser.jobPreferences.expectedSalary && (
                      <p className="text-sm mt-2"><span className="font-medium">Expected Salary:</span> ${currentUser.jobPreferences.expectedSalary}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No job preferences added yet</p>
                )}
              </div>
              
              {/* CTC Information */}
              {currentUser.employmentStatus === 'employed' && currentUser.currentCTC && currentUser.currentCTC.amount ? (
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Compensation Details</h3>
                  <p className="text-sm"><span className="font-medium">Current CTC:</span> ${currentUser.currentCTC.amount}</p>
                  
                  {currentUser.expectedCTC && currentUser.expectedCTC.min && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Expected CTC:</span> ${currentUser.expectedCTC.min} - ${currentUser.expectedCTC.max}
                      {currentUser.expectedCTC.negotiable && <span className="ml-1 text-xs">(Negotiable)</span>}
                    </p>
                  )}
                  
                  {currentUser.noticePeriod && currentUser.noticePeriod.duration && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Notice Period:</span> {currentUser.noticePeriod.duration}
                      {currentUser.noticePeriod.negotiable && <span className="ml-1 text-xs">(Negotiable)</span>}
                    </p>
                  )}
                </div>
              ) : null}
              
              <Link to="/profile" className="text-blue-600 hover:underline text-sm inline-flex items-center">
                <span>Edit Profile</span>
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </Link>
            </div>
            
            {/* Job Recommendations */}
            <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recommended Jobs</h2>
                <Link to="/jobs" className="text-sm text-blue-600 hover:underline">See all</Link>
              </div>
              
              {recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map(job => (
                    <div key={job.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm">{job.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(job.postedDate).toLocaleDateString()} • {job.salary}
                        </span>
                        <button 
                          onClick={() => handleSaveJob(job.id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p>No job recommendations yet. Complete your profile to get personalized job matches.</p>
                  <Link to="/job-search" className="text-blue-600 hover:underline mt-2 inline-block">Browse All Jobs</Link>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Applications Overview */}
              <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-lg font-semibold mb-4">Applications Overview</h2>
                
                {appliedJobs.length > 0 ? (
                  <div className="space-y-3">
                    {appliedJobs.map(job => (
                      <div key={job.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm">{job.company}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            job.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : 
                            job.status === 'Interview' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                            job.status === 'Offer' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' : 
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                          }`}>
                            {job.status}
                          </span>
                          <span className="text-xs text-gray-500">{job.appliedDate}</span>
                        </div>
                      </div>
                    ))}
                    
                    <Link to="/applications" className="text-blue-600 hover:underline text-sm block text-right mt-2">
                      View all applications
                    </Link>
                  </div>
                ) : (
                  <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p>No applications yet.</p>
                    <Link to="/job-search" className="text-blue-600 hover:underline mt-2 inline-block">Find Jobs to Apply</Link>
                  </div>
                )}
              </div>
              
              {/* Saved Jobs */}
              <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-lg font-semibold mb-4">Saved Jobs</h2>
                
                {savedJobs.length > 0 ? (
                  <div className="space-y-3">
                    {savedJobs.map(job => (
                      <div key={job.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm">{job.company}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                          <button 
                            onClick={() => handleApplyJob(job.id)}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <Link to="/saved-jobs" className="text-blue-600 hover:underline text-sm block text-right mt-2">
                      View all saved jobs
                    </Link>
                  </div>
                ) : (
                  <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p>No saved jobs yet.</p>
                    <Link to="/job-search" className="text-blue-600 hover:underline mt-2 inline-block">Find Jobs to Save</Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mt-6`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <Link to="/events" className="text-sm text-blue-600 hover:underline">See all</Link>
              </div>
              
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex">
                        <div className="flex-shrink-0 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-lg p-3 text-center mr-4 w-16">
                          <span className="block text-lg font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="text-xs">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm mt-1">
                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                            {event.isVirtual ? ' Virtual Event' : ` ${event.location}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {event.attendees} attendees
                          </p>
                        </div>
                        <div className="flex-shrink-0 self-center">
                          <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p>No upcoming events to display.</p>
                  <Link to="/events" className="text-blue-600 hover:underline mt-2 inline-block">
                    Browse All Events
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* AI Career Assistant Chatbot */}
      <div className="fixed bottom-4 right-4 z-20">
        {showChatbot ? (
          <div className={`w-80 md:w-96 shadow-xl rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-medium">AI Career Assistant</h3>
              <button onClick={() => setShowChatbot(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-3 h-64 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-2 rounded-lg max-w-xs ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : darkMode ? 'bg-gray-700 text-white rounded-bl-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleChatSubmit} className="border-t p-2 flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything about your career..."
                className={`flex-1 px-3 py-2 rounded-l-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-3 py-2 rounded-r-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          <button 
            onClick={() => setShowChatbot(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard; 