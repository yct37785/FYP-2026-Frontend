import { apiFetch } from '@lib/api/client';
import type { EventItem } from '@mytypes/event';

export interface GetMyOrganizerEventsResponse {
  count: number;
  items: EventItem[];
}

export interface CreateOrganizerEventInput {
  title: string;
  description: string;
  bannerUrl?: string | null;
  categoryId: number;
  venue: string;
  address: string;
  city: string;
  startsAt: string;
  endsAt: string;
  price: number;
  pax: number;
}

export interface UpdateOrganizerEventInput {
  title?: string;
  description?: string;
  bannerUrl?: string | null;
  categoryId?: number;
  venue?: string;
  address?: string;
  city?: string;
  startsAt?: string;
  endsAt?: string;
  price?: number;
  pax?: number;
}

export function getMyOrganizerEvents(): Promise<GetMyOrganizerEventsResponse> {
  return apiFetch<GetMyOrganizerEventsResponse>('/events/mine', {
    method: 'GET',
    auth: true,
  });
}

export function getMyOrganizerEventById(eventId: number): Promise<EventItem> {
  return apiFetch<EventItem>(`/events/mine/${eventId}`, {
    method: 'GET',
    auth: true,
  });
}

export function createOrganizerEvent(
  payload: CreateOrganizerEventInput
): Promise<EventItem> {
  return apiFetch<EventItem>('/events', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function updateMyOrganizerEvent(
  eventId: number,
  payload: UpdateOrganizerEventInput
): Promise<EventItem> {
  return apiFetch<EventItem>(`/events/mine/${eventId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function deleteMyOrganizerEvent(
  eventId: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/events/mine/${eventId}`, {
    method: 'DELETE',
    auth: true,
  });
}