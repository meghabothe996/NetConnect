import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile, processResume, getCareerAssistantResponse } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // General fields
    profileType: '',
    fullName: '',
    email: '',
    mobile: '',
    bio: '',
    location: '',
    
    // Job Seeker specific fields
    employmentStatus: '',
    lookingToSwitch: undefined,
    education: [],
    educations: [], // Add this line to initialize the educations array
    workExperience: [],
    skills: [],
    preferredRoles: [],
    customRoles: [],
    
    // Job Preferences
    jobPreferences: {
      jobType: '',
      jobSectors: [],
      expectedSalary: '',
      willRelocate: false
    },
    
    // Current CTC fields (for employed users)
    currentCTC: {
      amount: '',
      fixed: '',
      variable: '',
      esops: ''
    },
    
    // Expected CTC fields (for users looking to switch)
    expectedCTC: {
      min: '',
      max: '',
      negotiable: false,
      notes: ''
    },
    
    // Notice Period fields
    noticePeriod: {
      duration: '',
      negotiable: false,
      buyoutOption: false,
      buyoutNotes: ''
    },
    
    // Location preference (optional for non-remote jobs)
    locationPreference: '',
    
    // Recruiter specific fields
    companyName: '',
    companyEmail: '',
    companyVerified: false,
    hiringFor: [],
    postJobNow: false,
    jobPostings: [], // Array to store job postings
    
    // New job posting fields
    newJobPosting: {
      title: '',
      description: '',
      experienceLevel: '',
      location: '',
      employmentType: '',
      skills: [],
      salaryRange: '',
      applicationDeadline: ''
    },
    
    // Networking - Founder fields
    isFounder: undefined, // For networking type: true = founder, false = investor
    founderDetails: {
      companyName: '',
      website: '',
      companyDescription: '',
      industry: '',
      companyStage: '',
      foundedYear: '',
      companySize: ''
    },
    
    // Networking - Investor fields
    investorDetails: {
      interestedIndustries: [],
      companiesFunded: '',
      fundingPreferences: ''
    },
    
    // Profile completion tracking
    completedFields: {
      profileType: false,
      employmentStatus: false,
      education: false,
      workExperience: false,
      skills: false,
      currentCTC: false,
      expectedCTC: false,
      noticePeriod: false,
      preferredRoles: false,
      jobPreferences: false,
      companyDetails: false,
      investorDetails: false
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const fileInputRef = useRef(null);
  
  // Add OTP state for company verification
  const [companyOtp, setCompanyOtp] = useState('');
  const [companyOtpError, setCompanyOtpError] = useState('');
  const [generatedCompanyOtp, setGeneratedCompanyOtp] = useState('');
  const [companyOtpTimer, setCompanyOtpTimer] = useState(0);
  
  // Chat state for AI Career Assistant
  const [showChatbox, setShowChatbox] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Hi there! I\'m your AI Career Assistant. How can I help with your job search or career questions today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBoxRef = useRef(null);
  
  // Save form data to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('profileSetupData', JSON.stringify(formData));
  }, [formData]);
  
  // Set up Company OTP timer
  useEffect(() => {
    let interval;
    if (companyOtpTimer > 0) {
      interval = setInterval(() => {
        setCompanyOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [companyOtpTimer]);
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages, isAiTyping]);
  
  // Predefined options
  const profileTypes = ['Job Seeker', 'Recruiter (Companies Only)', 'Networking (Founder, Investor)'];
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
    'Design', 'Engineering', 'Retail', 'Hospitality', 'Manufacturing',
    'Media', 'Entertainment', 'Real Estate', 'Legal', 'Consulting',
    'Non-profit', 'Government', 'Research', 'Agriculture', 'Other'
  ];
  const interestOptions = [
    'Software Development', 'Data Science', 'UX/UI Design', 'Product Management',
    'Digital Marketing', 'Project Management', 'Business Analysis',
    'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing',
    'DevOps', 'Full Stack Development', 'Mobile Development',
    'Blockchain', 'Machine Learning', 'IoT', 'Robotics', 'Entrepreneurship'
  ];
  
  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 
    'AWS', 'Docker', 'Kubernetes', 'HTML/CSS', 'TypeScript',
    'Product Management', 'Agile', 'Scrum', 'Digital Marketing',
    'SEO', 'Content Writing', 'Data Analysis', 'Communication',
    'Leadership', 'Problem Solving', 'Critical Thinking'
  ];

  // Get step count based on profile type
  const getStepCount = () => {
    // Different number of steps based on user type
    if (formData.profileType === 'Job Seeker') {
      // Different flow based on employment status
      if (formData.employmentStatus === 'unemployed') {
        return 5; // Education + Optional Experience + Skills + Job Preferences + Complete Profile
      } else if (formData.employmentStatus === 'employed') {
        if (formData.lookingToSwitch === true) {
          return 7; // Education + Experience + Current CTC + Expected CTC + Notice Period + Skills + Job Preferences
        } else if (formData.lookingToSwitch === false) {
          return 6; // Education + Experience + Current CTC + Expected CTC + Notice Period (Optional) + Skills
        }
      }
      // Default before employment status is selected
      return 2; // Profile Type + Employment Status
    } 
    else if (formData.profileType === 'Recruiter (Companies Only)') {
      return 3; // Verify Company Email + Want to Post Jobs or Not + Dashboard
    } 
    else if (formData.profileType === 'Networking (Founder, Investor)') {
      if (formData.isFounder) {
        return 3; // Founder Details (Company Name, Website, About, Industry, Stage, Founded Year, Team Size) + Dashboard
      } else {
        return 3; // Investor Details (Industry Preferences, Company Stage Preferences, Companies Funded) + Dashboard
      }
    } 
    else {
      return 1; // Just profile type selection if no type is selected
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleMultiSelectChange = (field, value) => {
    const updatedArray = formData[field].includes(value)
      ? formData[field].filter(item => item !== value)
      : [...formData[field], value];
      
    setFormData({
      ...formData,
      [field]: updatedArray
    });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Store the file
    setFormData({
      ...formData,
      resumeFile: file
    });
    
    setIsProcessingResume(true);
    
    try {
      // Process the resume to extract data
      const extractedData = await processResume(file);
      
      // Update form data with extracted information
      setFormData(prev => ({
        ...prev,
        skills: [...new Set([...prev.skills, ...extractedData.skills])],
        education: extractedData.education,
        workExperience: extractedData.workExperience
      }));
      
      // Show confirmation to user
      alert("Resume processed successfully! You can review and edit the extracted information in the next steps.");
      
    } catch (error) {
      console.error("Error processing resume:", error);
      alert("Could not process resume. Please fill in your details manually.");
    } finally {
      setIsProcessingResume(false);
    }
  };
  
  const addEducation = () => {
    setFormData({
      ...formData,
      educations: [
        ...(formData.educations || []),
        {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          grade: '',
          startDate: '',
          endDate: '',
          currentlyStudying: false,
          description: ''
        }
      ]
    });
  };
  
  const updateEducation = (index, field, value) => {
    const updatedEducation = [...(formData.educations || [])];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      educations: updatedEducation
    });
  };
  
  const removeEducation = (index) => {
    setFormData({
      ...formData,
      educations: formData.educations.filter((_, i) => i !== index)
    });
  };
  
  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ]
    });
  };
  
  const updateWorkExperience = (index, field, value) => {
    const updatedExperience = [...formData.workExperience];
    
    if (field === 'current') {
      // If current is true, clear end date
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value,
        ...(value ? { endDate: '' } : {})
      };
    } else {
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value
      };
    }
    
    setFormData({
      ...formData,
      workExperience: updatedExperience
    });
  };
  
  const removeWorkExperience = (index) => {
    setFormData({
      ...formData,
      workExperience: formData.workExperience.filter((_, i) => i !== index)
    });
  };
  
  const validateStep = () => {
    const newErrors = {};
    
    // Validation based on user type and current step
    if (formData.profileType === 'Job Seeker') {
      // Employment Status step
      if (currentStep === 1) {
        if (!formData.employmentStatus) {
          newErrors.employmentStatus = 'Please select your employment status';
        }
        if (formData.employmentStatus === 'employed' && formData.lookingToSwitch === undefined) {
          newErrors.lookingToSwitch = 'Please indicate if you are looking to switch jobs';
        }
      }
      
      // Education step - make optional
      else if (currentStep === 2) {
        // If user added education, validate it
        if (formData.educations && formData.educations.length > 0) {
          // Validate each education entry
          formData.educations.forEach((edu, index) => {
            if (!edu.institution || !edu.institution.trim()) {
              newErrors[`educations[${index}].institution`] = 'Institution name is required';
            }
            if (!edu.degree || !edu.degree.trim()) {
              newErrors[`educations[${index}].degree`] = 'Degree is required';
            }
            if (!edu.startDate) {
              newErrors[`educations[${index}].startDate`] = 'Start date is required';
            }
            if (!edu.currentlyStudying && !edu.endDate) {
              newErrors[`educations[${index}].endDate`] = 'End date is required if not currently studying';
            }
          });
        }
        // Education is now optional, so no error if array is empty
      }
      
      // Work Experience step for employed users - make optional
      else if (currentStep === 3 && formData.employmentStatus === 'employed') {
        // Work experience validation is only for entries provided, not required
        if (formData.workExperience && formData.workExperience.length > 0) {
          // Validate work experience entries
          formData.workExperience.forEach((exp, index) => {
            if (!exp.company.trim()) {
              newErrors[`workExperience.${index}.company`] = 'Company name is required';
            }
            if (!exp.position.trim()) {
              newErrors[`workExperience.${index}.position`] = 'Position is required';
            }
            if (!exp.startDate) {
              newErrors[`workExperience.${index}.startDate`] = 'Start date is required';
            }
            if (!exp.current && !exp.endDate) {
              newErrors[`workExperience.${index}.endDate`] = 'End date is required';
            }
          });
        }
        // Experience is now optional, so no error if array is empty
      }
      
      // Current CTC step for employed users - make optional
      else if ((formData.employmentStatus === 'employed' && currentStep === 4)) {
        // Current CTC is now optional
      }
      
      // Expected CTC step for employed users looking to switch - make optional
      else if (formData.employmentStatus === 'employed' && formData.lookingToSwitch && currentStep === 5) {
        // Expected CTC is now optional
      }
      
      // Notice Period step - optional for all
      else if (formData.employmentStatus === 'employed' && currentStep === 6) {
        // Notice period is now optional for everyone
      }
      
      // Skills step - keep this required as it's important for job matching
      else if ((formData.employmentStatus === 'unemployed' && currentStep === 3) ||
               (formData.employmentStatus === 'employed' && currentStep === (formData.lookingToSwitch ? 7 : 6))) {
        if (!formData.skills || formData.skills.length === 0) {
          newErrors.skills = 'Please select at least one skill';
        }
      }
      
      // Job Preferences step - make preferred roles optional
      else if ((formData.employmentStatus === 'unemployed' && currentStep === 4) ||
               (formData.employmentStatus === 'employed' && formData.lookingToSwitch && currentStep === 8)) {
        if (!formData.jobPreferences.jobType) {
          newErrors['jobPreferences.jobType'] = 'Please select a job type';
        }
        // Make roles selection optional - removed the validation check
      }
    }
    
    // Recruiter validation
    else if (formData.profileType === 'Recruiter (Companies Only)') {
      // Company verification step
      if (currentStep === 1) {
        if (!formData.companyName) {
          newErrors.companyName = 'Company name is required';
        }
        if (!formData.companyEmail) {
          newErrors.companyEmail = 'Company email is required';
        } else if (!formData.companyEmail.includes('@')) {
          newErrors.companyEmail = 'Please enter a valid email address';
        }
        if (!formData.companyVerified) {
          newErrors.companyVerified = 'Please verify your company email';
        }
      }
      
      // Job posting preferences step
      else if (currentStep === 2) {
        // Check if postJobNow has a value
        if (formData.postJobNow === undefined) {
          newErrors.postJobNow = 'Please select whether you want to post a job now';
        }
        
        // Validate job posting if user wants to post job now
        if (formData.postJobNow === true) {
          if (!formData.newJobPosting.title) {
            newErrors['newJobPosting.title'] = 'Job title is required';
          }
          if (!formData.newJobPosting.description) {
            newErrors['newJobPosting.description'] = 'Job description is required';
          }
          if (!formData.newJobPosting.employmentType) {
            newErrors['newJobPosting.employmentType'] = 'Employment type is required';
          }
          if (!formData.newJobPosting.experienceLevel) {
            newErrors['newJobPosting.experienceLevel'] = 'Experience level is required';
          }
          if (!formData.newJobPosting.location) {
            newErrors['newJobPosting.location'] = 'Job location is required';
          }
          if (!formData.newJobPosting.skills || formData.newJobPosting.skills.length === 0) {
            newErrors['newJobPosting.skills'] = 'Please add at least one required skill';
          }
        }
      }
    }
    
    // Networker validation
    else if (formData.profileType === 'Networking (Founder, Investor)') {
      // Networker type selection step
      if (currentStep === 1) {
        if (formData.isFounder === undefined) {
          newErrors.isFounder = 'Please select if you are a founder or investor';
        }
      }
      
      // Founder details step
      else if (currentStep === 2 && formData.isFounder) {
        if (!formData.founderDetails.companyName) {
          newErrors['founderDetails.companyName'] = 'Company name is required';
        }
        if (!formData.founderDetails.companyDescription) {
          newErrors['founderDetails.companyDescription'] = 'Company description is required';
        }
        if (!formData.founderDetails.industry) {
          newErrors['founderDetails.industry'] = 'Industry is required';
        }
        if (!formData.founderDetails.companyStage) {
          newErrors['founderDetails.companyStage'] = 'Company stage is required';
        }
        if (!formData.founderDetails.foundedYear) {
          newErrors['founderDetails.foundedYear'] = 'Founded year is required';
        }
        if (!formData.founderDetails.companySize) {
          newErrors['founderDetails.companySize'] = 'Team size is required';
        }
      }
      
      // Investor details step
      else if (currentStep === 2 && formData.isFounder === false) {
        if (!formData.investorDetails.fundingPreferences) {
          newErrors['investorDetails.fundingPreferences'] = 'Please select your investment stage preference';
        }
        if (!formData.investorDetails.companiesFunded) {
          newErrors['investorDetails.companiesFunded'] = 'Please indicate the number of companies funded';
        }
      }
    }
    
    // Always validate profile type on first step
    if (currentStep === 0) {
      if (!formData.profileType) {
        newErrors.profileType = 'Please select your profile type';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (validateStep()) {
      setIsLoading(true);
      try {
        // Process all data and prepare final form data before saving
        let finalFormData = { ...formData };
        
        // Ensure education data is consistent in both fields
        if (finalFormData.education && finalFormData.education.length > 0) {
          finalFormData.educations = [...finalFormData.education];
        } else if (finalFormData.educations && finalFormData.educations.length > 0) {
          finalFormData.education = [...finalFormData.educations];
        }
        
        // Process resume upload
        if (formData.resumeFile) {
          await handleResumeUpload();
        }
        
        // Add job posting
        if (formData.newJobPosting.title && formData.newJobPosting.description) {
          const newJob = {
            id: new Date().getTime(),
            ...formData.newJobPosting,
            postedDate: new Date().toISOString(),
            company: formData.companyName,
            status: 'Active'
          };
          finalFormData = {
            ...finalFormData,
            jobPostings: [...finalFormData.jobPostings, newJob]
          };
        }
        
        // Add networking details
        if (formData.isFounder) {
          // Add founder details
          if (formData.founderDetails.companyName && formData.founderDetails.companyDescription && 
              formData.founderDetails.foundedYear && formData.founderDetails.companySize && 
              formData.founderDetails.fundingDetails && formData.founderDetails.companyStage) {
            finalFormData = {
              ...finalFormData,
              founderDetails: {
                ...finalFormData.founderDetails,
                fundingDetails: finalFormData.founderDetails.fundingDetails.replace(/\s+/g, ' ')
              }
            };
          }
        } else if (formData.investorDetails) {
          // Add investor details
          if (formData.investorDetails.interestedIndustries && formData.investorDetails.fundingPreferences) {
            finalFormData = {
              ...finalFormData,
              investorDetails: {
                ...finalFormData.investorDetails,
                interestedIndustries: Array.isArray(finalFormData.investorDetails.interestedIndustries) 
                  ? finalFormData.investorDetails.interestedIndustries.join(', ') 
                  : finalFormData.investorDetails.interestedIndustries
              }
            };
          }
        }
        
        // Update completed fields
        finalFormData = {
          ...finalFormData,
          completedFields: {
            ...finalFormData.completedFields,
            profileType: true,
            employmentStatus: true,
            education: true,
            skills: true,
            preferredRoles: true,
            locationPreference: true,
            jobPreferences: true
          }
        };
        
        // Transform profile type to match what App.jsx expects
        let updatedProfileType = finalFormData.profileType;
        if (finalFormData.profileType === 'Recruiter (Companies Only)') {
          updatedProfileType = 'Recruiter';
        } else if (finalFormData.profileType === 'Networking (Founder, Investor)') {
          updatedProfileType = 'Networker';
        }
        
        finalFormData = {
          ...finalFormData,
          profileType: updatedProfileType,
          profileCompletionRequired: false
        };
        
        console.log('Updating user profile with data:', finalFormData);
        
        // Update user profile with all changes at once
        const updateResult = await updateUserProfile(finalFormData);
        console.log('Profile update result:', updateResult);
        
        // Process AI response for job seekers only
        if (finalFormData.profileType === 'Job Seeker') {
          let aiQuery = "How to prepare for a job interview?";
          
          if (finalFormData.jobPreferences && finalFormData.jobPreferences.jobType) {
            aiQuery = `Tips for finding ${finalFormData.jobPreferences.jobType} jobs`;
          } else if (finalFormData.preferredRoles && finalFormData.preferredRoles.length > 0) {
            aiQuery = `Career advice for ${finalFormData.preferredRoles[0]}`;
          }
          
          console.log("Sending AI query:", aiQuery);
          const aiResponse = await getCareerAssistantResponse(aiQuery);
          setChatMessages(prev => [...prev, { sender: 'user', text: aiQuery }]);
          setChatMessages(prev => [...prev, { sender: 'assistant', text: aiResponse }]);
        }
        
        // Navigate based on user type
        console.log('Navigating to dashboard based on profile type:', updatedProfileType);
        if (updatedProfileType === 'Recruiter') {
          navigate('/recruiter-dashboard');
        } else if (updatedProfileType === 'Networker') {
          navigate('/networking-dashboard');
        } else {
          // Default for Job Seekers
          navigate('/job-seeker-dashboard');
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const renderStepContent = () => {
    // For Job Seeker
    if (formData.profileType === 'Job Seeker') {
      if (formData.employmentStatus === 'unemployed') {
        // For unemployed job seekers
        switch (currentStep) {
          case 0: return renderGoalSelection(); // What are you looking to do?
          case 1: return renderEmploymentStatus(); // Are you employed?
          case 2: return renderEducation(); // Education details
          case 3: return renderSkills(); // Skills
          case 4: return renderJobPreferences(); // Job preferences
          default: return null;
        }
      } else if (formData.employmentStatus === 'employed') {
        if (formData.lookingToSwitch === true) {
          // For employed users looking to switch
          switch (currentStep) {
            case 0: return renderGoalSelection(); // What are you looking to do?
            case 1: return renderEmploymentStatus(); // Are you employed?
            case 2: return renderEducation(); // Education details
            case 3: return renderWorkExperience(); // Work experience
            case 4: return renderCurrentCTC(); // Current CTC
            case 5: return renderExpectedCTC(); // Expected CTC
            case 6: return renderNoticePeriod(); // Notice Period (now optional for everyone)
            case 7: return renderSkills(); // Skills
            case 8: return renderJobPreferences(); // Job preferences
            default: return null;
          }
        } else if (formData.lookingToSwitch === false) {
          // For employed users just networking
          switch (currentStep) {
            case 0: return renderGoalSelection(); // What are you looking to do?
            case 1: return renderEmploymentStatus(); // Are you employed?
            case 2: return renderEducation(); // Education details
            case 3: return renderWorkExperience(); // Work experience
            case 4: return renderCurrentCTC(); // Current CTC
            case 5: return renderNoticePeriod(); // Notice Period (now optional for everyone)
            case 6: return renderSkills(); // Skills
            default: return null;
          }
        }
        // Default view before selecting if looking to switch
        switch (currentStep) {
          case 0: return renderGoalSelection(); // What are you looking to do?
          case 1: return renderEmploymentStatus(); // Are you employed?
          default: return null;
        }
      }
      // Default view before selecting employment status
      switch (currentStep) {
        case 0: return renderGoalSelection(); // What are you looking to do?
        case 1: return renderEmploymentStatus(); // Are you employed?
        default: return null;
      }
    } 
    // For Recruiter
    else if (formData.profileType === 'Recruiter (Companies Only)') {
      switch (currentStep) {
        case 0: return renderGoalSelection(); // What are you looking to do?
        case 1: return renderCompanyVerification(); // Verify company email
        case 2: return renderRecruiterPreferences(); // Job posting preferences
        default: return null;
      }
    } 
    // For Networker (Founder or Investor)
    else if (formData.profileType === 'Networking (Founder, Investor)') {
      switch (currentStep) {
        case 0: return renderGoalSelection(); // What are you looking to do?
        case 1: return renderNetworkerType(); // Founder or Investor?
        case 2: return formData.isFounder ? renderFounderDetails() : renderInvestorDetails(); // Type-specific details
        default: return null;
      }
    }
    
    // Default view before selecting profile type
    return renderGoalSelection();
  };
  
  const renderGoalSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">What are you looking to do?</h2>
      <p className="text-gray-600">This will help us tailor your networking experience.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {profileTypes.map((type) => (
          <div
            key={type}
            onClick={() => setFormData({ ...formData, profileType: type })}
            className={`p-6 border rounded-lg cursor-pointer transition-all ${
              formData.profileType === type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center mb-4">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                formData.profileType === type ? 'border-blue-500' : 'border-gray-400'
              }`}>
                {formData.profileType === type && (
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                )}
              </div>
              <span className="ml-2 font-medium">{type}</span>
            </div>
            <p className="text-sm text-gray-600">{type === 'Job Seeker' ? 'Looking for a job or career change' : type === 'Recruiter (Companies Only)' ? 'Recruiting for your company' : 'Networking with potential investors and partners'}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderUserTypeSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Are you a Job Seeker or a Recruiter?</h2>
      <p className="text-gray-600">This will help us tailor your networking experience.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div
          onClick={() => setFormData({ ...formData, profileType: 'Job Seeker' })}
          className={`p-6 border rounded-lg cursor-pointer transition-all ${
            formData.profileType === 'Job Seeker'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              formData.profileType === 'Job Seeker' ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {formData.profileType === 'Job Seeker' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <span className="ml-2 font-medium">Job Seeker</span>
          </div>
          <p className="text-sm text-gray-600">
            I'm looking for a job or career change.
          </p>
        </div>
        
        <div
          onClick={() => setFormData({ ...formData, profileType: 'Recruiter (Companies Only)' })}
          className={`p-6 border rounded-lg cursor-pointer transition-all ${
            formData.profileType === 'Recruiter (Companies Only)'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              formData.profileType === 'Recruiter (Companies Only)' ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {formData.profileType === 'Recruiter (Companies Only)' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <span className="ml-2 font-medium">Recruiter</span>
          </div>
          <p className="text-sm text-gray-600">
            I'm recruiting for my company.
          </p>
        </div>
      </div>
    </div>
  );
  
  const renderUserDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Tell us about yourself</h2>
      <p className="text-gray-600">This will help us tailor your networking experience.</p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="e.g. John Doe"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="name@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>
    </div>
  );
  
  const renderEducation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Education (Optional)</h2>
      <p className="text-gray-600">Add your educational background. You can skip this step if you prefer.</p>
      
      {formData.educations && formData.educations.length > 0 ? (
        formData.educations.map((education, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium text-gray-800">Education #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  value={education.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`educations[${index}].institution`] ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g. Harvard University"
                />
                {errors[`educations[${index}].institution`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`educations[${index}].institution`]}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree</label>
                <input
                  type="text"
                  value={education.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`educations[${index}].degree`] ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g. Bachelor of Science"
                />
                {errors[`educations[${index}].degree`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`educations[${index}].degree`]}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                <input
                  type="text"
                  value={education.fieldOfStudy}
                  onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`educations[${index}].fieldOfStudy`] ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g. Computer Science"
                />
                {errors[`educations[${index}].fieldOfStudy`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`educations[${index}].fieldOfStudy`]}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Grade/GPA</label>
                <input
                  type="text"
                  value={education.grade}
                  onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. 3.8/4.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="month"
                  value={education.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`educations[${index}].startDate`] ? 'border-red-500' : ''
                  }`}
                />
                {errors[`educations[${index}].startDate`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`educations[${index}].startDate`]}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="month"
                    value={education.endDate}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                    disabled={education.currentlyStudying}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors[`educations[${index}].endDate`] && !education.currentlyStudying ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={education.currentlyStudying}
                      onChange={(e) => updateEducation(index, 'currentlyStudying', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Currently Studying</span>
                  </label>
                </div>
                {errors[`educations[${index}].endDate`] && !education.currentlyStudying && (
                  <p className="mt-1 text-sm text-red-600">{errors[`educations[${index}].endDate`]}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={education.description}
                  onChange={(e) => updateEducation(index, 'description', e.target.value)}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add any relevant information about your education"
                ></textarea>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No education entries added yet. You can proceed without adding education.</p>
        </div>
      )}
      
      <button
        type="button"
        onClick={addEducation}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="mr-2">+</span> Add Education
      </button>
    </div>
  );
  
  const renderEmploymentStatus = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">What's your current employment status?</h2>
      <p className="text-gray-600">This helps us customize your job search experience.</p>
      
      <div className="grid grid-cols-1 gap-4 mt-6">
        <div
          onClick={() => setFormData({ 
            ...formData, 
            employmentStatus: 'employed',
            lookingToSwitch: undefined // Reset the looking to switch when employment status changes
          })}
          className={`p-6 border rounded-lg cursor-pointer transition-all ${
            formData.employmentStatus === 'employed'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center mb-2">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              formData.employmentStatus === 'employed' ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {formData.employmentStatus === 'employed' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <span className="ml-2 font-medium">Currently Employed</span>
          </div>
          
          {formData.employmentStatus === 'employed' && (
            <div className="mt-4 ml-7">
              <p className="text-sm font-medium text-gray-700 mb-2">Are you looking to switch jobs?</p>
              
              <div className="space-y-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData({ ...formData, lookingToSwitch: true });
                  }}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    formData.lookingToSwitch === true
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.lookingToSwitch === true ? 'border-blue-500' : 'border-gray-400'
                    }`}>
                      {formData.lookingToSwitch === true && (
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span className="ml-2 text-sm">Yes, I'm looking for new opportunities</span>
                  </div>
                </div>
                
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData({ ...formData, lookingToSwitch: false });
                  }}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    formData.lookingToSwitch === false
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.lookingToSwitch === false ? 'border-blue-500' : 'border-gray-400'
                    }`}>
                      {formData.lookingToSwitch === false && (
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span className="ml-2 text-sm">No, just networking</span>
                  </div>
                </div>
              </div>
              
              {errors.lookingToSwitch && <p className="mt-1 text-sm text-red-600">{errors.lookingToSwitch}</p>}
            </div>
          )}
        </div>
        
        <div
          onClick={() => setFormData({ ...formData, employmentStatus: 'unemployed' })}
          className={`p-6 border rounded-lg cursor-pointer transition-all ${
            formData.employmentStatus === 'unemployed'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              formData.employmentStatus === 'unemployed' ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {formData.employmentStatus === 'unemployed' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <span className="ml-2 font-medium">Currently Not Employed</span>
          </div>
        </div>
      </div>
      
      {errors.employmentStatus && <p className="mt-1 text-sm text-red-600">{errors.employmentStatus}</p>}
    </div>
  );
  
  const renderWorkExperience = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Work Experience (Optional)</h2>
      <p className="text-gray-600">Tell us about your work history. You can skip this step if you prefer.</p>
      
      {formData.workExperience.length > 0 ? (
        <div className="space-y-4">
          {formData.workExperience.map((experience, index) => (
            <div key={index} className="p-4 border rounded-lg mb-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-md font-medium">Experience {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeWorkExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    id={`company-${index}`}
                    value={experience.company}
                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors[`workExperience.${index}.company`] ? 'border-red-500' : ''
                    }`}
                    placeholder="Company name"
                  />
                  {errors[`workExperience.${index}.company`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`workExperience.${index}.company`]}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    id={`position-${index}`}
                    value={experience.position}
                    onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors[`workExperience.${index}.position`] ? 'border-red-500' : ''
                    }`}
                    placeholder="Job title"
                  />
                  {errors[`workExperience.${index}.position`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`workExperience.${index}.position`]}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="month"
                    id={`startDate-${index}`}
                    value={experience.startDate}
                    onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors[`workExperience.${index}.startDate`] ? 'border-red-500' : ''
                    }`}
                  />
                  {errors[`workExperience.${index}.startDate`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`workExperience.${index}.startDate`]}</p>
                  )}
                </div>
                
                <div className="flex items-center mt-4 md:mt-0">
                  <input
                    type="checkbox"
                    id={`current-${index}`}
                    checked={experience.current}
                    onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor={`current-${index}`} className="ml-2 text-sm text-gray-700">
                    I currently work here
                  </label>
                </div>
                
                {!experience.current && (
                  <div>
                    <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="month"
                      id={`endDate-${index}`}
                      value={experience.endDate}
                      onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors[`workExperience.${index}.endDate`] ? 'border-red-500' : ''
                      }`}
                    />
                    {errors[`workExperience.${index}.endDate`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`workExperience.${index}.endDate`]}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                  Job Description (Optional)
                </label>
                <textarea
                  id={`description-${index}`}
                  value={experience.description}
                  onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe your responsibilities and achievements"
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed rounded-lg">
          <p className="text-gray-500">No work experience added yet. You can proceed without adding work experience.</p>
        </div>
      )}
      
      <button
        type="button"
        onClick={addWorkExperience}
        className="mt-2 inline-flex items-center px-3 py-1.5 border border-blue-700 text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        + Add Work Experience
      </button>
    </div>
  );
  
  const renderCurrentCTC = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Current Compensation (Optional)</h2>
      <p className="text-gray-600">Please provide details about your current compensation package. You can skip this step if you prefer.</p>
      
      <div className="space-y-4">
        {/* Current CTC */}
        <div>
          <label htmlFor="ctcAmount" className="block text-sm font-medium text-gray-700">
            Current CTC (Annual)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="ctcAmount"
              name="currentCTC.amount"
              value={formData.currentCTC.amount}
              onChange={handleInputChange}
              className={`block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.currentCTC ? 'border-red-500' : ''}`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">LPA</span>
            </div>
          </div>
          {errors.currentCTC && <p className="mt-1 text-sm text-red-600">{errors.currentCTC}</p>}
        </div>
        
        {/* Fixed Component */}
        <div>
          <label htmlFor="ctcFixed" className="block text-sm font-medium text-gray-700">
            Fixed Component (Annual)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="ctcFixed"
              name="currentCTC.fixed"
              value={formData.currentCTC.fixed}
              onChange={handleInputChange}
              className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">LPA</span>
            </div>
          </div>
        </div>
        
        {/* Variable Component */}
        <div>
          <label htmlFor="ctcVariable" className="block text-sm font-medium text-gray-700">
            Variable Component (Annual, if any)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="ctcVariable"
              name="currentCTC.variable"
              value={formData.currentCTC.variable}
              onChange={handleInputChange}
              className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">LPA</span>
            </div>
          </div>
        </div>
        
        {/* ESOP/RSU Value */}
        <div>
          <label htmlFor="ctcEsops" className="block text-sm font-medium text-gray-700">
            ESOP/RSU Value (Annual, if any)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="ctcEsops"
              name="currentCTC.esops"
              value={formData.currentCTC.esops}
              onChange={handleInputChange}
              className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">LPA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderExpectedCTC = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Expected Compensation (Optional)</h2>
      <p className="text-gray-600">What compensation range are you looking for in your next role? You can skip this step if you prefer.</p>
      
      <div className="space-y-4">
        {/* Expected Min CTC */}
        <div>
          <label htmlFor="expectedMinCTC" className="block text-sm font-medium text-gray-700">
            Minimum Expected CTC (Annual)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="expectedMinCTC"
              name="expectedCTC.min"
              value={formData.expectedCTC.min}
              onChange={handleInputChange}
              className={`block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.expectedCTC ? 'border-red-500' : ''}`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">LPA</span>
            </div>
          </div>
          {errors.expectedCTC && <p className="mt-1 text-sm text-red-600">{errors.expectedCTC}</p>}
        </div>
        
        {/* Expected Max CTC */}
        <div>
          <label htmlFor="expectedMaxCTC" className="block text-sm font-medium text-gray-700">
            Maximum Expected CTC (Annual)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="expectedMaxCTC"
              name="expectedCTC.max"
              value={formData.expectedCTC.max}
              onChange={handleInputChange}
              className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">LPA</span>
            </div>
          </div>
        </div>
        
        {/* Negotiable */}
        <div className="flex items-center">
          <input
            id="negotiable"
            name="expectedCTC.negotiable"
            type="checkbox"
            checked={formData.expectedCTC.negotiable}
            onChange={(e) => handleInputChange({
              target: {
                name: 'expectedCTC.negotiable',
                value: e.target.checked,
                type: 'checkbox',
                checked: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="negotiable" className="ml-2 block text-sm text-gray-700">
            My expected CTC is negotiable
          </label>
        </div>
        
        {/* Additional Notes */}
        <div>
          <label htmlFor="ctcNotes" className="block text-sm font-medium text-gray-700">
            Additional Notes About Compensation (Optional)
          </label>
          <textarea
            id="ctcNotes"
            name="expectedCTC.notes"
            value={formData.expectedCTC.notes}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any specific requirements or details about your compensation expectations..."
          ></textarea>
        </div>
      </div>
    </div>
  );
  
  const renderNoticePeriod = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Notice Period (Optional)</h2>
      <p className="text-gray-600">Share your notice period information if applicable. You can skip this step if you prefer.</p>
      
      <div className="space-y-4">
        {/* Notice Period Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select your notice period {!isRequired && "(Optional)"}
          </label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {['Immediate', '15 Days', '30 Days', '60 Days', '90 Days', 'More than 90 Days'].map((option) => (
              <div
                key={option}
                onClick={() => handleInputChange({
                  target: {
                    name: 'noticePeriod.duration',
                    value: option
                  }
                })}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  formData.noticePeriod.duration === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
          {errors.noticePeriod && <p className="mt-1 text-sm text-red-600">{errors.noticePeriod}</p>}
        </div>
        
        {/* Negotiable Notice Period */}
        <div className="flex items-center">
          <input
            id="negotiableNoticePeriod"
            name="noticePeriod.negotiable"
            type="checkbox"
            checked={formData.noticePeriod.negotiable}
            onChange={(e) => handleInputChange({
              target: {
                name: 'noticePeriod.negotiable',
                value: e.target.checked,
                type: 'checkbox',
                checked: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="negotiableNoticePeriod" className="ml-2 block text-sm text-gray-700">
            My notice period is negotiable
          </label>
        </div>
        
        {/* Buyout Option */}
        <div className="flex items-center">
          <input
            id="buyoutOption"
            name="noticePeriod.buyoutOption"
            type="checkbox"
            checked={formData.noticePeriod.buyoutOption}
            onChange={(e) => handleInputChange({
              target: {
                name: 'noticePeriod.buyoutOption',
                value: e.target.checked,
                type: 'checkbox',
                checked: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="buyoutOption" className="ml-2 block text-sm text-gray-700">
            My current company offers a notice period buyout option
          </label>
        </div>
        
        {/* Additional Notes */}
        {formData.noticePeriod.buyoutOption && (
          <div>
            <label htmlFor="buyoutNotes" className="block text-sm font-medium text-gray-700">
              Buyout Details (Optional)
            </label>
            <textarea
              id="buyoutNotes"
              name="noticePeriod.buyoutNotes"
              value={formData.noticePeriod.buyoutNotes}
              onChange={handleInputChange}
              rows="2"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide any relevant details about the buyout process..."
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderJobPreferences = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Job Preferences</h3>
      <p className="text-sm text-gray-500">Help us understand what you're looking for in your next role.</p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            id="jobType"
            name="jobPreferences.jobType"
            value={formData.jobPreferences.jobType}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
          {errors['jobPreferences.jobType'] && (
            <p className="mt-1 text-sm text-red-600">{errors['jobPreferences.jobType']}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Roles (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-2">Select roles you're interested in or add your own.</p>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            {['Software Engineer', 'Product Manager', 'Data Scientist', 'UX/UI Designer', 'Digital Marketer', 
              'Project Manager', 'Business Analyst', 'DevOps Engineer', 'QA Engineer', 'Frontend Developer',
              'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'Data Analyst', 'Technical Writer'].map((role) => (
              <div
                key={role}
                onClick={() => {
                  if (formData.preferredRoles.includes(role)) {
                    setFormData({
                      ...formData,
                      preferredRoles: formData.preferredRoles.filter(r => r !== role)
                    });
                  } else if (formData.preferredRoles.length + formData.customRoles.length < 5) {
                    setFormData({
                      ...formData,
                      preferredRoles: [...formData.preferredRoles, role]
                    });
                  } else {
                    alert("You can select a maximum of 5 roles");
                  }
                }}
                className={`px-3 py-2 border rounded-md cursor-pointer text-sm ${
                  formData.preferredRoles.includes(role)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                {role}
              </div>
            ))}
          </div>
          
          {/* Custom Roles */}
          <div className="mt-3">
            <label htmlFor="customRole" className="block text-sm font-medium text-gray-700">Add a custom role</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="customRole"
                name="customRole"
                className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Growth Hacker"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (value && !formData.customRoles.includes(value) && !formData.preferredRoles.includes(value) && 
                        formData.preferredRoles.length + formData.customRoles.length < 5) {
                      setFormData({
                        ...formData,
                        customRoles: [...formData.customRoles, value]
                      });
                      e.target.value = '';
                    } else if (formData.preferredRoles.length + formData.customRoles.length >= 5) {
                      alert("You can select a maximum of 5 roles");
                    } else if (formData.customRoles.includes(value) || formData.preferredRoles.includes(value)) {
                      alert("This role is already selected");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = document.getElementById('customRole');
                  const value = input.value.trim();
                  if (value && !formData.customRoles.includes(value) && !formData.preferredRoles.includes(value) && 
                      formData.preferredRoles.length + formData.customRoles.length < 5) {
                    setFormData({
                      ...formData,
                      customRoles: [...formData.customRoles, value]
                    });
                    input.value = '';
                  } else if (formData.preferredRoles.length + formData.customRoles.length >= 5) {
                    alert("You can select a maximum of 5 roles");
                  } else if (formData.customRoles.includes(value) || formData.preferredRoles.includes(value)) {
                    alert("This role is already selected");
                  }
                }}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Display selected roles */}
          {(formData.preferredRoles.length > 0 || formData.customRoles.length > 0) && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Roles:</h3>
              <div className="flex flex-wrap gap-2">
                {formData.preferredRoles.map((role, index) => (
                  <div key={`preferred-${index}`} className="bg-blue-50 text-blue-700 border border-blue-300 rounded-md px-2 py-1 flex items-center">
                    {role}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          preferredRoles: formData.preferredRoles.filter((_, i) => i !== index)
                        });
                      }}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {formData.customRoles.map((role, index) => (
                  <div key={`custom-${index}`} className="bg-green-50 text-green-700 border border-green-300 rounded-md px-2 py-1 flex items-center">
                    {role}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          customRoles: formData.customRoles.filter((_, i) => i !== index)
                        });
                      }}
                      className="ml-1 text-green-500 hover:text-green-700"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {errors.preferredRoles && <p className="mt-1 text-sm text-red-600">{errors.preferredRoles}</p>}
        </div>
        
        {/* Job Sectors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Industry Sectors (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {industries.slice(0, 12).map((industry) => (
              <div
                key={industry}
                onClick={() => {
                  const updatedSectors = formData.jobPreferences.jobSectors.includes(industry)
                    ? formData.jobPreferences.jobSectors.filter(s => s !== industry)
                    : [...formData.jobPreferences.jobSectors, industry];
                  
                  setFormData({
                    ...formData,
                    jobPreferences: {
                      ...formData.jobPreferences,
                      jobSectors: updatedSectors
                    }
                  });
                }}
                className={`px-3 py-2 border rounded-md cursor-pointer text-sm ${
                  formData.jobPreferences.jobSectors.includes(industry)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
        
        {/* Expected Salary */}
        <div>
          <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700">
            Expected Salary (Optional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="text"
              id="expectedSalary"
              name="jobPreferences.expectedSalary"
              value={formData.jobPreferences.expectedSalary}
              onChange={handleInputChange}
              className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 15-20 LPA"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">per annum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render career assistant chatbot
  const renderCareerAssistant = () => (
    <div className="fixed bottom-4 right-4 z-50">
      {!showChatbox ? (
        <button
          onClick={() => setShowChatbox(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          title="AI Career Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 border border-gray-200 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold">AI Career Assistant</h3>
            </div>
            <button
              onClick={() => setShowChatbox(false)}
              className="text-white hover:text-gray-200"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 h-80 overflow-y-auto" ref={chatBoxRef}>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block rounded-lg py-2 px-3 max-w-xs ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiTyping && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-200 text-gray-800 rounded-lg py-2 px-3 rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t p-2">
            <form onSubmit={handleChatSubmit} className="flex">
              <input
                type="text"
                placeholder="Ask about career advice, skills, etc."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Function to handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
    
    // Clear input
    const userQuery = chatInput;
    setChatInput('');
    
    // Show AI typing indicator
    setIsAiTyping(true);
    
    try {
      // Get AI response
      const aiResponse = await getCareerAssistantResponse(userQuery, formData);
      
      // Add AI response to chat after a small delay to simulate typing
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'assistant', text: aiResponse }]);
        setIsAiTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          sender: 'assistant', 
          text: "I'm sorry, I encountered an error processing your request. Please try again later." 
        }]);
        setIsAiTyping(false);
      }, 1000);
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    // Define fields required based on user type
    let requiredFields = ['profileType'];
    let completedFields = 0;
    let totalFields = 1; // profileType is always required
    
    if (formData.profileType) {
      completedFields++; // profileType is filled
      
      if (formData.profileType === 'Job Seeker') {
        requiredFields = [
          ...requiredFields,
          'employmentStatus',
          'education',
          'skills',
          'preferredRoles',
          'locationPreference',
          'jobPreferences'
        ];
        totalFields += 6;
        
        // Check completed fields for Job Seeker
        if (formData.employmentStatus) completedFields++;
        if (formData.education && formData.education.length > 0) completedFields++;
        if (formData.skills && formData.skills.length > 0) completedFields++;
        if ((formData.preferredRoles && formData.preferredRoles.length > 0) || 
            (formData.customRoles && formData.customRoles.length > 0)) completedFields++;
        if (formData.locationPreference) completedFields++;
        if (formData.jobPreferences && formData.jobPreferences.jobType) completedFields++;
      } 
      else if (formData.profileType === 'Recruiter (Companies Only)') {
        requiredFields = [
          ...requiredFields,
          'companyVerified',
          'hiringFor'
        ];
        totalFields += 2;
        
        // Check completed fields for Recruiter
        if (formData.companyVerified) completedFields++;
        if (formData.hiringFor && formData.hiringFor.length > 0) completedFields++;
      } 
      else if (formData.profileType === 'Networking (Founder, Investor)') {
        totalFields += 1;
        if (formData.isFounder !== undefined) completedFields++;
        
        if (formData.isFounder) {
          requiredFields = [
            ...requiredFields,
            'founderDetails.companyName',
            'founderDetails.companyStage'
          ];
          totalFields += 2;
          
          if (formData.founderDetails) {
            if (formData.founderDetails.companyName) completedFields++;
            if (formData.founderDetails.companyStage) completedFields++;
          }
        } else {
          requiredFields = [
            ...requiredFields,
            'investorDetails.interestedIndustries',
            'investorDetails.fundingPreferences'
          ];
          totalFields += 2;
          
          if (formData.investorDetails) {
            if (formData.investorDetails.interestedIndustries && 
                formData.investorDetails.interestedIndustries.length > 0) completedFields++;
            if (formData.investorDetails.fundingPreferences) completedFields++;
          }
        }
      }
    }
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Handle next and previous step navigation
  const nextStep = () => {
    if (validateStep()) {
      const maxSteps = getStepCount();
      if (currentStep < maxSteps - 1) {
        setCurrentStep(prevStep => prevStep + 1);
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  // Render networker type selection (Founder or Investor)
  const renderNetworkerType = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Are you a Founder or an Investor?</h2>
      <p className="text-gray-600">This will help us match you with relevant connections.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div
          onClick={() => setFormData({ ...formData, isFounder: true })}
          className={`p-6 border rounded-lg cursor-pointer transition-all ${
            formData.isFounder === true
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              formData.isFounder === true ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {formData.isFounder === true && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <span className="ml-2 font-medium">Founder</span>
          </div>
          <p className="text-sm text-gray-600">
            I've started a company and looking to connect with investors or other founders
          </p>
        </div>
        
        <div
          onClick={() => setFormData({ ...formData, isFounder: false })}
          className={`p-6 border rounded-lg cursor-pointer transition-all ${
            formData.isFounder === false
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              formData.isFounder === false ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {formData.isFounder === false && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <span className="ml-2 font-medium">Investor</span>
          </div>
          <p className="text-sm text-gray-600">
            I invest in startups and looking to connect with promising founders
          </p>
        </div>
      </div>
    </div>
  );

  // Render founder details with complete fields
  const renderFounderDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Founder Details</h2>
      <p className="text-gray-600">Tell us about your company to help connect with investors and other founders.</p>
      
      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label htmlFor="founderCompanyName" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            id="founderCompanyName"
            name="founderDetails.companyName"
            value={formData.founderDetails.companyName}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['founderDetails.companyName'] ? 'border-red-500' : ''}`}
            placeholder="Your Company Name"
          />
          {errors['founderDetails.companyName'] && <p className="mt-1 text-sm text-red-600">{errors['founderDetails.companyName']}</p>}
        </div>
        
        {/* Website (Optional) */}
        <div>
          <label htmlFor="founderWebsite" className="block text-sm font-medium text-gray-700">Website (Optional)</label>
          <input
            type="url"
            id="founderWebsite"
            name="founderDetails.website"
            value={formData.founderDetails.website}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
        
        {/* Brief Description */}
        <div>
          <label htmlFor="founderCompanyDescription" className="block text-sm font-medium text-gray-700">Brief About Company</label>
          <textarea
            id="founderCompanyDescription"
            name="founderDetails.companyDescription"
            value={formData.founderDetails.companyDescription}
            onChange={handleInputChange}
            rows="3"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['founderDetails.companyDescription'] ? 'border-red-500' : ''}`}
            placeholder="Describe what your company does and your vision"
          ></textarea>
          {errors['founderDetails.companyDescription'] && <p className="mt-1 text-sm text-red-600">{errors['founderDetails.companyDescription']}</p>}
        </div>
        
        {/* Industry */}
        <div>
          <label htmlFor="founderIndustry" className="block text-sm font-medium text-gray-700">Industry</label>
          <select
            id="founderIndustry"
            name="founderDetails.industry"
            value={formData.founderDetails.industry}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['founderDetails.industry'] ? 'border-red-500' : ''}`}
          >
            <option value="">Select Industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors['founderDetails.industry'] && <p className="mt-1 text-sm text-red-600">{errors['founderDetails.industry']}</p>}
        </div>
        
        {/* Company Stage */}
        <div>
          <label htmlFor="founderCompanyStage" className="block text-sm font-medium text-gray-700">Company Stage</label>
          <select
            id="founderCompanyStage"
            name="founderDetails.companyStage"
            value={formData.founderDetails.companyStage}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['founderDetails.companyStage'] ? 'border-red-500' : ''}`}
          >
            <option value="">Select Company Stage</option>
            <option value="Pre-revenue">Pre-revenue</option>
            <option value="Early Revenue">Early Revenue</option>
            <option value="MVP">MVP Stage</option>
            <option value="Pre-seed">Pre-seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Series C+">Series C+</option>
            <option value="Profitable">Profitable</option>
          </select>
          {errors['founderDetails.companyStage'] && <p className="mt-1 text-sm text-red-600">{errors['founderDetails.companyStage']}</p>}
        </div>
        
        {/* Founded Year */}
        <div>
          <label htmlFor="founderFoundedYear" className="block text-sm font-medium text-gray-700">Founded Year</label>
          <input
            type="number"
            id="founderFoundedYear"
            name="founderDetails.foundedYear"
            value={formData.founderDetails.foundedYear}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['founderDetails.foundedYear'] ? 'border-red-500' : ''}`}
            placeholder="e.g. 2020"
            min="1900"
            max={new Date().getFullYear()}
          />
          {errors['founderDetails.foundedYear'] && <p className="mt-1 text-sm text-red-600">{errors['founderDetails.foundedYear']}</p>}
        </div>
        
        {/* Team Size */}
        <div>
          <label htmlFor="founderCompanySize" className="block text-sm font-medium text-gray-700">Team Size</label>
          <select
            id="founderCompanySize"
            name="founderDetails.companySize"
            value={formData.founderDetails.companySize}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['founderDetails.companySize'] ? 'border-red-500' : ''}`}
          >
            <option value="">Select Team Size</option>
            <option value="Solo Founder">Solo Founder</option>
            <option value="2-5">2-5 employees</option>
            <option value="6-10">6-10 employees</option>
            <option value="11-25">11-25 employees</option>
            <option value="26-50">26-50 employees</option>
            <option value="51-100">51-100 employees</option>
            <option value="101-250">101-250 employees</option>
            <option value="251-500">251-500 employees</option>
            <option value="501+">501+ employees</option>
          </select>
          {errors['founderDetails.companySize'] && <p className="mt-1 text-sm text-red-600">{errors['founderDetails.companySize']}</p>}
        </div>
      </div>
    </div>
  );

  // Render investor details with all required fields
  const renderInvestorDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Investor Details</h2>
      <p className="text-gray-600">Tell us about your investment preferences to connect you with suitable founders.</p>
      
      <div className="space-y-6">
        {/* Industries of Interest (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industries of Interest (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {industries.map((industry) => (
              <div
                key={industry}
                onClick={() => {
                  const updatedIndustries = formData.investorDetails.interestedIndustries.includes(industry)
                    ? formData.investorDetails.interestedIndustries.filter(i => i !== industry)
                    : [...formData.investorDetails.interestedIndustries, industry];
                    
                  setFormData({
                    ...formData,
                    investorDetails: {
                      ...formData.investorDetails,
                      interestedIndustries: updatedIndustries
                    }
                  });
                }}
                className={`px-3 py-2 border rounded-md cursor-pointer text-sm ${
                  formData.investorDetails.interestedIndustries.includes(industry)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                {industry}
              </div>
            ))}
          </div>
          
          {/* Add custom industry */}
          <div className="mt-2">
            <label htmlFor="customIndustry" className="block text-sm font-medium text-gray-700">Add a custom industry</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="customIndustry"
                className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. AgriTech"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (value && !formData.investorDetails.interestedIndustries.includes(value)) {
                      setFormData({
                        ...formData,
                        investorDetails: {
                          ...formData.investorDetails,
                          interestedIndustries: [
                            ...formData.investorDetails.interestedIndustries,
                            value
                          ]
                        }
                      });
                      e.target.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('customIndustry');
                  const value = input.value.trim();
                  if (value && !formData.investorDetails.interestedIndustries.includes(value)) {
                    setFormData({
                      ...formData,
                      investorDetails: {
                        ...formData.investorDetails,
                        interestedIndustries: [
                          ...formData.investorDetails.interestedIndustries,
                          value
                        ]
                      }
                    });
                    input.value = '';
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Display selected industries */}
          {formData.investorDetails.interestedIndustries.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Industries:</p>
              <div className="flex flex-wrap gap-2">
                {formData.investorDetails.interestedIndustries.map((industry, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-md px-2 py-1 flex items-center">
                    <span className="text-blue-700 text-sm">{industry}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          investorDetails: {
                            ...formData.investorDetails,
                            interestedIndustries: formData.investorDetails.interestedIndustries.filter((_, i) => i !== index)
                          }
                        });
                      }}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Investment Preferences */}
        <div>
          <label htmlFor="fundingPreferences" className="block text-sm font-medium text-gray-700">
            Investment Preferences (Company Stage)
          </label>
          <select
            id="fundingPreferences"
            name="investorDetails.fundingPreferences"
            value={formData.investorDetails.fundingPreferences}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['investorDetails.fundingPreferences'] ? 'border-red-500' : ''}`}
          >
            <option value="">Select Stage Preference</option>
            <option value="Pre-revenue">Pre-revenue</option>
            <option value="Early Revenue">Early Revenue</option>
            <option value="Pre-seed">Pre-seed</option>
            <option value="Seed">Seed</option>
            <option value="Growth">Growth Stage</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Series C+">Series C+</option>
            <option value="All Stages">All Stages</option>
          </select>
          {errors['investorDetails.fundingPreferences'] && <p className="mt-1 text-sm text-red-600">{errors['investorDetails.fundingPreferences']}</p>}
        </div>
        
        {/* Companies Funded */}
        <div>
          <label htmlFor="companiesFunded" className="block text-sm font-medium text-gray-700">
            How Many Companies Have You Funded?
          </label>
          <select
            id="companiesFunded"
            name="investorDetails.companiesFunded"
            value={formData.investorDetails.companiesFunded}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['investorDetails.companiesFunded'] ? 'border-red-500' : ''}`}
          >
            <option value="">Select Range</option>
            <option value="0">0 (New Investor)</option>
            <option value="1-5">1-5 companies</option>
            <option value="6-10">6-10 companies</option>
            <option value="11-25">11-25 companies</option>
            <option value="26-50">26-50 companies</option>
            <option value="50+">50+ companies</option>
          </select>
          {errors['investorDetails.companiesFunded'] && <p className="mt-1 text-sm text-red-600">{errors['investorDetails.companiesFunded']}</p>}
        </div>
      </div>
    </div>
  );

  // Render company verification with OTP for recruiters
  const renderCompanyVerification = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Company Verification</h2>
      <p className="text-gray-600">Please verify your company email to continue setting up your recruiter account.</p>
      
      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.companyName ? 'border-red-500' : ''}`}
            placeholder="Your Company Name"
          />
          {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
        </div>
        
        {/* Company Email Verification */}
        <div>
          <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">Company Email</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleInputChange}
              disabled={formData.companyVerified || companyOtpTimer > 0}
              className={`block w-full flex-1 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.companyEmail ? 'border-red-500' : ''}`}
              placeholder="you@yourcompany.com"
            />
            <button
              type="button"
              onClick={sendCompanyOTP}
              disabled={formData.companyVerified || companyOtpTimer > 0 || !formData.companyEmail}
              className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm font-medium ${
                formData.companyVerified || companyOtpTimer > 0 || !formData.companyEmail
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {companyOtpTimer > 0 ? `Resend in ${companyOtpTimer}s` : 'Send OTP'}
            </button>
          </div>
          {errors.companyEmail && <p className="mt-1 text-sm text-red-600">{errors.companyEmail}</p>}
        </div>
        
        {/* OTP Verification field - only shown after OTP is sent */}
        {generatedCompanyOtp && !formData.companyVerified && (
          <div className="animate-fadeIn">
            <label htmlFor="companyOtp" className="block text-sm font-medium text-gray-700">Enter OTP sent to your company email</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="companyOtp"
                value={companyOtp}
                onChange={(e) => setCompanyOtp(e.target.value)}
                className={`block w-full flex-1 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${companyOtpError ? 'border-red-500' : ''}`}
                placeholder="6-digit OTP"
                maxLength={6}
              />
              <button
                type="button"
                onClick={verifyCompanyOTP}
                disabled={!companyOtp || companyOtp.length !== 6}
                className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm font-medium ${
                  !companyOtp || companyOtp.length !== 6
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Verify
              </button>
            </div>
            {companyOtpError && <p className="mt-1 text-sm text-red-600">{companyOtpError}</p>}
            
            <div className="mt-2 text-sm text-gray-500">
              <p>Didn't receive OTP? {companyOtpTimer > 0 ? `You can request a new one in ${companyOtpTimer} seconds.` : (
                <button
                  type="button"
                  onClick={sendCompanyOTP}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  Resend OTP
                </button>
              )}</p>
            </div>
          </div>
        )}
        
        {/* Success message after verification */}
        {formData.companyVerified && (
          <div className="rounded-md bg-green-50 p-4 animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your company email has been successfully verified!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Generate random OTP for company verification
  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCompanyOtp(otp);
    setCompanyOtpTimer(60); // 60 seconds for demo purposes
    return otp;
  };
  
  // Send OTP to company email
  const sendCompanyOTP = () => {
    // Validate email first
    if (!formData.companyEmail) {
      setErrors(prev => ({
        ...prev,
        companyEmail: 'Please enter your company email'
      }));
      return;
    }
    
    if (!formData.companyEmail.includes('@')) {
      setErrors(prev => ({
        ...prev,
        companyEmail: 'Please enter a valid email address'
      }));
      return;
    }
    
    const otp = generateOTP();
    
    // In a real app, this would send an email
    // For demo, we'll just show the OTP
    alert(`For demo purposes, your OTP is: ${otp}`);
    
    setCompanyOtpError('');
  };
  
  // Verify company email with OTP
  const verifyCompanyOTP = () => {
    if (companyOtp === generatedCompanyOtp) {
      setFormData({
        ...formData,
        companyVerified: true
      });
      setCompanyOtpError('');
    } else {
      setCompanyOtpError('Invalid OTP. Please check and try again.');
    }
  };

  // Render recruiter preferences for job posting
  const renderRecruiterPreferences = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Job Posting Preferences</h2>
      <p className="text-gray-600">Let us know if you'd like to post job opportunities right away.</p>
      
      <div className="space-y-6">
        {/* Job Posting Question */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Would you like to post a job right now?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setFormData({ ...formData, postJobNow: true })}
              className={`p-6 border rounded-lg cursor-pointer transition-all ${
                formData.postJobNow === true
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  formData.postJobNow === true ? 'border-blue-500' : 'border-gray-400'
                }`}>
                  {formData.postJobNow === true && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <span className="ml-2 font-medium">Yes</span>
              </div>
              <p className="text-sm text-gray-600">
                I'd like to create a job posting immediately.
              </p>
            </div>
            
            <div
              onClick={() => setFormData({ ...formData, postJobNow: false })}
              className={`p-6 border rounded-lg cursor-pointer transition-all ${
                formData.postJobNow === false
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  formData.postJobNow === false ? 'border-blue-500' : 'border-gray-400'
                }`}>
                  {formData.postJobNow === false && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <span className="ml-2 font-medium">No</span>
              </div>
              <p className="text-sm text-gray-600">
                I'll post jobs later from the dashboard.
              </p>
            </div>
          </div>
        </div>
        
        {/* Job Posting Form - only shown if postJobNow is true */}
        {formData.postJobNow && (
          <div className="border border-gray-200 rounded-lg p-6 mt-6 bg-white shadow-sm animate-fadeIn">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Job Posting Details</h3>
            
            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="newJobPosting.title"
                  value={formData.newJobPosting.title}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['newJobPosting.title'] ? 'border-red-500' : ''}`}
                  placeholder="e.g. Senior Software Engineer"
                />
                {errors['newJobPosting.title'] && <p className="mt-1 text-sm text-red-600">{errors['newJobPosting.title']}</p>}
              </div>
              
              {/* Job Description */}
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  id="jobDescription"
                  name="newJobPosting.description"
                  value={formData.newJobPosting.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['newJobPosting.description'] ? 'border-red-500' : ''}`}
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                ></textarea>
                {errors['newJobPosting.description'] && <p className="mt-1 text-sm text-red-600">{errors['newJobPosting.description']}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Employment Type */}
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">Employment Type</label>
                  <select
                    id="employmentType"
                    name="newJobPosting.employmentType"
                    value={formData.newJobPosting.employmentType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                
                {/* Experience Level */}
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">Experience Level</label>
                  <select
                    id="experienceLevel"
                    name="newJobPosting.experienceLevel"
                    value={formData.newJobPosting.experienceLevel}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Junior">Junior (1-3 years)</option>
                    <option value="Mid-Level">Mid-Level (3-5 years)</option>
                    <option value="Senior">Senior (5+ years)</option>
                    <option value="Lead">Lead/Principal</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    id="jobLocation"
                    name="newJobPosting.location"
                    value={formData.newJobPosting.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g. Mumbai, India or Remote"
                  />
                </div>
                
                {/* Salary Range */}
                <div>
                  <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">Salary Range (Optional)</label>
                  <input
                    type="text"
                    id="salaryRange"
                    name="newJobPosting.salaryRange"
                    value={formData.newJobPosting.salaryRange}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g. ₹15-25 LPA"
                  />
                </div>
              </div>
              
              {/* Required Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skillOptions.map((skill) => (
                    <div
                      key={skill}
                      onClick={() => {
                        const updatedSkills = formData.newJobPosting.skills.includes(skill)
                          ? formData.newJobPosting.skills.filter(s => s !== skill)
                          : [...formData.newJobPosting.skills, skill];
                        
                        setFormData({
                          ...formData,
                          newJobPosting: {
                            ...formData.newJobPosting,
                            skills: updatedSkills
                          }
                        });
                      }}
                      className={`px-3 py-1 rounded-md cursor-pointer text-sm ${
                        formData.newJobPosting.skills.includes(skill)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    id="customJobSkill"
                    className="flex-1 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a custom skill"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.target.value.trim();
                        if (value && !formData.newJobPosting.skills.includes(value)) {
                          setFormData({
                            ...formData,
                            newJobPosting: {
                              ...formData.newJobPosting,
                              skills: [...formData.newJobPosting.skills, value]
                            }
                          });
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('customJobSkill');
                      const value = input.value.trim();
                      if (value && !formData.newJobPosting.skills.includes(value)) {
                        setFormData({
                          ...formData,
                          newJobPosting: {
                            ...formData.newJobPosting,
                            skills: [...formData.newJobPosting.skills, value]
                          }
                        });
                        input.value = '';
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                  >
                    Add
                  </button>
                </div>
                
                {/* Display selected skills */}
                {formData.newJobPosting.skills.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.newJobPosting.skills.map((skill, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-md px-2 py-1 flex items-center">
                          <span className="text-blue-700 text-sm">{skill}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                newJobPosting: {
                                  ...formData.newJobPosting,
                                  skills: formData.newJobPosting.skills.filter((_, i) => i !== index)
                                }
                              });
                            }}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Application Deadline */}
              <div>
                <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">Application Deadline (Optional)</label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="newJobPosting.applicationDeadline"
                  value={formData.newJobPosting.applicationDeadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-4">
          <p className="text-sm text-gray-600">
            You can always post additional job opportunities from your recruiter dashboard later.
          </p>
        </div>
      </div>
    </div>
  );

  // Add the missing renderSkills function
  const renderSkills = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">What skills do you have?</h2>
      <p className="text-gray-600">Select or add skills relevant to your profession.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Popular Skills
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'SQL', 'Data Analysis', 
              'Product Management', 'UI/UX Design', 'Digital Marketing', 'Cloud Services'].map((skill) => (
              <div
                key={skill}
                onClick={() => {
                  if (formData.skills && formData.skills.includes(skill)) {
                    setFormData({
                      ...formData,
                      skills: formData.skills.filter(s => s !== skill)
                    });
                  } else {
                    setFormData({
                      ...formData,
                      skills: [...(formData.skills || []), skill]
                    });
                  }
                }}
                className={`px-3 py-2 border rounded-md cursor-pointer text-sm ${
                  formData.skills && formData.skills.includes(skill)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="customSkill" className="block text-sm font-medium text-gray-700">
            Add custom skill
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="customSkill"
              className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Agile Development"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const value = e.target.value.trim();
                  if (value && (!formData.skills || !formData.skills.includes(value))) {
                    setFormData({
                      ...formData,
                      skills: [...(formData.skills || []), value]
                    });
                    e.target.value = '';
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = document.getElementById('customSkill');
                const value = input.value.trim();
                if (value && (!formData.skills || !formData.skills.includes(value))) {
                  setFormData({
                    ...formData,
                    skills: [...(formData.skills || []), value]
                  });
                  input.value = '';
                }
              }}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
            >
              Add
            </button>
          </div>
        </div>
        
        {formData.skills && formData.skills.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Your Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="bg-blue-50 text-blue-700 border border-blue-300 rounded-md px-2 py-1 flex items-center">
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        skills: formData.skills.filter((_, i) => i !== index)
                      });
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Form */}
          <div className="mt-6">
            {renderStepContent()}
            
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {errors.submit}
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Back
              </button>
              
              {currentStep < getStepCount() - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Career Assistant Chatbot - Only shown for Job Seekers */}
      {formData.profileType === 'Job Seeker' && renderCareerAssistant()}
    </div>
  );
};

export default ProfileSetup; 