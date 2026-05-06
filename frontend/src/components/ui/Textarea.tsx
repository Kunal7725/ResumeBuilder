import React from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<Props> = ({ label, className = '', ...props }) => (
  <div className="input-wrapper">
    {label && <label className="input-label">{label}</label>}
    <textarea className={`textarea-field ${className}`} {...props} />
  </div>
);
