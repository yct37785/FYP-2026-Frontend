'use client';

import type { ReviewItem } from '@mytypes/review';
import { Card } from '@components/ui/Card';

interface ReviewListProps {
  items: ReviewItem[];
}

function renderStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ReviewList({ items }: ReviewListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
        <p className="mt-2 text-sm text-slate-600">
          No reviews yet for this event.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
        <p className="mt-1 text-sm text-slate-600">
          See what attendees are saying about this event.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((review) => (
          <Card key={review.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {review.userName}
                </h3>
                <p className="mt-1 text-sm text-amber-500">
                  {renderStars(review.rating)}
                </p>
              </div>

              <p className="text-xs text-slate-500">
                {formatDate(review.createdAt)}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              {review.comment}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}