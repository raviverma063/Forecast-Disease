'use client';

import { createContext, useContext } from 'react';

// 1. Create the context
const SidebarContext = createContext(null);

// 2. Create a custom hook for easy access to the context
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === null) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }
    return context;
};

// 3. Create the Provider component that will wrap your application
export const SidebarProvider = ({ children }) => {
    // You can add real state here in the future if needed
    const value = { isSidebarOpen: false }; // Example value from your layout

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};

