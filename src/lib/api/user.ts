import { apiFetch } from '@/lib/api/client';
import type { UserProfile } from '@/types/user';

export function getMyProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/user', {
    method: 'GET',
    auth: true,
  });
}