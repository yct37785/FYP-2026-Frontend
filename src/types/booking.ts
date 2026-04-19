export interface BookingItem {
  id: number;
  userId: number;
  eventId: number;
  eventTitle: string;
  eventPrice: number;
  creditsSpent: number;
  eventStartsAt: string;
  eventEndsAt: string;
  eventVenue: string;
  eventCity: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStatusItem {
  isBooked: boolean;
  bookingId: number | null;
}