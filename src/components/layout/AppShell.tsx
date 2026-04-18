'use client';

import { ReactNode } from 'react';
import type { UserRole } from '@/types/user';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { getNavItems } from '@/lib/constants/nav';

interface AppShellProps {
  role: UserRole;
  onLogout: () => void;
  children: ReactNode;
}

export function AppShell({ role, onLogout, children }: AppShellProps) {
  const items = getNavItems(role);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNavbar onLogout={onLogout} />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar items={items} />

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}