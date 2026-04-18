'use client';

import { useMemo } from 'react';

interface CategoryOption {
  id: number;
  name: string;
}

interface EventFilterBarProps {
  selectedPreset: string;
  onPresetChange: (value: string) => void;
  selectedCategoryId?: number;
  onCategoryChange: (value?: number) => void;
  eventsCategorySource: Array<{ categoryId: number; categoryName?: string }>;
}

const presetOptions = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Weekend', value: 'weekend' },
  { label: 'Free', value: 'free' },
];

export function EventFilterBar({
  selectedPreset,
  onPresetChange,
  selectedCategoryId,
  onCategoryChange,
  eventsCategorySource,
}: EventFilterBarProps) {
  const categories = useMemo<CategoryOption[]>(() => {
    const map = new Map<number, string>();

    for (const item of eventsCategorySource) {
      if (item.categoryName) {
        map.set(item.categoryId, item.categoryName);
      }
    }

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [eventsCategorySource]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presetOptions.map((option) => {
          const active = selectedPreset === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onPresetChange(option.value)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange(undefined)}
          className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
            selectedCategoryId === undefined
              ? 'bg-orange-600 text-white'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>

        {categories.map((category) => {
          const active = selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}