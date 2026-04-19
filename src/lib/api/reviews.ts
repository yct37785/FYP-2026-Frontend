import { apiFetch } from '@lib/api/client';
import type {
  GetEventReviewsResponse,
  GetMyReviewsResponse,
  ReviewItem,
} from '@mytypes/review';

export interface ReviewUpsertInput {
  rating: number;
  comment: string;
}

export function getEventReviews(
  eventId: number
): Promise<GetEventReviewsResponse> {
  return apiFetch<GetEventReviewsResponse>(`/reviews/events/${eventId}`, {
    method: 'GET',
  });
}

export function getMyReviews(): Promise<GetMyReviewsResponse> {
  return apiFetch<GetMyReviewsResponse>('/reviews/mine', {
    method: 'GET',
    auth: true,
  });
}

export function createReview(
  eventId: number,
  payload: ReviewUpsertInput
): Promise<ReviewItem> {
  return apiFetch<ReviewItem>(`/reviews/events/${eventId}`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function updateMyReview(
  reviewId: number,
  payload: ReviewUpsertInput
): Promise<ReviewItem> {
  return apiFetch<ReviewItem>(`/reviews/mine/${reviewId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function deleteMyReview(
  reviewId: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/reviews/mine/${reviewId}`, {
    method: 'DELETE',
    auth: true,
  });
}