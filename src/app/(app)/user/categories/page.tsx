'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { getCategories } from '@lib/api/categories';
import {
  addMyCategory,
  getMyCategories,
  removeMyCategory,
} from '@lib/api/user';
import type { CategoryItem } from '@mytypes/category';
import type { MeCategoryItem } from '@mytypes/user';

export default function UserCategoriesPage() {
  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<MeCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingCategoryId, setPendingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        const [allResult, myResult] = await Promise.all([
          getCategories(),
          getMyCategories(),
        ]);

        setAllCategories(allResult.items);
        setSelectedCategories(myResult.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load categories'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, []);

  const selectedCategoryIds = useMemo(
    () => new Set(selectedCategories.map((item) => item.categoryId)),
    [selectedCategories]
  );

  async function handleAdd(category: CategoryItem) {
    try {
      setPendingCategoryId(category.id);
      setError('');

      const created = await addMyCategory(category.id);

      setSelectedCategories((prev) =>
        [...prev, created].sort((a, b) =>
          a.categoryName.localeCompare(b.categoryName)
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    } finally {
      setPendingCategoryId(null);
    }
  }

  async function handleRemove(categoryId: number) {
    try {
      setPendingCategoryId(categoryId);
      setError('');

      await removeMyCategory(categoryId);

      setSelectedCategories((prev) =>
        prev.filter((item) => item.categoryId !== categoryId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to remove category'
      );
    } finally {
      setPendingCategoryId(null);
    }
  }

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          My Categories
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage the categories you are interested in.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : null}

      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Selected Categories
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              These categories are currently linked to your profile.
            </p>
          </div>

          {selectedCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              You have not selected any categories yet.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {selectedCategories.map((category) => (
                <div
                  key={category.categoryId}
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {category.categoryName}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemove(category.categoryId)}
                    disabled={pendingCategoryId === category.categoryId}
                    className="cursor-pointer text-xs font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingCategoryId === category.categoryId
                      ? 'Removing...'
                      : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              All Categories
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Add more categories to personalize your experience.
            </p>
          </div>

          {allCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              No categories available.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {allCategories.map((category) => {
                const isSelected = selectedCategoryIds.has(category.id);
                const isPending = pendingCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Category #{category.id}
                        </p>
                      </div>

                      {isSelected ? (
                        <Button
                          variant="secondary"
                          className="w-auto px-4 py-2"
                          onClick={() => handleRemove(category.id)}
                          disabled={isPending}
                        >
                          {isPending ? 'Removing...' : 'Remove'}
                        </Button>
                      ) : (
                        <Button
                          className="w-auto px-4 py-2"
                          onClick={() => handleAdd(category)}
                          disabled={isPending}
                        >
                          {isPending ? 'Adding...' : 'Add'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}