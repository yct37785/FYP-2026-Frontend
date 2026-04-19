import { apiFetch } from '@lib/api/client';
import type { EventItem } from '@mytypes/event';
import type { WaitlistStatusItem } from '@mytypes/waitlist';

export function createWaitlist(eventId: number): Promise<EventItem> {
  return apiFetch<EventItem>(`/waitlists/events/${eventId}`, {
    method: 'POST',
    auth: true,
  });
}

export function getMyWaitlists(): Promise<{ count: number; items: EventItem[] }> {
  return apiFetch<{ count: number; items: EventItem[] }>('/waitlists/mine', {
    method: 'GET',
    auth: true,
  });
}

export function getWaitlistStatus(eventId: number): Promise<WaitlistStatusItem> {
  return apiFetch<WaitlistStatusItem>(`/waitlists/events/${eventId}/status`, {
    method: 'GET',
    auth: true,
  });
}

export function deleteMyWaitlist(waitlistId: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/waitlists/mine/${waitlistId}`, {
    method: 'DELETE',
    auth: true,
  });
}