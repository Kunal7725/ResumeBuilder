import React from 'react';
import { PersonalInfoForm } from '../components/form/PersonalInfoForm';
import { SummaryForm } from '../components/form/SummaryForm';
import { SkillsForm } from '../components/form/SkillsForm';
import { ExperienceForm } from '../components/form/ExperienceForm';
import { ProjectsForm } from '../components/form/ProjectsForm';
import { EducationForm } from '../components/form/EducationForm';
import { ResumePreview } from '../components/preview/ResumePreview';
import { useResumeStore } from '../store/resumeStore';

export const BuilderPage: React.FC = () => {
  const { resumeData } = useResumeStore();
  const hasContent =
    resumeData.personalInfo.name ||
    resumeData.personalInfo.email ||
    resumeData.summary ||
    resumeData.experiences.length > 0 ||
    resumeData.projects.length > 0;

  return (
    <div className="builder-layout">
      {/* Left Panel — Form */}
      <div className="builder-form-panel">
        <div className="builder-form-inner">
          <PersonalInfoForm />
          <SummaryForm />
          <SkillsForm />
          <ExperienceForm />
          <ProjectsForm />
          <EducationForm />
        </div>
      </div>

      {/* Right Panel — Preview */}
      <div className="builder-preview-panel">
        {!hasContent && (
          <div className="builder-empty-state">
            <div className="builder-empty-icon-wrap">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="builder-empty-title">Start Building Your Resume</h3>
            <p className="builder-empty-subtitle">
              Fill in your details on the left and watch your resume come to life in real-time.
            </p>
          </div>
        )}

        <div className={!hasContent ? 'builder-preview-wrapper-hidden' : 'builder-preview-wrapper-visible'}>
          <ResumePreview />
        </div>
      </div>
    </div>
  );
};
