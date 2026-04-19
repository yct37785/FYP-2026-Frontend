'use client';

import { useEffect, useState } from 'react';
import { MyEventListPage } from '@components/event/MyEventListPage';
import { getMyFavorites } from '@lib/api/favorites';
import type { EventItem } from '@mytypes/event';

export default function UserFavoritesPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyFavorites();
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    }

    void loadFavorites();
  }, []);

  return (
    <MyEventListPage
      title="My Favorites"
      description="View all events you have favorited."
      items={items}
      loading={loading}
      error={error}
      emptyTitle="No favorites yet"
      emptyDescription="Events you favorite will appear here."
    />
  );
}