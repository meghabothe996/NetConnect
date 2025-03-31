import React from 'react';

/**
 * Avatar component that displays either a user's profile image or their initials
 * 
 * @param {Object} props
 * @param {string} props.src - URL of the profile image
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.name - User's name (used for initials if no image)
 * @param {string} props.size - Size of the avatar (sm, md, lg, xl)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.bgColor - Background color when showing initials
 */
const Avatar = ({ 
  src, 
  alt = 'User',
  name,
  size = 'md',
  className = '',
  bgColor = 'bg-blue-500'
}) => {
  // Determine size class
  const sizeClasses = {
    'xs': 'w-6 h-6 text-xs',
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-10 h-10 text-md',
    'lg': 'w-16 h-16 text-xl',
    'xl': 'w-24 h-24 text-2xl'
  };
  
  // Get initials from name
  const getInitials = () => {
    if (!name) return 'U';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center text-white font-medium ${bgColor} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.classList.add(bgColor);
            e.target.parentNode.innerHTML = getInitials();
          }}
        />
      ) : (
        getInitials()
      )}
    </div>
  );
};

export default Avatar; 