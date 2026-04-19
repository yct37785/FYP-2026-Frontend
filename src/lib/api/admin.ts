import { apiFetch } from '@lib/api/client';
import type { GetAdminReportsResponse } from '@mytypes/admin';
import type { SyncItem } from '@mytypes/sync';

export function getAdminReports(): Promise<GetAdminReportsResponse> {
  return apiFetch<GetAdminReportsResponse>('/admin/reports', {
    method: 'GET',
    auth: true,
  });
}

export function dismissAdminReport(
  reportId: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/reports/${reportId}/dismiss`, {
    method: 'POST',
    auth: true,
  });
}

export function resolveAdminEventReport(
  reportId: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    `/admin/reports/${reportId}/resolve-event`,
    {
      method: 'POST',
      auth: true,
    }
  );
}

export function resolveAdminReviewReport(
  reportId: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    `/admin/reports/${reportId}/resolve-review`,
    {
      method: 'POST',
      auth: true,
    }
  );
}

export function getAdminSyncLogs(): Promise<{
  count: number;
  items: SyncItem[];
}> {
  return apiFetch<{ count: number; items: SyncItem[] }>('/admin/sync-logs', {
    method: 'GET',
    auth: true,
  });
}