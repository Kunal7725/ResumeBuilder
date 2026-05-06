import React from 'react';
import type { ResumeData } from '../../types/resume';

interface Props { data: ResumeData; }

export const ModernTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo: p, summary, skillCategories, experiences, projects, education } = data;

  return (
    <div className="font-sans bg-white flex" style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.4', minHeight: '297mm' }}>
      {/* Sidebar */}
      <div className="w-56 bg-slate-800 text-white p-5 shrink-0 space-y-4">
        <div>
          <h1 className="text-lg font-bold leading-tight">{p.name || 'Your Name'}</h1>
          {p.role && <p className="text-xs text-slate-300 mt-0.5">{p.role}</p>}
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-600 pb-0.5">Contact</h3>
          {[p.email, p.phone, p.location, p.github, p.portfolio].filter(Boolean).map((v, i) => (
            <p key={i} className="text-xs text-slate-300 break-all">{v}</p>
          ))}
        </div>

        {skillCategories.some((c) => c.skills) && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-600 pb-0.5">Skills</h3>
            {skillCategories.filter((c) => c.skills).map((cat) => (
              <div key={cat.id}>
                <p className="text-xs font-semibold text-slate-200">{cat.category}</p>
                <p className="text-xs text-slate-400">{cat.skills}</p>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-600 pb-0.5">Education</h3>
            {education.map((edu) => (
              <div key={edu.id}>
                <p className="text-xs font-semibold text-slate-200">{edu.institution}</p>
                <p className="text-xs text-slate-400">{edu.degree}</p>
                <p className="text-xs text-slate-500">{edu.duration}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-4">
        {summary && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700 border-b-2 border-slate-700 pb-0.5 mb-1.5">Profile</h2>
            <p className="text-xs text-gray-700">{summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700 border-b-2 border-slate-700 pb-0.5 mb-2">Experience</h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-gray-900">{exp.role}</span>
                    <span className="text-xs text-gray-500">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{exp.company} {exp.location && `· ${exp.location}`}</p>
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
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700 border-b-2 border-slate-700 pb-0.5 mb-2">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-gray-900">{proj.name}</span>
                    {proj.link && <span className="text-xs text-slate-500">{proj.link}</span>}
                  </div>
                  {proj.techStack && <p className="text-xs text-slate-500 italic">{proj.techStack}</p>}
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
      </div>
    </div>
  );
};
