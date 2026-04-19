import { apiFetch } from '@lib/api/client';
import type { CategoryItem } from '@mytypes/category';

export function getCategories(): Promise<{ count: number; items: CategoryItem[] }> {
  return apiFetch<{ count: number; items: CategoryItem[] }>('/categories', {
    method: 'GET',
  });
}