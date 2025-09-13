import './globals.css';
import { Inter } from 'next/font/google';
import { SidebarProvider } from '../context/SidebarProvider'; // Import the new provider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Forecast Disease App',
  description: 'A disease forecasting application.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap your entire application with the SidebarProvider */}
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
