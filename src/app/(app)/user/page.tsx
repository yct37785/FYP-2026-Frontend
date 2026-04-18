'use client';

import { Card } from '@components/ui/Card';
import { useAppSession } from '@lib/session/AppSessionContext';

export default function UserPage() {
  const { profile } = useAppSession();

  return (
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
            <span className="font-medium">Gender:</span> {profile.gender || '-'}
          </div>
          <div>
            <span className="font-medium">Age:</span> {profile.age ?? '-'}
          </div>
        </div>
      </Card>
    </div>
  );
}