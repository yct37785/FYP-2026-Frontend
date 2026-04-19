import { apiFetch } from '@lib/api/client';
import type { EventItem } from '@mytypes/event';
import type { FavoriteStatusItem } from '@mytypes/favorite';

export function createFavorite(eventId: number): Promise<EventItem> {
  return apiFetch<EventItem>(`/favorites/events/${eventId}`, {
    method: 'POST',
    auth: true,
  });
}

export function getMyFavorites(): Promise<{ count: number; items: EventItem[] }> {
  return apiFetch<{ count: number; items: EventItem[] }>('/favorites/mine', {
    method: 'GET',
    auth: true,
  });
}

export function getFavoriteStatus(eventId: number): Promise<FavoriteStatusItem> {
  return apiFetch<FavoriteStatusItem>(`/favorites/events/${eventId}/status`, {
    method: 'GET',
    auth: true,
  });
}

export function deleteMyFavorite(favoriteId: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/favorites/mine/${favoriteId}`, {
    method: 'DELETE',
    auth: true,
  });
}