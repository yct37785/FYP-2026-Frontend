'use client';

import { useEffect, useState } from 'react';
import { Button } from '@components/ui/Button';
import type { ReportItem } from '@mytypes/report';

export type ReportModalMode = 'create' | 'edit' | 'delete';

interface ReportModalProps {
  open: boolean;
  mode: ReportModalMode;
  report: ReportItem | null;
  titleOverride?: string;
  descriptionOverride?: string;
  isLoading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: { reason: string; details: string }) => void;
  onDelete: () => void;
}

export function ReportModal({
  open,
  mode,
  report,
  titleOverride,
  descriptionOverride,
  isLoading = false,
  error = '',
  onClose,
  onSubmit,
  onDelete,
}: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (!open) return;

    if (mode === 'create') {
      setReason('');
      setDetails('');
      return;
    }

    setReason(report?.reason ?? '');
    setDetails(report?.details ?? '');
  }, [open, mode, report]);

  if (!open) {
    return null;
  }

  if ((mode === 'edit' || mode === 'delete') && !report) {
    return null;
  }

  const title =
    titleOverride ??
    (mode === 'create'
      ? 'Report content'
      : mode === 'edit'
      ? 'Edit report'
      : 'Delete report');

  const description =
    descriptionOverride ??
    (mode === 'create'
      ? 'Tell us what is inappropriate or problematic.'
      : mode === 'edit'
      ? 'Update the report reason and details below.'
      : 'Are you sure you want to delete this report? This action cannot be undone.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>

        {mode === 'delete' ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="w-auto px-5"
              onClick={onDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Report'}
            </Button>

            <Button
              variant="secondary"
              className="w-auto px-5"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Reason
                </label>
                <input
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Short reason"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Details
                </label>
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  rows={6}
                  placeholder="Describe the issue in more detail..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="w-auto px-5"
                onClick={() =>
                  onSubmit({
                    reason: reason.trim(),
                    details: details.trim(),
                  })
                }
                disabled={isLoading || !reason.trim()}
              >
                {isLoading
                  ? mode === 'create'
                    ? 'Submitting...'
                    : 'Saving...'
                  : mode === 'create'
                  ? 'Submit Report'
                  : 'Save Changes'}
              </Button>

              <Button
                variant="secondary"
                className="w-auto px-5"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </>
        )}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}