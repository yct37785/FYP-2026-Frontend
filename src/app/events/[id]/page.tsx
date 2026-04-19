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
import {
  ActionStatusModal,
  type ActionModalMode,
} from '@components/ui/ActionStatusModal';
import { ReviewList } from '@components/event/ReviewList';
import { getPublicEventById } from '@lib/api/events';
import { getEventReviews } from '@lib/api/reviews';
import {
  createBooking,
  deleteMyBooking,
  getBookingStatus,
} from '@lib/api/bookings';
import {
  createFavorite,
  deleteMyFavorite,
  getFavoriteStatus,
} from '@lib/api/favorites';
import {
  createWaitlist,
  deleteMyWaitlist,
  getWaitlistStatus,
} from '@lib/api/waitlists';
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

  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [waitlistId, setWaitlistId] = useState<number | null>(null);

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] =
    useState<ActionModalMode>('confirm-book');
  const [modalMessage, setModalMessage] = useState('');

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
        setIsWaitlisted(false);
        setWaitlistId(null);
        return;
      }

      try {
        const [favoriteStatus, bookingStatus, waitlistStatus, currentProfile] =
          await Promise.all([
            getFavoriteStatus(eventId),
            getBookingStatus(eventId),
            getWaitlistStatus(eventId),
            getMyProfile(),
          ]);

        setIsFavorited(favoriteStatus.isFavorited);
        setFavoriteId(favoriteStatus.favoriteId);

        setIsBooked(bookingStatus.isBooked);
        setBookingId(bookingStatus.bookingId);

        setIsWaitlisted(waitlistStatus.isWaitlisted);
        setWaitlistId(waitlistStatus.waitlistId);

        setProfile(currentProfile);
      } catch {
        setProfile(null);
        setIsFavorited(false);
        setFavoriteId(null);
        setIsBooked(false);
        setBookingId(null);
        setIsWaitlisted(false);
        setWaitlistId(null);
      }
    }

    void loadAuthedState();
  }, [hasToken, eventId]);

  async function refreshEvent() {
    if (Number.isNaN(eventId)) return;
    const refreshed = await getPublicEventById(eventId);
    setEvent(refreshed);
  }

  async function refreshStatuses() {
    if (!hasToken || Number.isNaN(eventId)) return;

    const [bookingStatus, waitlistStatus, favoriteStatus] = await Promise.all([
      getBookingStatus(eventId),
      getWaitlistStatus(eventId),
      getFavoriteStatus(eventId),
    ]);

    setIsBooked(bookingStatus.isBooked);
    setBookingId(bookingStatus.bookingId);

    setIsWaitlisted(waitlistStatus.isWaitlisted);
    setWaitlistId(waitlistStatus.waitlistId);

    setIsFavorited(favoriteStatus.isFavorited);
    setFavoriteId(favoriteStatus.favoriteId);
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
      window.alert(
        err instanceof Error ? err.message : 'Failed to update favorite'
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  function requireLoginOr(action: () => void) {
    if (!hasToken) {
      router.push('/login');
      return;
    }

    action();
  }

  function openModal(mode: ActionModalMode) {
    setModalMode(mode);
    setModalMessage('');
    setModalOpen(true);
  }

  async function handleConfirmModalAction() {
    if (!event) return;

    try {
      setIsActionLoading(true);
      setModalMessage('');

      if (modalMode === 'confirm-book') {
        await createBooking(event.id);
        await Promise.all([refreshEvent(), refreshStatuses(), refreshProfile()]);
        setModalMode('book-success');
        setModalMessage('Your booking has been confirmed.');
        return;
      }

      if (modalMode === 'confirm-cancel-booking' && bookingId) {
        await deleteMyBooking(bookingId);
        await Promise.all([refreshEvent(), refreshStatuses(), refreshProfile()]);
        setModalMode('cancel-booking-success');
        setModalMessage('Your booking has been cancelled.');
        return;
      }

      if (modalMode === 'confirm-waitlist') {
        await createWaitlist(event.id);
        await Promise.all([refreshEvent(), refreshStatuses()]);
        setModalMode('waitlist-success');
        setModalMessage('You have joined the waitlist successfully.');
        return;
      }

      if (modalMode === 'confirm-cancel-waitlist' && waitlistId) {
        await deleteMyWaitlist(waitlistId);
        await Promise.all([refreshEvent(), refreshStatuses()]);
        setModalMode('cancel-waitlist-success');
        setModalMessage('You have left the waitlist.');
        return;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Action failed. Please try again.';

      if (modalMode === 'confirm-book') {
        setModalMode('book-error');
      } else if (modalMode === 'confirm-cancel-booking') {
        setModalMode('cancel-booking-error');
      } else if (modalMode === 'confirm-waitlist') {
        setModalMode('waitlist-error');
      } else if (modalMode === 'confirm-cancel-waitlist') {
        setModalMode('cancel-waitlist-error');
      }

      setModalMessage(message);
    } finally {
      setIsActionLoading(false);
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

  const currentEvent = event;
  const mapsUrl = buildGoogleMapsUrl(currentEvent);
  const isFull =
    currentEvent.totalBookings !== null &&
    currentEvent.totalBookings >= currentEvent.pax;
  const remainingSlots =
    currentEvent.totalBookings !== null
      ? Math.max(currentEvent.pax - currentEvent.totalBookings, 0)
      : null;
  const creditsLeftAfterBooking = profile
    ? Math.max(profile.credits - currentEvent.price, 0)
    : null;

  function getModalConfig() {
    switch (modalMode) {
      case 'confirm-book':
        return {
          title: 'Confirm booking',
          description: `You are about to book ${currentEvent.title}.`,
          details: (
            <>
              <p>
                <span className="font-medium text-slate-900">
                  Credits to deduct:
                </span>{' '}
                {currentEvent.price}
              </p>
              <p className="mt-2">
                <span className="font-medium text-slate-900">
                  Credits left after booking:
                </span>{' '}
                {creditsLeftAfterBooking ?? '-'}
              </p>
            </>
          ),
          confirmLabel: 'Confirm Booking',
          hideConfirm: false,
          messageTone: 'neutral' as const,
        };

      case 'book-success':
        return {
          title: 'Booking confirmed',
          description: `Your booking for ${currentEvent.title} has been confirmed.`,
          details: undefined,
          confirmLabel: 'Confirm',
          hideConfirm: true,
          messageTone: 'success' as const,
        };

      case 'book-error':
        return {
          title: 'Booking failed',
          description: `We could not complete your booking for ${currentEvent.title}.`,
          details: undefined,
          confirmLabel: 'Confirm',
          hideConfirm: true,
          messageTone: 'error' as const,
        };

      case 'confirm-cancel-booking':
        return {
          title: 'Cancel booking',
          description: `You are about to cancel your booking for ${currentEvent.title}.`,
          details: <p>Any refund behavior will follow backend rules.</p>,
          confirmLabel: 'Confirm Cancel',
          hideConfirm: false,
          messageTone: 'neutral' as const,
        };

      case 'cancel-booking-success':
        return {
          title: 'Booking cancelled',
          description: `Your booking for ${currentEvent.title} has been cancelled.`,
          details: undefined,
          confirmLabel: 'Confirm',
          hideConfirm: true,
          messageTone: 'success' as const,
        };

      case 'cancel-booking-error':
        return {
          title: 'Cancel booking failed',
          description: `We could not cancel your booking for ${currentEvent.title}.`,
          details: undefined,
          confirmLabel: 'Confirm',
          hideConfirm: true,
          messageTone: 'error' as const,
        };

      case 'confirm-waitlist':
        return {
          title: 'Join waitlist',
          description: `This event is full. Join the waitlist for ${currentEvent.title}?`,
          details: (
            <p>
              You will be notified if a slot becomes available and you are
              promoted.
            </p>
          ),
          confirmLabel: 'Join Waitlist',
          hideConfirm: false,
          messageTone: 'neutral' as const,
        };

      case 'waitlist-success':
        return {
          title: 'Waitlist joined',
          description: `You have joined the waitlist for ${currentEvent.title}.`,
          details: undefined,
          confirmLabel: 'Confirm',
          hideConfirm: true,
          messageTone: 'success' as const,
        };

      case 'waitlist-error':
        return {
          title: 'Waitlist action failed',
          description: `We could not add you to the waitlist for ${currentEvent.title}.`,
          details: undefined,
          confirmLabel: 'Confirm',
          hideConfirm: true,
          messageTone: 'error' as const,
        };

      case 'confirm-cancel-waitlist':
        return {
          title: 'Leave waitlist',
          description: `You are about to leave the waitlist for ${currentEvent.title}.`,
          details: undefined,
          confirmLabel: 'Leave Waitlist',
          hideConfirm: false,
          messageTone: 'neutral' as const,
        };

      case 'cancel-waitlist-success':
        return {
          title: 'Waitlist removed',
          description: `You have left the waitlist for ${currentEvent.title}.`,
          details: undefined,
          confirmLabel: 'Confirm',
          hideConfirm: true,
          messageTone: 'success' as const,
        };

      case 'cancel-waitlist-error':
        return {
          title: 'Leave waitlist failed',
          description: `We could not remove you from the waitlist for ${currentEvent.title}.`,
          details: undefined,
          confirmLabel: 'Confirm',
          hideConfirm: true,
          messageTone: 'error' as const,
        };
    }
  }

  const modalConfig = getModalConfig();

  return (
    <>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <PublicNavbar keyword={keyword} onKeywordChange={setKeyword} />

        <div className={styles.layout.content}>
          <div className="space-y-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="min-h-[320px] bg-slate-200">
                  {currentEvent.bannerUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentEvent.bannerUrl}
                      alt={currentEvent.title}
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
                      {currentEvent.categoryName || 'Event'}
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900">
                      {currentEvent.title}
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {currentEvent.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {currentEvent.source === 'EXTERNAL' &&
                      currentEvent.externalUrl ? (
                        <a
                          href={currentEvent.externalUrl}
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
                            onClick={() => openModal('confirm-cancel-booking')}
                          >
                            Cancel Booking
                          </Button>
                        ) : isFull ? (
                          isWaitlisted ? (
                            <Button
                              variant="secondary"
                              className="w-auto px-5"
                              onClick={() =>
                                openModal('confirm-cancel-waitlist')
                              }
                            >
                              Leave Waitlist
                            </Button>
                          ) : (
                            <>
                              <Button className="w-auto px-5" disabled>
                                Event is Full
                              </Button>

                              <Button
                                variant="secondary"
                                className="w-auto px-5"
                                onClick={() => openModal('confirm-waitlist')}
                              >
                                Join Waitlist
                              </Button>
                            </>
                          )
                        ) : (
                          <Button
                            className="w-auto px-5"
                            onClick={() => openModal('confirm-book')}
                          >
                            Book Event
                          </Button>
                        )
                      ) : (
                        <Button
                          className="w-auto px-5"
                          onClick={() =>
                            requireLoginOr(() => openModal('confirm-book'))
                          }
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
                    {currentEvent.description}
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
                          {formatDateRange(
                            currentEvent.startsAt,
                            currentEvent.endsAt
                          )}
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
                          {currentEvent.venue}
                          <br />
                          {currentEvent.address}
                          <br />
                          {currentEvent.city}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Ticket size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Price</p>
                        <p className="mt-1 text-slate-600">
                          {formatPrice(currentEvent.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <UserRound size={18} className="mt-0.5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Organizer</p>
                        <p className="mt-1 text-slate-600">
                          {currentEvent.ownerName}
                        </p>
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
                      {currentEvent.categoryName || '-'}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Pax:</span>{' '}
                      {currentEvent.pax}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Booked:</span>{' '}
                      {currentEvent.totalBookings ?? '-'}
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
                      {currentEvent.source}
                    </p>
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <ActionStatusModal
        open={modalOpen}
        title={modalConfig.title}
        description={modalConfig.description}
        details={modalConfig.details}
        message={modalMessage}
        messageTone={modalConfig.messageTone}
        confirmLabel={modalConfig.confirmLabel}
        hideConfirm={modalConfig.hideConfirm}
        isLoading={isActionLoading}
        onConfirm={handleConfirmModalAction}
        onClose={() => {
          setModalOpen(false);
          setModalMessage('');
        }}
      />
    </>
  );
}