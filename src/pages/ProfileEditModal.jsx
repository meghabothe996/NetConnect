import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Industry options
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
    'Design', 'Engineering', 'Sales', 'Customer Service', 'Consulting',
    'Research', 'Media', 'Non-profit', 'Government', 'Retail'
  ];
  
  // Career interest options
  const careerInterestOptions = [
    'Software Development', 'Data Science', 'AI/Machine Learning',
    'UX/UI Design', 'Product Management', 'Digital Marketing',
    'Project Management', 'Business Analysis', 'Consulting',
    'Leadership', 'Entrepreneurship', 'Research'
  ];
  
  // Profile type options
  const profileTypes = [
    { id: 'job-seeker', label: 'Looking for a job', description: 'Find new career opportunities' },
    { id: 'recruiter', label: 'Hiring candidates', description: 'Find talent for your company' },
    { id: 'mentor', label: 'Seeking mentorship', description: 'Get guidance from experts' },
    { id: 'networker', label: 'Networking & collaborations', description: 'Connect with professionals' }
  ];
  
  useEffect(() => {
    if (currentUser) {
      // Initialize form data with current user data
      setFormData({
        fullName: currentUser.name || '',
        profilePicture: currentUser.avatar || null,
        profileType: currentUser.profileType || '',
        industry: currentUser.industry || '',
        careerInterests: currentUser.careerInterests || [],
        isOpenToWork: currentUser.isOpenToWork || false,
        openToStartupJobs: currentUser.openToStartupJobs || false,
        wantJobRecommendations: currentUser.wantJobRecommendations !== false, // default to true
        linkedinUrl: currentUser.linkedinUrl || '',
        githubUrl: currentUser.githubUrl || '',
        portfolioUrl: currentUser.portfolioUrl || '',
        allowAiSuggestions: currentUser.allowAiSuggestions !== false, // default to true
        about: currentUser.about || ''
      });
    }
  }, [currentUser, isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Save to sessionStorage for backup
    const updatedData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    sessionStorage.setItem('profileEditData', JSON.stringify(updatedData));
  };
  
  const handleMultiSelectChange = (e) => {
    const { value, checked } = e.target;
    const updatedInterests = checked 
      ? [...formData.careerInterests, value]
      : formData.careerInterests.filter(interest => interest !== value);
      
    setFormData(prev => ({
      ...prev,
      careerInterests: updatedInterests
    }));
    
    // Save to sessionStorage for backup
    sessionStorage.setItem('profileEditData', JSON.stringify({
      ...formData,
      careerInterests: updatedInterests
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = {
          ...formData,
          profilePicture: reader.result
        };
        setFormData(updatedData);
        sessionStorage.setItem('profileEditData', JSON.stringify(updatedData));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const saveChanges = async (section) => {
    setLoading(true);
    try {
      // Update only the current section or all data if not specified
      const dataToUpdate = section ? { 
        ...currentUser,
        ...Object.fromEntries(
          Object.entries(formData).filter(([key]) => {
            if (section === 'basic') return ['fullName', 'profilePicture', 'about'].includes(key);
            if (section === 'career') return ['profileType', 'industry', 'careerInterests'].includes(key);
            if (section === 'preferences') return ['isOpenToWork', 'openToStartupJobs', 'wantJobRecommendations', 'allowAiSuggestions'].includes(key);
            if (section === 'social') return ['linkedinUrl', 'githubUrl', 'portfolioUrl'].includes(key);
            return true;
          })
        )
      } : formData;
      
      await updateUserProfile({
        ...dataToUpdate,
        name: formData.fullName, // Ensure name is properly mapped
        avatar: formData.profilePicture // Ensure avatar is properly mapped
      });
      
      setMessage({ 
        type: 'success', 
        text: section ? `${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully!` : 'Profile updated successfully!' 
      });
      
      // Clear after a few seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-4xl">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-medium text-white">Edit Your Profile</h3>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveSection('basic')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeSection === 'basic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveSection('career')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeSection === 'career'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Career
              </button>
              <button
                onClick={() => setActiveSection('preferences')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeSection === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveSection('social')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeSection === 'social'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Social Links
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {message.text && (
              <div className={`mb-4 p-3 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}
            
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <div className="mt-1 flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {formData.profilePicture ? (
                        <img
                          src={formData.profilePicture}
                          alt="Profile preview"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <label
                        htmlFor="profilePicture"
                        className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change photo
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                    About Me
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows="4"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell others about yourself..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => saveChanges('basic')}
                    disabled={loading}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Career Section */}
            {activeSection === 'career' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What brings you to NetConnect?
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {profileTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`relative rounded-lg border ${
                          formData.profileType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-white'
                        } p-4 shadow-sm cursor-pointer hover:border-blue-400`}
                        onClick={() => setFormData(prev => ({ ...prev, profileType: type.id }))}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">{type.label}</p>
                              <p className="text-gray-500">{type.description}</p>
                            </div>
                          </div>
                          <div>
                            <div
                              className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                formData.profileType === type.id
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {formData.profileType === type.id && (
                                <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    What industry are you in?
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select an industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What are your career interests?
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {careerInterestOptions.map((interest) => (
                      <div key={interest} className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id={`interest-${interest}`}
                            name="careerInterests"
                            type="checkbox"
                            value={interest}
                            checked={formData.careerInterests.includes(interest)}
                            onChange={handleMultiSelectChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`interest-${interest}`} className="font-medium text-gray-700">
                            {interest}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => saveChanges('career')}
                    disabled={loading}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <div className="flex items-start mb-4">
                  <div className="flex h-5 items-center">
                    <input
                      id="isOpenToWork"
                      name="isOpenToWork"
                      type="checkbox"
                      checked={formData.isOpenToWork}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isOpenToWork" className="font-medium text-gray-700">
                      I'm open to work opportunities
                    </label>
                    <p className="text-gray-500">Let recruiters know you're available</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <div className="flex h-5 items-center">
                    <input
                      id="openToStartupJobs"
                      name="openToStartupJobs"
                      type="checkbox"
                      checked={formData.openToStartupJobs}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="openToStartupJobs" className="font-medium text-gray-700">
                      I'm open to startup jobs
                    </label>
                    <p className="text-gray-500">Receive early-stage startup opportunities</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <div className="flex h-5 items-center">
                    <input
                      id="wantJobRecommendations"
                      name="wantJobRecommendations"
                      type="checkbox"
                      checked={formData.wantJobRecommendations}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="wantJobRecommendations" className="font-medium text-gray-700">
                      I'd like to receive job recommendations
                    </label>
                    <p className="text-gray-500">Based on my profile and interests</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="allowAiSuggestions"
                      name="allowAiSuggestions"
                      type="checkbox"
                      checked={formData.allowAiSuggestions}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="allowAiSuggestions" className="font-medium text-gray-700">
                      Allow AI-powered career suggestions
                    </label>
                    <p className="text-gray-500">
                      We'll use AI to provide personalized career advice, job recommendations, and networking suggestions.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => saveChanges('preferences')}
                    disabled={loading}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Social Links Section */}
            {activeSection === 'social' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                      linkedin.com/in/
                    </span>
                    <input
                      type="text"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="yourusername"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Profile
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                      github.com/
                    </span>
                    <input
                      type="text"
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="yourusername"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Website/Portfolio
                  </label>
                  <input
                    type="url"
                    id="portfolioUrl"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => saveChanges('social')}
                    disabled={loading}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => saveChanges()}
              disabled={loading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving All Changes...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal; 