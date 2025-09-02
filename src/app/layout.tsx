// 1. Import your provider
// Make sure this path is correct for your project!
import { SidebarProvider } from '@/context/SidebarContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 2. Wrap your entire application with the provider */}
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
