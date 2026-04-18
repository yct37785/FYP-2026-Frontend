'use client';

import { Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@components/ui/Button';

interface TopNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export function TopNavbar({
  collapsed,
  onToggleSidebar,
  onLogout,
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <div className="text-lg font-semibold text-slate-900">
            Events Finder
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={18} />
          </button>

          <Button
            variant="secondary"
            className="w-auto px-4 py-2"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}