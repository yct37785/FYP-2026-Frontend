'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import {
  ReviewModal,
  type ReviewModalMode,
} from '@components/review/ReviewModal';
import {
  deleteMyReview,
  getMyReviews,
  updateMyReview,
} from '@lib/api/reviews';
import type { ReviewItem } from '@mytypes/review';

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function renderStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default function UserReviewsPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ReviewModalMode>('edit');
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyReviews();
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    }

    void loadReviews();
  }, []);

  function openEditModal(review: ReviewItem) {
    setSelectedReview(review);
    setModalMode('edit');
    setModalError('');
    setModalOpen(true);
  }

  function openDeleteModal(review: ReviewItem) {
    setSelectedReview(review);
    setModalMode('delete');
    setModalError('');
    setModalOpen(true);
  }

  async function handleSubmit(payload: { rating: number; comment: string }) {
    if (!selectedReview) return;

    try {
      setIsSubmitting(true);
      setModalError('');

      const updated = await updateMyReview(selectedReview.id, {
        rating: payload.rating,
        comment: payload.comment.trim(),
      });

      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setModalOpen(false);
      setSelectedReview(null);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedReview) return;

    try {
      setIsSubmitting(true);
      setModalError('');

      await deleteMyReview(selectedReview.id);

      setItems((prev) => prev.filter((item) => item.id !== selectedReview.id));

      setModalOpen(false);
      setSelectedReview(null);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to delete review');
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
        <h1 className="text-2xl font-semibold text-slate-900">My Reviews</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review and manage the feedback you have submitted.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : null}

      {items.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">No reviews yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Reviews you leave for events will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((review) => (
            <Card key={review.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/events/${review.eventId}`}
                      className="text-base font-semibold text-slate-900 transition hover:text-slate-700"
                    >
                      {review.eventTitle || `Event #${review.eventId}`}
                    </Link>

                    <span className="text-sm text-amber-500">
                      {renderStars(review.rating)}
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {review.comment}
                  </p>

                  <p className="mt-3 text-xs text-slate-500">
                    Updated {formatDate(review.updatedAt || review.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 gap-3">
                  <Button
                    variant="secondary"
                    className="w-auto px-4 py-2"
                    onClick={() => openEditModal(review)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="secondary"
                    className="w-auto px-4 py-2"
                    onClick={() => openDeleteModal(review)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ReviewModal
        open={modalOpen}
        mode={modalMode}
        review={selectedReview}
        isLoading={isSubmitting}
        error={modalError}
        onClose={() => {
          setModalOpen(false);
          setSelectedReview(null);
          setModalError('');
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}