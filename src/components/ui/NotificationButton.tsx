'use client';

import { Bell } from 'lucide-react';

interface NotificationButtonProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationButton({
  count = 0,
  onClick,
  className = '',
}: NotificationButtonProps) {
  const displayCount = count > 99 ? '99+' : String(count);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50 ${className}`}
      aria-label="Notifications"
      title="Notifications"
    >
      <Bell size={18} />

      {count > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-semibold leading-none text-white">
          {displayCount}
        </span>
      ) : null}
    </button>
  );
}