'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@components/layout/AppShell';
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

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl">
          <Card>
            <p className="text-slate-600">Loading...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AppSessionProvider value={{ profile }}>
      <AppShell role={profile.role} onLogout={handleLogout}>
        {children}
      </AppShell>
    </AppSessionProvider>
  );
}