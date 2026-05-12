'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Link2, RefreshCw, Unplug } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import {
  disconnectGoogleCalendar,
  getCalendarStatus,
  getGoogleCalendarAuthUrl,
  syncMyBookingsToCalendar,
} from '@lib/api/calendar';
import type {
  BookingCalendarSyncItem,
  CalendarConnectionStatus,
} from '@mytypes/calendar';

function formatDate(value: string | null) {
  if (!value) return '-';

  return new Date(value).toLocaleString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function UserCalendarPage() {
  const [status, setStatus] = useState<CalendarConnectionStatus | null>(null);
  const [syncItems, setSyncItems] = useState<BookingCalendarSyncItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const connectedParam = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('connected');
  }, []);

  async function loadStatus() {
    const result = await getCalendarStatus();
    setStatus(result);
  }

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        await loadStatus();

        if (connectedParam === '1') {
          setMessage('Google Calendar connected successfully.');
          window.history.replaceState(null, '', '/user/calendar');
        } else if (connectedParam === '0') {
          setError('Google Calendar connection failed. Please try again.');
          window.history.replaceState(null, '', '/user/calendar');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load calendar status'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [connectedParam]);

  async function handleConnect() {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');

      const result = await getGoogleCalendarAuthUrl();
      window.location.href = result.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to start Google connection'
      );
      setActionLoading(false);
    }
  }

  async function handleDisconnect() {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');

      await disconnectGoogleCalendar();
      await loadStatus();
      setSyncItems([]);
      setMessage('Google Calendar disconnected.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to disconnect calendar'
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSyncBookings() {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');

      const result = await syncMyBookingsToCalendar();
      setSyncItems(result.items);
      setMessage(`Synced ${result.count} booking${result.count === 1 ? '' : 's'}.`);
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync bookings');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <PageSkeleton />;
  }

  const isConnected = Boolean(status?.connected);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Calendar Sync
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Connect Google Calendar so booked events are added automatically.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <CalendarCheck size={22} />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Google Calendar
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {isConnected ? 'Connected' : 'Not connected'}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Last updated: {formatDate(status?.updatedAt ?? null)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {isConnected ? (
              <>
                <Button
                  className="w-auto px-5"
                  onClick={handleSyncBookings}
                  disabled={actionLoading}
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw size={16} />
                    Sync Bookings
                  </span>
                </Button>

                <Button
                  variant="secondary"
                  className="w-auto px-5"
                  onClick={handleDisconnect}
                  disabled={actionLoading}
                >
                  <span className="flex items-center gap-2">
                    <Unplug size={16} />
                    Disconnect
                  </span>
                </Button>
              </>
            ) : (
              <Button
                className="w-auto px-5"
                onClick={handleConnect}
                disabled={actionLoading}
              >
                <span className="flex items-center gap-2">
                  <Link2 size={16} />
                  Connect Google
                </span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {syncItems.length > 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            Latest sync results
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[1fr_1fr_1fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Booking</span>
              <span>Status</span>
              <span>Synced at</span>
            </div>

            {syncItems.map((item) => (
              <div
                key={item.bookingId}
                className="grid grid-cols-[1fr_1fr_1fr] border-t border-slate-200 px-4 py-3 text-sm text-slate-700"
              >
                <span>#{item.bookingId}</span>
                <span>{item.status}</span>
                <span>{formatDate(item.syncedAt)}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
