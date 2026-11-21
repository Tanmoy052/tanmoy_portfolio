import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FileText,
  User,
  Cpu,
  FolderGit2,
  Briefcase,
  Mail,
  Save,
  Upload,
  Trash2,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowLeft,
  Lock,
  Eye,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  Check,
  Calendar,
  Layers,
  GraduationCap,
  Shield,
  KeyRound,
  EyeOff,
  Copy,
  Search,
  SlidersHorizontal,
  Activity,
  LogOut,
  Clock,
  TrendingUp,
  Share2,
  CheckSquare,
  Download,
  ArrowUp,
  ArrowDown,
  Star,
  FileSpreadsheet,
  Code2,
  RotateCcw,
  FileUp,
  X,
  Compass,
  Zap,
  Globe,
  Sliders,
  Award
} from 'lucide-react';
import { Project, SkillCategory, TimelineItem } from '../../types';
import { AdminLogin } from './AdminLogin';

interface AdminPanelProps {
  onBackToPortfolio: () => void;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToPortfolio, onLogout }) => {
  const {
    about,
    resume,
    skills,
    projects,
    experiences,
    contacts,
    adminUsername,
    documents,
    dbStatus,
    lastSaved,
    updatePortfolioData,
    uploadResumeFile,
    uploadImageFile,
    refreshPortfolio,
    refreshContacts,
    deleteContact,
    updateAdminCredentials,
    uploadDocumentFile,
    deleteDocumentFile,
    refreshDocuments,
  } = usePortfolio();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });

  // Active Tab
  type TabType = 'resume' | 'about' | 'skills' | 'projects' | 'experiences' | 'documents' | 'contacts' | 'account';
  const [activeTab, setActiveTab] = useState<TabType>('resume');

  // Local Form States
  const [localAbout, setLocalAbout] = useState(about);
  const [localResume, setLocalResume] = useState(resume);
  const [localSkills, setLocalSkills] = useState(skills);
  const [localProjects, setLocalProjects] = useState(projects);
  const [localExperiences, setLocalExperiences] = useState(experiences);

  // User Credentials Update State
  const [userForm, setUserForm] = useState({
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState<string | null>(null);
  const [userUpdateError, setUserUpdateError] = useState<string | null>(null);

  // UI Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [copiedResumeUrl, setCopiedResumeUrl] = useState(false);

  // Filter & Search States
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [projectFeaturedOnly, setProjectFeaturedOnly] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [previewPdfExpanded, setPreviewPdfExpanded] = useState(true);

  // Personal Documents States
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Academic');
  const [docDescription, setDocDescription] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docUploading, setDocUploading] = useState(false);
  const [docUploadProgress, setDocUploadProgress] = useState<number>(0);
  const [docSearch, setDocSearch] = useState('');
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // Project Editor Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Unsaved Changes Tracking
  const hasUnsavedChanges = useMemo(() => {
    return (
      JSON.stringify(localAbout) !== JSON.stringify(about) ||
      JSON.stringify(localResume) !== JSON.stringify(resume) ||
      JSON.stringify(localSkills) !== JSON.stringify(skills) ||
      JSON.stringify(localProjects) !== JSON.stringify(projects) ||
      JSON.stringify(localExperiences) !== JSON.stringify(experiences)
    );
  }, [localAbout, localResume, localSkills, localProjects, localExperiences, about, resume, skills, projects, experiences]);

  // Sync initial context data to local state if context updates and user hasn't made local edits
  useEffect(() => {
    setLocalAbout(about);
    setLocalResume(resume);
    setLocalSkills(skills);
    setLocalProjects(projects);
    setLocalExperiences(experiences);
  }, [about, resume, skills, projects, experiences]);

  // Keyboard shortcut Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localAbout, localResume, localSkills, localProjects, localExperiences]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_token');
    if (onLogout) onLogout();
  };

  const handleDiscardChanges = () => {
    if (confirm('Are you sure you want to discard unsaved changes? This will revert back to the database state.')) {
      setLocalAbout(about);
      setLocalResume(resume);
      setLocalSkills(skills);
      setLocalProjects(projects);
      setLocalExperiences(experiences);
      showToast('Unsaved changes discarded.', 'info');
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      showToast('Please enter a document title.', 'error');
      return;
    }
    if (!docFile) {
      showToast('Please select a PDF document file to upload.', 'error');
      return;
    }

    setDocUploading(true);
    setDocUploadProgress(0);
    const formData = new FormData();
    formData.append('title', docTitle.trim());
    formData.append('category', docCategory);
    formData.append('description', docDescription.trim());
    formData.append('file', docFile);

    const res = await uploadDocumentFile(formData, (percent) => {
      setDocUploadProgress(percent);
    });
    setDocUploading(false);
    setDocUploadProgress(0);

    if (res.success) {
      showToast(`Document "${docTitle}" added to vault!`, 'success');
      setDocTitle('');
      setDocDescription('');
      setDocFile(null);
      if (docFileInputRef.current) docFileInputRef.current.value = '';
    } else {
      showToast(res.error || 'Failed to upload document', 'error');
    }
  };

  const handleDeleteDocument = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    setDeletingDocId(id);
    const success = await deleteDocumentFile(id);
    setDeletingDocId(null);
    if (success) {
      showToast(`Document "${title}" removed from vault.`, 'success');
    } else {
      showToast('Failed to delete document.', 'error');
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const success = await updatePortfolioData({
      about: localAbout,
      resume: localResume,
      skills: localSkills,
      projects: localProjects,
      experiences: localExperiences,
    });
    setIsSaving(false);

    if (success) {
      showToast('All changes successfully saved and synced to MongoDB Atlas!', 'success');
    } else {
      showToast('Failed to save changes. Please check server connection.', 'error');
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a valid PDF file for the resume.', 'error');
      return;
    }

    setResumeUploading(true);
    const res = await uploadResumeFile(file);
    setResumeUploading(false);

    if (res.success && res.url) {
      setLocalResume(prev => ({
        ...prev,
        pdfUrl: res.url!,
        lastUpdated: new Date().toISOString().split('T')[0],
      }));
      showToast('Updated resume PDF uploaded and live across portfolio!', 'success');
    } else {
      showToast(res.error || 'Failed to upload resume file.', 'error');
    }
  };

  const handleCopyResumeUrl = () => {
    const fullUrl = window.location.origin + localResume.pdfUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopiedResumeUrl(true);
    setTimeout(() => setCopiedResumeUrl(false), 2000);
    showToast('Resume link copied to clipboard!');
  };

  // Export full backup JSON
  const handleExportBackup = () => {
    const backupData = {
      about: localAbout,
      resume: localResume,
      skills: localSkills,
      projects: localProjects,
      experiences: localExperiences,
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tanmoy-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Portfolio JSON backup downloaded successfully!', 'success');
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.about) setLocalAbout(parsed.about);
        if (parsed.resume) setLocalResume(parsed.resume);
        if (parsed.skills) setLocalSkills(parsed.skills);
        if (parsed.projects) setLocalProjects(parsed.projects);
        if (parsed.experiences) setLocalExperiences(parsed.experiences);
        showToast('Backup JSON imported into working session. Click "Save Changes" to commit!', 'info');
      } catch (err) {
        showToast('Invalid JSON file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Export contact inquiries to CSV
  const handleExportContactsCSV = () => {
    if (contacts.length === 0) {
      showToast('No messages to export.', 'info');
      return;
    }
    const headers = ['Name', 'Email', 'Subject', 'Date', 'Message'];
    const rows = contacts.map(c => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.subject || '').replace(/"/g, '""')}"`,
      `"${new Date(c.createdAt).toLocaleString()}"`,
      `"${(c.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `portfolio-inquiries-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inquiries exported to CSV spreadsheet!', 'success');
  };

  // Move project up or down
  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localProjects.length) return;
    const updated = [...localProjects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setLocalProjects(updated);
  };

  // Toggle Project Featured
  const toggleProjectFeatured = (index: number) => {
    const updated = [...localProjects];
    updated[index].featured = !updated[index].featured;
    setLocalProjects(updated);
    showToast(`Project "${updated[index].title}" ${updated[index].featured ? 'featured on home' : 'unfeatured'}.`);
  };

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    const pwd = userForm.newPassword;
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  }, [userForm.newPassword]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserUpdateError(null);
    setUserUpdateSuccess(null);

    if (!userForm.currentPassword) {
      setUserUpdateError('Please enter your current password to authorize changes.');
      return;
    }

    if (userForm.newPassword && userForm.newPassword.length < 6) {
      setUserUpdateError('New password must be at least 6 characters long.');
      return;
    }

    if (userForm.newPassword && userForm.newPassword !== userForm.confirmPassword) {
      setUserUpdateError('New password and confirmation do not match.');
      return;
    }

    if (!userForm.newUsername && !userForm.newPassword) {
      setUserUpdateError('Please provide a new username or new password to update.');
      return;
    }

    setIsUpdatingUser(true);
    const res = await updateAdminCredentials({
      currentPassword: userForm.currentPassword,
      newUsername: userForm.newUsername.trim() || undefined,
      newPassword: userForm.newPassword.trim() || undefined,
    });
    setIsUpdatingUser(false);

    if (res.success) {
      setUserUpdateSuccess(res.message || 'Credentials successfully updated in MongoDB Atlas!');
      setUserForm({
        newUsername: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      showToast('Admin credentials updated successfully!', 'success');
      setTimeout(() => setUserUpdateSuccess(null), 5000);
    } else {
      setUserUpdateError(res.error || 'Failed to update credentials.');
    }
  };

  // ------------------- LOGIN VIEW DELEGATION -------------------
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        onBackToPortfolio={onBackToPortfolio}
      />
    );
  }

  // Calculate quick metrics
  const totalSkillsCount = localSkills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const featuredProjectsCount = localProjects.filter(p => p.featured).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative">
      
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/5 blur-[140px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-600/5 blur-[140px] rounded-full" />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-medium ${
              toastMessage.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10'
                : toastMessage.type === 'info'
                ? 'bg-slate-900/95 border-cyan-500/40 text-cyan-300 shadow-cyan-500/10'
                : 'bg-slate-900/95 border-rose-500/40 text-rose-300 shadow-rose-500/10'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'info' ? (
              <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-2xl border-b border-slate-800/80 px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBackToPortfolio}
              className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition border border-slate-800 hover:border-slate-700 shadow-sm"
              title="Return to Public Portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Tanmoy Pal
                  </span>
                  <span className="text-slate-400 font-light text-xs sm:text-sm">Control Console</span>
                </h1>
                
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  dbStatus === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {dbStatus === 'connected' ? 'MongoDB Atlas Live' : 'Connecting DB'}
                </span>

                {hasUnsavedChanges && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                    ● Unsaved Changes
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {lastSaved ? `Synced with Atlas at ${lastSaved}` : 'Enterprise portfolio management'}
              </p>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {hasUnsavedChanges && (
              <button
                onClick={handleDiscardChanges}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition"
                title="Discard unsaved local changes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Discard
              </button>
            )}

            <button
              onClick={handleExportBackup}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-800 transition"
              title="Download JSON backup of all portfolio data"
            >
              <Download className="w-3.5 h-3.5" />
              Backup JSON
            </button>

            <button
              onClick={onBackToPortfolio}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              View Site
            </button>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 cursor-pointer border border-emerald-400/20 active:scale-95"
              title="Save All Changes (Ctrl + S)"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-850 hover:border-rose-900/40 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
              title="Logout from console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 z-10">
        
        {/* KPI Summary Cards Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Projects</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">{localProjects.length}</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <Star className="w-3 h-3 fill-emerald-400/30" /> {featuredProjectsCount} Featured Highlights
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skills Catalog</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">{totalSkillsCount}</h3>
              <p className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5 font-medium">
                <Layers className="w-3 h-3" /> {localSkills.length} Tech Domains
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inquiries Received</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">{contacts.length}</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <Database className="w-3 h-3" /> MongoDB Atlas Synced
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('documents')}
            className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-sm cursor-pointer"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vault Documents</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">{documents.length}</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <FileText className="w-3 h-3" /> Protected PDF Vault
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Resume</p>
              <h3 className="text-xs font-bold text-white mt-1 truncate max-w-[130px]">
                {localResume.lastUpdated || 'Up to date'}
              </h3>
              <button
                onClick={handleCopyResumeUrl}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-0.5 font-semibold transition cursor-pointer"
              >
                {copiedResumeUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedResumeUrl ? 'Copied Link' : 'Copy Direct PDF'}
              </button>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Main Body: Sidebar + Main Workspace */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Navigation Sidebar */}
          <nav className="w-full md:w-64 shrink-0 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-3 flex flex-row md:flex-col gap-1.5 overflow-x-auto shadow-sm">
            
            <div className="hidden md:block px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Portfolio Content
            </div>

            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'resume'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume PDF</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'about'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>About & Bio</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'skills'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                <span>Skills Matrix</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-800 font-bold text-slate-300">
                {totalSkillsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" />
                <span>Projects</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-800 font-bold text-slate-300">
                {localProjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('experiences')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'experiences'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experience & Edu</span>
            </button>

            <div className="hidden md:block my-2 border-t border-slate-800" />
            <div className="hidden md:block px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Communications
            </div>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'contacts'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Inquiries</span>
              </span>
              {contacts.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {contacts.length}
                </span>
              )}
            </button>

            <div className="hidden md:block my-2 border-t border-slate-800" />
            <div className="hidden md:block px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Documents Vault
            </div>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Personal Documents</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                {documents.length}
              </span>
            </button>

            <div className="hidden md:block my-2 border-t border-slate-800" />
            <div className="hidden md:block px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Administration
            </div>

            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'account'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Account & Security</span>
            </button>

            {/* Bottom Admin User & System Pill */}
            <div className="hidden md:flex flex-col gap-2 mt-auto p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  TP
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{adminUsername}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Superadmin
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500">
                <label className="hover:text-emerald-400 cursor-pointer flex items-center gap-1">
                  <FileUp className="w-3 h-3" />
                  Import JSON
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
                <span className="text-[9px] font-mono">v2.1 • Atlas</span>
              </div>
            </div>

          </nav>

          {/* Main Content Workspace Card */}
          <main className="flex-1 bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
            
            {/* ======================= TAB: RESUME ======================= */}
            {activeTab === 'resume' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      Resume & PDF Document Management
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload your updated PDF resume. It immediately overrides the public download file and synchronizes across the entire portfolio.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyResumeUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                    >
                      {copiedResumeUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedResumeUrl ? 'Copied' : 'Share Resume URL'}
                    </button>
                    <a
                      href={localResume.pdfUrl}
                      download="Tanmoy_Pal_Resume.pdf"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>

                {/* Upload Hero Dropzone */}
                <div className="p-8 border-2 border-dashed border-slate-700/80 hover:border-emerald-500 rounded-3xl bg-slate-950/60 text-center transition-all flex flex-col items-center justify-center relative group">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">Upload New Resume PDF</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Drag and drop your updated PDF resume here, or click to browse (up to 25MB). Auto-saved directly to <code className="text-emerald-400 font-mono">Tanmoy_Pal_Resume.pdf</code>.
                  </p>

                  <label className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl cursor-pointer transition shadow-lg shadow-emerald-600/20 active:scale-95">
                    <Upload className="w-4 h-4" />
                    {resumeUploading ? 'Uploading & Syncing...' : 'Select PDF File to Upload'}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleResumeUpload}
                      disabled={resumeUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Live Resume Details Bar */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">Tanmoy_Pal_Resume.pdf</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active Public Document
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Path: {localResume.pdfUrl}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Last Updated: {localResume.lastUpdated || 'Recently updated'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setPreviewPdfExpanded(!previewPdfExpanded)}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
                    >
                      {previewPdfExpanded ? 'Hide Embedded Inspector' : 'Show Embedded Inspector'}
                    </button>
                    <a
                      href={localResume.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Fullscreen Preview
                    </a>
                  </div>
                </div>

                {/* Resume Headline & Metadata Inputs */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    Resume Metadata & Headline Banner
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Headline on Resume Badge</label>
                      <input
                        type="text"
                        value={localResume.headline || ''}
                        onChange={(e) => setLocalResume({ ...localResume, headline: e.target.value })}
                        placeholder="e.g. Full-Stack Developer & UI/UX Craftsman"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Last Updated Display Date</label>
                      <input
                        type="text"
                        value={localResume.lastUpdated || ''}
                        onChange={(e) => setLocalResume({ ...localResume, lastUpdated: e.target.value })}
                        placeholder="e.g. 2026-10-16"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* PDF Viewer Embed */}
                {previewPdfExpanded && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-2 overflow-hidden shadow-inner">
                    <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 rounded-t-xl flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-300">Live Embedded PDF Inspector</span>
                        <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Synchronized
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={localResume.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-400 flex items-center gap-1 text-[11px] transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          New Tab
                        </a>
                      </div>
                    </div>
                    <div className="h-[460px] sm:h-[540px] w-full bg-slate-900/50 rounded-b-xl overflow-hidden relative">
                      <object
                        data={`${localResume.pdfUrl}`}
                        type="application/pdf"
                        className="w-full h-full border-0"
                      >
                        <iframe
                          src={`${localResume.pdfUrl}`}
                          title="Resume Preview"
                          className="w-full h-full border-0"
                        >
                          <div className="p-8 text-center flex flex-col items-center justify-center h-full space-y-3">
                            <FileText className="w-12 h-12 text-slate-600" />
                            <p className="text-sm font-semibold text-white">Preview PDF Document</p>
                            <p className="text-xs text-slate-400 max-w-sm">
                              Your browser has embedded PDF viewing blocked or disabled. You can open or download the file directly.
                            </p>
                            <a
                              href={localResume.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                            >
                              Open Resume in Full Tab
                            </a>
                          </div>
                        </iframe>
                      </object>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ======================= TAB: ABOUT & BIO ======================= */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800/80 pb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <User className="w-5 h-5 text-emerald-400" />
                    About & Bio Customization
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Control how your personal profile, headline, biography, availability, and social links appear to recruiters and visitors.
                  </p>
                </div>

                {/* Profile Avatar & Hero Banner Quick Preview */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 overflow-hidden">
                      <img
                        src={localAbout.avatar || '/projects/cgec_website.png'}
                        alt={localAbout.name}
                        className="w-full h-full object-cover rounded-[14px]"
                        onError={(e) => {
                          // Fallback avatar icon
                          (e.target as any).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>
                    <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition text-[10px] text-emerald-300 font-bold">
                      <Upload className="w-4 h-4 mb-0.5" />
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const res = await uploadImageFile(file);
                          if (res.success && res.url) {
                            setLocalAbout({ ...localAbout, avatar: res.url });
                            showToast('Avatar updated!');
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white">{localAbout.name || 'Tanmoy Pal'}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {localAbout.status || 'Available for Opportunities'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{localAbout.tagline || 'Crafting scalable web systems'}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{localAbout.location || 'India'} &bull; {localAbout.email || 'tanmoypal30102004@gmail.com'}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={localAbout.name}
                      onChange={(e) => setLocalAbout({ ...localAbout, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Current Availability Status
                    </label>
                    <input
                      type="text"
                      value={localAbout.status}
                      onChange={(e) => setLocalAbout({ ...localAbout, status: e.target.value })}
                      placeholder="e.g. Open for Full-Time Roles & Projects"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Hero Primary Tagline
                    </label>
                    <input
                      type="text"
                      value={localAbout.tagline}
                      onChange={(e) => setLocalAbout({ ...localAbout, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Specialization Sub-Tagline
                    </label>
                    <input
                      type="text"
                      value={localAbout.subTagline}
                      onChange={(e) => setLocalAbout({ ...localAbout, subTagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Full Biography & Background
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {localAbout.bio?.length || 0} characters &bull; {localAbout.bio?.split(/\s+/).filter(Boolean).length || 0} words
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={localAbout.bio}
                      onChange={(e) => setLocalAbout({ ...localAbout, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden resize-y leading-relaxed font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={localAbout.email}
                      onChange={(e) => setLocalAbout({ ...localAbout, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={localAbout.phone}
                      onChange={(e) => setLocalAbout({ ...localAbout, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={localAbout.location}
                      onChange={(e) => setLocalAbout({ ...localAbout, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={localAbout.github}
                      onChange={(e) => setLocalAbout({ ...localAbout, github: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={localAbout.linkedin}
                      onChange={(e) => setLocalAbout({ ...localAbout, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Twitter / X Profile URL
                    </label>
                    <input
                      type="url"
                      value={localAbout.twitter}
                      onChange={(e) => setLocalAbout({ ...localAbout, twitter: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-hidden"
                    />
                  </div>
                </div>

                {/* Stats Counters */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Hero Metrics & Counters
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setLocalAbout({
                          ...localAbout,
                          stats: [...(localAbout.stats || []), { label: 'New Metric', value: '10+' }],
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Stat
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {localAbout.stats?.map((stat, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...localAbout.stats];
                            updated[idx].value = e.target.value;
                            setLocalAbout({ ...localAbout, stats: updated });
                          }}
                          className="w-24 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-black text-xs"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...localAbout.stats];
                            updated[idx].label = e.target.value;
                            setLocalAbout({ ...localAbout, stats: updated });
                          }}
                          className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = localAbout.stats.filter((_, i) => i !== idx);
                            setLocalAbout({ ...localAbout, stats: updated });
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================= TAB: SKILLS ======================= */}
            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      Technical Skills Matrix
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure technical categories and fine-tune your proficiency levels and descriptions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newCat: SkillCategory = {
                          id: `cat-${Date.now()}`,
                          title: 'New Domain',
                          iconName: 'Cpu',
                          skills: [],
                        };
                        setLocalSkills([...localSkills, newCat]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20"
                    >
                      <Plus className="w-4 h-4" />
                      Add Category
                    </button>
                  </div>
                </div>

                {/* Skill Filter Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Quick search across skills by name or keyword..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-6">
                  {localSkills.map((cat, catIdx) => {
                    const filteredSkills = cat.skills.filter(s =>
                      !skillSearch ||
                      s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
                      s.description?.toLowerCase().includes(skillSearch.toLowerCase())
                    );

                    if (skillSearch && filteredSkills.length === 0) return null;

                    return (
                      <div key={cat.id || catIdx} className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
                          <div className="flex items-center gap-2.5 flex-1 max-w-sm">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                              <Layers className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={cat.title}
                              onChange={(e) => {
                                const updated = [...localSkills];
                                updated[catIdx].title = e.target.value;
                                setLocalSkills(updated);
                              }}
                              className="bg-transparent font-bold text-sm text-white border-b border-dashed border-slate-700 hover:border-emerald-500 outline-hidden px-1"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...localSkills];
                                updated[catIdx].skills.push({
                                  name: 'New Skill',
                                  level: 85,
                                  experience: '2+ yrs',
                                  description: 'Description of tools and capabilities',
                                  icon: 'Code2',
                                });
                                setLocalSkills(updated);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Skill
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete entire category "${cat.title}"?`)) {
                                  setLocalSkills(localSkills.filter((_, i) => i !== catIdx));
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Skill Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {filteredSkills.map((skill, sIdx) => {
                            const origIdx = cat.skills.findIndex(s => s === skill);
                            const skillLevel = skill.level || 0;
                            const levelBadgeColor =
                              skillLevel >= 90
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : skillLevel >= 75
                                ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                                : skillLevel >= 50
                                ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

                            return (
                              <div key={sIdx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => {
                                      const updated = [...localSkills];
                                      updated[catIdx].skills[origIdx].name = e.target.value;
                                      setLocalSkills(updated);
                                    }}
                                    className="font-bold text-xs text-white bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 flex-1 max-w-[140px]"
                                  />
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded border ${levelBadgeColor}`}>
                                      {skill.level}%
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="Exp"
                                      value={skill.experience}
                                      onChange={(e) => {
                                        const updated = [...localSkills];
                                        updated[catIdx].skills[origIdx].experience = e.target.value;
                                        setLocalSkills(updated);
                                      }}
                                      className="w-16 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-medium"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...localSkills];
                                        updated[catIdx].skills.splice(origIdx, 1);
                                        setLocalSkills(updated);
                                      }}
                                      className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={skill.level}
                                    onChange={(e) => {
                                      const updated = [...localSkills];
                                      updated[catIdx].skills[origIdx].level = Number(e.target.value);
                                      setLocalSkills(updated);
                                    }}
                                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                                  />
                                </div>

                                <input
                                  type="text"
                                  placeholder="Key focus & ecosystem knowledge"
                                  value={skill.description}
                                  onChange={(e) => {
                                    const updated = [...localSkills];
                                    updated[catIdx].skills[origIdx].description = e.target.value;
                                    setLocalSkills(updated);
                                  }}
                                  className="text-[11px] text-slate-400 bg-transparent border-b border-slate-800 px-1 py-0.5 outline-hidden"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ======================= TAB: PROJECTS ======================= */}
            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <FolderGit2 className="w-5 h-5 text-emerald-400" />
                      Project Showcase ({localProjects.length})
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage project cards, live demos, repository URLs, screenshot uploads, reordering, and featured highlights.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newProj: Project = {
                        id: `proj-${Date.now()}`,
                        title: 'New Featured Project',
                        shortDescription: 'Concise summary of features and impact.',
                        fullDescription: 'Deep dive into full-stack architecture, API design, and performance optimizations.',
                        category: 'Full Stack',
                        tags: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
                        featured: true,
                        image: '/projects/cgec_website.png',
                        demoUrl: 'https://demo.example.com',
                        githubUrl: 'https://github.com/Tanmoy052/',
                        starsCount: 20,
                        metrics: [{ label: 'Latency', value: '<50ms' }],
                        features: ['Key architectural accomplishment 1', 'Key architectural accomplishment 2'],
                        architecture: ['Client: React + TypeScript', 'API: Express + MongoDB'],
                      };
                      setEditingProject(newProj);
                      setIsNewProject(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search projects by title, description, or tech stack..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Full Stack', 'Frontend', 'AI & ML', 'Mini Apps'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setProjectCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                          projectCategoryFilter === cat
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}

                    <button
                      onClick={() => setProjectFeaturedOnly(!projectFeaturedOnly)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
                        projectFeaturedOnly
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${projectFeaturedOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                      Featured
                    </button>
                  </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localProjects
                    .map((proj, idx) => ({ proj, originalIndex: idx }))
                    .filter(({ proj }) => {
                      const matchesCategory =
                        projectCategoryFilter === 'All' || proj.category === projectCategoryFilter;
                      const matchesFeatured = !projectFeaturedOnly || proj.featured;
                      const q = projectSearch.toLowerCase();
                      const matchesSearch =
                        !projectSearch ||
                        proj.title.toLowerCase().includes(q) ||
                        proj.shortDescription.toLowerCase().includes(q) ||
                        proj.tags?.some((t) => t.toLowerCase().includes(q));
                      return matchesCategory && matchesFeatured && matchesSearch;
                    })
                    .map(({ proj, originalIndex }) => (
                      <div
                        key={proj.id || originalIndex}
                        className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition shadow-lg group relative overflow-hidden"
                      >
                        <div>
                          {/* Image preview thumbnail banner */}
                          {proj.image && (
                            <div className="w-full h-32 rounded-xl mb-3 overflow-hidden bg-slate-900 border border-slate-850 relative group-hover:scale-[1.01] transition-transform">
                              <img
                                src={proj.image}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as any).style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {proj.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => toggleProjectFeatured(originalIndex)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition ${
                                  proj.featured
                                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                                }`}
                                title="Toggle Featured status on portfolio"
                              >
                                <Star className={`w-3 h-3 ${proj.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                                {proj.featured ? 'Featured' : 'Standard'}
                              </button>
                            </div>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {proj.shortDescription}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {proj.tags?.map((t, tidx) => (
                              <span key={tidx} className="text-[10px] font-medium px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Bottom Toolbar */}
                        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {/* Reordering buttons */}
                            <button
                              type="button"
                              onClick={() => moveProject(originalIndex, 'up')}
                              disabled={originalIndex === 0}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 disabled:opacity-30 transition"
                              title="Move project up in display order"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveProject(originalIndex, 'down')}
                              disabled={originalIndex === localProjects.length - 1}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 disabled:opacity-30 transition"
                              title="Move project down in display order"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {proj.demoUrl && (
                              <a
                                href={proj.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-900 transition"
                                title="Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition"
                                title="GitHub"
                              >
                                <FolderGit2 className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProject(proj);
                                setIsNewProject(false);
                              }}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete project "${proj.title}"?`)) {
                                  setLocalProjects(localProjects.filter((_, i) => i !== originalIndex));
                                  showToast(`Project "${proj.title}" removed.`);
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Project Editor Modal */}
                {editingProject && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <FolderGit2 className="w-5 h-5 text-emerald-400" />
                          {isNewProject ? 'Add New Project' : `Edit "${editingProject.title}"`}
                        </h3>
                        <button
                          onClick={() => setEditingProject(null)}
                          className="text-slate-400 hover:text-white text-lg p-1"
                        >
                          &times;
                        </button>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                              Category
                            </label>
                            <select
                              value={editingProject.category}
                              onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold"
                            >
                              <option value="Full Stack">Full Stack</option>
                              <option value="Frontend">Frontend</option>
                              <option value="AI & ML">AI & ML</option>
                              <option value="Mini Apps">Mini Apps</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2 pt-5">
                            <input
                              type="checkbox"
                              id="proj-featured"
                              checked={editingProject.featured}
                              onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                            />
                            <label htmlFor="proj-featured" className="text-white cursor-pointer font-bold">
                              Feature on homepage
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Short Description (Cards)
                          </label>
                          <textarea
                            rows={2}
                            value={editingProject.shortDescription}
                            onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white resize-y"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Full Description (Detail Modal)
                          </label>
                          <textarea
                            rows={3}
                            value={editingProject.fullDescription}
                            onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white resize-y"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                              Live Demo URL
                            </label>
                            <input
                              type="url"
                              value={editingProject.demoUrl}
                              onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                              GitHub Repository URL
                            </label>
                            <input
                              type="url"
                              value={editingProject.githubUrl}
                              onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                            />
                          </div>
                        </div>

                        {/* Interactive Tag Chips */}
                        <div>
                          <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Tech Stack Tags
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {editingProject.tags?.map((t, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 text-xs font-medium"
                              >
                                {t}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedTags = editingProject.tags.filter((_, i) => i !== idx);
                                    setEditingProject({ ...editingProject, tags: updatedTags });
                                  }}
                                  className="text-slate-500 hover:text-rose-400 ml-0.5"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newTagInput.trim()) {
                                  e.preventDefault();
                                  setEditingProject({
                                    ...editingProject,
                                    tags: [...(editingProject.tags || []), newTagInput.trim()],
                                  });
                                  setNewTagInput('');
                                }
                              }}
                              placeholder="Type tag and press Add (or Enter)..."
                              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newTagInput.trim()) {
                                  setEditingProject({
                                    ...editingProject,
                                    tags: [...(editingProject.tags || []), newTagInput.trim()],
                                  });
                                  setNewTagInput('');
                                }
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                            >
                              Add Tag
                            </button>
                          </div>
                        </div>

                        {/* Image Upload for Project */}
                        <div>
                          <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Project Screenshot / Image
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingProject.image}
                              onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                            />
                            <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-3.5 h-3.5" />
                              Upload File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const uploadRes = await uploadImageFile(file);
                                  if (uploadRes.success && uploadRes.url) {
                                    setEditingProject({ ...editingProject, image: uploadRes.url });
                                    showToast('Image uploaded successfully!');
                                  } else {
                                    showToast(uploadRes.error || 'Failed to upload image.', 'error');
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (isNewProject) {
                              setLocalProjects([editingProject, ...localProjects]);
                              showToast(`Project "${editingProject.title}" added.`);
                            } else {
                              setLocalProjects(
                                localProjects.map((p) =>
                                  p.id === editingProject.id ? editingProject : p
                                )
                              );
                              showToast(`Project "${editingProject.title}" updated.`);
                            }
                            setEditingProject(null);
                          }}
                          className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md"
                        >
                          Save Project
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ======================= TAB: EXPERIENCES ======================= */}
            {activeTab === 'experiences' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                      Experience & Education Milestones
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage your career history, developer roles, internships, and university degrees.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newItem: TimelineItem = {
                        id: `item-${Date.now()}`,
                        year: '2026 - Present',
                        role: 'Software Engineer',
                        companyOrInstitution: 'Company or College Name',
                        location: 'Remote / India',
                        type: 'Experience',
                        description: 'Role overview and key accomplishments.',
                        skillsUsed: ['React', 'Node.js', 'MongoDB'],
                        highlights: ['Accomplished key deliverable 1', 'Optimized architecture 2'],
                      };
                      setLocalExperiences([newItem, ...localExperiences]);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Add Milestone
                  </button>
                </div>

                <div className="space-y-4">
                  {localExperiences.map((item, idx) => {
                    const isEdu = item.type === 'Education';
                    const isHack = item.type === 'Hackathon' || item.type === 'Achievement';
                    const typeColor = isEdu
                      ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
                      : isHack
                      ? 'text-amber-400 border-amber-500/20 bg-amber-500/10'
                      : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';

                    return (
                      <div key={item.id || idx} className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 flex flex-col gap-3.5 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            {isEdu ? (
                              <GraduationCap className="w-5 h-5 text-cyan-400" />
                            ) : isHack ? (
                              <Award className="w-5 h-5 text-amber-400" />
                            ) : (
                              <Briefcase className="w-5 h-5 text-emerald-400" />
                            )}
                            <select
                              value={item.type}
                              onChange={(e) => {
                                const updated = [...localExperiences];
                                updated[idx].type = e.target.value as any;
                                setLocalExperiences(updated);
                              }}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${typeColor}`}
                            >
                              <option value="Experience">Experience</option>
                              <option value="Education">Education</option>
                              <option value="Hackathon">Hackathon</option>
                              <option value="Achievement">Achievement</option>
                            </select>
                            <input
                              type="text"
                              value={item.year}
                              onChange={(e) => {
                                const updated = [...localExperiences];
                                updated[idx].year = e.target.value;
                                setLocalExperiences(updated);
                              }}
                              className="bg-slate-900 text-emerald-400 text-xs px-2.5 py-1 rounded-lg border border-slate-800 font-mono font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove this timeline entry?`)) {
                                setLocalExperiences(localExperiences.filter((_, i) => i !== idx));
                                showToast('Milestone removed.');
                              }
                            }}
                            className="text-slate-500 hover:text-rose-400 self-end sm:self-auto p-1.5 hover:bg-rose-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Role / Degree</label>
                            <input
                              type="text"
                              value={item.role}
                              onChange={(e) => {
                                const updated = [...localExperiences];
                                updated[idx].role = e.target.value;
                                setLocalExperiences(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Company / Institution</label>
                            <input
                              type="text"
                              value={item.companyOrInstitution}
                              onChange={(e) => {
                                const updated = [...localExperiences];
                                updated[idx].companyOrInstitution = e.target.value;
                                setLocalExperiences(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Location</label>
                            <input
                              type="text"
                              value={item.location}
                              onChange={(e) => {
                                const updated = [...localExperiences];
                                updated[idx].location = e.target.value;
                                setLocalExperiences(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Skills Used (comma-separated)</label>
                            <input
                              type="text"
                              value={item.skillsUsed?.join(', ') || ''}
                              onChange={(e) => {
                                const skillsArr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                const updated = [...localExperiences];
                                updated[idx].skillsUsed = skillsArr;
                                setLocalExperiences(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-slate-400 font-semibold mb-1">Description / Key Notes</label>
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => {
                                const updated = [...localExperiences];
                                updated[idx].description = e.target.value;
                                setLocalExperiences(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white leading-relaxed resize-y"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ======================= TAB: CONTACTS ======================= */}
            {activeTab === 'contacts' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <Mail className="w-5 h-5 text-emerald-400" />
                      Visitor Messages & Inquiries ({contacts.length})
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Direct contact form submissions recorded in your MongoDB Atlas database.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportContactsCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                      title="Export all leads to CSV"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      Export CSV
                    </button>
                    <button
                      onClick={refreshContacts}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search messages by sender name, email, subject, or keywords..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* Message Cards */}
                {contacts.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs flex flex-col items-center">
                    <Mail className="w-10 h-10 text-slate-700 mb-2" />
                    No contact messages received yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contacts
                      .filter((c) => {
                        if (!contactSearch) return true;
                        const q = contactSearch.toLowerCase();
                        return (
                          c.name?.toLowerCase().includes(q) ||
                          c.email?.toLowerCase().includes(q) ||
                          c.subject?.toLowerCase().includes(q) ||
                          c.message?.toLowerCase().includes(q)
                        );
                      })
                      .map((msg) => (
                        <div
                          key={msg._id}
                          className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:border-slate-700 transition shadow-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                              <span className="font-bold text-white text-sm">{msg.name}</span>
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-emerald-400 hover:underline text-xs font-mono"
                              >
                                {msg.email}
                              </a>
                              <span className="text-[10px] text-slate-500 font-mono ml-auto flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                            </div>

                            {msg.subject && (
                              <h4 className="text-xs font-bold text-slate-200 mb-1">
                                Subject: {msg.subject}
                              </h4>
                            )}

                            <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-850 whitespace-pre-wrap leading-relaxed">
                              {msg.message}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition"
                            >
                              <Mail className="w-3.5 h-3.5" /> Reply
                            </a>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Delete message from "${msg.name}"?`)) {
                                  await deleteContact(msg._id);
                                  showToast('Contact message deleted.');
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ======================= TAB: PERSONAL DOCUMENTS ======================= */}
            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-5xl"
              >
                {/* Header */}
                <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      Personal Documents Vault Manager
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload and manage your personal documents (PDF format). These are protected and accessible from the website's Documents section with secure verification.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {documents.length} Document{documents.length === 1 ? '' : 's'} in Vault
                    </span>
                  </div>
                </div>

                {/* Upload Form Card */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      Upload New Document (PDF)
                    </h3>
                    <span className="text-[11px] text-slate-400">PDF Files Only • Max 50MB</span>
                  </div>

                  <form onSubmit={handleUploadDocument} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Document Title *
                        </label>
                        <input
                          type="text"
                          value={docTitle}
                          onChange={(e) => setDocTitle(e.target.value)}
                          placeholder="e.g. B.Tech Degree Certificate, Aadhaar Card, PAN Card"
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Category *
                        </label>
                        <select
                          value={docCategory}
                          onChange={(e) => setDocCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        >
                          <option value="Academic">Academic (Degrees, Marksheets, Transcripts)</option>
                          <option value="Identification">Identification (Aadhaar, Passport, Voter ID)</option>
                          <option value="Certifications">Certifications & Achievements</option>
                          <option value="Experience & Letters">Experience & Recommendation Letters</option>
                          <option value="Financial">Financial & Tax Documents</option>
                          <option value="General">General / Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Description / Confidential Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={docDescription}
                        onChange={(e) => setDocDescription(e.target.value)}
                        placeholder="e.g. Official CGEC B.Tech 8th Semester Grade Card & Degree"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      />
                    </div>

                    {/* PDF File Input Dropzone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        PDF Document File *
                      </label>
                      <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500/60 rounded-2xl p-4 bg-slate-950/60 transition text-center cursor-pointer group">
                        <input
                          ref={docFileInputRef}
                          type="file"
                          accept=".pdf,application/pdf,application/x-pdf,application/octet-stream"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const isPdf =
                                file.name.toLowerCase().endsWith('.pdf') ||
                                file.type.toLowerCase().includes('pdf') ||
                                file.type === '' ||
                                file.type === 'application/octet-stream';
                              if (!isPdf) {
                                showToast('Only PDF files are supported.', 'error');
                                e.target.value = '';
                                setDocFile(null);
                                return;
                              }
                              setDocFile(file);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center py-2 pointer-events-none">
                          <FileText className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition mb-2" />
                          {docFile ? (
                            <div>
                              <p className="text-sm font-bold text-emerald-400">{docFile.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {(docFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-slate-300">
                                Click or drag and drop your PDF document here
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Securely uploaded and saved directly to your MongoDB and storage
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Live Upload Progress Indicator for Mobile & Cellular Networks */}
                    {docUploading && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            {docUploadProgress < 100
                              ? `Uploading to Cloud Vault: ${docUploadProgress}%`
                              : 'Securing Document in MongoDB Atlas...'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {docUploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full transition-all duration-200 rounded-full"
                            style={{ width: `${Math.max(docUploadProgress, 5)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={docUploading || !docFile || !docTitle.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                      >
                        {docUploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>
                              {docUploadProgress > 0 && docUploadProgress < 100
                                ? `Uploading ${docUploadProgress}%...`
                                : 'Saving to Cloud...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Add Document to Vault</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Documents List & Explorer */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        placeholder="Search uploaded documents..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={refreshDocuments}
                        className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
                        title="Refresh List"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {documents.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                      <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-300">No Personal Documents Uploaded Yet</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Use the form above to upload your certificates, marksheets, or IDs in PDF format.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {documents
                        .filter((d) => {
                          const query = docSearch.toLowerCase().trim();
                          if (!query) return true;
                          return (
                            d.title.toLowerCase().includes(query) ||
                            d.category?.toLowerCase().includes(query) ||
                            d.description?.toLowerCase().includes(query) ||
                            d.originalName?.toLowerCase().includes(query)
                          );
                        })
                        .map((doc) => (
                          <div
                            key={doc._id}
                            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex flex-col items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                                <span className="text-[8px] font-black uppercase leading-none mt-0.5">PDF</span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {doc.category || 'General'}
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    {doc.fileSize ? (doc.fileSize / (1024 * 1024)).toFixed(2) + ' MB' : 'PDF'}
                                  </span>
                                </div>

                                <h4 className="text-sm font-bold text-white truncate" title={doc.title}>
                                  {doc.title}
                                </h4>

                                {doc.description && (
                                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{doc.description}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                              <span className="text-[11px] text-slate-500">
                                {new Date(doc.createdAt).toLocaleDateString()}
                              </span>

                              <div className="flex items-center gap-2">
                                <a
                                  href={`/api/documents/view/${doc._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                                  title="Preview Document"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>

                                <a
                                  href={`/api/documents/download/${doc._id}`}
                                  download
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                                  title="Download Document"
                                >
                                  <Download className="w-4 h-4" />
                                </a>

                                <button
                                  type="button"
                                  disabled={deletingDocId === doc._id}
                                  onClick={() => handleDeleteDocument(doc._id, doc.title)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                  title="Delete Document"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ======================= TAB: ACCOUNT & SECURITY ======================= */}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-2xl"
              >
                <div className="border-b border-slate-800/80 pb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Admin Account & Security Settings
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Update your admin username and password. Changes persist in MongoDB Atlas immediately.
                  </p>
                </div>

                {/* Current Active Account Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-cyan-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{adminUsername}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active Superadmin
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Current authentication handle for <code className="text-emerald-400 font-mono">/admin/login</code>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Update Form */}
                <form onSubmit={handleUpdateUser} className="space-y-4 bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-3">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    Modify Username & Password
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      New Username (Leave blank to keep "{adminUsername}")
                    </label>
                    <input
                      type="text"
                      value={userForm.newUsername}
                      onChange={(e) => setUserForm({ ...userForm, newUsername: e.target.value })}
                      placeholder={`Current: ${adminUsername}`}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Current Password <span className="text-rose-400">* (Required to authorize)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={userForm.currentPassword}
                        onChange={(e) => setUserForm({ ...userForm, currentPassword: e.target.value })}
                        placeholder="Enter current password..."
                        className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        New Password (Min 6 chars)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={userForm.newPassword}
                          onChange={(e) => setUserForm({ ...userForm, newPassword: e.target.value })}
                          placeholder="New password..."
                          className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password strength meter */}
                      {userForm.newPassword && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">Strength:</span>
                            <span className="font-bold text-white">{passwordStrength.label}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden flex gap-1">
                            <div className={`h-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'} flex-1 transition-all`} />
                            <div className={`h-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'} flex-1 transition-all`} />
                            <div className={`h-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'} flex-1 transition-all`} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                        placeholder="Confirm new password..."
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm outline-hidden"
                      />
                      {userForm.newPassword && userForm.confirmPassword && (
                        <p className={`text-[10px] mt-1 ${userForm.newPassword === userForm.confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {userForm.newPassword === userForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </p>
                      )}
                    </div>
                  </div>

                  {userUpdateError && (
                    <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{userUpdateError}</span>
                    </div>
                  )}

                  {userUpdateSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{userUpdateSuccess}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdatingUser}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer active:scale-95"
                    >
                      {isUpdatingUser ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Updating Credentials...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save New Credentials
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Security Advice Card */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-1">
                  <p className="font-bold text-slate-300">Security Note:</p>
                  <p className="leading-relaxed">
                    Once updated, the new username and password take effect across all sessions immediately. Future attempts to log in at <code className="text-emerald-400 font-mono">/admin/login</code> must use these new credentials.
                  </p>
                </div>
              </motion.div>
            )}

          </main>
        </div>

      </div>

    </div>
  );
};
