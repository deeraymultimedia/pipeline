/**
 * SearchInput — accessible search field with clear button.
 * Uses useId() for label association; role="searchbox" on the input.
 */

import { useId, type ChangeEvent } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  label = 'Search',
  className = '',
}: SearchInputProps) {
  const id = useId();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleClear() {
    onChange('');
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span
        className="absolute left-3 text-text-muted pointer-events-none"
        aria-hidden="true"
      >
        🔍
      </span>
      <input
        id={id}
        type="search"
        role="searchbox"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-border-subtle rounded-lg text-navy placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal min-h-[44px]"
        aria-label={label}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 text-text-muted hover:text-navy min-h-[36px] min-w-[36px] flex items-center justify-center rounded"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
