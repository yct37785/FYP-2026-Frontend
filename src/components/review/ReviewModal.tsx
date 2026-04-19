'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@components/ui/Button';
import type { ReviewItem } from '@mytypes/review';

export type ReviewModalMode = 'create' | 'edit' | 'delete';

interface ReviewModalProps {
  open: boolean;
  mode: ReviewModalMode;
  review?: ReviewItem | null;
  isLoading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: { rating: number; comment: string }) => void;
  onDelete: () => void;
}

const defaultState = {
  rating: 5,
  comment: '',
};

export function ReviewModal({
  open,
  mode,
  review,
  isLoading = false,
  error = '',
  onClose,
  onSubmit,
  onDelete,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(defaultState.rating);
  const [comment, setComment] = useState<string>(defaultState.comment);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && review) {
      setRating(review.rating);
      setComment(review.comment);
      return;
    }

    if (mode === 'create') {
      setRating(defaultState.rating);
      setComment(defaultState.comment);
    }
  }, [open, mode, review]);

  const title = useMemo(() => {
    if (mode === 'create') return 'Write a review';
    if (mode === 'edit') return 'Edit review';
    return 'Delete review';
  }, [mode]);

  const description = useMemo(() => {
    if (mode === 'create') {
      return 'Share your experience for this event.';
    }

    if (mode === 'edit') {
      return 'Update your review details below.';
    }

    return 'Are you sure you want to delete this review? This action cannot be undone.';
  }, [mode]);

  if (!open) {
    return null;
  }

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
              {isLoading ? 'Deleting...' : 'Delete Review'}
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
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Review
                </label>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={6}
                  placeholder="Share your experience..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="w-auto px-5"
                onClick={() =>
                  onSubmit({
                    rating,
                    comment,
                  })
                }
                disabled={isLoading || !comment.trim()}
              >
                {isLoading
                  ? mode === 'create'
                    ? 'Submitting...'
                    : 'Saving...'
                  : mode === 'create'
                  ? 'Submit Review'
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