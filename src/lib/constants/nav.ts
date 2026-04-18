import type { UserRole } from '@/types/user';

export interface NavItem {
  label: string;
  href: string;
}

const userNav: NavItem[] = [
  { label: 'My Profile', href: '/user' },
  { label: 'My Categories', href: '/user/categories' },
  { label: 'My Bookings', href: '/user/bookings' },
  { label: 'My Waitlists', href: '/user/waitlists' },
  { label: 'My Favorites', href: '/user/favorites' },
  { label: 'My Reviews', href: '/user/reviews' },
  { label: 'My Reports', href: '/user/reports' },
  { label: 'Notifications', href: '/user/notifications' },
];

const organizerNav: NavItem[] = [
  ...userNav,
  { label: 'Organizer Events', href: '/organizer/events' },
  { label: 'Create Event', href: '/organizer/events/new' },
];

const adminNav: NavItem[] = [
  ...organizerNav,
  { label: 'Admin Reports', href: '/admin/reports' },
];

export function getNavItems(role: UserRole): NavItem[] {
  if (role === 'admin') return adminNav;
  if (role === 'organizer') return organizerNav;
  return userNav;
}