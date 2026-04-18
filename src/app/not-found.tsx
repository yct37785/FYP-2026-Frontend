'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@components/layout/AppShell';
import { Card } from '@components/ui/Card';
import { tokenStorage } from '@lib/auth/token';
import { getMyProfile } from '@lib/api/user';
import type { UserProfile } from '@mytypes/user';

export default function RootNotFoundPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = tokenStorage.get();

    if (!token) {
      setChecked(true);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const result = await getMyProfile();

        if (!cancelled) {
          setProfile(result);
        }
      } catch {
        tokenStorage.clear();
      } finally {
        if (!cancelled) {
          setChecked(true);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    tokenStorage.clear();
    router.replace('/login');
  }

  if (!checked) {
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

  const content = (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The page you tried to open does not exist.
      </p>
    </div>
  );

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-4xl">{content}</div>
      </div>
    );
  }

  return (
    <AppShell role={profile.role} onLogout={handleLogout}>
      {content}
    </AppShell>
  );
}