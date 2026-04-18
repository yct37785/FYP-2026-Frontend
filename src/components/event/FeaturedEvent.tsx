'use client';

import Link from 'next/link';
import type { EventItem } from '@mytypes/event';
import { Button } from '@components/ui/Button';

interface FeaturedEventProps {
  event: EventItem | null;
}

function formatDate(startsAt: string) {
  return new Date(startsAt).toLocaleString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatPrice(price: number) {
  if (price <= 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export function FeaturedEvent({ event }: FeaturedEventProps) {
  if (!event) {
    return (
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="min-h-[280px] bg-gradient-to-br from-slate-100 to-slate-200" />
          <div className="flex items-center p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                Featured Event
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                Discover what’s happening around you
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Browse upcoming events, workshops, meetups, performances and
                more.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-h-[280px] bg-slate-200">
          {event.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-orange-100 via-white to-slate-100 text-sm text-slate-500">
              Featured event
            </div>
          )}
        </div>

        <div className="flex items-center p-8">
          <div className="w-full">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Featured Event
            </p>

            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900">
              {event.title}
            </h2>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>{formatDate(event.startsAt)}</p>
              <p>
                {event.venue}, {event.city}
              </p>
              <p>by {event.ownerName}</p>
              <p className="font-medium text-slate-800">
                {formatPrice(event.price)}
              </p>
            </div>

            <p className="mt-5 line-clamp-4 text-sm text-slate-600">
              {event.description}
            </p>

            <div className="mt-6">
              <Link href={`/events/${event.id}`}>
                <Button className="w-auto px-5">View Event</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}