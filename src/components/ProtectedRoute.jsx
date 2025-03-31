import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A wrapper component for routes that require authentication
 * Redirects to login page if user is not authenticated
 * Can also check if user profile is complete for routes that require it
 */
const ProtectedRoute = ({ children, requireProfileComplete = false }) => {
  const { isAuthenticated, currentUser, loading, isProfileComplete } = useAuth();
  
  useEffect(() => {
    // Log the current state for debugging
    if (requireProfileComplete) {
      console.log('ProtectedRoute - Auth state:', { 
        isAuthenticated,
        currentUser,
        isProfileComplete,
        profileCompletionRequired: currentUser?.profileCompletionRequired 
      });
    }
  }, [isAuthenticated, currentUser, isProfileComplete, requireProfileComplete]);
  
  // Use conditional rendering pattern
  return (
    <>
      {loading ? (
        // Show loading spinner
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : !isAuthenticated ? (
        // Not authenticated - redirect to login
        <Navigate to="/login" replace />
      ) : requireProfileComplete && currentUser?.profileCompletionRequired ? (
        // Profile completion required but not complete - redirect to setup
        <Navigate to="/profile-setup" replace />
      ) : (
        // All conditions met - render children
        children
      )}
    </>
  );
};

export default ProtectedRoute; 