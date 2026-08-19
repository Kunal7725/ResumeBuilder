import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeData, TemplateType, User } from '../types/resume';
import { nanoid } from '../utils/nanoid';

interface ResumeStore {
  resumeData: ResumeData;
  template: TemplateType;
  darkMode: boolean;
  user: User | null;
  token: string | null;
  setPersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  setSummary: (summary: string) => void;
  setSkillCategories: (cats: ResumeData['skillCategories']) => void;
  setExperiences: (exps: ResumeData['experiences']) => void;
  setProjects: (projects: ResumeData['projects']) => void;
  setEducation: (edu: ResumeData['education']) => void;
  setTemplate: (t: TemplateType) => void;
  toggleDarkMode: () => void;
  setUser: (user: User | null, token: string | null) => void;
  importData: (data: ResumeData) => void;
}

const defaultData: ResumeData = {
  personalInfo: { name: '', role: '', location: '', phone: '', email: '', github: '', portfolio: '' },
  summary: '',
  skillCategories: [{ id: nanoid(), category: 'Languages', skills: '' }],
  experiences: [],
  projects: [],
  education: [],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: defaultData,
      template: 'minimal',
      darkMode: false,
      user: null,
      token: null,
      setPersonalInfo: (info) =>
        set((s) => ({ resumeData: { ...s.resumeData, personalInfo: { ...s.resumeData.personalInfo, ...info } } })),
      setSummary: (summary) => set((s) => ({ resumeData: { ...s.resumeData, summary } })),
      setSkillCategories: (skillCategories) => set((s) => ({ resumeData: { ...s.resumeData, skillCategories } })),
      setExperiences: (experiences) => set((s) => ({ resumeData: { ...s.resumeData, experiences } })),
      setProjects: (projects) => set((s) => ({ resumeData: { ...s.resumeData, projects } })),
      setEducation: (education) => set((s) => ({ resumeData: { ...s.resumeData, education } })),
      setTemplate: (template) => set({ template }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setUser: (user, token) => set({ user, token }),
      importData: (data) => set({ resumeData: data }),
    }),
    { name: 'resume-builder' }
  )
);
