'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { tokenStorage } from '@/lib/auth/token';
import { getMyProfile } from '@/lib/api/user';
import type { UserProfile } from '@/types/user';

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
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
            <p className="mt-1 text-sm text-slate-600">
              Logged-in starter page using your backend `/api/user`.
            </p>
          </div>

          <Button
            variant="secondary"
            className="w-auto px-4"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {loading ? (
          <Card>
            <p className="text-slate-600">Loading profile...</p>
          </Card>
        ) : error ? (
          <Card>
            <p className="text-red-600">{error}</p>
          </Card>
        ) : profile ? (
          <Card>
            <div className="space-y-3 text-sm text-slate-700">
              <div><span className="font-medium">Name:</span> {profile.name}</div>
              <div><span className="font-medium">Email:</span> {profile.email}</div>
              <div><span className="font-medium">Role:</span> {profile.role}</div>
              <div><span className="font-medium">Status:</span> {profile.status}</div>
              <div><span className="font-medium">Credits:</span> {profile.credits}</div>
              <div>
                <span className="font-medium">Description:</span>{' '}
                {profile.description || '-'}
              </div>
              <div>
                <span className="font-medium">Gender:</span>{' '}
                {profile.gender || '-'}
              </div>
              <div>
                <span className="font-medium">Age:</span>{' '}
                {profile.age ?? '-'}
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </main>
  );
}