import React, { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
  reason?: string;
}

export const AuthModal: React.FC<Props> = ({ onClose, onSuccess, reason }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useResumeStore();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const { data } = await api.post(endpoint, form);
      setUser(data.user, data.token);
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {reason && (
          <div className="modal-reason-banner">
            <p className="modal-reason-text">{reason}</p>
          </div>
        )}

        <form onSubmit={submit} className="modal-form">
          {mode === 'signup' && (
            <Input label="Name" placeholder="John Doe" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          )}
          <Input label="Email" type="email" placeholder="john@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" className="w-full" loading={loading}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p className="modal-footer-text">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="modal-switch-btn">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};
