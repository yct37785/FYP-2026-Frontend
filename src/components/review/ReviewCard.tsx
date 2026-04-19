'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  Flag,
} from 'lucide-react';
import type { ReviewItem } from '@mytypes/review';

interface ReviewCardProps {
  review: ReviewItem;
  canManage: boolean;
  canReport?: boolean;
  isSuspended?: boolean;
  onEdit?: (review: ReviewItem) => void;
  onDelete?: (review: ReviewItem) => void;
  onReport?: (review: ReviewItem) => void;
}

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
  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < rating;

    return (
      <Star
        key={index}
        size={16}
        className={filled ? 'fill-current text-amber-500' : 'text-slate-300'}
      />
    );
  });
}

export function ReviewCard({
  review,
  canManage,
  canReport = false,
  isSuspended = false,
  onEdit,
  onDelete,
  onReport,
}: ReviewCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const showMenu = canManage || canReport;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {review.userName}
            </h3>
            <span className="text-xs text-slate-500">
              {formatDate(review.updatedAt || review.createdAt)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
        </div>

        {showMenu ? (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
              aria-label="Review actions"
              title="Review actions"
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-12 z-10 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {canManage ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit?.(review);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit review
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete?.(review);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete review
                    </button>
                  </>
                ) : null}

                {canReport ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onReport?.(review);
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <Flag size={15} />
                    Report review
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        {isSuspended ? (
          <p className="text-sm italic text-slate-500">
            This review is unavailable.
          </p>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {review.comment}
          </p>
        )}
      </div>
    </div>
  );
}