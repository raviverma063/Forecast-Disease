// src/app/layout.tsx

// 1. Import the Sidebar component
import { Sidebar } from '@/components/ui/sidebar';
// You will also need your SidebarProvider here
import { SidebarProvider } from '@/context/SidebarContext'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          {/* 2. Add the Sidebar component here */}
          <Sidebar>
            <ul>
              <li><a href="/">Dashboard</a></li>
              <li><a href="/prevention">Prevention</a></li>
              {/* Add other links here */}
            </ul>
          </Sidebar>
          
          <main>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
