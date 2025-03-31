import React, { useState } from 'react';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "This platform completely transformed my job search. I was able to connect with hiring managers directly and landed my dream role within two weeks!",
      name: "Sarah Johnson",
      title: "Senior UX Designer",
      company: "TechCorp",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      quote: "As a recruiter, I've found exceptional talent through this platform. The filtering tools and direct messaging features make hiring efficient and effective.",
      name: "Michael Rodriguez",
      title: "Technical Recruiter",
      company: "Innovate Inc",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      quote: "The networking opportunities here are unmatched. I've connected with industry leaders, potential investors, and even found a co-founder for my startup!",
      name: "Aisha Patel",
      title: "Founder & CEO",
      company: "NextGen Solutions",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600">
            Thousands of professionals have advanced their careers using our platform. Here are some of their stories.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 relative">
            <div className="absolute -top-5 -left-5 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 15a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm0-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm4 .5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z"/>
              </svg>
            </div>
            
            <div className="text-center">
              <p className="text-xl md:text-2xl text-gray-800 italic mb-8 leading-relaxed">
                "{testimonials[activeIndex].quote}"
              </p>
              
              <div className="flex items-center justify-center">
                <img 
                  src={testimonials[activeIndex].avatar} 
                  alt={testimonials[activeIndex].name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="ml-4 text-left">
                  <h4 className="font-semibold text-lg">{testimonials[activeIndex].name}</h4>
                  <p className="text-gray-600">{testimonials[activeIndex].title}</p>
                  <p className="text-blue-600">{testimonials[activeIndex].company}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-between mt-8">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg mb-6">Join thousands of professionals already advancing their careers</p>
          <a 
            href="/register" 
            className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Sign Up For Free
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 