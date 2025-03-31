import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A reusable component for displaying profile sections in dashboard views
 * 
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Content of the section
 * @param {boolean} props.isEmpty - Whether the section has no content
 * @param {string} props.emptyMessage - Message to display when section is empty
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 * @param {function} props.onEdit - Function to call when edit button is clicked
 * @param {string} props.editUrl - URL to navigate to when edit link is clicked (alternative to onEdit)
 */
const ProfileSection = ({ 
  title, 
  children, 
  isEmpty = false, 
  emptyMessage = "No information provided", 
  darkMode = false,
  onEdit,
  editUrl
}) => {
  return (
    <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium">{title}</h3>
        {(onEdit || editUrl) && (
          editUrl ? (
            <Link 
              to={editUrl} 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
              Edit
            </Link>
          ) : (
            <button 
              onClick={onEdit} 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
              Edit
            </button>
          )
        )}
      </div>
      
      {isEmpty ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          {emptyMessage}
        </div>
      ) : (
        <div className="text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProfileSection; 