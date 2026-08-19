import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login({ theme }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passvis, setpassvis] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = theme || {
    bg: '#121417',
    surfaceCard: '#1B1E23',
    text: '#EDEAE4',
    accent: '#FF753A',
    accentText: '#121416',
    border: '#2E343E',
    muted: '#8E95A0',
    codeBg: '#1E2228',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem('token', res.data.token);
      const role = res.data.role ? res.data.role.replace('ROLE_', '') : '';

      if (role === 'CUSTOMER') {
        navigate('/customer/dashboard');
      } else if (role === 'WORKER') {
        navigate('/worker/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-sm p-7 space-y-6"
        style={{
          border: `1px solid ${t.border}`,
          background: t.surfaceCard,
        }}
      >
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: t.border }}>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 20,
                height: 20,
                background: '#22262B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 6, height: 6, background: t.accent }} />
            </div>
            <span className="wd-display font-black text-sm tracking-wider" style={{ color: t.text }}>
              WORKERS<span style={{ color: t.accent }}>DEN</span>
            </span>
          </div>
          <span className="wd-mono text-[10px]" style={{ color: t.muted }}>
            AUTH // GATEWAY
          </span>
        </div>

        <div>
          <h2 className="wd-display font-extrabold text-xl uppercase tracking-tight" style={{ color: t.text }}>
            Sign In
          </h2>
          <p className="text-xs mt-1" style={{ color: t.muted }}>
            Enter your credentials to access dispatch console.
          </p>
        </div>

        {error && (
          <div
            className="p-3 text-xs wd-mono"
            style={{
              background: '#3B1818',
              border: '1px solid #7F2323',
              color: '#F87171',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block wd-mono text-[11px] font-bold mb-1.5" style={{ color: t.muted }}>
              EMAIL IDENTIFIER
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="user@workersden.com"
              className="w-full px-3 py-2.5 text-xs wd-mono outline-none transition"
              style={{
                background: 'transparent',
                border: `1px solid ${t.border}`,
                color: t.text,
              }}
            />
          </div>

          <div>
            <label className="block wd-mono text-[11px] font-bold mb-1.5" style={{ color: t.muted }}>
              SECURITY KEY
            </label>
            <div className="relative">
              <input
                type={passvis ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 pr-10 text-xs wd-mono outline-none transition"
                style={{
                  background: 'transparent',
                  border: `1px solid ${t.border}`,
                  color: t.text,
                }}
              />
              <button
                type="button"
                onClick={() => setpassvis(!passvis)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: t.muted }}
              >
                {passvis ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full wd-mono wd-btn text-xs font-bold py-3 flex items-center justify-center gap-2 mt-2"
            style={{
              background: t.accent,
              color: t.accentText,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 text-center border-t wd-mono text-[11px]" style={{ borderColor: t.border }}>
          <span style={{ color: t.muted }}>Need registration? </span>
          <Link to="/register" className="font-bold underline" style={{ color: t.accent }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}