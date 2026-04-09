'use client';

import './globals.css';
import { LayoutProvider, useLayout } from '@/components/LayoutProvider';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

function AppContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useLayout();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-56'
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <footer className="border-t" style={{ backgroundColor: '#1a233b' }}>
          <div className="flex h-10 items-center px-4 md:px-6 text-xs" style={{ color: '#64748B' }}>
            <span style={{ color: '#1e52f1', fontWeight: 600 }}>BlueVector.AI</span>
            <span className="mx-2">—</span>
            Google Cloud-Focused Consultancy
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutProvider>
          <AppContent>{children}</AppContent>
        </LayoutProvider>
      </body>
    </html>
  );
}
