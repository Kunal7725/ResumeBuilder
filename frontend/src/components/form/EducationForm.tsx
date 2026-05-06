import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from '../../utils/nanoid';
import type { Education } from '../../types/resume';

const emptyEdu = (): Education => ({
  id: nanoid(), institution: '', degree: '', duration: '', gpa: '',
});

export const EducationForm: React.FC = () => {
  const { resumeData, setEducation } = useResumeStore();
  const edu = resumeData.education;

  const add = () => setEducation([...edu, emptyEdu()]);

  const update = (id: string, field: keyof Education, value: string) =>
    setEducation(edu.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const remove = (id: string) => setEducation(edu.filter((e) => e.id !== id));

  return (
    <Section title="Education">
      <div className="education-list">
        {edu.map((e) => (
          <div key={e.id} className="education-item">
            <div className="education-item-inner">
              <div className="education-fields-grid">
                <div className="education-full-col">
                  <Input placeholder="Institution" value={e.institution} onChange={(ev) => update(e.id, 'institution', ev.target.value)} />
                </div>
                <Input placeholder="Degree / Major" value={e.degree} onChange={(ev) => update(e.id, 'degree', ev.target.value)} />
                <Input placeholder="Duration (2020 – 2024)" value={e.duration} onChange={(ev) => update(e.id, 'duration', ev.target.value)} />
                <Input placeholder="GPA (optional)" value={e.gpa || ''} onChange={(ev) => update(e.id, 'gpa', ev.target.value)} />
              </div>
              <button onClick={() => remove(e.id)} className="education-delete-btn">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5" /> Add Education
      </Button>
    </Section>
  );
};
