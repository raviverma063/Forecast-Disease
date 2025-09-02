'use client';

import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="sidebar-toggle"
      >
        {isOpen ? '✕' : '☰'}
      </button>
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2>Navigation</h2>
        <nav>
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">Calendar</a></li>
            <li><a href="#">Documents</a></li>
            <li><a href="#">Reports</a></li>
          </ul>
        </nav>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
    </>
  );
}