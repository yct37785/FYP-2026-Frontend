export interface ReviewItem {
  id: number;
  userId: number;
  userName: string;
  eventId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetEventReviewsResponse {
  count: number;
  items: ReviewItem[];
}