import { apiFetch } from '@lib/api/client';
import type {
  BookingCalendarSyncItem,
  CalendarConnectionStatus,
} from '@mytypes/calendar';

export function getGoogleCalendarAuthUrl(): Promise<{ url: string }> {
  return apiFetch<{ url: string }>('/calendar/google/auth-url', {
    method: 'GET',
    auth: true,
  });
}

export function getCalendarStatus(): Promise<CalendarConnectionStatus> {
  return apiFetch<CalendarConnectionStatus>('/calendar/status', {
    method: 'GET',
    auth: true,
  });
}

export function disconnectGoogleCalendar(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/calendar/google/disconnect', {
    method: 'DELETE',
    auth: true,
  });
}

export function syncMyBookingsToCalendar(): Promise<{
  count: number;
  items: BookingCalendarSyncItem[];
}> {
  return apiFetch<{ count: number; items: BookingCalendarSyncItem[] }>(
    '/calendar/sync-bookings',
    {
      method: 'POST',
      auth: true,
    }
  );
}
