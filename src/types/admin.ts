import type { ReportStatus } from '@mytypes/report';

export interface AdminReportItem {
  id: number;
  userId: number;
  reporterName: string;
  reporterEmail: string;
  eventId: number | null;
  eventTitle: string | null;
  reviewId: number | null;
  reviewComment: string | null;
  reviewRating: number | null;
  reviewIsSuspended: boolean | null;
  reviewAuthorId: number | null;
  reviewAuthorName: string | null;
  reviewEventId: number | null;
  reviewEventTitle: string | null;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminReportsResponse {
  count: number;
  items: AdminReportItem[];
}