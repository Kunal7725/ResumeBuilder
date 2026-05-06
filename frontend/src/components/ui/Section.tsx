import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Section: React.FC<Props> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="section-container">
      <button onClick={() => setOpen(!open)} className="section-toggle-btn">
        <span className="section-title">{title}</span>
        <ChevronDown className={`section-chevron ${open ? 'section-chevron-open' : ''}`} />
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
};
