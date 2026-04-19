'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import {
  ReportModal,
  type ReportModalMode,
} from '@components/report/ReportModal';
import {
  deleteMyReport,
  getMyReports,
  updateMyReport,
} from '@lib/api/reports';
import type { ReportItem } from '@mytypes/report';

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getReportTarget(report: ReportItem) {
  if (report.eventId) {
    return {
      label: `Event #${report.eventId}`,
      href: `/events/${report.eventId}`,
    };
  }

  if (report.reviewId) {
    return {
      label: `Review #${report.reviewId}`,
      href: null,
    };
  }

  return {
    label: 'Unknown target',
    href: null,
  };
}

function getStatusClass(status: ReportItem['status']) {
  if (status === 'RESOLVED') {
    return 'bg-green-100 text-green-700';
  }

  if (status === 'DISMISSED') {
    return 'bg-slate-200 text-slate-700';
  }

  return 'bg-amber-100 text-amber-700';
}

export default function UserReportsPage() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ReportModalMode>('edit');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyReports();
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    }

    void loadReports();
  }, []);

  function openEditModal(report: ReportItem) {
    setSelectedReport(report);
    setModalMode('edit');
    setModalError('');
    setModalOpen(true);
  }

  function openDeleteModal(report: ReportItem) {
    setSelectedReport(report);
    setModalMode('delete');
    setModalError('');
    setModalOpen(true);
  }

  async function handleSubmit(payload: { reason: string; details: string }) {
    if (!selectedReport) return;

    try {
      setIsSubmitting(true);
      setModalError('');

      const updated = await updateMyReport(selectedReport.id, {
        reason: payload.reason,
        details: payload.details ? payload.details : null,
      });

      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setModalOpen(false);
      setSelectedReport(null);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update report');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedReport) return;

    try {
      setIsSubmitting(true);
      setModalError('');

      await deleteMyReport(selectedReport.id);

      setItems((prev) => prev.filter((item) => item.id !== selectedReport.id));

      setModalOpen(false);
      setSelectedReport(null);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to delete report');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review and manage the reports you have submitted.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : null}

      {items.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">No reports yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Reports you submit will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((report) => {
            const target = getReportTarget(report);

            return (
              <Card key={report.id}>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {target.href ? (
                        <Link
                          href={target.href}
                          className="text-base font-semibold text-slate-900 transition hover:text-slate-700"
                        >
                          {target.label}
                        </Link>
                      ) : (
                        <span className="text-base font-semibold text-slate-900">
                          {target.label}
                        </span>
                      )}

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {report.eventId ? 'Event Report' : 'Review Report'}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-900">
                      {report.reason}
                    </p>

                    {report.details ? (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {report.details}
                      </p>
                    ) : null}

                    <p className="mt-3 text-xs text-slate-500">
                      Updated {formatDate(report.updatedAt || report.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-3">
                    <Button
                      variant="secondary"
                      className="w-auto px-4 py-2"
                      onClick={() => openEditModal(report)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="secondary"
                      className="w-auto px-4 py-2"
                      onClick={() => openDeleteModal(report)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ReportModal
        open={modalOpen}
        mode={modalMode}
        report={selectedReport}
        isLoading={isSubmitting}
        error={modalError}
        onClose={() => {
          setModalOpen(false);
          setSelectedReport(null);
          setModalError('');
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}