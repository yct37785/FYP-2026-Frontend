'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@components/layout/AppShell';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { Card } from '@components/ui/Card';
import { tokenStorage } from '@lib/auth/token';
import { getMyProfile } from '@lib/api/user';
import { AppSessionProvider } from '@lib/session/AppSessionContext';
import type { UserProfile } from '@mytypes/user';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();

    if (!token) {
      router.replace('/login');
      return;
    }

    let cancelled = false;

    async function bootstrap() {
      try {
        const result = await getMyProfile();

        if (!cancelled) {
          setProfile(result);
        }
      } catch {
        tokenStorage.clear();
        router.replace('/login');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    tokenStorage.clear();
    router.replace('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-64px)]">
          <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
            <div className="space-y-2 px-3 py-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-slate-200"
                />
              ))}
            </div>
          </aside>

          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
              <PageSkeleton />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <AppSessionProvider value={{ profile, setProfile }}>
      <AppShell role={profile.role} onLogout={handleLogout}>
        {children}
      </AppShell>
    </AppSessionProvider>
  );
}