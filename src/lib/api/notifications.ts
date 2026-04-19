import { apiFetch } from '@lib/api/client';
import type { NotificationItem } from '@mytypes/notification';

export function getMyNotifications(from?: string): Promise<{
  count: number;
  items: NotificationItem[];
}> {
  const query = from
    ? `?from=${encodeURIComponent(from)}`
    : '';

  return apiFetch<{ count: number; items: NotificationItem[] }>(
    `/notifications/mine${query}`,
    {
      method: 'GET',
      auth: true,
    }
  );
}

export function deleteMyNotification(
  notificationId: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/notifications/mine/${notificationId}`, {
    method: 'DELETE',
    auth: true,
  });
}