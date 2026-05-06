import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { nanoid } from '../../utils/nanoid';
import type { Experience } from '../../types/resume';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const emptyExp = (): Experience => ({
  id: nanoid(), company: '', role: '', duration: '', location: '', bullets: [''],
});

export const ExperienceForm: React.FC = () => {
  const { resumeData, setExperiences } = useResumeStore();
  const exps = resumeData.experiences;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [improving, setImproving] = useState<string | null>(null);

  const add = () => {
    const e = emptyExp();
    setExperiences([...exps, e]);
    setExpanded(e.id);
  };

  const update = (id: string, field: keyof Experience, value: unknown) =>
    setExperiences(exps.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const remove = (id: string) => setExperiences(exps.filter((e) => e.id !== id));

  const updateBullet = (id: string, idx: number, val: string) => {
    const exp = exps.find((e) => e.id === id)!;
    const bullets = [...exp.bullets];
    bullets[idx] = val;
    update(id, 'bullets', bullets);
  };

  const addBullet = (id: string) => {
    const exp = exps.find((e) => e.id === id)!;
    update(id, 'bullets', [...exp.bullets, '']);
  };

  const removeBullet = (id: string, idx: number) => {
    const exp = exps.find((e) => e.id === id)!;
    update(id, 'bullets', exp.bullets.filter((_, i) => i !== idx));
  };

  const improveWithAI = async (id: string) => {
    const exp = exps.find((e) => e.id === id)!;
    setImproving(id);
    try {
      const { data } = await api.post('/ai/improve-bullets', { bullets: exp.bullets, context: `${exp.role} at ${exp.company}` });
      update(id, 'bullets', data.improved);
      toast.success('Bullets improved!');
    } catch {
      toast.error('AI improvement failed.');
    } finally {
      setImproving(null);
    }
  };

  return (
    <Section title="Experience">
      <div className="accordion-list">
        {exps.map((exp) => (
          <div key={exp.id} className="accordion-item">
            <div className="accordion-header">
              <button className="accordion-title-btn"
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}>
                {exp.company || 'New Experience'} {exp.role && `— ${exp.role}`}
              </button>
              <div className="accordion-header-actions">
                <button onClick={() => setExpanded(expanded === exp.id ? null : exp.id)} className="accordion-toggle-btn">
                  {expanded === exp.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(exp.id)} className="accordion-delete-btn">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {expanded === exp.id && (
              <div className="accordion-body">
                <div className="accordion-fields-grid">
                  <Input placeholder="Company" value={exp.company} onChange={(e) => update(exp.id, 'company', e.target.value)} />
                  <Input placeholder="Role / Title" value={exp.role} onChange={(e) => update(exp.id, 'role', e.target.value)} />
                  <Input placeholder="Duration (e.g. Jan 2022 – Present)" value={exp.duration} onChange={(e) => update(exp.id, 'duration', e.target.value)} />
                  <Input placeholder="Location" value={exp.location} onChange={(e) => update(exp.id, 'location', e.target.value)} />
                </div>
                <div className="accordion-bullets-section">
                  <label className="accordion-bullets-label">Bullet Points</label>
                  {exp.bullets.map((b, i) => (
                    <div key={i} className="accordion-bullet-row">
                      <Textarea rows={2} placeholder="Developed feature X that improved Y by Z%..." value={b}
                        onChange={(e) => updateBullet(exp.id, i, e.target.value)} />
                      <button onClick={() => removeBullet(exp.id, i)} className="accordion-bullet-delete-btn">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="accordion-bullet-actions">
                    <Button variant="ghost" size="sm" onClick={() => addBullet(exp.id)}>
                      <Plus className="w-3.5 h-3.5" /> Add Bullet
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => improveWithAI(exp.id)} loading={improving === exp.id}>
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
        <Plus className="w-3.5 h-3.5" /> Add Experience
      </Button>
    </Section>
  );
};
