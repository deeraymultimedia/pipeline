/**
 * MetricCard — KPI card with accent bar, value, label, and optional trend.
 * When href is provided the card renders as a React Router <Link>.
 */

import { Link } from 'react-router-dom';

interface MetricCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  accentColor?: string;
  href?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subLabel,
  trend,
  trendLabel,
  accentColor = '#0EA5A0',
  href,
  className = '',
}: MetricCardProps) {
  const inner = (
    <div className={`bg-white rounded-xl border border-border-subtle shadow-card p-5 flex flex-col gap-2 relative overflow-hidden ${className}`}>
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />
      <p className="text-text-muted text-xs font-medium uppercase tracking-wide pt-1">{label}</p>
      <p className="text-3xl font-bold text-navy leading-none">{value}</p>
      {subLabel && <p className="text-text-muted text-xs">{subLabel}</p>}
      {trend && trendLabel && (
        <p
          className={`text-xs font-medium ${
            trend === 'up' ? 'text-health-healthy' : trend === 'down' ? 'text-health-at_risk' : 'text-text-muted'
          }`}
        >
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '–'} {trendLabel}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal rounded-xl">
        {inner}
      </Link>
    );
  }

  return inner;
}
