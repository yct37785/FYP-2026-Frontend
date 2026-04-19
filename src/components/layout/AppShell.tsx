'use client';

import { ReactNode, useState } from 'react';
import type { UserRole } from '@mytypes/user';
import { PrivateNavbar } from '@components/layout/PrivateNavbar';
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
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <PrivateNavbar
        collapsed={collapsed}
        onToggleSidebar={() => setCollapsed((prev) => !prev)}
        onLogout={onLogout}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <div className="sticky top-16 h-[calc(100vh-64px)] shrink-0">
          <Sidebar items={items} collapsed={collapsed} />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}