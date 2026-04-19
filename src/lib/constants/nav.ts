import type { LucideIcon } from 'lucide-react';
import {
  User,
  Tags,
  Ticket,
  Clock3,
  Heart,
  Star,
  FileWarning,
  CalendarDays,
  PlusSquare,
  Shield,
  Database,
} from 'lucide-react';
import type { UserRole } from '@mytypes/user';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const userNav: NavItem[] = [
  { label: 'My Profile', href: '/user', icon: User },
  { label: 'My Categories', href: '/user/categories', icon: Tags },
  { label: 'My Bookings', href: '/user/bookings', icon: Ticket },
  { label: 'My Waitlists', href: '/user/waitlists', icon: Clock3 },
  { label: 'My Favorites', href: '/user/favorites', icon: Heart },
  { label: 'My Reviews', href: '/user/reviews', icon: Star },
  { label: 'My Reports', href: '/user/reports', icon: FileWarning },
];

const organizerNav: NavItem[] = [
  ...userNav,
  { label: 'Organizer Events', href: '/organizer/events', icon: CalendarDays },
  { label: 'Create Event', href: '/organizer/events/new', icon: PlusSquare },
];

const adminNav: NavItem[] = [
  ...organizerNav,
  { label: 'Admin Reports', href: '/admin/reports', icon: Shield },
  { label: 'Sync Logs', href: '/admin/sync-logs', icon: Database },
];

export function getNavItems(role: UserRole): NavItem[] {
  if (role === 'admin') return adminNav;
  if (role === 'organizer') return organizerNav;
  return userNav;
}