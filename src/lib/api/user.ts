import { apiFetch } from '@lib/api/client';
import type {
  MeCategoryItem,
  UpdateMyProfileInput,
  UserProfile,
} from '@mytypes/user';

export function getMyProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/user', {
    method: 'GET',
    auth: true,
  });
}

export function updateMyProfile(
  payload: UpdateMyProfileInput
): Promise<UserProfile> {
  return apiFetch<UserProfile>('/user', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function getMyCategories(): Promise<{ count: number; items: MeCategoryItem[] }> {
  return apiFetch<{ count: number; items: MeCategoryItem[] }>('/user/categories', {
    method: 'GET',
    auth: true,
  });
}

export function addMyCategory(categoryId: number): Promise<MeCategoryItem> {
  return apiFetch<MeCategoryItem>('/user/categories', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ categoryId }),
  });
}

export function removeMyCategory(
  categoryId: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/user/categories/${categoryId}`, {
    method: 'DELETE',
    auth: true,
  });
}