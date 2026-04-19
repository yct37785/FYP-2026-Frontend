'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, Mail, UserRound } from 'lucide-react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import {
  getMyOrganizerEventBookings,
  getMyOrganizerEventById,
  type OrganizerEventBookingItem,
} from '@lib/api/organizerEvents';
import type { EventItem } from '@mytypes/event';

function formatDate(value: string | Date) {
  return new Date(value).toLocaleString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatPrice(price: number) {
  if (price <= 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export default function OrganizerEventBookingsPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const [event, setEvent] = useState<EventItem | null>(null);
  const [items, setItems] = useState<OrganizerEventBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        if (Number.isNaN(eventId)) {
          throw new Error('Invalid event id');
        }

        const [eventResult, bookingResult] = await Promise.all([
          getMyOrganizerEventById(eventId),
          getMyOrganizerEventBookings(eventId),
        ]);

        setEvent(eventResult);
        setItems(bookingResult.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load event bookings'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [eventId]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Event Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            View all confirmed bookings for your event.
          </p>
        </div>

        <Card>
          <p className="text-sm text-red-600">
            {error || 'Failed to load event bookings.'}
          </p>
        </Card>

        <Link href="/organizer/events">
          <Button variant="secondary" className="w-auto px-5">
            <span className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Events
            </span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Event Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            View all confirmed bookings for your event.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/organizer/events/${event.id}`}>
            <Button variant="secondary" className="w-auto px-5">
              <span className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Event
              </span>
            </Button>
          </Link>

          <Link href={`/events/${event.id}`}>
            <Button variant="secondary" className="w-auto px-5">
              View Public Event
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Event</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {event.title}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Schedule</p>
            <p className="mt-1 text-sm text-slate-700">
              {formatDate(event.startsAt)} - {formatDate(event.endsAt)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Summary</p>
            <p className="mt-1 text-sm text-slate-700">
              {items.length} booking{items.length === 1 ? '' : 's'} · Price{' '}
              {formatPrice(event.price)}
            </p>
          </div>
        </div>
      </Card>

      {items.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            No bookings yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Confirmed bookings for this event will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((booking, index) => (
            <Card key={booking.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Booking #{index + 1}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Credits spent: {booking.creditsSpent}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <UserRound size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Attendee
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {booking.userName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Email
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {booking.userEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays
                        size={18}
                        className="mt-0.5 text-slate-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Booked at
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {formatDate(booking.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays
                        size={18}
                        className="mt-0.5 text-slate-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Last updated
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {formatDate(booking.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}