'use client';

import { EventCard } from '@components/event/EventCard';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import type { EventItem } from '@mytypes/event';

interface MyEventListPageProps {
  title: string;
  description: string;
  items: EventItem[];
  loading: boolean;
  error: string;
  emptyTitle: string;
  emptyDescription: string;
}

export function MyEventListPage({
  title,
  description,
  items,
  loading,
  error,
  emptyTitle,
  emptyDescription,
}: MyEventListPageProps) {
  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((event) => (
          <EventCard key={event.id} event={event} href={`/events/${event.id}`} />
        ))}
      </div>
    </div>
  );
}