'use client';

import Link from 'next/link';
import { ArrowLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { NotificationButton } from '@components/ui/NotificationButton';

interface PrivateNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export function PrivateNavbar({
  collapsed,
  onToggleSidebar,
  onLogout,
}: PrivateNavbarProps) {
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
          <Link href="/">
            <Button variant="secondary" className="w-auto px-4 py-2">
              <span className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Browse Events
              </span>
            </Button>
          </Link>

          <Link href="/user/notifications">
            <NotificationButton count={0} />
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="cursor-pointer text-sm font-medium text-slate-700 transition hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}