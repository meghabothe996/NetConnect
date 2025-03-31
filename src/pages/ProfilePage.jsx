import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ProfileEditModal from './ProfileEditModal';

const ProfilePage = () => {
  const { currentUser, profileCompletion } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Placeholder for AI-recommended skills
  const aiRecommendedSkills = [
    'React', 'Node.js', 'TypeScript', 'GraphQL', 'UX Research'
  ];

  // Placeholder for AI-recommended career paths
  const aiRecommendedPaths = [
    { 
      title: 'Senior Frontend Developer',
      description: 'Based on your skills, you could progress toward a senior frontend role in 1-2 years.'
    },
    {
      title: 'UX Engineer',
      description: 'Your combined design and development skills make you a good fit for UX engineering.'
    }
  ];

  // Placeholder for experience data
  const experience = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Example Tech, Inc.',
      location: 'San Francisco, CA',
      startDate: 'January 2021',
      endDate: 'Present',
      description: 'Building responsive web applications using React, TypeScript, and GraphQL. Implementing UI components, optimizing performance, and collaborating with design and backend teams.'
    },
    {
      id: 2,
      title: 'Junior Web Developer',
      company: 'Startup Co.',
      location: 'Remote',
      startDate: 'June 2019',
      endDate: 'December 2020',
      description: 'Developed and maintained client websites using HTML, CSS, JavaScript and WordPress. Collaborated with designers to implement responsive designs.'
    }
  ];

  // Placeholder for education data
  const education = [
    {
      id: 1,
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Technology',
      location: 'Boston, MA',
      startDate: '2015',
      endDate: '2019',
      description: 'Focus on web development and human-computer interaction. Participated in coding competitions and hackathons.'
    }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please sign in to view your profile
          </h2>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-shrink-0 mb-4 sm:mb-0">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="sm:ml-6 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-white">{currentUser.name || "Your Name"}</h1>
                <p className="text-blue-100 text-lg mt-1">
                  {currentUser.profileType === 'job-seeker' ? 'Looking for new opportunities' : 
                   currentUser.profileType === 'recruiter' ? 'Hiring new talent' : 
                   currentUser.profileType === 'mentor' ? 'Seeking mentorship' : 
                   currentUser.profileType === 'networker' ? 'Building connections' : 
                   'Complete your profile to get started'}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="sm:ml-auto mt-6 sm:mt-0">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div className="text-xl font-semibold text-white">{profileCompletion}%</div>
                  <div className="text-blue-100 text-sm">Profile Completion</div>
                  <div className="w-full h-2 bg-blue-800 rounded-full mt-2">
                    <div
                      className="h-2 bg-blue-200 rounded-full"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Overview
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'experience'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'education'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'skills'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Skills & Interests
              </button>
            </nav>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-6">
            {/* Profile Overview Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - About */}
                <div className="md:col-span-2">
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
                    <p className="text-gray-600">
                      {currentUser.about || 
                        "Your profile description appears here. Click Edit Profile to add a description of yourself, your career goals, and what you're looking for on this platform."}
                    </p>
                  </div>

                  {/* Industry & Interests */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium text-gray-700">Industry</h3>
                        <p className="text-gray-600 mt-1">{currentUser.industry || "Not specified"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium text-gray-700">Open to Work</h3>
                        <p className="text-gray-600 mt-1">{currentUser.isOpenToWork ? "Yes" : "No"}</p>
                      </div>
                      {currentUser.careerInterests && currentUser.careerInterests.length > 0 && (
                        <div className="sm:col-span-2 bg-gray-50 p-4 rounded-md">
                          <h3 className="font-medium text-gray-700">Career Interests</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {currentUser.careerInterests.map((interest, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* External Profiles */}
                  {(currentUser.linkedinUrl || currentUser.githubUrl || currentUser.portfolioUrl) && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Connect with Me</h2>
                      <div className="flex flex-wrap gap-4">
                        {currentUser.linkedinUrl && (
                          <a
                            href={`https://linkedin.com/in/${currentUser.linkedinUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.338 16.338H13.67V12.16c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.08-1.6 2.2v4.258H8.014v-8.59h2.56v1.17h.037c.355-.675 1.227-1.387 2.534-1.387 2.712 0 3.213 1.785 3.213 4.107v4.7h-.02zM5.004 6.575a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm-1.33 9.763h2.667v-8.59H3.675v8.59z" />
                            </svg>
                            LinkedIn
                          </a>
                        )}
                        {currentUser.githubUrl && (
                          <a
                            href={`https://github.com/${currentUser.githubUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.28.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.1 2.5.33 1.9-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.65.7 1.03 1.6 1.03 2.7 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd" />
                            </svg>
                            GitHub
                          </a>
                        )}
                        {currentUser.portfolioUrl && (
                          <a
                            href={currentUser.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - AI Assistant */}
                <div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="ml-3 text-lg font-bold text-gray-800">AI Career Assistant</h2>
                    </div>
                    
                    {currentUser.allowAiSuggestions ? (
                      <>
                        <p className="text-gray-600 mb-4">
                          Based on your profile, our AI suggests these career paths:
                        </p>
                        <div className="space-y-4 mb-6">
                          {aiRecommendedPaths.map((path, index) => (
                            <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                              <h3 className="font-medium text-blue-700">{path.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{path.description}</p>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-blue-100 pt-4">
                          <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Get detailed career advice
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-3">
                          Enable AI suggestions to receive personalized career advice.
                        </p>
                        <button
                          onClick={() => setIsEditModalOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Enable AI suggestions
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Add Experience
                  </button>
                </div>

                {experience.length > 0 ? (
                  <div className="space-y-8">
                    {experience.map((job) => (
                      <div key={job.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                        <div className="text-gray-600 mt-1">{job.company} • {job.location}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {job.startDate} – {job.endDate}
                        </div>
                        <p className="text-gray-600 mt-3">{job.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No experience added yet</h3>
                    <p className="mt-1 text-gray-500">Click "Add Experience" to add your work history.</p>
                  </div>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Education</h2>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Add Education
                  </button>
                </div>

                {education.length > 0 ? (
                  <div className="space-y-8">
                    {education.map((edu) => (
                      <div key={edu.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                        <div className="text-gray-600 mt-1">{edu.school} • {edu.location}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {edu.startDate} – {edu.endDate}
                        </div>
                        <p className="text-gray-600 mt-3">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No education added yet</h3>
                    <p className="mt-1 text-gray-500">Click "Add Education" to add your educational background.</p>
                  </div>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Skills & Interests</h2>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Add Skills
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-4">Your Skills</h3>
                    {currentUser.skills && currentUser.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentUser.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No skills added yet. Add skills to help connections and recruiters find you.</p>
                    )}

                    <h3 className="font-semibold text-gray-700 mt-8 mb-4">Career Interests</h3>
                    {currentUser.careerInterests && currentUser.careerInterests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentUser.careerInterests.map((interest, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No career interests added yet. Add interests to receive targeted recommendations.</p>
                    )}
                  </div>

                  <div>
                    {currentUser.allowAiSuggestions && (
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-4">AI-Recommended Skills</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Based on your profile and industry trends, we recommend adding these skills:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {aiRecommendedSkills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                              {skill}
                              <button className="ml-1 text-green-600 hover:text-green-800">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage; 