'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TopNavbarProps {
  onLogout: () => void;
}

export function TopNavbar({ onLogout }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="text-lg font-semibold text-slate-900">
          Events Finder
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