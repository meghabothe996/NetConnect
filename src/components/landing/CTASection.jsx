import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already taken the next step in their career journey. It's free to get started!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
            >
              Create Account
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Sign In
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <p className="text-blue-100">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-blue-100">Companies</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="text-blue-100">Jobs Posted</p>
            </div>
          </div>
          
          <div className="mt-16 text-sm text-blue-200">
            <p>By joining, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 