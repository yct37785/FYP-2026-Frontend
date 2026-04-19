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

export interface OrganizerEventBookingItem {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  creditsSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerEventWaitlistItem {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrganizerEventBookingsResponse {
  count: number;
  items: OrganizerEventBookingItem[];
}

export interface GetOrganizerEventWaitlistsResponse {
  count: number;
  items: OrganizerEventWaitlistItem[];
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

export function getMyOrganizerEventBookings(
  eventId: number
): Promise<GetOrganizerEventBookingsResponse> {
  return apiFetch<GetOrganizerEventBookingsResponse>(
    `/events/mine/${eventId}/bookings`,
    {
      method: 'GET',
      auth: true,
    }
  );
}

export function getMyOrganizerEventWaitlists(
  eventId: number
): Promise<GetOrganizerEventWaitlistsResponse> {
  return apiFetch<GetOrganizerEventWaitlistsResponse>(
    `/events/mine/${eventId}/waitlists`,
    {
      method: 'GET',
      auth: true,
    }
  );
}