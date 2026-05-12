export type CalendarSyncStatus = 'SYNCED' | 'FAILED' | 'DELETED';

export interface CalendarConnectionStatus {
  connected: boolean;
  updatedAt: string | null;
}

export interface BookingCalendarSyncItem {
  bookingId: number;
  eventId: number;
  googleEventId: string | null;
  status: CalendarSyncStatus;
  lastError: string | null;
  syncedAt: string | null;
}
