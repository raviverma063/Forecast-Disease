'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data for TypeScript
interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// 1. Create the context with a default value of null
// The context will hold the sidebar's state and a function to change it.
const SidebarContext = createContext<SidebarContextType | null>(null);

// 2. Create a custom hook for easy, type-safe access to the context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === null) {
    // This error is thrown if the hook is used outside of the provider's scope,
    // ensuring you wrap your component tree correctly.
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
};

// Define the type for the provider's props
interface SidebarProviderProps {
  children: ReactNode;
}

// 3. Create the Provider component that will wrap your application
export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  // Use the 'useState' hook to manage the sidebar's open/closed state.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Create a function to toggle the state.
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // The value provided to consuming components now includes both the
  // current state and the function to change it.
  const value = { isSidebarOpen, toggleSidebar };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
