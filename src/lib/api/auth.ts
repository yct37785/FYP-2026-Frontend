import { apiFetch } from '@/lib/api/client';

export interface LoginResponse {
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'organizer';
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(payload: RegisterInput): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}