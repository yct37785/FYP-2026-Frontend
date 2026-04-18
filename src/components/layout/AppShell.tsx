'use client';

import { ReactNode, useState } from 'react';
import type { UserRole } from '@mytypes/user';
import { TopNavbar } from '@components/layout/TopNavbar';
import { Sidebar } from '@components/layout/Sidebar';
import { getNavItems } from '@lib/constants/nav';

interface AppShellProps {
  role: UserRole;
  onLogout: () => void;
  children: ReactNode;
}

export function AppShell({ role, onLogout, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const items = getNavItems(role);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNavbar
        collapsed={collapsed}
        onToggleSidebar={() => setCollapsed((prev) => !prev)}
        onLogout={onLogout}
      />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar items={items} collapsed={collapsed} />

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}