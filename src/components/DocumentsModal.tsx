import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Search,
  Download,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  FolderLock,
  Maximize2,
  Minimize2,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PersonalDocument } from '../types';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
}) => {
  const {
    documents,
    documentsAuth,
    documentsLoading,
    verifyDocumentsAuth,
    logoutDocuments,
    refreshDocuments,
    adminUsername,
  } = usePortfolio();

  // Login verification form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // PDF Preview State
  const [previewDoc, setPreviewDoc] = useState<PersonalDocument | null>(null);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

  // If PDF preview is open, pressing Escape closes the preview first
  React.useEffect(() => {
    const handlePreviewKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewDoc) {
        e.stopPropagation();
        setPreviewDoc(null);
      }
    };
    if (previewDoc) {
      window.addEventListener('keydown', handlePreviewKeyDown, { capture: true });
    }
    return () => {
      window.removeEventListener('keydown', handlePreviewKeyDown, { capture: true });
    };
  }, [previewDoc]);

  // Automatically log out and clear sensitive fields whenever the modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      logoutDocuments();
      setPreviewDoc(null);
      setIdentifier('');
      setPassword('');
      setAuthError(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    logoutDocuments();
    setPreviewDoc(null);
    setIdentifier('');
    setPassword('');
    setAuthError(null);
    onClose();
  };

  // Reset form when modal closes or opens
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setAuthError('Please enter your email or username and password.');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    const result = await verifyDocumentsAuth(identifier.trim(), password);
    setIsVerifying(false);

    if (!result.success) {
      setAuthError(result.error || 'Authentication failed. Please verify your credentials.');
    } else {
      setPassword('');
      setAuthError(null);
    }
  };

  const handleLock = () => {
    logoutDocuments();
    setPreviewDoc(null);
    setIdentifier('');
    setPassword('');
    setAuthError(null);
  };

  // Distinct categories from existing documents
  const categories = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return ['All', ...Array.from(set)];
  }, [documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory =
        selectedCategory === 'All' || doc.category?.toLowerCase() === selectedCategory.toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        doc.title.toLowerCase().includes(query) ||
        doc.category?.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.originalName?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return 'PDF Document';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <FolderLock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Personal Documents Vault
                  </h2>
                  {documentsAuth && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {documentsAuth
                    ? 'Secure, encrypted vault for your personal certificates, academic records & credentials.'
                    : 'Protected document repository. Identity verification required.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {documentsAuth && (
                <button
                  onClick={handleLock}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 transition"
                  title="Lock Vault & End Session"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Vault</span>
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Close and Lock Vault"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Either Authentication Gate OR Documents List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7">
            {!documentsAuth ? (
              /* ======================================================== */
              /* STATE A: SECURITY VERIFICATION GATE                      */
              /* ======================================================== */
              <div className="max-w-md mx-auto py-6 sm:py-10 text-center">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 mx-auto flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner mb-5">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Security Verification Required
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 mb-6">
                  This section contains personal and confidential documents. Enter your administrator email or username and password to proceed.
                </p>

                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start gap-2.5 text-left"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </motion.div>
                )}

                <form
                  onSubmit={handleVerifySubmit}
                  className="space-y-4 text-left"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Email or Username
                    </label>
                    <input
                      type="text"
                      name="vault_access_identity"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      data-lpignore="true"
                      data-1p-ignore="true"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your email or username"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="vault_access_key"
                        autoComplete="off"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                        aria-autocomplete="none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 active:scale-[0.99] transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        <span>Unlock Documents Vault</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Secured by MongoDB Admin Authentication</span>
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* STATE B: UNLOCKED DOCUMENTS EXPLORER                      */
              /* ======================================================== */
              <div className="space-y-6">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search documents by title, category, or keyword..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Actions / Refresh */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={refreshDocuments}
                      disabled={documentsLoading}
                      className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
                      title="Refresh Documents"
                    >
                      <RefreshCw className={`w-4 h-4 ${documentsLoading ? 'animate-spin' : ''}`} />
                    </button>

                    {onOpenAdmin && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenAdmin();
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-500/20 transition whitespace-nowrap"
                        title="Upload New Documents in Admin Panel"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Manage / Upload</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Pills */}
                {categories.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {cat}
                        {cat === 'All' && ` (${documents.length})`}
                      </button>
                    ))}
                  </div>
                )}

                {/* Documents Grid */}
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      No Documents Found
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                      {searchQuery
                        ? 'No documents match your current filter or query.'
                        : 'No personal documents have been uploaded to your vault yet.'}
                    </p>
                    {onOpenAdmin && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenAdmin();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                      >
                        <FolderLock className="w-3.5 h-3.5" />
                        <span>Open Admin Panel to Add Documents</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc._id}
                        className="group relative p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start gap-3.5">
                            {/* PDF Badge Icon */}
                            <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex flex-col items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-sm">
                              <FileText className="w-5 h-5" />
                              <span className="text-[9px] font-black uppercase tracking-tight leading-none mt-0.5">
                                PDF
                              </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 uppercase tracking-wide">
                                  {doc.category || 'General'}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {formatFileSize(doc.fileSize)}
                                </span>
                              </div>

                              <h3
                                className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition"
                                title={doc.title}
                              >
                                {doc.title}
                              </h3>

                              {doc.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                  {doc.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Actions & Timestamp */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            Uploaded {formatDate(doc.createdAt)}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* View / Preview PDF */}
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                              title="Preview PDF"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-500" />
                              <span>View</span>
                            </button>

                            {/* Download PDF */}
                            <a
                              href={`/api/documents/download/${doc._id}`}
                              download
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <span>Tanmoy Pal • Developer Portfolio Documents Vault</span>
            {documentsAuth && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Session Active (Passcode Synced with Admin)
              </span>
            )}
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* PDF PREVIEW MODAL                                        */}
        {/* ======================================================== */}
        {previewDoc && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-5">
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setPreviewDoc(null)}
            />
            <div
              className={`relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 ${
                isPreviewFullscreen ? 'w-full h-full' : 'w-full max-w-5xl h-[88vh]'
              }`}
            >
              {/* Preview Bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-sm font-bold text-white truncate">
                    {previewDoc.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    PDF
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/api/documents/download/${previewDoc._id}`}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>

                  <a
                    href={previewDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title={isPreviewFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isPreviewFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Close Preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Iframe for PDF rendering */}
              <div className="flex-1 bg-slate-950 overflow-hidden">
                <iframe
                  src={`${previewDoc.fileUrl}#toolbar=1&navpanes=0`}
                  title={previewDoc.title}
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
