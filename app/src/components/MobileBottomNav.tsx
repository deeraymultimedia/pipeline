/**
 * MobileBottomNav — fixed bottom navigation at <1024px
 *
 * Navigation items (5 visible):
 *   Today, Pipeline, Clients, Tasks, More
 *
 * "More" navigates to settings or expands a drawer (Batch 1A: routes to settings).
 * Hidden at lg breakpoint and above.
 * Touch targets meet minimum 44×44px.
 * Safe area bottom padding for notched devices.
 *
 * Batch 1C.1: Unicode placeholder icons replaced with NavIcon SVG components.
 */

import { NavLink } from 'react-router-dom';
import { NavIcon, type NavIconName } from './ui/NavIcon';

interface MobileNavItem {
  to: string;
  label: string;
  icon: NavIconName;
  end?: boolean;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { to: '/',         label: 'Today',    icon: 'today',    end: true },
  { to: '/pipeline', label: 'Pipeline', icon: 'pipeline' },
  { to: '/clients',  label: 'Clients',  icon: 'clients' },
  { to: '/tasks',    label: 'Tasks',    icon: 'tasks' },
  { to: '/settings', label: 'More',     icon: 'more' },
];

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="mobile-bottom-nav lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border-subtle"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul
        className="flex items-stretch justify-around list-none m-0 p-0"
        role="list"
      >
        {MOBILE_NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              {...(item.end !== undefined ? { end: item.end } : {})}
              className={({ isActive }) =>
                [
                  'mobile-nav-link flex flex-col items-center justify-center gap-0.5 min-h-[56px] w-full text-xs font-medium transition-colors',
                  isActive ? 'text-teal' : 'text-text-muted',
                ].join(' ')
              }
            >
              <NavIcon name={item.icon} />
              <span className="mobile-nav-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
