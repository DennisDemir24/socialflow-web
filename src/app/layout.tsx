import Sidebar from '@/components/shared/Sidebar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SocialFlow | Social Media Content Planner',
  description: 'Plan and organize your social media content effectively',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto transition-all duration-300">
            {children}
          </main>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}