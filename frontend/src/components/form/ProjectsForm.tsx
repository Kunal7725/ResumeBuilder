import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { nanoid } from '../../utils/nanoid';
import type { Project } from '../../types/resume';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const emptyProject = (): Project => ({
  id: nanoid(), name: '', description: '', techStack: '', link: '', bullets: [''],
});

export const ProjectsForm: React.FC = () => {
  const { resumeData, setProjects } = useResumeStore();
  const projects = resumeData.projects;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [improving, setImproving] = useState<string | null>(null);

  const add = () => {
    const p = emptyProject();
    setProjects([...projects, p]);
    setExpanded(p.id);
  };

  const update = (id: string, field: keyof Project, value: unknown) =>
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const remove = (id: string) => setProjects(projects.filter((p) => p.id !== id));

  const updateBullet = (id: string, idx: number, val: string) => {
    const proj = projects.find((p) => p.id === id)!;
    const bullets = [...proj.bullets];
    bullets[idx] = val;
    update(id, 'bullets', bullets);
  };

  const addBullet = (id: string) => {
    const proj = projects.find((p) => p.id === id)!;
    update(id, 'bullets', [...proj.bullets, '']);
  };

  const removeBullet = (id: string, idx: number) => {
    const proj = projects.find((p) => p.id === id)!;
    update(id, 'bullets', proj.bullets.filter((_, i) => i !== idx));
  };

  const improveWithAI = async (id: string) => {
    const proj = projects.find((p) => p.id === id)!;
    setImproving(id);
    try {
      const { data } = await api.post('/ai/improve-bullets', { bullets: proj.bullets, context: `Project: ${proj.name}` });
      update(id, 'bullets', data.improved);
      toast.success('Bullets improved!');
    } catch {
      toast.error('AI improvement failed.');
    } finally {
      setImproving(null);
    }
  };

  return (
    <Section title="Projects">
      <div className="accordion-list">
        {projects.map((proj) => (
          <div key={proj.id} className="accordion-item">
            <div className="accordion-header">
              <button className="accordion-title-btn"
                onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}>
                {proj.name || 'New Project'}
              </button>
              <div className="accordion-header-actions">
                <button onClick={() => setExpanded(expanded === proj.id ? null : proj.id)} className="accordion-toggle-btn">
                  {expanded === proj.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(proj.id)} className="accordion-delete-btn">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {expanded === proj.id && (
              <div className="accordion-body">
                <div className="accordion-fields-grid">
                  <Input placeholder="Project Name" value={proj.name} onChange={(e) => update(proj.id, 'name', e.target.value)} />
                  <Input placeholder="Live Link / GitHub URL" value={proj.link} onChange={(e) => update(proj.id, 'link', e.target.value)} />
                  <div className="col-span-2">
                    <Input placeholder="Tech Stack (React, Node.js, MongoDB...)" value={proj.techStack} onChange={(e) => update(proj.id, 'techStack', e.target.value)} />
                  </div>
                </div>
                <div className="accordion-bullets-section">
                  <label className="accordion-bullets-label">Bullet Points</label>
                  {proj.bullets.map((b, i) => (
                    <div key={i} className="accordion-bullet-row">
                      <Textarea rows={2} placeholder="Built X feature using Y, resulting in Z improvement..." value={b}
                        onChange={(e) => updateBullet(proj.id, i, e.target.value)} />
                      <button onClick={() => removeBullet(proj.id, i)} className="accordion-bullet-delete-btn">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="accordion-bullet-actions">
                    <Button variant="ghost" size="sm" onClick={() => addBullet(proj.id)}>
                      <Plus className="w-3.5 h-3.5" /> Add Bullet
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => improveWithAI(proj.id)} loading={improving === proj.id}>
                      <Sparkles className="w-3.5 h-3.5" /> AI Improve
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5" /> Add Project
      </Button>
    </Section>
  );
};
