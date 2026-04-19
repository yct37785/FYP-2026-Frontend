'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PlusSquare } from 'lucide-react';
import { EventCard } from '@components/event/EventCard';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { getMyOrganizerEvents } from '@lib/api/organizerEvents';
import type { EventItem } from '@mytypes/event';

export default function OrganizerEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyOrganizerEvents();
        setItems(result.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load organizer events'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadEvents();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Organizer Events
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage the events you created.
          </p>
        </div>

        <Link href="/organizer/events/new">
          <Button className="w-auto px-5">
            <span className="flex items-center gap-2">
              <PlusSquare size={18} />
              Create Event
            </span>
          </Button>
        </Link>
      </div>

      {error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : null}

      {items.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            No organizer events yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Events you create will appear here.
          </p>

          <div className="mt-5">
            <Link href="/organizer/events/new">
              <Button className="w-auto px-5">
                <span className="flex items-center gap-2">
                  <PlusSquare size={18} />
                  Create Your First Event
                </span>
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/organizer/events/${event.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}