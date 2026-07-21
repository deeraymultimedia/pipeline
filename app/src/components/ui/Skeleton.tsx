/**
 * Skeleton — pulse skeleton respecting prefers-reduced-motion.
 * Tailwind's animate-pulse is automatically disabled under reduced motion
 * via @media (prefers-reduced-motion: reduce) in Tailwind's base styles.
 */

interface SkeletonProps {
  className?: string;
  'aria-label'?: string;
}

export function Skeleton({ className = '', 'aria-label': ariaLabel }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel ?? 'Loading…'}
      aria-busy="true"
      className={`animate-pulse bg-navy-light rounded ${className}`}
    />
  );
}

/** Convenience: a block of stacked skeleton rows */
export function SkeletonRows({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div role="status" aria-label="Loading…" aria-busy="true" className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-navy-light rounded h-4" />
      ))}
    </div>
  );
}
