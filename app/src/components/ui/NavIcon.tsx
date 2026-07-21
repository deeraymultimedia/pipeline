/**
 * NavIcon — Stroke-based inline SVG icon set for navigation components.
 *
 * All icons: 20×20 viewBox, strokeWidth 1.5, strokeLinecap/Join round,
 * fill none, currentColor. Render at 20px (w-5 h-5 in Tailwind).
 *
 * Used by: DesktopSidebar, MobileBottomNav, MobileDrawer.
 * Batch 1C.1 — replaces Unicode/emoji navigation icons.
 */

import React from 'react';

export type NavIconName =
  | 'today'
  | 'pipeline'
  | 'clients'
  | 'engagements'
  | 'tasks'
  | 'revenue'
  | 'settings'
  | 'close'
  | 'more';

const ICONS: Record<NavIconName, React.ReactNode> = {
  /** Calendar with a date indicator dot */
  today: (
    <>
      <rect x="3" y="4" width="14" height="14" rx="2" ry="2" />
      <line x1="7" y1="2" x2="7" y2="6" />
      <line x1="13" y1="2" x2="13" y2="6" />
      <line x1="3" y1="9" x2="17" y2="9" />
      <circle cx="10" cy="13" r="1" fill="currentColor" stroke="none" />
    </>
  ),

  /** Three kanban columns (pipeline board) */
  pipeline: (
    <>
      <rect x="3" y="3" width="4" height="14" rx="1" />
      <rect x="8" y="3" width="4" height="9" rx="1" />
      <rect x="13" y="3" width="4" height="14" rx="1" />
    </>
  ),

  /** Person silhouette — head circle + shoulder arc */
  clients: (
    <>
      <circle cx="10" cy="7" r="3" />
      <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" />
    </>
  ),

  /** Briefcase with handle and centre divider */
  engagements: (
    <>
      <rect x="3" y="8" width="14" height="10" rx="1" />
      <path d="M7 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <line x1="3" y1="13" x2="17" y2="13" />
    </>
  ),

  /** Rounded checkbox with checkmark */
  tasks: (
    <>
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <polyline points="7 10 9.5 12.5 13 8" />
    </>
  ),

  /** Three ascending bar chart columns */
  revenue: (
    <>
      <rect x="3" y="12" width="4" height="5" rx="1" />
      <rect x="8" y="8" width="4" height="9" rx="1" />
      <rect x="13" y="4" width="4" height="13" rx="1" />
    </>
  ),

  /** Gear: centre circle + 8 directional spokes */
  settings: (
    <>
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
    </>
  ),

  /** × close / dismiss */
  close: (
    <path d="M5 5l10 10M15 5L5 15" />
  ),

  /** Three horizontal dots (overflow / more) */
  more: (
    <>
      <circle cx="5" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
};

export function NavIcon({
  name,
  className,
}: {
  name: NavIconName;
  className?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}
