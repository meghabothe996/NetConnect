import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Clear registration data when component unmounts
  useEffect(() => {
    return () => {
      // This will run when the user navigates away from the page
      sessionStorage.removeItem('tempRegistrationData');
    };
  }, []);

  // Save temporary registration data to session storage
  useEffect(() => {
    if (formData.firstName || formData.lastName || formData.email || formData.mobile) {
      sessionStorage.setItem('tempRegistrationData', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile
      }));
    }
  }, [formData]);

  // Handle navigation buttons
  const handleNavigationClick = (e) => {
    // If it's a link to somewhere other than the submit button or sign in link
    if (e.target.tagName === 'A' && !e.target.href.includes('/login')) {
      sessionStorage.removeItem('tempRegistrationData');
    }
  };

  // Add event listener for navigation
  useEffect(() => {
    document.addEventListener('click', handleNavigationClick);
    
    return () => {
      document.removeEventListener('click', handleNavigationClick);
    };
  }, []);

  // Set up OTP timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);
  
  const validateForm = () => {
    const newErrors = {};
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Mobile validation (required)
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    // Password validation (only if OTP is verified)
    if (isOtpVerified) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      
      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const generateOtp = () => {
    // Generate a random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    // In a real application, this would send an SMS
    console.log(`OTP for verification: ${newOtp}`);
    
    // Set timer for 2 minutes
    setOtpTimer(120);
    
    return newOtp;
  };
  
  const sendOtp = () => {
    // Validate mobile number
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      setErrors(prev => ({
        ...prev,
        mobile: 'Please enter a valid 10-digit mobile number'
      }));
      return;
    }
    
    const newOtp = generateOtp();
    
    // Show the user what the OTP is (for demo purposes)
    alert(`Your OTP is: ${newOtp}\nIn a real app, this would be sent via SMS to ${formData.mobile}`);
  };
  
  const handleVerifyOtp = () => {
    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }
    
    if (otp === generatedOtp) {
      setIsOtpVerified(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Save the basic user info to sessionStorage for the onboarding
        sessionStorage.setItem('registrationData', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile
        }));
        
        // Use register from AuthContext
        const success = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          name: `${formData.firstName} ${formData.lastName}`,
          password: formData.password // In a real app, password would be hashed by the backend
        });
        
        if (success) {
          // Redirect to profile setup
          navigate('/profile-setup');
        } else {
          setErrors({ form: 'Registration failed. Please try again.' });
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({ form: 'Registration failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const resendOtp = () => {
    if (otpTimer === 0) {
      sendOtp();
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full max-w-lg m-auto bg-white rounded-lg shadow-lg p-8 my-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-600 mt-2">Join NetConnect and start networking today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {errors.form}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number (Required for Verification)
              </label>
              <div className="flex">
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`flex-1 px-3 py-2 border rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit mobile number"
                />
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={otpTimer > 0}
                  className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Get OTP"}
                </button>
              </div>
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
              )}
            </div>
            
            {/* OTP Verification Section */}
            {generatedOtp && (
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-2">OTP Verification</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ''));
                      setOtpError('');
                    }}
                    placeholder="Enter 6-digit OTP"
                    className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      otpError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isOtpVerified}
                  />
                  {!isOtpVerified ? (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Verify
                    </button>
                  ) : (
                    <div className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md">
                      <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
                {otpError && (
                  <p className="mt-1 text-sm text-red-600">{otpError}</p>
                )}
                {!isOtpVerified && otpTimer > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    Didn't receive the code? You can resend in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                  </p>
                )}
                {!isOtpVerified && otpTimer === 0 && generatedOtp && (
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-500"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Password Section - Only shown after OTP verification */}
          {isOtpVerified && (
            <div className="space-y-4 p-4 border rounded-md bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Set Your Password</h3>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password ? (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters and include uppercase, lowercase, and numbers
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                errors.agreeTerms ? 'border-red-500' : ''
              }`}
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading || !isOtpVerified || !formData.password || !formData.confirmPassword}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 