/**
 * DesktopSidebar — persistent left sidebar at ≥1024px
 *
 * Navigation items (in order):
 *   Today, Pipeline, Clients, Engagements, Tasks, Revenue, Settings
 *
 * Dark navy background with teal active accent.
 * Hidden below lg breakpoint (mobile uses MobileBottomNav instead).
 */

import { NavLink } from 'react-router-dom';
import { COMPANY } from '../constants/company';

interface NavItem {
  to: string;
  label: string;
  icon: string; // Placeholder text icon — replace with SVG icons in later batches
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',            label: 'Today',       icon: '◎', end: true },
  { to: '/pipeline',    label: 'Pipeline',    icon: '⊞' },
  { to: '/clients',     label: 'Clients',     icon: '👤' },
  { to: '/engagements', label: 'Engagements', icon: '↔' },
  { to: '/tasks',       label: 'Tasks',       icon: '☑' },
  { to: '/revenue',     label: 'Revenue',     icon: '£' },
  { to: '/settings',    label: 'Settings',    icon: '⚙' },
];

export function DesktopSidebar() {
  return (
    <nav
      aria-label="Primary navigation"
      className="desktop-sidebar hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-navy z-40"
    >
      {/* Brand header */}
      <div className="sidebar-brand flex items-center gap-3 px-6 py-5 border-b border-white/10">
        {/* Logo placeholder — official logo file to be supplied before template creation */}
        <div
          className="brand-logo-placeholder w-8 h-8 rounded bg-teal flex items-center justify-center text-white text-xs font-bold"
          aria-hidden="true"
        >
          DM
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">{COMPANY.name}</p>
          <p className="text-white/50 text-xs leading-tight">Pipeline Tracker</p>
        </div>
      </div>

      {/* Navigation links */}
      <ul className="nav-list flex-1 px-3 py-4 space-y-1 list-none" role="list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              {...(item.end !== undefined ? { end: item.end } : {})}
              className={({ isActive }) =>
                [
                  'nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-teal text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              <span className="nav-icon w-5 text-center" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="sidebar-footer px-6 py-4 border-t border-white/10">
        <p className="text-white/40 text-xs">{COMPANY.taglines.primary}</p>
      </div>
    </nav>
  );
}
