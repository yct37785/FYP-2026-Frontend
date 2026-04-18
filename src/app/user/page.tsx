'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { tokenStorage } from '@/lib/auth/token';
import { getMyProfile } from '@/lib/api/user';
import type { UserProfile } from '@/types/user';
import { AppShell } from '@/components/layout/AppShell';

export default function UserPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();

    if (!token) {
      router.replace('/login');
      return;
    }

    async function loadProfile() {
      try {
        const result = await getMyProfile();
        setProfile(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [router]);

  function handleLogout() {
    tokenStorage.clear();
    router.replace('/login');
  }

  if (!profile && loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Card>
            <p className="text-slate-600">Loading profile...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile && error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Card>
            <p className="text-red-600">{error}</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <AppShell role={profile.role} onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-600">
            View your account details and profile information.
          </p>
        </div>

        <Card>
          <div className="space-y-3 text-sm text-slate-700">
            <div>
              <span className="font-medium">Name:</span> {profile.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {profile.email}
            </div>
            <div>
              <span className="font-medium">Role:</span> {profile.role}
            </div>
            <div>
              <span className="font-medium">Status:</span> {profile.status}
            </div>
            <div>
              <span className="font-medium">Credits:</span> {profile.credits}
            </div>
            <div>
              <span className="font-medium">Description:</span>{' '}
              {profile.description || '-'}
            </div>
            <div>
              <span className="font-medium">Gender:</span>{' '}
              {profile.gender || '-'}
            </div>
            <div>
              <span className="font-medium">Age:</span> {profile.age ?? '-'}
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}