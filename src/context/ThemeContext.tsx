import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the shape of the context
interface ThemeContextType {
  isDarkMode: boolean;
  apiUrl: string;
  toggleTheme: () => void;
  setApiUrl: (url: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [apiUrl, setApiUrl] = useState<string>(() => {
    // Default to localhost MediaMTX API
    return localStorage.getItem('apiUrl') || 'http://localhost:9997';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Persist API URL
  useEffect(() => {
    localStorage.setItem('apiUrl', apiUrl);
  }, [apiUrl]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      apiUrl, 
      toggleTheme, 
      setApiUrl 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easier context usage
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};