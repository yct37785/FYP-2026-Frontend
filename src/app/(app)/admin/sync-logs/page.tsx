'use client';

import { useEffect, useState } from 'react';
import { SyncLogCard } from '@components/admin/SyncLogCard';
import { Card } from '@components/ui/Card';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { getAdminSyncLogs } from '@lib/api/admin';
import type { SyncItem } from '@mytypes/sync';

export default function AdminSyncLogsPage() {
  const [items, setItems] = useState<SyncItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSyncLogs() {
      try {
        setLoading(true);
        setError('');

        const result = await getAdminSyncLogs();
        setItems(result.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load sync logs'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSyncLogs();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Sync Logs</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review the latest external event sync status and run history.
        </p>
      </div>

      {error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : null}

      {items.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            No sync logs yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sync activity will appear here once the background job runs.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <SyncLogCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}