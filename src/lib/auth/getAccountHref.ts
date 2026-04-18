import type { UserRole } from '@mytypes/user';

export function getAccountHref(role?: UserRole): string {
  if (role === 'admin') {
    return '/admin/reports';
  }

  if (role === 'organizer') {
    return '/organizer/events';
  }

  return '/user';
}