'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, CalendarDays, UserRound, Ticket, ExternalLink } from 'lucide-react';
import { PublicNavbar } from '@components/layout/PublicNavbar';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { ReviewList } from '@components/event/ReviewList';
import { getPublicEventById } from '@lib/api/events';
import { getEventReviews } from '@lib/api/reviews';
import { tokenStorage } from '@lib/auth/token';
import { styles } from '@styles/styles';
import type { EventItem } from '@mytypes/event';
import type { ReviewItem } from '@mytypes/review';

function formatDateRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const startText = start.toLocaleString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const endText = end.toLocaleString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${startText} — ${endText}`;
}

function formatPrice(price: number) {
  if (price <= 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export default function EventDetailPage() {
  const params = useParams();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [error, setError] = useState('');
  const [hasToken, setHasToken] = useState(false);

  const eventId = useMemo(() => Number(params.id), [params.id]);

  useEffect(() => {
    setHasToken(Boolean(tokenStorage.get()));
  }, []);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        if (Number.isNaN(eventId)) {
          throw new Error('Invalid event id');
        }

        const [eventResult, reviewResult] = await Promise.all([
          getPublicEventById(eventId),
          getEventReviews(eventId),
        ]);

        setEvent(eventResult);
        setReviews(reviewResult.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [eventId]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNavbar keyword={keyword} onKeywordChange={setKeyword} />

      <div className={styles.layout.content}>
        {loading ? (
          <PageSkeleton />
        ) : error || !event ? (
          <Card>
            <h1 className="text-2xl font-semibold text-slate-900">Event not found</h1>
            <p className="mt-2 text-sm text-slate-600">
              {error || 'The requested event could not be loaded.'}
            </p>
            <div className="mt-6">
              <Link href="/">
                <Button className="w-auto px-5">Back to Home</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="min-h-[320px] bg-slate-200">
                  {event.bannerUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`flex h-full min-h-[320px] items-center justify-center ${styles.brand.softBg} text-sm text-slate-500`}>
                      Event banner
                    </div>
                  )}
                </div>

                <div className="flex items-center p-8">
                  <div className="w-full">
                    <p className={styles.text.eyebrow}>
                      {event.categoryName || 'Event'}
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900">
                      {event.title}
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {event.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {event.source === 'EXTERNAL' && event.externalUrl ? (
                        <a
                          href={event.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button className="w-auto px-5">
                            <span className="flex items-center gap-2">
                              Open External Event
                              <ExternalLink size={16} />
                            </span>
                          </Button>
                        </a>
                      ) : hasToken ? (
                        <Button className="w-auto px-5">Book Event</Button>
                      ) : (
                        <Link href="/login">
                          <Button className="w-auto px-5">Login to Continue</Button>
                        </Link>
                      )}

                      <Button variant="secondary" className="w-auto px-5">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-6">
                <Card>
                  <h2 className="text-xl font-semibold text-slate-900">About this event</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    {event.description}
                  </p>
                </Card>

                <ReviewList items={reviews} />
              </section>

              <aside className="space-y-6">
                <Card>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Event details
                  </h2>

                  <div className="mt-5 space-y-4 text-sm text-slate-700">
                    <div className="flex items-start gap-3">
                      <CalendarDays size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Date and time</p>
                        <p className="mt-1 text-slate-600">
                          {formatDateRange(event.startsAt, event.endsAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Location</p>
                        <p className="mt-1 text-slate-600">
                          {event.venue}
                        </p>
                        <p className="text-slate-600">{event.address}</p>
                        <p className="text-slate-600">{event.city}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Ticket size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Price</p>
                        <p className="mt-1 text-slate-600">{formatPrice(event.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <UserRound size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Organizer</p>
                        <p className="mt-1 text-slate-600">{event.ownerName}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-semibold text-slate-900">Quick info</h2>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-900">Category:</span>{' '}
                      {event.categoryName || '-'}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Pax:</span>{' '}
                      {event.pax}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Source:</span>{' '}
                      {event.source}
                    </p>
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}