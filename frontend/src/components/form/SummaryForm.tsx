import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { Sparkles } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const SummaryForm: React.FC = () => {
  const { resumeData, setSummary } = useResumeStore();
  const [loading, setLoading] = useState(false);

  const improve = async () => {
    if (!resumeData.summary.trim()) return toast.error('Write a summary first');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/improve-summary', {
        summary: resumeData.summary,
        role: resumeData.personalInfo.role,
      });
      setSummary(data.improved);
      toast.success('Summary improved!');
    } catch {
      toast.error('AI improvement failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section title="Professional Summary">
      <Textarea
        label="Summary"
        rows={4}
        placeholder="Results-driven developer with 3+ years of experience..."
        value={resumeData.summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <Button variant="secondary" size="sm" onClick={improve} loading={loading}>
        <Sparkles className="w-3.5 h-3.5" /> Improve with AI
      </Button>
    </Section>
  );
};
