export type EventSource = 'INTERNAL' | 'EXTERNAL';

export interface EventItem {
  id: number;
  ownerId: number;
  ownerName: string;
  title: string;
  description: string;
  bannerUrl: string | null;
  categoryId: number;
  categoryName?: string;
  venue: string;
  address: string;
  city: string;
  startsAt: string;
  endsAt: string;
  price: number;
  pax: number;
  source: EventSource;
  sourceName: string | null;
  externalEventId: string | null;
  externalUrl: string | null;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetPublicEventsResponse {
  count: number;
  items: EventItem[];
}