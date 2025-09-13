'use client';

import React, { useState, useContext, createContext } from 'react';
import {
  Menu,
  LayoutDashboard,
  Map,
  Users,
  ShieldCheck,
  Siren,
  User,
  Bot,
  X,
} from 'lucide-react';

// --- START: Routing & Component Simulation ---
// To make this a runnable, single-file example, we'll simulate Next.js routing and shadcn/ui components.

// 1. Routing Simulation (replaces Next.js usePathname and Link)
const RouterContext = createContext({ path: '/dashboard', navigate: () => {} });

const RouterProvider = ({ children }) => {
    const [path, setPath] = useState('/dashboard');
    const navigate = (newPath) => setPath(newPath);
    return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
};

const usePathname = () => {
    return useContext(RouterContext).path;
};

const Link = ({ href, children, className, onClick }) => {
    const { navigate } = useContext(RouterContext);
    const handleClick = (e) => {
        e.preventDefault();
        navigate(href);
        if (onClick) onClick(e);
    };
    return <a href={href} className={className} onClick={handleClick}>{children}</a>;
};

// 2. UI Component Simulation (replaces shadcn/ui)
const Button = ({ variant, size, className, children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = "border border-gray-700 hover:bg-gray-800 hover:text-white";
  const sizeClasses = "h-10 w-10";
  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Sheet = ({ open, onOpenChange, children }) => (
  <div onKeyDown={(e) => e.key === 'Escape' && onOpenChange(false)}>
    {React.Children.map(children, child => 
      React.cloneElement(child, { open, onOpenChange })
    )}
  </div>
);

const SheetTrigger = ({ children, onOpenChange }) => 
  React.cloneElement(React.Children.only(children), {
    onClick: () => onOpenChange(true),
  });

const SheetContent = ({ side = 'left', className, children, open, onOpenChange }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70" onClick={() => onOpenChange(false)} />
            {/* Content */}
            <div className={`fixed top-0 bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} bg-gray-950 p-6 transition-transform transform ${open ? 'translate-x-0' : '-translate-x-full'} duration-300 ease-in-out ${className}`}>
                {children}
                <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </button>
            </div>
        </div>
    );
};
// --- END: Routing & Component Simulation ---


// --- Main Application Code ---

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/travel-insights', label: 'Travel Insights', icon: Map },
  { href: '/dashboard/community', label: 'Community', icon: Users },
  { href: '/dashboard/prevention', label: 'Prevention', icon: ShieldCheck },
  { href: '/dashboard/emergency', label: 'Emergency', icon: Siren },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

function NavLink({ href, label, icon: Icon }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-colors hover:text-white hover:bg-gray-800 ${
        isActive ? 'bg-gray-800 text-white' : ''
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full bg-gray-900 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Sidebar (desktop) --- */}
      <div className="hidden border-r border-gray-800 bg-gray-950 md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center border-b border-gray-800 px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
              <Bot className="h-6 w-6" />
              <span>Forecast Frontier</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start p-2 text-sm font-medium lg:p-4">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* --- Content + mobile header --- */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-gray-800 bg-gray-950 px-4 md:hidden lg:h-[60px]">
          {/* Mobile nav toggle */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-[280px]">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/dashboard" className="flex items-center gap-3 text-lg font-semibold mb-4">
                  <Bot className="h-6 w-6 text-white" />
                  <span className="text-white">Forecast Frontier</span>
                </Link>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-4 rounded-lg px-3 py-2 transition-colors ${
                                isActive
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Centered Title (flex-1 makes it take up available space) */}
          <div className="flex-1 text-center font-semibold text-white">
            Forecast Frontier
          </div>

          {/* Spacer to perfectly center the title */}
          <div className="w-10" />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}

// Placeholder Page Content
const PlaceholderContent = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-700 rounded-lg bg-gray-950/20">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-400">Content for this page goes here.</p>
    </div>
);

// The main App component that ties everything together
export default function App() {
    return (
        <RouterProvider>
            <DashboardLayout>
                <AppContent />
            </DashboardLayout>
        </RouterProvider>
    );
}

// A helper component to render content based on the current path
const AppContent = () => {
    const pathname = usePathname();
    switch (pathname) {
        case '/dashboard':
            return <PlaceholderContent title="Dashboard" />;
        case '/dashboard/travel-insights':
            return <PlaceholderContent title="Travel Insights" />;
        case '/dashboard/community':
            return <PlaceholderContent title="Community" />;
        case '/dashboard/prevention':
            return <PlaceholderContent title="Prevention" />;
        case '/dashboard/emergency':
            return <PlaceholderContent title="Emergency" />;
        case '/dashboard/profile':
            return <PlaceholderContent title="Profile" />;
        default:
            return <PlaceholderContent title="Page Not Found" />;
    }
};
