'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Trash2, UserPlus, UsersRound, UserMinus } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { getCategories } from '@lib/api/categories';
import {
  createGroup,
  deleteGroup,
  getGroups,
  joinGroup,
  leaveGroup,
} from '@lib/api/groups';
import { useAppSession } from '@lib/session/AppSessionContext';
import type { CategoryItem } from '@mytypes/category';
import type { GroupItem } from '@mytypes/group';

export default function UserGroupsPage() {
  const { profile } = useAppSession();
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
    undefined
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | 'create' | null>(null);
  const [error, setError] = useState('');

  async function loadGroups(categoryId = selectedCategoryId) {
    const result = await getGroups({ categoryId });
    setGroups(result.items);
  }

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        const [categoryResult, groupResult] = await Promise.all([
          getCategories(),
          getGroups(),
        ]);

        setCategories(categoryResult.items);
        setGroups(groupResult.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load groups');
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, []);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === undefined) return 'All groups';
    return (
      categories.find((category) => category.id === selectedCategoryId)?.name ||
      'Selected category'
    );
  }, [categories, selectedCategoryId]);

  async function handleCategoryFilter(categoryId?: number) {
    try {
      setSelectedCategoryId(categoryId);
      setError('');
      await loadGroups(categoryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter groups');
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setActionId('create');
      setError('');

      const created = await createGroup({
        name: name.trim(),
        description: description.trim(),
        categoryId: formCategoryId ? Number(formCategoryId) : null,
      });

      setName('');
      setDescription('');
      setFormCategoryId('');

      if (
        selectedCategoryId === undefined ||
        created.categoryId === selectedCategoryId
      ) {
        setGroups((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setActionId(null);
    }
  }

  async function handleJoin(groupId: number) {
    try {
      setActionId(groupId);
      setError('');

      const updated = await joinGroup(groupId);
      setGroups((prev) =>
        prev.map((group) => (group.id === groupId ? updated : group))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
    } finally {
      setActionId(null);
    }
  }

  async function handleLeave(groupId: number) {
    try {
      setActionId(groupId);
      setError('');

      const updated = await leaveGroup(groupId);
      setGroups((prev) =>
        prev.map((group) => (group.id === groupId ? updated : group))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave group');
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(groupId: number) {
    try {
      setActionId(groupId);
      setError('');

      await deleteGroup(groupId);
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
    } finally {
      setActionId(null);
    }
  }

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Groups</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create and join interest groups around event categories.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Card>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create a group
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Start a space for people with the same event interests.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Group name
              </span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Weekend runners"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </span>
              <select
                value={formCategoryId}
                onChange={(event) => setFormCategoryId(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <Button
                className="w-full px-5 lg:w-auto"
                disabled={
                  actionId === 'create' || !name.trim() || !description.trim()
                }
              >
                Create
              </Button>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What should members use this group for?"
              required
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
            />
          </label>
        </form>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedCategoryName}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {groups.length} group{groups.length === 1 ? '' : 's'} available.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryFilter(undefined)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategoryId === undefined
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryFilter(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategoryId === category.id
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <UsersRound className="mx-auto text-slate-400" size={30} />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No groups yet
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Create the first group for this view.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {groups.map((group) => {
              const isBusy = actionId === group.id;
              const canDelete = group.isOwner || profile.role === 'admin';

              return (
                <div
                  key={group.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {group.categoryName || 'General'}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {group.name}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                        {group.description}
                      </p>
                    </div>

                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {group.memberCount} member
                      {group.memberCount === 1 ? '' : 's'}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">
                      Owner: {group.ownerName}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {canDelete ? (
                        <Button
                          variant="secondary"
                          className="w-auto px-4 py-2"
                          disabled
                        >
                          Owner
                        </Button>
                      ) : group.isMember ? (
                        <Button
                          variant="secondary"
                          className="w-auto px-4 py-2"
                          onClick={() => handleLeave(group.id)}
                          disabled={isBusy}
                        >
                          <span className="flex items-center gap-2">
                            <UserMinus size={16} />
                            Leave
                          </span>
                        </Button>
                      ) : (
                        <Button
                          className="w-auto px-4 py-2"
                          onClick={() => handleJoin(group.id)}
                          disabled={isBusy}
                        >
                          <span className="flex items-center gap-2">
                            <UserPlus size={16} />
                            Join
                          </span>
                        </Button>
                      )}

                      {group.isOwner ? (
                        <Button
                          variant="secondary"
                          className="w-auto px-4 py-2"
                          onClick={() => handleDelete(group.id)}
                          disabled={isBusy}
                        >
                          <span className="flex items-center gap-2 text-red-600">
                            <Trash2 size={16} />
                            Delete
                          </span>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
