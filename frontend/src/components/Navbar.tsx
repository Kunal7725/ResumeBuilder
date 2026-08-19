import React, { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { Button } from './ui/Button';
import { downloadPDF, exportJSON, importJSON } from '../utils/pdf';
import { Moon, Sun, Download, Upload, FileJson, LogOut, User, Save, FolderOpen, Trash2 } from 'lucide-react';
import type { TemplateType } from '../types/resume';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { AuthModal } from './AuthModal';

interface SavedResume {
  _id: string;
  title: string;
  template: TemplateType;
  updatedAt: string;
}

export const Navbar: React.FC = () => {
  const { darkMode, toggleDarkMode, template, setTemplate, resumeData, importData, user, setUser } = useResumeStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumesOpen, setResumesOpen] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/health`)
      .then((r) => r.ok ? setBackendOnline(true) : setBackendOnline(false))
      .catch(() => setBackendOnline(false));
  }, [backendUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setResumesOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchResumes = async () => {
    setLoadingResumes(true);
    try {
      const { data } = await api.get('/resumes');
      setSavedResumes(data);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleOpenResumes = () => {
    if (!resumesOpen) fetchResumes();
    setResumesOpen((v) => !v);
  };

  const handleLoadResume = async (id: string) => {
    try {
      const { data } = await api.get(`/resumes/${id}`);
      importData(data.data);
      setTemplate(data.template);
      setResumesOpen(false);
      toast.success('Resume loaded!');
    } catch {
      toast.error('Failed to load resume');
    }
  };

  const handleDeleteResume = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.delete(`/resumes/${id}`);
      setSavedResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  const templates: TemplateType[] = ['minimal', 'modern', 'professional'];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPDF('resume-preview', `${resumeData.personalInfo.name || 'resume'}.pdf`);
      toast.success('PDF downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Download failed. Make sure the preview is visible.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save your resume');
      setAuthOpen(true);
      return;
    }
    setSaving(true);
    try {
      await api.post('/resumes', {
        title: resumeData.personalInfo.name ? `${resumeData.personalInfo.name}'s Resume` : 'My Resume',
        data: resumeData,
        template,
      });
      toast.success('Resume saved to your account!');
    } catch {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    try {
      exportJSON(resumeData);
      toast.success('Resume exported as JSON!');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleImportClick = () => {
    importRef.current?.click();
  };

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importJSON(file)
      .then((data) => {
        importData(data);
        toast.success('Resume imported!');
      })
      .catch(() => toast.error('Invalid JSON file'));
    e.target.value = '';
  };

  const logout = () => {
    setUser(null, null);
    toast.success('Logged out');
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="navbar-logo-icon">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="navbar-logo-text">ResumeAI</span>
        </div>

        {/* Backend Port Badge */}
        <a
          href={backendUrl}
          target="_blank"
          rel="noreferrer"
          className="navbar-backend-badge"
          title={backendOnline ? 'Backend is online' : 'Backend is offline'}
        >
          <span className={`navbar-backend-dot ${backendOnline === true ? 'navbar-backend-dot-online' : backendOnline === false ? 'navbar-backend-dot-offline' : 'navbar-backend-dot-checking'}`} />
          <span>API :5000</span>
        </a>

        <div className="navbar-actions">
          {/* Template Switcher */}
          <div className="navbar-template-switcher">
            {templates.map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={template === t ? 'navbar-template-btn-active' : 'navbar-template-btn'}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="navbar-divider" />

          <Button variant="secondary" size="sm" onClick={handleSave} loading={saving}>
            <Save className="w-3.5 h-3.5" /> Save
          </Button>

          {user && (
            <div className="navbar-resumes-wrapper" ref={dropdownRef}>
              <Button variant="ghost" size="sm" onClick={handleOpenResumes}>
                <FolderOpen className="w-3.5 h-3.5" /> My Resumes
              </Button>
              {resumesOpen && (
                <div className="navbar-resumes-dropdown">
                  <p className="navbar-resumes-title">Saved Resumes</p>
                  {loadingResumes ? (
                    <p className="navbar-resumes-empty">Loading...</p>
                  ) : savedResumes.length === 0 ? (
                    <p className="navbar-resumes-empty">No saved resumes yet</p>
                  ) : (
                    savedResumes.map((r) => (
                      <div key={r._id} className="navbar-resume-item" onClick={() => handleLoadResume(r._id)}>
                        <div className="navbar-resume-info">
                          <span className="navbar-resume-name">{r.title}</span>
                          <span className="navbar-resume-meta">{r.template} · {new Date(r.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <button className="navbar-resume-delete" onClick={(e) => handleDeleteResume(e, r._id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={handleExport}>
            <FileJson className="w-3.5 h-3.5" /> Export
          </Button>

          <Button variant="ghost" size="sm" onClick={handleImportClick}>
            <Upload className="w-3.5 h-3.5" /> Import
          </Button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportChange}
          />

          <Button variant="primary" size="sm" onClick={handleDownload} loading={downloading}>
            <Download className="w-3.5 h-3.5" /> Download PDF
          </Button>

          <div className="navbar-divider" />

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="navbar-icon-btn"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth */}
          {user ? (
            <div className="navbar-user-info">
              <span className="navbar-username">{user.name}</span>
              <button onClick={logout} className="navbar-logout-btn">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setAuthOpen(true)}>
              <User className="w-3.5 h-3.5" /> Sign In
            </Button>
          )}
        </div>
      </nav>

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={() => setAuthOpen(false)}
        />
      )}
    </>
  );
};
