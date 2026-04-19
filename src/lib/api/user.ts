import { apiFetch } from '@/lib/api/client';
import type { UpdateMyProfileInput, UserProfile } from '@/types/user';

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