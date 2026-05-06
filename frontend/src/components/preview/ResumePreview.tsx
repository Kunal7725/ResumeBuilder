import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';

export const ResumePreview: React.FC = () => {
  const { resumeData, template } = useResumeStore();

  const templates = { minimal: MinimalTemplate, modern: ModernTemplate, professional: ProfessionalTemplate };
  const Template = templates[template];

  return (
    <div id="resume-preview" className="resume-preview-canvas" style={{ width: '210mm', minHeight: '297mm' }}>
      <Template data={resumeData} />
    </div>
  );
};
