'use client';

import { useEffect, useState } from 'react';
import { PageSkeleton } from '@components/ui/PageSkeleton';

export default function UserBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // replace this with your real API call later
        await new Promise((resolve) => setTimeout(resolve, 500));

        setItems([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">My Bookings</h1>
      <p className="mt-2 text-sm text-slate-600">
        You have {items.length} bookings.
      </p>
    </div>
  );
}