'use client';

import type { SyncItem } from '@mytypes/sync';
import { Card } from '@components/ui/Card';

interface SyncLogCardProps {
  item: SyncItem;
}

function formatDate(value: string | Date | null) {
  if (!value) return '-';

  return new Date(value).toLocaleString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getStatusLabel(item: SyncItem) {
  if (item.isRunning) {
    return {
      text: 'RUNNING',
      className: 'bg-blue-100 text-blue-700',
    };
  }

  if (item.lastError) {
    return {
      text: 'FAILED',
      className: 'bg-red-100 text-red-700',
    };
  }

  return {
    text: 'IDLE',
    className: 'bg-green-100 text-green-700',
  };
}

export function SyncLogCard({ item }: SyncLogCardProps) {
  const status = getStatusLabel(item);

  return (
    <Card>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            Sync #{item.id}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {item.source}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
          >
            {status.text}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Last Created At</p>
            <p className="mt-1 text-sm text-slate-900">
              {formatDate(item.lastCreatedAt)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Last Run At</p>
            <p className="mt-1 text-sm text-slate-900">
              {formatDate(item.lastRunAt)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Last Success At</p>
            <p className="mt-1 text-sm text-slate-900">
              {formatDate(item.lastSuccessAt)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Total New Events
            </p>
            <p className="mt-1 text-sm text-slate-900">{item.totalNewEvents}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Created At</p>
            <p className="mt-1 text-sm text-slate-900">
              {formatDate(item.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Updated At</p>
            <p className="mt-1 text-sm text-slate-900">
              {formatDate(item.updatedAt)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Last Error</p>
          <p
            className={`mt-1 whitespace-pre-wrap text-sm ${
              item.lastError ? 'text-red-600' : 'text-slate-500'
            }`}
          >
            {item.lastError || '-'}
          </p>
        </div>
      </div>
    </Card>
  );
}