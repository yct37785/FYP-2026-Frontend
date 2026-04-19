'use client';

import { useEffect, useState } from 'react';
import { MyEventListPage } from '@components/event/MyEventListPage';
import { getMyBookings } from '@lib/api/bookings';
import type { EventItem } from '@mytypes/event';

export default function UserBookingsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyBookings();
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }

    void loadBookings();
  }, []);

  return (
    <MyEventListPage
      title="My Bookings"
      description="View all events you have booked."
      items={items}
      loading={loading}
      error={error}
      emptyTitle="No bookings yet"
      emptyDescription="Events you book will appear here."
    />
  );
}