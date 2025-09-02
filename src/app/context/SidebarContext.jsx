'use client';

import { createContext, useContext, useState } from 'react';

// Create the context
const SidebarContext = createContext(null);

// Create a custom hook to use the context easily
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === null) {
        // This error will now be much clearer if you forget the provider!
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }
    return context;
};

// Create the Provider component
export const SidebarProvider = ({ children }) => {
    // You can add real state here if needed, for example:
    // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const value = { isSidebarOpen, setIsSidebarOpen };
    const value = { isSidebarOpen: false }; // Keeping your example value

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};
