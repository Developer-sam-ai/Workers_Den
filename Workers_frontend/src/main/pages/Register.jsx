import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Logo from '../Component/Logo';
import { useTheme } from '../../theme/ThemeContext';
import { Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mode, theme: t } = useTheme();

  const initialRole = searchParams.get('role') === 'WORKER' ? 'WORKER' : 'CUSTOMER';

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone: '',
    password: '',
    role: initialRole,
  });

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'WORKER' || roleParam === 'CUSTOMER') {
      setFormData((prev) => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      setErrorMsg('Phone number must be exactly 10 digits.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      await axiosClient.post('/auth/register', formData);
      navigate('/login', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Registration failed. Please check your credentials or try another email.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 select-none"
      style={{
        background: t.bg,
        color: t.text,
      }}
    >
      {/* Schematic Background Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${t.border} 1px, transparent 1px),
            linear-gradient(to bottom, ${t.border} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div
        className="relative z-10 w-full max-w-md p-7 sm:p-8 border shadow-xs"
        style={{
          background: t.surface,
          borderColor: t.border,
        }}
      >
        {/* Navigation Return & Brand Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: t.border }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-75"
            style={{ color: t.muted }}
          >
            <ArrowLeft size={14} /> BACK TO HOME
          </button>

          <span
            className="wd-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border"
            style={{ borderColor: t.border, color: t.accent, background: t.accentSoft }}
          >
            SIGNUP 
          </span>
        </div>

        <div className="mb-6">
          <h1 className="wd-display font-black text-2xl uppercase tracking-tight" style={{ color: t.text }}>
            Create Account
          </h1>
          <p className="text-xs mt-1 wd-mono" style={{ color: t.muted }}>
            Provision an identity on the Workers Den dispatch network.
          </p>
        </div>

        {/* Role Toggle Switcher */}
        {/* Role Selector Rocker Switch */}
<div
  className="mb-5 grid grid-cols-2 p-1 border gap-1"
  style={{ background: t.cardHover, borderColor: t.border }}
>
  {/* Customer Button */}
  <button
    type="button"
    onClick={() => handleRoleSelect('CUSTOMER')}
    className="py-2 text-xs wd-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer active:scale-[0.98]"
    style={{
      background: formData.role === 'CUSTOMER' ? t.surface : 'transparent',
      color: formData.role === 'CUSTOMER' ? t.accent : t.muted,
      border: formData.role === 'CUSTOMER' ? `1px solid ${t.accent}` : '1px solid transparent',
      boxShadow: formData.role === 'CUSTOMER' ? `0 0 0 1px ${t.accent}` : 'none',
    }}
    onMouseEnter={(e) => {
      if (formData.role !== 'CUSTOMER') {
        e.currentTarget.style.color = t.accent;
        e.currentTarget.style.borderColor = t.accent;
      }
    }}
    onMouseLeave={(e) => {
      if (formData.role !== 'CUSTOMER') {
        e.currentTarget.style.color = t.muted;
        e.currentTarget.style.borderColor = 'transparent';
      }
    }}
  >
    Customer 
  </button>

  {/* Worker Button */}
  <button
    type="button"
    onClick={() => handleRoleSelect('WORKER')}
    className="py-2 text-xs wd-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer active:scale-[0.98]"
    style={{
      background: formData.role === 'WORKER' ? t.surface : 'transparent',
      color: formData.role === 'WORKER' ? t.accent : t.muted,
      border: formData.role === 'WORKER' ? `1px solid ${t.accent}` : '1px solid transparent',
      boxShadow: formData.role === 'WORKER' ? `0 0 0 1px ${t.accent}` : 'none',
    }}
    onMouseEnter={(e) => {
      if (formData.role !== 'WORKER') {
        e.currentTarget.style.color = t.accent;
        e.currentTarget.style.borderColor = t.accent;
      }
    }}
    onMouseLeave={(e) => {
      if (formData.role !== 'WORKER') {
        e.currentTarget.style.color = t.muted;
        e.currentTarget.style.borderColor = 'transparent';
      }
    }}
  >
    Worker 
  </button>
</div>

        {/* System Error Toast */}
        {errorMsg && (
          <div
            className="mb-5 p-3 text-xs wd-mono border flex items-start gap-2"
            style={{
              background: mode === 'light' ? '#FEE2E2' : '#451A1A',
              borderColor: mode === 'light' ? '#F87171' : '#7F2323',
              color: mode === 'light' ? '#B91C1C' : '#FCA5A5',
            }}
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>[SYS_ERR]: {errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
              Full Name
            </label>
            <input
              type="text"
              name="user_name"
              required
              value={formData.user_name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border outline-none transition-colors"
              style={{ borderColor: t.border, color: t.text }}
              onFocus={(e) => (e.target.style.borderColor = t.accent)}
              onBlur={(e) => (e.target.style.borderColor = t.border)}
            />
          </div>

          <div>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
              Email Identifier
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="operator@workersden.com"
              className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border outline-none transition-colors"
              style={{ borderColor: t.border, color: t.text }}
              onFocus={(e) => (e.target.style.borderColor = t.accent)}
              onBlur={(e) => (e.target.style.borderColor = t.border)}
            />
          </div>

          <div>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
              Phone Number (10 Digits)
            </label>
            <input
              type="tel"
              name="phone"
              required
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border outline-none transition-colors"
              style={{ borderColor: t.border, color: t.text }}
              onFocus={(e) => (e.target.style.borderColor = t.accent)}
              onBlur={(e) => (e.target.style.borderColor = t.border)}
            />
          </div>

          <div>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
              Security Key (Min. 6 Characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 pr-10 text-xs wd-mono bg-transparent border outline-none transition-colors"
                style={{ borderColor: t.border, color: t.text }}
                onFocus={(e) => (e.target.style.borderColor = t.accent)}
                onBlur={(e) => (e.target.style.borderColor = t.border)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                style={{ color: t.muted }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full wd-mono wd-btn text-xs font-bold py-3 flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-50"
            style={{
              background: t.accent,
              color: t.accentText,
              border: 'none',
            }}
          >
            {loading ? 'PROVISIONING ENTITY...' : `REGISTER AS ${formData.role}`} <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t text-center wd-mono text-xs" style={{ borderColor: t.border }}>
          <span style={{ color: t.muted }}>Already registered on platform? </span>
          <Link to="/login" className="font-bold underline" style={{ color: t.accent }}>
            Authenticate Here
          </Link>
        </div>
      </div>
    </div>
  );
}