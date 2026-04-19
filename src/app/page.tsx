'use client';

import { useEffect, useMemo, useState } from 'react';
import { PublicNavbar } from '@components/layout/PublicNavbar';
import { FeaturedEvent } from '@components/event/FeaturedEvent';
import { EventFilterBar } from '@components/event/EventFilterBar';
import { EventCard } from '@components/event/EventCard';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { getPublicEvents } from '@lib/api/events';
import type { EventItem } from '@mytypes/event';

function getTodayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function getWeekendRange() {
  const now = new Date();
  const day = now.getDay();

  const daysUntilSaturday = day === 6 ? 0 : (6 - day + 7) % 7;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSaturday);
  saturday.setHours(0, 0, 0, 0);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);

  return { start: saturday, end: sunday };
}

function getRandomFeaturedEvent(items: EventItem[]): EventItem | null {
  if (items.length === 0) return null;
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState<EventItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError('');

        const params: Parameters<typeof getPublicEvents>[0] = {};

        if (selectedCategoryId !== undefined) {
          params.categoryId = selectedCategoryId;
        }

        if (keyword.trim()) {
          params.keyword = keyword.trim();
        }

        if (selectedPreset === 'today') {
          const { start, end } = getTodayRange();
          params.startsFrom = start.toISOString();
          params.startsTo = end.toISOString();
        }

        if (selectedPreset === 'weekend') {
          const { start, end } = getWeekendRange();
          params.startsFrom = start.toISOString();
          params.startsTo = end.toISOString();
        }

        if (selectedPreset === 'free') {
          params.maxPrice = 0;
        }

        const result = await getPublicEvents(params);
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    const timeout = window.setTimeout(() => {
      void loadEvents();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [keyword, selectedPreset, selectedCategoryId]);

  const featuredEvent = useMemo(() => getRandomFeaturedEvent(items), [items]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNavbar keyword={keyword} onKeywordChange={setKeyword} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6">
        {loading ? (
          <PageSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <FeaturedEvent event={featuredEvent} />

            <section className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">
                  Discover events
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Browse workshops, meetups, performances and experiences
                  happening around you.
                </p>
              </div>

              <EventFilterBar
                selectedPreset={selectedPreset}
                onPresetChange={setSelectedPreset}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={setSelectedCategoryId}
                eventsCategorySource={items}
              />

              {items.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">
                    No events found
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Try changing your keyword or filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((event) => (
                    <EventCard key={event.id} event={event} href={`/events/${event.id}`} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}