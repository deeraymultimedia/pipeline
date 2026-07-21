/**
 * MobileDrawer — slide-in navigation drawer for mobile viewports.
 *
 * Accessibility contract:
 *   - Conditionally mounted by parent when open (WCAG 2.1 SC 2.1.1 — keyboard access)
 *   - role="dialog", aria-modal={true}, aria-label="Navigation menu"
 *   - Full keyboard focus trap (Tab / Shift+Tab)
 *   - Escape key closes
 *   - Backdrop click closes
 *   - Focus restored to triggerRef on close (via useEffect cleanup)
 *   - motion-reduce:transition-none on slide transition
 *   - Close button: min-h-[44px] min-w-[44px]
 */

import { useEffect, useRef, type RefObject, type KeyboardEvent } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',             label: 'Today',        icon: '🏠', end: true },
  { to: '/pipeline',     label: 'Pipeline',     icon: '📊' },
  { to: '/clients',      label: 'Clients',      icon: '👥' },
  { to: '/engagements',  label: 'Engagements',  icon: '📋' },
  { to: '/tasks',        label: 'Tasks',        icon: '✅' },
  { to: '/revenue',      label: 'Revenue',      icon: '💷' },
  { to: '/settings',     label: 'Settings',     icon: '⚙️' },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

interface MobileDrawerProps {
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export function MobileDrawer({ onClose, triggerRef }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Capture the trigger element now so the cleanup closure holds the same reference
    // even if triggerRef.current changes before cleanup runs (satisfies hooks/exhaustive-deps).
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    const frameId = requestAnimationFrame(() => {
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      firstFocusable?.focus();
    });
    return () => {
      cancelAnimationFrame(frameId);
      document.body.style.overflow = '';
      trigger?.focus();
    };
  }, [triggerRef]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-navy/40 transition-opacity motion-reduce:transition-none opacity-100 pointer-events-auto"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal={true}
        aria-label="Navigation menu"
        onKeyDown={handleKeyDown}
        className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-xs bg-navy flex flex-col shadow-popover transform transition-transform motion-reduce:transition-none translate-x-0"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded bg-teal flex items-center justify-center text-white text-xs font-bold"
              aria-hidden="true"
            >
              DM
            </div>
            <span className="text-white text-sm font-semibold">Deeray</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="text-white/70 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <span aria-hidden="true" className="text-lg">✕</span>
          </button>
        </div>

        {/* Navigation items */}
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto py-3">
          <ul role="list" className="flex flex-col gap-0.5 px-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end ?? false}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-teal text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className="text-lg" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Demo data indicator */}
        <div className="px-5 py-4 border-t border-white/10">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-400/20 text-amber-300 text-xs font-medium rounded">
            <span aria-hidden="true">⚠</span> Demo data
          </span>
        </div>
      </div>
    </>
  );
}
