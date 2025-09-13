// src/components/ui/sidebar.tsx

'use client';

import { useSidebar } from '../../context/SidebarContext';

// 1. The Trigger Button Component
export function SidebarTrigger({ className }: { className?: string }) {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar} className={className}>
      {isOpen ? '✕' : '☰'}
    </button>
  );
}

// 2. The Sidebar Panel Component
export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav>{children}</nav>
      </div>

      {/* This dark overlay appears when the sidebar is open */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
    </>
  );
}
