export const styles = {
  layout: {
    page: 'min-h-screen bg-background text-foreground',
    center: 'flex min-h-screen items-center justify-center',
    container: 'mx-auto w-full max-w-md px-4',
    content: 'mx-auto max-w-7xl px-4 py-8 md:px-6',
    appContent: 'mx-auto max-w-6xl px-4 py-6 md:px-6',
  },

  card: {
    base: 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
    interactive:
      'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md',
  },

  text: {
    title: 'text-2xl font-semibold tracking-tight text-slate-900',
    subtitle: 'mt-2 text-sm text-slate-600',
    label: 'mb-2 block text-sm font-medium text-slate-700',
    error: 'mt-2 text-sm text-red-600',
    primary: 'text-[var(--primary)]',
    eyebrow: 'text-xs font-semibold uppercase tracking-wide text-[var(--primary)]',
    sectionTitle: 'text-3xl font-semibold text-slate-900',
    muted: 'text-sm text-slate-600',
  },

  input: {
    base: 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500',
    search:
      'w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white',
  },

  button: {
    primary:
      'inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
    secondary:
      'inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50',
    ghost:
      'inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100',
  },

  brand: {
    text: 'text-[var(--primary)]',
    bg: 'bg-[var(--primary)]',
    bgText: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
    softBg: 'bg-[var(--primary-soft)]',
    softText: 'bg-[var(--primary-soft)] text-[var(--primary)]',
    border: 'border-[var(--primary)]',
    ring: 'ring-1 ring-[var(--primary)]',
  },

  badge: {
    neutral: 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700',
    primary:
      'rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-[var(--primary)]',
    solidPrimary:
      'rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-medium text-[var(--primary-foreground)]',
  },

  filter: {
    chip:
      'cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition',
    chipInactive:
      'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
    chipActiveDark: 'bg-slate-900 text-white',
    chipActivePrimary: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
  },

  navbar: {
    public: 'sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur',
    app: 'sticky top-0 z-30 border-b border-slate-200 bg-white',
  },

  sidebar: {
    base: 'border-r border-slate-200 bg-white',
    link:
      'flex items-center rounded-xl px-3 py-3 text-sm transition',
    linkInactive: 'text-slate-700 hover:bg-slate-100',
    linkActive: 'bg-slate-900 text-white',
  },

  skeleton: {
    block: 'animate-pulse rounded bg-slate-200',
    card: 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
  },
} as const;