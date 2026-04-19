'use client';

import { useEffect, useState } from 'react';
import { MyEventListPage } from '@components/event/MyEventListPage';
import { getMyWaitlists } from '@lib/api/waitlists';
import type { EventItem } from '@mytypes/event';

export default function UserWaitlistsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWaitlists() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyWaitlists();
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load waitlists');
      } finally {
        setLoading(false);
      }
    }

    void loadWaitlists();
  }, []);

  return (
    <MyEventListPage
      title="My Waitlists"
      description="View all events you are currently waitlisted for."
      items={items}
      loading={loading}
      error={error}
      emptyTitle="No waitlists yet"
      emptyDescription="Events you join the waitlist for will appear here."
    />
  );
}