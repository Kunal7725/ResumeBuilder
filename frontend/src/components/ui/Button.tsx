import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

export const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    className={`btn-base ${size === 'sm' ? 'btn-sm' : 'btn-md'} ${variantClass[variant]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <svg className="btn-spinner" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    )}
    {children}
  </button>
);
