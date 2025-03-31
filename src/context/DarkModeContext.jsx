import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const DarkModeContext = createContext();

// Custom hook to use the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);

// Provider component for dark mode functionality
export const DarkModeProvider = ({ children }) => {
  // Check if the user has a preference saved in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Add or remove dark mode class from body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Value to be provided by the context
  const value = {
    darkMode,
    toggleDarkMode
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext; 