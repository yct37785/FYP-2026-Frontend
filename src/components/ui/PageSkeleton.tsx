export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-slate-200" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-9/12 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-8/12 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}