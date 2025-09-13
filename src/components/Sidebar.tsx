'use client';

import { useSidebar } from '../../context/SidebarProvider'; // Corrected import path

// Your sidebar component code goes here.
// You can now safely use the useSidebar hook.

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold">Sidebar</h2>
        <button onClick={toggleSidebar} className="mt-4 px-4 py-2 bg-blue-500 rounded">
          Toggle
        </button>
      </div>
    </div>
  );
}
