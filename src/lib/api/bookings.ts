import { apiFetch } from '@lib/api/client';
import type { BookingItem, BookingStatusItem } from '@mytypes/booking';

export function createBooking(eventId: number): Promise<BookingItem> {
  return apiFetch<BookingItem>(`/bookings/events/${eventId}`, {
    method: 'POST',
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