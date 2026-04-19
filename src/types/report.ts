export type ReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export interface ReportItem {
  id: number;
  userId: number;
  eventId: number | null;
  eventTitle: string | null;
  reviewId: number | null;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetMyReportsResponse {
  count: number;
  items: ReportItem[];
}

export interface UpdateMyReportInput {
  reason: string;
  details?: string | null;
}