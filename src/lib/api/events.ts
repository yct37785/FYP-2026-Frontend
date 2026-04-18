import { apiFetch } from '@lib/api/client';
import type { GetPublicEventsResponse } from '@mytypes/event';

export interface GetPublicEventsParams {
  categoryId?: number;
  city?: string;
  venue?: string;
  minPrice?: number;
  maxPrice?: number;
  startsFrom?: string;
  startsTo?: string;
  keyword?: string;
}

function buildQuery(params: GetPublicEventsParams): string {
  const searchParams = new URLSearchParams();

  if (params.categoryId !== undefined) {
    searchParams.set('category_id', String(params.categoryId));
  }

  if (params.city) {
    searchParams.set('city', params.city);
  }

  if (params.venue) {
    searchParams.set('venue', params.venue);
  }

  if (params.minPrice !== undefined) {
    searchParams.set('min_price', String(params.minPrice));
  }

  if (params.maxPrice !== undefined) {
    searchParams.set('max_price', String(params.maxPrice));
  }

  if (params.startsFrom) {
    searchParams.set('starts_from', params.startsFrom);
  }

  if (params.startsTo) {
    searchParams.set('starts_to', params.startsTo);
  }

  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function getPublicEvents(
  params: GetPublicEventsParams = {}
): Promise<GetPublicEventsResponse> {
  return apiFetch<GetPublicEventsResponse>(`/events/public${buildQuery(params)}`, {
    method: 'GET',
  });
}