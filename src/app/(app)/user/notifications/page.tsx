'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Card } from '@components/ui/Card';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import {
  deleteMyNotification,
  getMyNotifications,
} from '@lib/api/notifications';
import type { NotificationItem } from '@mytypes/notification';

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function UserNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyNotifications();
        setItems(result.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load notifications'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadNotifications();
  }, []);

  async function handleRead(notificationId: number) {
    try {
      setPendingId(notificationId);
      setError('');

      await deleteMyNotification(notificationId);

      setItems((prev) => prev.filter((item) => item.id !== notificationId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update notification'
      );
    } finally {
      setPendingId(null);
    }
  }

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          My Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Review your latest notifications.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : null}

      {items.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            No notifications
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            New notifications will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((notification) => (
            <Card key={notification.id}>
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">
                    {notification.message}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRead(notification.id)}
                  disabled={pendingId === notification.id}
                  className="inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Mark as read"
                  title="Mark as read"
                >
                  <Check size={22} strokeWidth={2.5} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}