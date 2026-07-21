/**
 * Button — design system button component
 *
 * Variants: primary | secondary | ghost | danger
 * Sizes: sm | md | lg
 * as="link" support via React Router Link
 */

import { type ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:   'bg-teal text-white hover:bg-teal/90 border-transparent',
  secondary: 'bg-white text-navy border-border-subtle hover:border-navy',
  ghost:     'bg-transparent text-navy border-transparent hover:bg-navy-light',
  danger:    'bg-red-600 text-white hover:bg-red-700 border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-[36px]',
  md: 'px-4 py-2 text-sm min-h-[44px]',
  lg: 'px-5 py-2.5 text-md min-h-[48px]',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: 'link';
  href?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  as,
  href,
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = `${base} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if (as === 'link' && href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
