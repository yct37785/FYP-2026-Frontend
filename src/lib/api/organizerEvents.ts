import { apiFetch } from '@lib/api/client';
import type { EventItem } from '@mytypes/event';

export interface GetMyOrganizerEventsResponse {
  count: number;
  items: EventItem[];
}

export function getMyOrganizerEvents(): Promise<GetMyOrganizerEventsResponse> {
  return apiFetch<GetMyOrganizerEventsResponse>('/events/mine', {
    method: 'GET',
    auth: true,
  });
}