import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from '../../utils/nanoid';
import type { SkillCategory } from '../../types/resume';

export const SkillsForm: React.FC = () => {
  const { resumeData, setSkillCategories } = useResumeStore();
  const cats = resumeData.skillCategories;

  const add = () =>
    setSkillCategories([...cats, { id: nanoid(), category: '', skills: '' }]);

  const update = (id: string, field: keyof SkillCategory, value: string) =>
    setSkillCategories(cats.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const remove = (id: string) =>
    setSkillCategories(cats.filter((c) => c.id !== id));

  return (
    <Section title="Technical Skills">
      <div className="skills-list">
        {cats.map((cat) => (
          <div key={cat.id} className="skill-row">
            <Input
              placeholder="Category"
              value={cat.category}
              onChange={(e) => update(cat.id, 'category', e.target.value)}
              className="skill-category-input"
            />
            <Input
              placeholder="React, Node.js, TypeScript..."
              value={cat.skills}
              onChange={(e) => update(cat.id, 'skills', e.target.value)}
            />
            <button onClick={() => remove(cat.id)} className="skill-remove-btn">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={add}>
        <Plus className="w-3.5 h-3.5" /> Add Category
      </Button>
    </Section>
  );
};
