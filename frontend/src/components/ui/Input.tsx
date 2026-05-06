import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<Props> = ({ label, className = '', ...props }) => (
  <div className="input-wrapper">
    {label && <label className="input-label">{label}</label>}
    <input className={`input-field ${className}`} {...props} />
  </div>
);
