import React, { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';

const HomePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect authenticated users based on profile type
      if (currentUser?.profileType === 'Job Seeker') {
        navigate('/job-seeker-dashboard', { replace: true });
      } else if (currentUser?.profileType === 'Recruiter') {
        navigate('/recruiter-dashboard', { replace: true });
      } else if (currentUser?.profileType === 'Networker') {
        navigate('/networking-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  // Immediate redirect if user is authenticated
  if (isAuthenticated) {
    if (currentUser?.profileType === 'Job Seeker') {
      return <Navigate to="/job-seeker-dashboard" replace />;
    } else if (currentUser?.profileType === 'Recruiter') {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else if (currentUser?.profileType === 'Networker') {
      return <Navigate to="/networking-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <div className="landing-page">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage; 