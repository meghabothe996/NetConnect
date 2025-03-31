import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-800 py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="w-full md:w-1/2 text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Connect, Collaborate, and Grow Your Career
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-xl">
              Join our professional networking platform to find your dream job, build connections, and advance your career in tech.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link 
                to="/register" 
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                Join Today
              </Link>
              <Link 
                to="/login" 
                className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Sign In
              </Link>
            </div>
            <div className="mt-8 text-blue-100 text-sm">
              <p>Join 100,000+ professionals already networking</p>
              <div className="flex mt-3 space-x-1">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2">4.9/5 from 10,000+ reviews</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="w-full md:w-1/2 max-w-lg">
            <div className="relative bg-white p-2 rounded-xl shadow-2xl">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-blue-800 font-bold transform -rotate-12">
                <span className="text-sm text-center">Join Today!</span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Professionals networking" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="bg-white rounded-lg shadow-lg p-4 absolute -bottom-6 -right-6 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    JP
                  </div>
                  <div>
                    <p className="font-medium">Jane P. found her dream job in 2 weeks!</p>
                    <p className="text-sm text-gray-500">Senior Product Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Companies */}
        <div className="mt-16 text-center">
          <p className="text-blue-100 mb-6">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-80">
            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'].map((company) => (
              <div key={company} className="text-white font-bold text-xl">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 