/**
 * Dialog — WCAG 2.2 compliant modal dialog.
 *
 * Features:
 *   - role="dialog", aria-modal="true", aria-labelledby, aria-describedby
 *   - Full keyboard focus trap (Tab / Shift+Tab cycle)
 *   - Escape key closes
 *   - Focus saved on open and restored on close
 *   - Backdrop click closes (unless preventBackdropClose)
 *   - @keyframes dialog-in overridden to fade-only under prefers-reduced-motion
 */

import {
  useRef,
  useEffect,
  useId,
  type ReactNode,
  type KeyboardEvent,
} from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  preventBackdropClose?: boolean;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  preventBackdropClose = false,
  className = '',
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const savedFocusRef = useRef<HTMLElement | null>(null);

  // Save and restore focus
  useEffect(() => {
    if (open) {
      savedFocusRef.current = document.activeElement as HTMLElement;
      // Focus first focusable element inside dialog
      requestAnimationFrame(() => {
        const first = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)[0];
        first?.focus();
      });
    } else {
      savedFocusRef.current?.focus();
      savedFocusRef.current = null;
    }
  }, [open]);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    ).filter((el) => !el.closest('[aria-hidden="true"]'));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Guard for noUncheckedIndexedAccess — length > 0 ensures both are defined
    if (first === undefined || last === undefined) return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/40"
        aria-hidden="true"
        onClick={preventBackdropClose ? undefined : onClose}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onKeyDown={handleKeyDown}
        className={`relative z-10 bg-white rounded-2xl shadow-popover w-full max-w-lg max-h-[90vh] overflow-y-auto animate-dialog-in motion-reduce:animate-none motion-reduce:opacity-100 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div>
            <h2 id={titleId} className="text-navy font-semibold text-lg">
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-text-muted text-sm mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-text-muted hover:text-navy min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-canvas transition-colors"
          >
            <span aria-hidden="true" className="text-xl">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>

      <style>{`
        @keyframes dialog-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-dialog-in {
          animation: dialog-in 0.15s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes dialog-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}
