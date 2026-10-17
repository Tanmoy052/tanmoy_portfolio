export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Full Stack' | 'Frontend' | 'AI & ML' | 'Mini Apps';
  tags: string[];
  featured: boolean;
  image: string;
  demoUrl: string;
  githubUrl: string;
  starsCount: number;
  metrics: { label: string; value: string }[];
  features: string[];
  architecture: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface SkillCategory {
  id: string;
  title: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 0-100
    experience: string;
    description: string;
    icon: string;
  }[];
}

export interface TimelineItem {
  id: string;
  year: string;
  role: string;
  companyOrInstitution: string;
  location: string;
  type: 'Education' | 'Experience' | 'Hackathon' | 'Achievement';
  description: string;
  skillsUsed: string[];
  highlights: string[];
}

export type ThemeMode = 'dark' | 'light' | 'matrix';
export type AccentColor = 'emerald' | 'indigo' | 'cyan' | 'amber' | 'rose';

export interface AuditPoint {
  area: string;
  observation: string;
  improvementMade: string;
  impactScore: string;
}

export interface PersonalInfo {
  name: string;
  tagline: string;
  avatar: string;
  subTagline: string;
  bio: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  location: string;
  status: string;
  stats: { label: string; value: string }[];
}

export interface ResumeData {
  pdfUrl: string;
  headline?: string;
  lastUpdated?: string;
}

export interface PortfolioData {
  about: PersonalInfo;
  resume: ResumeData;
  skills: SkillCategory[];
  projects: Project[];
  experiences: TimelineItem[];
}
