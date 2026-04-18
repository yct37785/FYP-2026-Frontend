'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { NotificationButton } from '@components/ui/NotificationButton';
import { tokenStorage } from '@lib/auth/token';
import { getAccountHref } from '@lib/auth/getAccountHref';
import type { UserRole } from '@mytypes/user';

interface PublicNavbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
}

export function PublicNavbar({
  keyword,
  onKeywordChange,
}: PublicNavbarProps) {
  const [accountHref, setAccountHref] = useState<string | null>(null);

  useEffect(() => {
    const payload = tokenStorage.getPayload();
    const role = payload?.role as UserRole | undefined;

    if (!payload) {
      setAccountHref(null);
      return;
    }

    setAccountHref(getAccountHref(role));
  }, []);

  function handleLogout() {
    tokenStorage.clear();
    window.location.href = '/login';
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold text-slate-900"
        >
          Events Finder
        </Link>

        <div className="relative hidden flex-1 md:block">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Search events, venues, cities, organizers..."
            className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {accountHref ? (
            <>
              <Link href={accountHref}>
                <Button variant="secondary" className="w-auto px-4 py-2">
                  <span className="flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Portal
                  </span>
                </Button>
              </Link>

              <Link href="/user/notifications">
                <NotificationButton count={0} />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer text-sm font-medium text-slate-700 transition hover:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="secondary" className="w-auto px-4 py-2">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Search events..."
            className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
          />
        </div>
      </div>
    </header>
  );
}