import { apiFetch } from '@/lib/api/client';
import type { LoginResponse } from '@/types/auth';

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}