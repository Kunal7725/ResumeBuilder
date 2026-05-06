import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Input } from '../ui/Input';
import { Section } from '../ui/Section';

export const PersonalInfoForm: React.FC = () => {
  const { resumeData, setPersonalInfo } = useResumeStore();
  const { personalInfo: p } = resumeData;

  const fields: { key: keyof typeof p; label: string; placeholder: string }[] = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
    { key: 'role', label: 'Job Title', placeholder: 'Full Stack Developer' },
    { key: 'location', label: 'Location', placeholder: 'New York, NY' },
    { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000' },
    { key: 'email', label: 'Email', placeholder: 'john@example.com' },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/johndoe' },
    { key: 'portfolio', label: 'Portfolio', placeholder: 'johndoe.dev' },
  ];

  return (
    <Section title="Personal Info">
      <div className="personal-info-grid">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className={key === 'name' || key === 'role' ? 'personal-info-full' : ''}>
            <Input
              label={label}
              placeholder={placeholder}
              value={p[key]}
              onChange={(e) => setPersonalInfo({ [key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </Section>
  );
};
