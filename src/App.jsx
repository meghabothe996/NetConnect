import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import MessagingPage from './pages/MessagingPage';
import JobsPage from './pages/JobsPage';
import NetworkingPage from './pages/NetworkingPage';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import NetworkingDashboard from './pages/NetworkingDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

// Route that redirects authenticated users
const PublicOnlyRoute = ({ children }) => {
  const { currentUser, isAuthenticated, isProfileComplete } = useAuth();
  
  // For debugging
  React.useEffect(() => {
    console.log('PublicOnlyRoute - Auth state:', { 
      isAuthenticated, 
      currentUser,
      isProfileComplete,
      profileType: currentUser?.profileType
    });
  }, [isAuthenticated, currentUser, isProfileComplete]);
  
  // Return appropriate redirect or children
  return (
    <>
      {isAuthenticated ? (
        <>
          {/* If profile is not complete */}
          {currentUser?.profileCompletionRequired && <Navigate to="/profile-setup" replace />}
          
          {/* If profile is complete, redirect based on user type */}
          {!currentUser?.profileCompletionRequired && currentUser?.profileType === 'Job Seeker' && 
            <Navigate to="/job-seeker-dashboard" replace />}
          {!currentUser?.profileCompletionRequired && currentUser?.profileType === 'Recruiter' && 
            <Navigate to="/recruiter-dashboard" replace />}
          {!currentUser?.profileCompletionRequired && currentUser?.profileType === 'Networker' && 
            <Navigate to="/networking-dashboard" replace />}
          {!currentUser?.profileCompletionRequired && (!currentUser?.profileType || 
            !['Job Seeker', 'Recruiter', 'Networker'].includes(currentUser?.profileType)) && 
            <Navigate to="/dashboard" replace />}
        </>
      ) : (
        // Not authenticated - render children
        children
      )}
    </>
  );
};

function App() {
  const { currentUser, isAuthenticated } = useAuth();
  
  // For debugging
  React.useEffect(() => {
    if (currentUser) {
      console.log('App - Current user state:', { 
        profileType: currentUser.profileType,
        profileCompletionRequired: currentUser.profileCompletionRequired
      });
    }
  }, [currentUser]);
  
  return (
    <Router>
      <DarkModeProvider>
        {/* If user is authenticated and on root path, redirect using Route instead */}
        {window.location.pathname === '/' && currentUser && (
          <>
            {currentUser.profileCompletionRequired ? (
              <Navigate to="/profile-setup" replace />
            ) : (
              <>
                {currentUser.profileType === 'Job Seeker' && <Navigate to="/job-seeker-dashboard" replace />}
                {currentUser.profileType === 'Recruiter' && <Navigate to="/recruiter-dashboard" replace />}
                {currentUser.profileType === 'Networker' && <Navigate to="/networking-dashboard" replace />}
                {!currentUser.profileType && <Navigate to="/dashboard" replace />}
              </>
            )}
          </>
        )}
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <PublicOnlyRoute>
                  <HomePage />
                </PublicOnlyRoute>
              } />
              <Route path="/login" element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              } />
              <Route path="/register" element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              } />
              
              {/* Protected routes */}
              <Route path="/profile-setup" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/messaging" element={
                <ProtectedRoute>
                  <MessagingPage />
                </ProtectedRoute>
              } />
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              } />
              <Route path="/networking" element={
                <ProtectedRoute>
                  <NetworkingPage />
                </ProtectedRoute>
              } />
              
              {/* Role-specific dashboards */}
              <Route path="/job-seeker-dashboard" element={
                <ProtectedRoute requireProfileComplete={true}>
                  <JobSeekerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/recruiter-dashboard" element={
                <ProtectedRoute requireProfileComplete={true}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/networking-dashboard" element={
                <ProtectedRoute requireProfileComplete={true}>
                  <NetworkingDashboard />
                </ProtectedRoute>
              } />
              
              {/* Not Found Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </Router>
  );
}

export default function AppWithProviders() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
