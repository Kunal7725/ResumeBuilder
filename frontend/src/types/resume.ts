export interface PersonalInfo {
  name: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  github: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string;
  link: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  gpa?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  skillCategories: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
}

export type TemplateType = 'minimal' | 'modern' | 'professional';

export interface User {
  id: string;
  email: string;
  name: string;
}
