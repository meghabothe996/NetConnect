import { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Predefined Career Assistant Q&A
  const careerAssistantQA = [
    {
      question: "What are the top skills for AI engineers?",
      answer: "The top skills for AI engineers include: 1) Programming in Python, R, or Java, 2) Machine Learning frameworks like TensorFlow or PyTorch, 3) Deep Learning concepts, 4) Mathematics and Statistics, 5) Natural Language Processing, 6) Data preprocessing and visualization, 7) Distributed computing, 8) Cloud platforms like AWS or Azure, 9) Software engineering best practices, and 10) Domain knowledge relevant to your industry."
    },
    {
      question: "How to prepare for a technical interview?",
      answer: "To prepare for a technical interview: 1) Research the company and role thoroughly, 2) Review core computer science concepts (data structures, algorithms, system design), 3) Practice coding challenges on platforms like LeetCode or HackerRank, 4) Prepare to explain your past projects clearly, 5) Practice behavioral questions using the STAR method, 6) Prepare thoughtful questions for the interviewer, 7) Mock interviews with peers, 8) Work on communication skills when explaining technical concepts, and 9) Get plenty of rest before the interview day."
    },
    {
      question: "What are the best ways to find remote jobs?",
      answer: "The best ways to find remote jobs include: 1) Specialized remote job boards like We Work Remotely, Remote OK, and FlexJobs, 2) LinkedIn with 'Remote' location filter, 3) Company career pages of fully distributed companies, 4) Networking in online communities like Slack groups or Discord servers, 5) Twitter hashtags like #remotejobs, 6) GitHub Job Board for tech roles, 7) Freelance marketplaces like Upwork or Fiverr to start, 8) Industry-specific job boards, and 9) Recruiters who specialize in remote placements."
    },
    {
      question: "How to negotiate a higher salary?",
      answer: "To negotiate a higher salary: 1) Research industry salary ranges for your role and location, 2) Highlight your unique value and achievements, 3) Practice your negotiation pitch beforehand, 4) Consider the entire compensation package, not just base salary, 5) Start slightly higher than your target, 6) Use silence strategically after stating your number, 7) Get competing offers if possible, 8) Be prepared to explain why you deserve more, 9) Consider non-salary benefits if base pay is fixed, and 10) Maintain a positive, collaborative tone throughout negotiations."
    },
    {
      question: "What should I include in my portfolio?",
      answer: "Your portfolio should include: 1) A clean, user-friendly design, 2) Your best 4-6 projects with case studies, 3) The problem each project solved, 4) Your role and contributions, 5) Technologies and methods used, 6) Project outcomes and metrics, 7) A brief but compelling bio, 8) Your contact information, 9) Testimonials or recommendations if available, and 10) Your resume in downloadable format. Tailor the content to the type of job you're seeking and prioritize quality over quantity."
    }
  ];
  
  // Function to get AI career assistant response
  const getCareerAssistantResponse = (query) => {
    // Handle case when query is an object (e.g., formData) instead of a string
    if (typeof query !== 'string') {
      console.log("Career assistant received object instead of string:", query);
      // Extract a meaningful string from the form data to use as query
      let queryString = "";
      
      if (query.jobPreferences && query.jobPreferences.jobType) {
        queryString = `Looking for ${query.jobPreferences.jobType} jobs`;
      } else if (query.profileType) {
        queryString = `Career advice for ${query.profileType}`;
      } else {
        queryString = "General career advice";
      }
      
      console.log("Using extracted query string:", queryString);
      query = queryString;
    }
    
    // First check if there's an exact match in our predefined Q&A
    const exactMatch = careerAssistantQA.find(
      qa => qa.question.toLowerCase() === query.toLowerCase()
    );
    
    if (exactMatch) {
      return exactMatch.answer;
    }
    
    // If no exact match, look for similar questions based on keywords
    const keywords = query.toLowerCase().split(' ')
      .filter(word => word.length > 3)
      .map(word => word.replace(/[^a-z0-9]/g, ''));
    
    if (keywords.length > 0) {
      // Calculate similarity score for each predefined question
      const matches = careerAssistantQA.map(qa => {
        const questionWords = qa.question.toLowerCase().split(' ')
          .filter(word => word.length > 3)
          .map(word => word.replace(/[^a-z0-9]/g, ''));
        
        // Count matching keywords
        const matchingWords = keywords.filter(word => 
          questionWords.some(qWord => qWord.includes(word) || word.includes(qWord))
        );
        
        return {
          qa,
          score: matchingWords.length / keywords.length
        };
      });
      
      // Find the best match with a score above 0.3 (30% matching)
      const bestMatch = matches.sort((a, b) => b.score - a.score)[0];
      if (bestMatch && bestMatch.score > 0.3) {
        return bestMatch.qa.answer;
      }
    }
    
    // Default response if no match found
    return "I don't have specific information about that, but I'd recommend researching industry trends, talking to professionals in your field, and checking online resources like LinkedIn articles and industry publications for insights on this topic.";
  };
  
  const updateUserProfile = useCallback(async (profileData) => {
    try {
      // Update user profile in state
      const updatedUser = {
        ...currentUser,
        ...profileData,
        profileCompletionRequired: false // Explicitly set to false when profile is updated
      };
      
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      
      // Save updated user to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // In a real app, you would save this to your backend
      // await api.updateUserProfile(currentUser.id, profileData);
      console.log('Profile updated successfully:', updatedUser);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      return false;
    }
  }, [currentUser]);
  
  // Mock resume processing function
  const processResume = async (file) => {
    // In a real app, this would send the file to a backend service
    // that would extract information from the resume
    
    // For demo purposes, we'll simulate a processing delay
    // and return some mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          skills: ['JavaScript', 'React', 'Node.js'],
          education: [
            {
              school: 'Example University',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startYear: '2016',
              endYear: '2020'
            }
          ],
          workExperience: [
            {
              company: 'Tech Company',
              position: 'Software Developer',
              startDate: '2020-06',
              endDate: '',
              current: true,
              description: 'Full-stack development, focusing on React and Node.js applications.'
            }
          ]
        });
      }, 2000);
    });
  };
  
  // Mock register function
  const register = useCallback(async (userData) => {
    try {
      // In a real app, you would register with your backend
      // const response = await api.register(userData);
      
      // Simulate successful registration with mock data
      const newUser = {
        id: '1234',
        ...userData,
        profileCompletionRequired: true // Set flag to indicate onboarding is needed
      };
      
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      
      // Store user in localStorage to persist session
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);
  
  // Mock login function
  const login = useCallback(async (email, password) => {
    try {
      // In a real app, you would verify with your backend
      // const response = await api.login(email, password);
      
      // Simulate successful login with mock data that includes profile data
      const userData = {
        id: '1234',
        email,
        firstName: 'Demo',
        lastName: 'User',
        // Include complete profile data
        profileType: 'Job Seeker',
        employmentStatus: 'employed',
        lookingToSwitch: true,
        educations: [
          {
            institution: 'University of Technology',
            degree: 'Bachelor of Computer Science',
            fieldOfStudy: 'Software Engineering',
            grade: '3.8/4.0',
            startDate: '2016-09',
            endDate: '2020-06',
            currentlyStudying: false,
            description: 'Specialized in software development and artificial intelligence'
          }
        ],
        workExperience: [
          {
            company: 'Tech Innovations Inc.',
            position: 'Software Developer',
            startDate: '2020-07',
            endDate: '',
            current: true,
            description: 'Full-stack development using React, Node.js, and cloud technologies'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        preferredRoles: ['Frontend Developer', 'Full-stack Engineer', 'React Developer'],
        customRoles: ['UI Specialist'],
        currentCTC: {
          amount: '85000',
          fixed: '75000',
          variable: '10000',
          esops: '15000'
        },
        expectedCTC: {
          min: '95000',
          max: '120000',
          negotiable: true,
          notes: 'Flexible for the right opportunity'
        },
        noticePeriod: {
          duration: '30 days',
          negotiable: true,
          buyoutOption: true,
          buyoutNotes: 'Open to discussing buyout options'
        },
        locationPreference: 'Remote',
        jobPreferences: {
          jobType: 'Full-time',
          jobSectors: ['Technology', 'Finance', 'E-commerce'],
          expectedSalary: '100000-120000',
          willRelocate: true
        },
        // New fields
        certifications: [
          {
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            issueDate: '2021-03',
            expiryDate: '2024-03',
            credentialID: 'AWS-DEV-12345'
          },
          {
            name: 'Professional Scrum Master I',
            issuer: 'Scrum.org',
            issueDate: '2022-01',
            expiryDate: '',
            credentialID: 'PSM-I-98765'
          }
        ],
        summary: 'Experienced full-stack developer with 3+ years of experience building scalable web applications. Passionate about clean code and user-centric design. Seeking remote opportunities to create impactful software solutions.',
        achievements: [
          'Led a team of 4 developers to launch a fintech application with 10,000+ active users',
          'Reduced API response time by 40% through code optimization and caching strategies',
          'Contributed to open-source projects with 500+ GitHub stars'
        ],
        profileCompletionRequired: false // Profile is complete
      };
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);
  
  // Mock logout function
  const logout = useCallback(async () => {
    try {
      // In a real app, you would call your backend
      // await api.logout();
      
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      // Remove user from localStorage
      localStorage.removeItem('user');
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);
  
  // Function to switch user role
  const switchUserRole = useCallback(async (newRole) => {
    try {
      if (!currentUser) return false;
      
      // Map display role names to internal role names if needed
      let internalNewRole = newRole;
      if (newRole === 'Recruiter (Companies Only)') internalNewRole = 'Recruiter';
      if (newRole === 'Networking (Founder, Investor)') internalNewRole = 'Networker';
      
      // Store previous role data
      const prevRoleData = {
        profileType: currentUser.profileType,
        // Store any role-specific data here
        jobSeekerData: currentUser.profileType === 'Job Seeker' ? {
          employmentStatus: currentUser.employmentStatus,
          lookingToSwitch: currentUser.lookingToSwitch,
          educations: currentUser.educations || currentUser.education, // Handle both formats
          workExperience: currentUser.workExperience,
          skills: currentUser.skills,
          preferredRoles: currentUser.preferredRoles,
          customRoles: currentUser.customRoles,
          currentCTC: currentUser.currentCTC,
          expectedCTC: currentUser.expectedCTC,
          noticePeriod: currentUser.noticePeriod,
          locationPreference: currentUser.locationPreference,
          jobPreferences: currentUser.jobPreferences,
          certifications: currentUser.certifications,
          summary: currentUser.summary,
          achievements: currentUser.achievements
        } : null,
        recruiterData: (currentUser.profileType === 'Recruiter' || currentUser.profileType === 'Recruiter (Companies Only)') ? {
          companyName: currentUser.companyName,
          companyEmail: currentUser.companyEmail,
          companyVerified: currentUser.companyVerified,
          hiringFor: currentUser.hiringFor,
          postJobNow: currentUser.postJobNow,
          jobPostings: currentUser.jobPostings
        } : null,
        networkerData: (currentUser.profileType === 'Networker' || currentUser.profileType === 'Networking (Founder, Investor)') ? {
          isFounder: currentUser.isFounder,
          founderDetails: currentUser.founderDetails,
          investorDetails: currentUser.investorDetails
        } : null
      };
      
      // Save the previous role data to localStorage
      const roleDataKey = `${currentUser.id}_${currentUser.profileType}`;
      localStorage.setItem(roleDataKey, JSON.stringify(prevRoleData));
      
      // Check if we have previous data for the new role
      const newRoleDataKey = `${currentUser.id}_${internalNewRole}`;
      let savedNewRoleData = localStorage.getItem(newRoleDataKey);
      
      // Also check with the display name format if not found
      if (!savedNewRoleData) {
        if (internalNewRole === 'Recruiter') {
          savedNewRoleData = localStorage.getItem(`${currentUser.id}_Recruiter (Companies Only)`);
        } else if (internalNewRole === 'Networker') {
          savedNewRoleData = localStorage.getItem(`${currentUser.id}_Networking (Founder, Investor)`);
        }
      }
      
      // Base updated user object
      let updatedUser = {
        ...currentUser,
        profileType: internalNewRole, // Use the internal role name for consistency
        // Reset role-specific fields
        employmentStatus: undefined,
        lookingToSwitch: undefined,
        educations: [],
        education: [],
        workExperience: [],
        skills: [],
        preferredRoles: [],
        customRoles: [],
        currentCTC: {},
        expectedCTC: {},
        noticePeriod: {},
        locationPreference: '',
        jobPreferences: {},
        companyName: '',
        companyEmail: '',
        companyVerified: false,
        hiringFor: [],
        postJobNow: false,
        jobPostings: [],
        isFounder: undefined,
        founderDetails: {},
        investorDetails: {},
        certifications: [],
        summary: '',
        achievements: []
      };
      
      // If we have saved data for the new role, apply it
      if (savedNewRoleData) {
        const parsedData = JSON.parse(savedNewRoleData);
        
        if (internalNewRole === 'Job Seeker' && parsedData.jobSeekerData) {
          updatedUser = {
            ...updatedUser,
            ...parsedData.jobSeekerData
          };
        } else if ((internalNewRole === 'Recruiter' || newRole === 'Recruiter (Companies Only)') && parsedData.recruiterData) {
          updatedUser = {
            ...updatedUser,
            ...parsedData.recruiterData
          };
        } else if ((internalNewRole === 'Networker' || newRole === 'Networking (Founder, Investor)') && parsedData.networkerData) {
          updatedUser = {
            ...updatedUser,
            ...parsedData.networkerData
          };
        }
      }
      
      // Ensure profileCompletionRequired is set to false for complete profiles
      updatedUser.profileCompletionRequired = false;
      
      // Update current user
      setCurrentUser(updatedUser);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return true;
    } catch (err) {
      console.error('Error switching user role:', err);
      setError(err.message || 'Failed to switch user role');
      return false;
    }
  }, [currentUser]);
  
  // Function to determine if profile is complete
  const isProfileComplete = useCallback(() => {
    if (!currentUser) return false;
    return !currentUser.profileCompletionRequired;
  }, [currentUser]);
  
  useEffect(() => {
    // Simulate checking if user is logged in
    const checkLoggedIn = () => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);
  
  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
    processResume,
    getCareerAssistantResponse,
    switchUserRole,
    isProfileComplete: isProfileComplete()
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 