import { apiFetch } from '@lib/api/client';
import type {
  GetMyReportsResponse,
  ReportItem,
  UpdateMyReportInput,
} from '@mytypes/report';

export interface CreateReportInput {
  reason: string;
  details?: string | null;
}

export function createEventReport(
  eventId: number,
  payload: CreateReportInput
): Promise<ReportItem> {
  return apiFetch<ReportItem>(`/reports/events/${eventId}`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function createReviewReport(
  reviewId: number,
  payload: CreateReportInput
): Promise<ReportItem> {
  return apiFetch<ReportItem>(`/reports/reviews/${reviewId}`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function getMyReports(): Promise<GetMyReportsResponse> {
  return apiFetch<GetMyReportsResponse>('/reports/mine', {
    method: 'GET',
    auth: true,
  });
}

export function updateMyReport(
  reportId: number,
  payload: UpdateMyReportInput
): Promise<ReportItem> {
  return apiFetch<ReportItem>(`/reports/mine/${reportId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function deleteMyReport(
  reportId: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/reports/mine/${reportId}`, {
    method: 'DELETE',
    auth: true,
  });
}