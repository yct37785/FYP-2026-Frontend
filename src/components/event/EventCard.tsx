'use client';

import Link from 'next/link';
import type { EventItem } from '@mytypes/event';

interface EventCardProps {
  event: EventItem;
}

function formatDateRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const startText = start.toLocaleString('en-SG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

  const endText = end.toLocaleString('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${startText} - ${endText}`;
}

function formatPrice(price: number) {
  if (price <= 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-200">
        {event.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-500">
            No banner
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
              {event.categoryName || 'Event'}
            </p>
            <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-slate-900">
              {event.title}
            </h3>
          </div>

          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {formatPrice(event.price)}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">
          {event.description}
        </p>

        <div className="space-y-1 text-sm text-slate-500">
          <p>{formatDateRange(event.startsAt, event.endsAt)}</p>
          <p className="line-clamp-1">
            {event.venue}, {event.city}
          </p>
          <p className="line-clamp-1">by {event.ownerName}</p>
        </div>
      </div>
    </Link>
  );
}