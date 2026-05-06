import React from 'react';
import type { ResumeData } from '../../types/resume';

interface Props { data: ResumeData; }

export const ProfessionalTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo: p, summary, skillCategories, experiences, projects, education } = data;

  return (
    <div className="font-sans bg-white p-8" style={{ fontFamily: 'Calibri, Arial, sans-serif', fontSize: '10.5pt', lineHeight: '1.45' }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-blue-800">{p.name || 'Your Name'}</h1>
        {p.role && <p className="text-sm font-medium text-blue-600 mt-0.5">{p.role}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-gray-600">
          {p.phone && <span>{p.phone}</span>}
          {p.email && <span>{p.email}</span>}
          {p.location && <span>{p.location}</span>}
          {p.github && <span>{p.github}</span>}
          {p.portfolio && <span>{p.portfolio}</span>}
        </div>
        <div className="mt-2 h-0.5 bg-blue-800" />
      </div>

      {summary && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase text-blue-800 tracking-widest mb-1">Professional Summary</h2>
          <p className="text-xs text-gray-700">{summary}</p>
        </div>
      )}

      {skillCategories.some((c) => c.skills) && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase text-blue-800 tracking-widest mb-1">Core Competencies</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {skillCategories.filter((c) => c.skills).map((cat) => (
              <div key={cat.id} className="text-xs">
                <span className="font-semibold text-gray-800">{cat.category}: </span>
                <span className="text-gray-600">{cat.skills}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase text-blue-800 tracking-widest mb-1.5">Professional Experience</h2>
          <div className="space-y-2.5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-gray-900">{exp.company}</span>
                  <span className="text-xs text-gray-500">{exp.duration}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-blue-700">{exp.role}</span>
                  <span className="text-xs text-gray-500">{exp.location}</span>
                </div>
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-xs text-gray-700">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase text-blue-800 tracking-widest mb-1.5">Key Projects</h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-gray-900">{proj.name}</span>
                  {proj.link && <span className="text-xs text-blue-600">{proj.link}</span>}
                </div>
                {proj.techStack && <p className="text-xs text-gray-500 italic">Technologies: {proj.techStack}</p>}
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                  {proj.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-xs text-gray-700">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase text-blue-800 tracking-widest mb-1.5">Education</h2>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-gray-900">{edu.institution}</span>
                  {edu.degree && <span className="text-xs text-gray-600"> — {edu.degree}</span>}
                  {edu.gpa && <span className="text-xs text-gray-500"> | GPA: {edu.gpa}</span>}
                </div>
                <span className="text-xs text-gray-500">{edu.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
