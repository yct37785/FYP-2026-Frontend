'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@lib/constants/nav';

interface SidebarProps {
  items: NavItem[];
  collapsed: boolean;
}

export function Sidebar({ items, collapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-200 md:block ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <nav className="px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center rounded-xl px-3 py-3 text-sm transition ${
                    collapsed ? 'justify-center' : 'gap-3'
                  } ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  {!collapsed ? <span>{item.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}