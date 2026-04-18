'use client';

import { useMemo } from 'react';
import { styles } from '@styles/styles';

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
              className={`${styles.filter.chip} ${
                active
                  ? styles.filter.chipActiveDark
                  : styles.filter.chipInactive
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
          className={`${styles.filter.chip} ${
            selectedCategoryId === undefined
              ? styles.filter.chipActivePrimary
              : styles.filter.chipInactive
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
              className={`${styles.filter.chip} ${
                active
                  ? styles.filter.chipActivePrimary
                  : styles.filter.chipInactive
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