'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  LayoutDashboard,
  Map,
  Users,
  ShieldCheck,
  Siren,
  User,
  X,
  Bot,
} from 'lucide-react';
// Assuming SidebarProvider is a component you have, update the import path if needed
// import { SidebarProvider } from '@/contexts/SidebarContext'; 

// --- Navigation Links Configuration ---
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/travel-insights', label: 'Travel Insights', icon: Map },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/prevention', label: 'Prevention', icon: ShieldCheck },
  { href: '/emergency', label: 'My Emergency', icon: Siren },
  { href: '/profile', label: 'Profile', icon: User },
];

// --- Reusable NavLink Component ---
function NavLink({ href, label, icon: Icon }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-white hover:bg-gray-700 ${
        isActive ? 'bg-gray-800 text-white' : ''
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

// --- Main Layout Component ---
// Mock SidebarProvider for demonstration. Replace with your actual provider.
const SidebarProvider = ({ children }) => <>{children}</>;

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* --- Desktop Sidebar --- */}
        <div className="hidden border-r bg-gray-900/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold text-white">
                <Bot className="h-6 w-6" />
                <span>Forecast Frontier</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* --- Mobile Header & Main Content --- */}
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-gray-900/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
            {/* --- Mobile Menu (Sheet) --- */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-gray-900 text-white border-r-gray-800">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <Bot className="h-6 w-6" />
                    <span>Forecast Frontier</span>
                  </Link>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                       <item.icon className="h-5 w-5" />
                       {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
             <div className="flex w-full justify-center font-semibold text-lg">
               Forecast Frontier
             </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-900 text-white">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
