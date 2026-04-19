import { apiFetch } from '@lib/api/client';
import type { EventItem } from '@mytypes/event';
import type { BookingStatusItem } from '@mytypes/booking';

export function createBooking(eventId: number): Promise<EventItem> {
  return apiFetch<EventItem>(`/bookings/events/${eventId}`, {
    method: 'POST',
    auth: true,
  });
}

export function getMyBookings(): Promise<{ count: number; items: EventItem[] }> {
  return apiFetch<{ count: number; items: EventItem[] }>('/bookings/mine', {
    method: 'GET',
    auth: true,
  });
}

export function getBookingStatus(eventId: number): Promise<BookingStatusItem> {
  return apiFetch<BookingStatusItem>(`/bookings/events/${eventId}/status`, {
    method: 'GET',
    auth: true,
  });
}

export function deleteMyBooking(bookingId: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/bookings/mine/${bookingId}`, {
    method: 'DELETE',
    auth: true,
  });
}