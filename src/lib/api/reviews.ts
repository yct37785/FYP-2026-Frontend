import { apiFetch } from '@lib/api/client';
import type { GetEventReviewsResponse } from '@mytypes/review';

export function getEventReviews(eventId: number): Promise<GetEventReviewsResponse> {
  return apiFetch<GetEventReviewsResponse>(`/reviews/events/${eventId}`, {
    method: 'GET',
  });
}