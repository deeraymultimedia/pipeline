/**
 * FilterSelect — labelled select control for URL-param filters.
 * Uses useId() for label association.
 */

import { useId, type ChangeEvent } from 'react';

interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  allLabel?: string;
  className?: string;
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel = 'All',
  className = '',
}: FilterSelectProps) {
  const id = useId();

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value);
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        aria-label={label}
        className="px-3 py-2 text-sm bg-white border border-border-subtle rounded-lg text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal min-h-[44px] cursor-pointer"
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
