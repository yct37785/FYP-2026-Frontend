'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import {
  dismissAdminReport,
  getAdminReports,
  resolveAdminEventReport,
  resolveAdminReviewReport,
} from '@lib/api/admin';
import type { AdminReportItem } from '@mytypes/admin';

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStatusClass(status: AdminReportItem['status']) {
  if (status === 'RESOLVED') {
    return 'bg-green-100 text-green-700';
  }

  if (status === 'DISMISSED') {
    return 'bg-slate-200 text-slate-700';
  }

  return 'bg-amber-100 text-amber-700';
}

function renderStars(rating: number | null) {
  if (rating === null) return '-';
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default function AdminReportsPage() {
  const [items, setItems] = useState<AdminReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  async function loadReports() {
    try {
      setLoading(true);
      setError('');

      const result = await getAdminReports();
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReports();
  }, []);

  async function handleDismiss(reportId: number) {
    try {
      setPendingAction(`dismiss-${reportId}`);
      setActionMessage('');
      setError('');

      const result = await dismissAdminReport(reportId);
      setActionMessage(result.message);
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss report');
    } finally {
      setPendingAction(null);
    }
  }

  async function handleResolveEvent(reportId: number) {
    try {
      setPendingAction(`resolve-event-${reportId}`);
      setActionMessage('');
      setError('');

      const result = await resolveAdminEventReport(reportId);
      setActionMessage(result.message);
      await loadReports();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to resolve event report'
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleResolveReview(reportId: number) {
    try {
      setPendingAction(`resolve-review-${reportId}`);
      setActionMessage('');
      setError('');

      const result = await resolveAdminReviewReport(reportId);
      setActionMessage(result.message);
      await loadReports();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to resolve review report'
      );
    } finally {
      setPendingAction(null);
    }
  }

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review submitted reports and decide whether to dismiss or resolve them.
        </p>
      </div>

      {actionMessage ? (
        <Card>
          <p className="text-sm text-green-600">{actionMessage}</p>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : null}

      {items.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">No reports</h2>
          <p className="mt-2 text-sm text-slate-600">
            Submitted reports will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((report) => {
            const isEventReport = Boolean(report.eventId);
            const isOpen = report.status === 'OPEN';

            return (
              <Card key={report.id}>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Report #{report.id}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {isEventReport ? 'Event Report' : 'Review Report'}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Reporter
                        </p>
                        <p className="mt-1 text-sm text-slate-900">
                          {report.reporterName} ({report.reporterEmail})
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Reason
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {report.reason}
                        </p>
                        {report.details ? (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {report.details}
                          </p>
                        ) : null}
                      </div>

                      {isEventReport ? (
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            Reported Event
                          </p>
                          {report.eventId ? (
                            <Link
                              href={`/events/${report.eventId}`}
                              className="mt-1 inline-block text-sm font-medium text-slate-900 underline underline-offset-2 transition hover:text-slate-700"
                            >
                              {report.eventTitle || `Event #${report.eventId}`}
                            </Link>
                          ) : (
                            <p className="mt-1 text-sm text-slate-600">-</p>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-500">
                            Reported Review
                          </p>

                          <div className="mt-3 space-y-2">
                            <p className="text-sm text-slate-900">
                              <span className="font-medium">Author:</span>{' '}
                              {report.reviewAuthorName || '-'}
                            </p>
                            <p className="text-sm text-slate-900">
                              <span className="font-medium">Event:</span>{' '}
                              {report.reviewEventId ? (
                                <Link
                                  href={`/events/${report.reviewEventId}`}
                                  className="underline underline-offset-2"
                                >
                                  {report.reviewEventTitle ||
                                    `Event #${report.reviewEventId}`}
                                </Link>
                              ) : (
                                '-'
                              )}
                            </p>
                            <p className="text-sm text-amber-500">
                              {renderStars(report.reviewRating)}
                            </p>
                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                              {report.reviewComment || '-'}
                            </p>
                            <p className="text-xs text-slate-500">
                              Suspended:{' '}
                              {report.reviewIsSuspended ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Submitted
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(report.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Last Updated
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(report.updatedAt)}
                        </p>
                      </div>

                      {isOpen ? (
                        <div className="flex flex-wrap gap-3 pt-2">
                          <Button
                            variant="secondary"
                            className="w-auto px-4 py-2"
                            onClick={() => handleDismiss(report.id)}
                            disabled={pendingAction !== null}
                          >
                            {pendingAction === `dismiss-${report.id}`
                              ? 'Processing...'
                              : 'Dismiss'}
                          </Button>

                          {isEventReport ? (
                            <Button
                              className="w-auto px-4 py-2"
                              onClick={() => handleResolveEvent(report.id)}
                              disabled={pendingAction !== null}
                            >
                              {pendingAction === `resolve-event-${report.id}`
                                ? 'Processing...'
                                : 'Resolve & Suspend Event'}
                            </Button>
                          ) : (
                            <Button
                              className="w-auto px-4 py-2"
                              onClick={() => handleResolveReview(report.id)}
                              disabled={pendingAction !== null}
                            >
                              {pendingAction === `resolve-review-${report.id}`
                                ? 'Processing...'
                                : 'Resolve & Suspend Review'}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          This report has already been processed.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}