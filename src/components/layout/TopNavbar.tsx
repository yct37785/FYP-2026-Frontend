'use client';

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

        <Button
          variant="secondary"
          className="w-auto px-4 py-2"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}