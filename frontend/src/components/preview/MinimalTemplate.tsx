import React from 'react';
import type { ResumeData } from '../../types/resume';

interface Props { data: ResumeData; }

export const MinimalTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo: p, summary, skillCategories, experiences, projects, education } = data;

  return (
    <div className="font-sans text-gray-900 bg-white p-8" style={{ fontFamily: 'Georgia, serif', fontSize: '10.5pt', lineHeight: '1.45' }}>
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-b-2 border-gray-800">
        <h1 className="text-2xl font-bold tracking-wide uppercase">{p.name || 'Your Name'}</h1>
        {p.role && <p className="text-sm text-gray-600 mt-0.5">{p.role}</p>}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-gray-600">
          {p.phone && <span>{p.phone}</span>}
          {p.email && <span>{p.email}</span>}
          {p.location && <span>{p.location}</span>}
          {p.github && <span>{p.github}</span>}
          {p.portfolio && <span>{p.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1.5">Summary</h2>
          <p className="text-xs text-gray-700">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skillCategories.some((c) => c.skills) && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1.5">Technical Skills</h2>
          <div className="space-y-0.5">
            {skillCategories.filter((c) => c.skills).map((cat) => (
              <div key={cat.id} className="text-xs">
                <span className="font-semibold">{cat.category}: </span>
                <span className="text-gray-700">{cat.skills}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1.5">Experience</h2>
          <div className="space-y-2.5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold">{exp.company}</span>
                  <span className="text-xs text-gray-500">{exp.duration}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs italic text-gray-600">{exp.role}</span>
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

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1.5">Projects</h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold">{proj.name}</span>
                  {proj.link && <span className="text-xs text-gray-500">{proj.link}</span>}
                </div>
                {proj.techStack && <p className="text-xs text-gray-600 italic">Tech: {proj.techStack}</p>}
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

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1.5">Education</h2>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold">{edu.institution}</span>
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
