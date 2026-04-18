export const styles = {
  layout: {
    page: 'min-h-screen bg-background text-foreground',
    center: 'flex min-h-screen items-center justify-center',
    container: 'mx-auto w-full max-w-md px-4',
  },
  card: {
    base: 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
  },
  text: {
    title: 'text-2xl font-semibold tracking-tight text-slate-900',
    subtitle: 'mt-2 text-sm text-slate-600',
    label: 'mb-2 block text-sm font-medium text-slate-700',
    error: 'mt-2 text-sm text-red-600',
  },
  input: {
    base: 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500',
  },
  button: {
    primary:
      'inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60',
    secondary:
      'inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50',
  },
};