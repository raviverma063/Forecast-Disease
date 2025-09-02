"use client";
import { createContext, useContext, useState } from "react";

// Create context
const SidebarContext = createContext();

// Provider
export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Hook
export function useSidebar() {
  return useContext(SidebarContext);
}