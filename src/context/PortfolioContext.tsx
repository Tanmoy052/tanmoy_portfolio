import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PersonalInfo,
  ResumeData,
  SkillCategory,
  Project,
  TimelineItem,
  PortfolioData,
  PersonalDocument
} from '../types';
import {
  PERSONAL_INFO as DEFAULT_PERSONAL_INFO,
  PROJECTS as DEFAULT_PROJECTS,
  SKILL_CATEGORIES as DEFAULT_SKILL_CATEGORIES,
  TIMELINE as DEFAULT_TIMELINE,
} from '../data/portfolioData';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

interface PortfolioContextType {
  about: PersonalInfo;
  resume: ResumeData;
  skills: SkillCategory[];
  projects: Project[];
  experiences: TimelineItem[];
  contacts: ContactMessage[];
  adminUsername: string;
  loading: boolean;
  dbStatus: 'connected' | 'disconnected' | 'checking';
  lastSaved: string | null;
  refreshPortfolio: () => Promise<void>;
  updatePortfolioData: (data: Partial<PortfolioData>) => Promise<boolean>;
  uploadResumeFile: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  uploadImageFile: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  refreshContacts: () => Promise<void>;
  deleteContact: (id: string) => Promise<boolean>;
  fetchAdminUser: () => Promise<void>;
  updateAdminCredentials: (payload: { currentPassword: string; newUsername?: string; newPassword?: string; newEmail?: string }) => Promise<{ success: boolean; message?: string; error?: string; username?: string }>;
  documents: PersonalDocument[];
  documentsAuth: boolean;
  documentsLoading: boolean;
  verifyDocumentsAuth: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutDocuments: () => void;
  refreshDocuments: () => Promise<void>;
  uploadDocumentFile: (formData: FormData) => Promise<{ success: boolean; data?: PersonalDocument; error?: string }>;
  deleteDocumentFile: (id: string) => Promise<boolean>;
}

const defaultResume: ResumeData = {
  pdfUrl: '/Tanmoy_Pal_Resume.pdf',
  headline: 'Full-Stack Developer & UI/UX Craftsman',
  lastUpdated: new Date().toISOString().split('T')[0],
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [about, setAbout] = useState<PersonalInfo>(DEFAULT_PERSONAL_INFO);
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [skills, setSkills] = useState<SkillCategory[]>(DEFAULT_SKILL_CATEGORIES);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState<TimelineItem[]>(DEFAULT_TIMELINE);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [documentsAuth, setDocumentsAuth] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('documents_auth') === 'true';
    }
    return false;
  });
  const [documentsLoading, setDocumentsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const refreshPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.about) setAbout(json.data.about);
          if (json.data.resume) setResume(json.data.resume);
          if (json.data.skills && json.data.skills.length > 0) setSkills(json.data.skills);
          if (json.data.projects && json.data.projects.length > 0) setProjects(json.data.projects);
          if (json.data.experiences && json.data.experiences.length > 0) setExperiences(json.data.experiences);
          setDbStatus('connected');
        }
      }
    } catch (err) {
      console.warn('Could not fetch portfolio from backend API, using cached data:', err);
      setDbStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  const refreshContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setContacts(json.data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch contacts:', err);
    }
  };

  const updatePortfolioData = async (data: Partial<PortfolioData>): Promise<boolean> => {
    try {
      if (data.about) setAbout(data.about);
      if (data.resume) setResume(data.resume);
      if (data.skills) setSkills(data.skills);
      if (data.projects) setProjects(data.projects);
      if (data.experiences) setExperiences(data.experiences);

      const res = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLastSaved(new Date().toLocaleTimeString());
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Failed to update portfolio data:', err);
      return false;
    }
  };

  const uploadResumeFile = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await fetch('/api/admin/resume', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setResume(prev => ({
          ...prev,
          pdfUrl: json.pdfUrl || prev.pdfUrl,
          lastUpdated: json.lastUpdated || new Date().toISOString().split('T')[0],
        }));
        setLastSaved(new Date().toLocaleTimeString());
        return { success: true, url: json.pdfUrl };
      }
      return { success: false, error: json.error || 'Upload failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error uploading resume' };
    }
  };

  const uploadImageFile = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, url: json.url };
      }
      return { success: false, error: json.error || 'Image upload failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error uploading image' };
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts(prev => prev.filter(c => c._id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete contact:', err);
      return false;
    }
  };

  const [adminUsername, setAdminUsername] = useState<string>('tanmoypal30102004');

  const fetchAdminUser = async () => {
    try {
      const res = await fetch('/api/admin/user');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.username) {
          setAdminUsername(json.username);
        }
      }
    } catch (e) {
      console.warn('Could not fetch admin user:', e);
    }
  };

  const updateAdminCredentials = async (payload: {
    currentPassword: string;
    newUsername?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message?: string; error?: string; username?: string }> => {
    try {
      const res = await fetch('/api/admin/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (json.username) setAdminUsername(json.username);
        setLastSaved(new Date().toLocaleTimeString());
        return { success: true, message: json.message, username: json.username };
      }
      return { success: false, error: json.error || 'Failed to update credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error updating credentials' };
    }
  };

  const refreshDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const res = await fetch('/api/documents');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDocuments(json.data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch documents:', err);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const verifyDocumentsAuth = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/documents/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        sessionStorage.setItem('documents_auth', 'true');
        if (json.token) sessionStorage.setItem('documents_token', json.token);
        setDocumentsAuth(true);
        await refreshDocuments();
        return { success: true };
      }
      return { success: false, error: json.error || 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification failed. Please check network connection.' };
    }
  };

  const logoutDocuments = () => {
    sessionStorage.removeItem('documents_auth');
    sessionStorage.removeItem('documents_token');
    setDocumentsAuth(false);
  };

  const uploadDocumentFile = async (
    formData: FormData
  ): Promise<{ success: boolean; data?: PersonalDocument; error?: string }> => {
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await refreshDocuments();
        setLastSaved(new Date().toLocaleTimeString());
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || 'Upload failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error uploading document' };
    }
  };

  const deleteDocumentFile = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setDocuments((prev) => prev.filter((d) => d._id !== id));
          setLastSaved(new Date().toLocaleTimeString());
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Failed to delete document:', err);
      return false;
    }
  };

  useEffect(() => {
    refreshPortfolio();
    refreshContacts();
    fetchAdminUser();
    refreshDocuments();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        about,
        resume,
        skills,
        projects,
        experiences,
        contacts,
        adminUsername,
        documents,
        documentsAuth,
        documentsLoading,
        loading,
        dbStatus,
        lastSaved,
        refreshPortfolio,
        updatePortfolioData,
        uploadResumeFile,
        uploadImageFile,
        refreshContacts,
        deleteContact,
        fetchAdminUser,
        updateAdminCredentials,
        verifyDocumentsAuth,
        logoutDocuments,
        refreshDocuments,
        uploadDocumentFile,
        deleteDocumentFile,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
