'use client';

import { Button } from '@components/ui/Button';

export type ActionModalMode =
  | 'confirm-book'
  | 'book-success'
  | 'book-error'
  | 'confirm-cancel-booking'
  | 'cancel-booking-success'
  | 'cancel-booking-error'
  | 'confirm-waitlist'
  | 'waitlist-success'
  | 'waitlist-error'
  | 'confirm-cancel-waitlist'
  | 'cancel-waitlist-success'
  | 'cancel-waitlist-error';

interface ActionStatusModalProps {
  open: boolean;
  title: string;
  description: string;
  details?: React.ReactNode;
  message?: string;
  messageTone?: 'success' | 'error' | 'neutral';
  confirmLabel?: string;
  closeLabel?: string;
  isLoading?: boolean;
  hideConfirm?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}

export function ActionStatusModal({
  open,
  title,
  description,
  details,
  message,
  messageTone = 'neutral',
  confirmLabel = 'Confirm',
  closeLabel = 'Close',
  isLoading = false,
  hideConfirm = false,
  onConfirm,
  onClose,
}: ActionStatusModalProps) {
  if (!open) {
    return null;
  }

  const messageClass =
    messageTone === 'success'
      ? 'text-green-600'
      : messageTone === 'error'
      ? 'text-red-600'
      : 'text-slate-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

        {details ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {details}
          </div>
        ) : null}

        {message ? <p className={`mt-4 text-sm ${messageClass}`}>{message}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {!hideConfirm ? (
            <Button
              className="w-auto px-5"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </Button>
          ) : null}

          <Button
            variant="secondary"
            className="w-auto px-5"
            onClick={onClose}
            disabled={isLoading}
          >
            {closeLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}