import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, switchUserRole } = useAuth();
  const { darkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  
  // Dummy state for job postings
  const [jobPostings, setJobPostings] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Fetch user data when component mounts
  useEffect(() => {
    // Check if user is logged in and is a recruiter
    if (!currentUser || currentUser.profileType !== 'Recruiter') {
      navigate('/login');
      return;
    }
    
    // Initialize dummy data
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
      },
      {
        id: 3,
        title: "UI/UX Designer",
        company: currentUser.companyName || "Your Company",
        location: "San Francisco, CA",
        applications: 5,
        status: "Paused",
        postedDate: "2023-12-02",
        skills: ["Figma", "UI Design", "Prototyping"]
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
      },
      {
        id: 3,
        name: "Michael Brown",
        role: "UI/UX Designer",
        skills: ["Figma", "Adobe XD", "UI Research"],
        status: "New",
        applicationDate: "Dec 8, 2023"
      }
    ];

    setJobPostings(dummyJobPostings);
    setApplicants(dummyApplicants);
    setLoading(false);
  }, [currentUser, navigate]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // Implementation would filter jobs or candidates
    }
  };
  
  const handleViewApplicants = (jobId) => {
    console.log(`Viewing applicants for job with ID: ${jobId}`);
    // Implementation would navigate to applicants list
  };
  
  const handleEditJobPosting = (jobId) => {
    console.log(`Editing job with ID: ${jobId}`);
    // Implementation would navigate to job edit page
  };
  
  // Add the function to handle role switching
  const handleRoleSwitch = async (newRole) => {
    const success = await switchUserRole(newRole);
    if (success) {
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
                placeholder="Search candidates or job postings..."
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
            <div className="relative mr-3">
              <button 
                className="flex items-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                title="Switch Role"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="ml-1 text-sm hidden md:inline">Role: Recruiter</span>
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
                  <Link to="/recruiter-dashboard" className={`flex items-center p-2 rounded-lg ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/job-postings" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Job Postings
                  </Link>
                </li>
                <li>
                  <Link to="/applicants" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Applicants
                  </Link>
                </li>
                <li>
                  <Link to="/talent-search" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Talent Search
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
                  placeholder="Search candidates or jobs..."
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
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{jobPostings.filter(j => j.status === 'Active').length}</div>
                  <div className="text-sm text-green-600">+2 this week</div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold mb-2">Total Applicants</h3>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{applicants.length}</div>
                  <div className="text-sm text-green-600">+5 this week</div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold mb-2">Shortlisted</h3>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{applicants.filter(a => a.status === 'Shortlisted').length}</div>
                  <div className="text-sm text-green-600">+1 this week</div>
                </div>
              </div>
            </div>
            
            {/* Company Profile */}
            <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Company Profile</h2>
                <Link to="/company-profile" className="text-sm text-blue-600 hover:underline">Edit</Link>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-gray-300 rounded-lg flex items-center justify-center mr-4">
                  {/* Company Logo Placeholder */}
                  <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{currentUser?.companyName || "Your Company"}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.industry || "Technology"}</p>
                </div>
              </div>
              
              <p className="text-sm mb-4">
                {currentUser?.companyDescription || 
                "Your company description appears here. Add details about your company to attract top talent."}
              </p>
              
              {/* Company details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Location</h3>
                  <p className="text-sm">{currentUser?.location || "Location not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Website</h3>
                  <p className="text-sm">{currentUser?.website || "Website not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Company Size</h3>
                  <p className="text-sm">{currentUser?.companySize || "Company size not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Founded</h3>
                  <p className="text-sm">{currentUser?.foundedYear || "Founded year not specified"}</p>
                </div>
              </div>
            </div>
            
            {/* Job Postings */}
            <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Job Postings</h2>
                <Link to="/post-job" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  + Post New Job
                </Link>
              </div>
              
              {jobPostings.length > 0 ? (
                <div className="space-y-4">
                  {jobPostings.map(job => (
                    <div key={job.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm">{job.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {job.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-1 text-xs rounded mb-2 ${
                            job.status === 'Active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                          }`}>
                            {job.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {job.applications} applications
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewApplicants(job.id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          View Applicants
                        </button>
                        <button
                          onClick={() => handleEditJobPosting(job.id)}
                          className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p>No job postings yet.</p>
                  <Link to="/post-job" className="text-blue-600 hover:underline mt-2 inline-block">Create your first job posting</Link>
                </div>
              )}
            </div>
            
            {/* Recent Applicants */}
            <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Applicants</h2>
                <Link to="/applicants" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              
              {applicants.length > 0 ? (
                <div className="space-y-4">
                  {applicants.map(applicant => (
                    <div key={applicant.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                            {applicant.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{applicant.name}</h3>
                            <p className="text-sm">{applicant.role}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {applicant.skills.map((skill, index) => (
                                <span key={index} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-1 text-xs rounded mb-2 ${
                            applicant.status === 'Shortlisted' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                            applicant.status === 'In Review' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                          }`}>
                            {applicant.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Applied {applicant.applicationDate}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          View Profile
                        </button>
                        <button
                          className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p>No applicants yet.</p>
                  <p className="text-sm mt-2">Post jobs to attract candidates.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard; 