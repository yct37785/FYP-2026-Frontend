'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  CalendarDays,
  UserRound,
  Ticket,
  ExternalLink,
} from 'lucide-react';
import { PublicNavbar } from '@components/layout/PublicNavbar';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { ReviewList } from '@components/event/ReviewList';
import { getPublicEventById } from '@lib/api/events';
import { getEventReviews } from '@lib/api/reviews';
import { createBooking, deleteMyBooking, getBookingStatus } from '@lib/api/bookings';
import {
  createFavorite,
  deleteMyFavorite,
  getFavoriteStatus,
} from '@lib/api/favorites';
import { getMyProfile } from '@lib/api/user';
import { tokenStorage } from '@lib/auth/token';
import { styles } from '@styles/styles';
import type { EventItem } from '@mytypes/event';
import type { ReviewItem } from '@mytypes/review';
import type { UserProfile } from '@mytypes/user';

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

function buildGoogleMapsUrl(event: EventItem) {
  const parts = [event.venue, event.address, event.city].filter(Boolean);
  const query = encodeURIComponent(parts.join(', '));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [error, setError] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalMessage, setBookingModalMessage] = useState('');
  const [bookingModalError, setBookingModalError] = useState('');
  const [bookingModalSuccess, setBookingModalSuccess] = useState('');

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

  useEffect(() => {
    async function loadAuthedState() {
      if (!hasToken || Number.isNaN(eventId)) {
        setProfile(null);
        setIsFavorited(false);
        setFavoriteId(null);
        setIsBooked(false);
        setBookingId(null);
        return;
      }

      try {
        const [favoriteStatus, bookingStatus, currentProfile] = await Promise.all([
          getFavoriteStatus(eventId),
          getBookingStatus(eventId),
          getMyProfile(),
        ]);

        setIsFavorited(favoriteStatus.isFavorited);
        setFavoriteId(favoriteStatus.favoriteId);
        setIsBooked(bookingStatus.isBooked);
        setBookingId(bookingStatus.bookingId);
        setProfile(currentProfile);
      } catch {
        setProfile(null);
        setIsFavorited(false);
        setFavoriteId(null);
        setIsBooked(false);
        setBookingId(null);
      }
    }

    void loadAuthedState();
  }, [hasToken, eventId]);

  async function refreshEvent() {
    if (Number.isNaN(eventId)) return;
    const refreshed = await getPublicEventById(eventId);
    setEvent(refreshed);
  }

  async function refreshBookingStatus() {
    if (!hasToken || Number.isNaN(eventId)) return;
    const status = await getBookingStatus(eventId);
    setIsBooked(status.isBooked);
    setBookingId(status.bookingId);
  }

  async function refreshProfile() {
    if (!hasToken) return;
    const currentProfile = await getMyProfile();
    setProfile(currentProfile);
  }

  async function handleFavoriteToggle() {
    if (!event) return;

    try {
      setIsFavoriteLoading(true);

      if (isFavorited && favoriteId) {
        await deleteMyFavorite(favoriteId);
        setIsFavorited(false);
        setFavoriteId(null);
        return;
      }

      await createFavorite(event.id);

      const status = await getFavoriteStatus(event.id);
      setIsFavorited(status.isFavorited);
      setFavoriteId(status.favoriteId);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to update favorite');
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  function handleOpenBookingModal() {
    if (!hasToken) {
      router.push('/login');
      return;
    }

    setBookingModalMessage('');
    setBookingModalError('');
    setBookingModalSuccess('');
    setIsBookingModalOpen(true);
  }

  async function handleConfirmBooking() {
    if (!event) return;

    try {
      setIsBookingLoading(true);
      setBookingModalMessage('');
      setBookingModalError('');
      setBookingModalSuccess('');

      await createBooking(event.id);

      await Promise.all([
        refreshEvent(),
        refreshBookingStatus(),
        refreshProfile(),
      ]);

      setBookingModalSuccess('Booking created successfully.');
    } catch (err) {
      setBookingModalError(
        err instanceof Error ? err.message : 'Failed to create booking'
      );
    } finally {
      setIsBookingLoading(false);
    }
  }

  async function handleCancelBooking() {
    if (!bookingId) return;

    try {
      setIsBookingLoading(true);
      setBookingModalMessage('');
      setBookingModalError('');
      setBookingModalSuccess('');

      await deleteMyBooking(bookingId);

      await Promise.all([
        refreshEvent(),
        refreshBookingStatus(),
        refreshProfile(),
      ]);

      setBookingModalSuccess('Booking cancelled successfully.');
    } catch (err) {
      setBookingModalError(
        err instanceof Error ? err.message : 'Failed to cancel booking'
      );
    } finally {
      setIsBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <PublicNavbar keyword={keyword} onKeywordChange={setKeyword} />
        <div className={styles.layout.content}>
          <PageSkeleton />
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <PublicNavbar keyword={keyword} onKeywordChange={setKeyword} />
        <div className={styles.layout.content}>
          <Card>
            <h1 className="text-2xl font-semibold text-slate-900">
              Event not found
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {error || 'The requested event could not be loaded.'}
            </p>
            <div className="mt-6">
              <Link href="/">
                <Button className="w-auto px-5">Back to Home</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const mapsUrl = buildGoogleMapsUrl(event);
  const isFull = event.totalBookings !== null && event.totalBookings >= event.pax;
  const remainingSlots =
    event.totalBookings !== null ? Math.max(event.pax - event.totalBookings, 0) : null;
  const creditsLeftAfterBooking =
    profile ? Math.max(profile.credits - event.price, 0) : null;

  return (
    <>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <PublicNavbar keyword={keyword} onKeywordChange={setKeyword} />

        <div className={styles.layout.content}>
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
                    <div
                      className={`flex h-full min-h-[320px] items-center justify-center ${styles.brand.softBg} text-sm text-slate-500`}
                    >
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
                        isBooked ? (
                          <Button
                            variant="secondary"
                            className="w-auto px-5"
                            onClick={handleOpenBookingModal}
                          >
                            Cancel Booking
                          </Button>
                        ) : isFull ? (
                          <>
                            <Button className="w-auto px-5" disabled>
                              Event is Full
                            </Button>

                            <Button variant="secondary" className="w-auto px-5">
                              Join Waitlist
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="w-auto px-5"
                            onClick={handleOpenBookingModal}
                          >
                            Book Event
                          </Button>
                        )
                      ) : (
                        <Button
                          className="w-auto px-5"
                          onClick={handleOpenBookingModal}
                        >
                          Book Event
                        </Button>
                      )}

                      {hasToken ? (
                        <Button
                          variant="secondary"
                          className="w-auto px-5"
                          onClick={handleFavoriteToggle}
                          disabled={isFavoriteLoading}
                        >
                          {isFavoriteLoading
                            ? 'Updating...'
                            : isFavorited
                            ? 'Remove Favorite'
                            : 'Favorite'}
                        </Button>
                      ) : (
                        <Link href="/login">
                          <Button variant="secondary" className="w-auto px-5">
                            Favorite
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-6">
                <Card>
                  <h2 className="text-xl font-semibold text-slate-900">
                    About this event
                  </h2>
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
                      <CalendarDays
                        size={18}
                        className="mt-0.5 text-slate-500"
                      />
                      <div>
                        <p className="font-medium text-slate-900">
                          Date and time
                        </p>
                        <p className="mt-1 text-slate-600">
                          {formatDateRange(event.startsAt, event.endsAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Location</p>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-slate-600 underline underline-offset-2 transition hover:text-slate-900"
                        >
                          {event.venue}
                          <br />
                          {event.address}
                          <br />
                          {event.city}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Ticket size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Price</p>
                        <p className="mt-1 text-slate-600">
                          {formatPrice(event.price)}
                        </p>
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
                  <h2 className="text-xl font-semibold text-slate-900">
                    Quick info
                  </h2>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-900">
                        Category:
                      </span>{' '}
                      {event.categoryName || '-'}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Pax:</span>{' '}
                      {event.pax}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Booked:</span>{' '}
                      {event.totalBookings ?? '-'}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">
                        Remaining slots:
                      </span>{' '}
                      {remainingSlots ?? '-'}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">
                        Source:
                      </span>{' '}
                      {event.source}
                    </p>
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </main>

      {isBookingModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">
              {isBooked ? 'Cancel booking' : 'Confirm booking'}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isBooked ? (
                <>
                  You are about to cancel your booking for{' '}
                  <span className="font-medium text-slate-900">{event.title}</span>.
                </>
              ) : (
                <>
                  You are about to book{' '}
                  <span className="font-medium text-slate-900">{event.title}</span>.
                </>
              )}
            </p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {isBooked ? (
                <p>
                  Your booking will be cancelled immediately. Any refund behavior
                  will follow backend rules.
                </p>
              ) : (
                <>
                  <p>
                    <span className="font-medium text-slate-900">
                      Credits to deduct:
                    </span>{' '}
                    {event.price}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium text-slate-900">
                      Credits left after booking:
                    </span>{' '}
                    {creditsLeftAfterBooking ?? '-'}
                  </p>
                </>
              )}
            </div>

            {bookingModalError ? (
              <p className="mt-4 text-sm text-red-600">{bookingModalError}</p>
            ) : null}

            {bookingModalSuccess ? (
              <p className="mt-4 text-sm text-green-600">{bookingModalSuccess}</p>
            ) : null}

            {bookingModalMessage ? (
              <p className="mt-4 text-sm text-slate-600">{bookingModalMessage}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {isBooked ? (
                <Button
                  className="w-auto px-5"
                  onClick={handleCancelBooking}
                  disabled={isBookingLoading}
                >
                  {isBookingLoading ? 'Cancelling...' : 'Confirm Cancel'}
                </Button>
              ) : (
                <Button
                  className="w-auto px-5"
                  onClick={handleConfirmBooking}
                  disabled={isBookingLoading}
                >
                  {isBookingLoading ? 'Confirming...' : 'Confirm Booking'}
                </Button>
              )}

              <Button
                variant="secondary"
                className="w-auto px-5"
                onClick={() => setIsBookingModalOpen(false)}
                disabled={isBookingLoading}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}