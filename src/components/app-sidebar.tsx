'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Plane,
  Users2,
  ShieldCheck,
  Siren,
  User,
  GitFork,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/travel', label: 'Travel Insights', icon: Plane },
  { href: '/community', label: 'Community', icon: Users2 },
  { href: '/prevention', label: 'Prevention', icon: ShieldCheck },
  { href: '/emergency', label: 'My Emergency', icon: Siren },
  { href: '/profile', label: 'Profile', icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-primary/20 text-primary">
            <GitFork className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-semibold">Forecast Frontier</h1>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <SidebarMenuItem key={href}>
            <Link href={href} passHref>
              <SidebarMenuButton
                isActive={pathname === href}
                className="w-full"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <div className="text-xs text-muted-foreground p-4 text-center">
          &copy; 2024 Forecast Frontier.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
