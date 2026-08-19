import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowRight, Bell, User, Wrench, Briefcase, PlusCircle } from 'lucide-react';

export default function Navbar({ mode, setMode, theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      user = {
        email: payload.sub || payload.email,
        role: payload.role ? payload.role.replace('ROLE_', '') : null,
      };
    } catch {
      localStorage.clear();
    }
  }

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const t = theme || {
    border: '#2E343E',
    text: '#EDEAE4',
    muted: '#8E95A0',
    accent: '#FF753A',
    surfaceCard: '#1B1E23',
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isWorker = user?.role === 'WORKER';

  return (
    <header
      style={{
        borderBottom: `1px solid ${t.border}`,
        background: mode === 'light' ? '#F5F3EB' : '#121417',
        color: t.text,
      }}
      className="sticky top-0 z-50 transition-colors duration-150"
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to={user ? (isCustomer ? '/customer/dashboard' : '/worker/dashboard') : '/'} className="flex items-center gap-2.5 text-decoration-none">
          <div
            style={{
              width: 26,
              height: 26,
              background: mode === 'light' ? '#2F363F' : '#22262B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 9, height: 9, background: t.accent }} />
          </div>
          <span className="wd-display font-black text-lg tracking-wider" style={{ color: t.text }}>
            WORKERS<span style={{ color: t.accent }}>DEN</span>
          </span>
          {user && (
            <span
              className="wd-mono text-[9px] px-1.5 py-0.5 border"
              style={{ borderColor: t.border, color: t.accent }}
            >
              {user.role}
            </span>
          )}
        </Link>

        {/* Dynamic Navigation Center */}
        <nav className="hidden md:flex items-center gap-6 wd-mono text-xs tracking-wider">
          {!user && (
            <>
              <a href="#services" className="hover:text-amber-500 transition" style={{ color: t.muted }}>
                SERVICES
              </a>
              <a href="#workflow" className="hover:text-amber-500 transition" style={{ color: t.muted }}>
                WORKFLOW
              </a>
              <a href="#team" className="hover:text-amber-500 transition" style={{ color: t.muted }}>
                ROLES
              </a>
            </>
          )}

          {isCustomer && (
            <>
              <Link to="/customer/dashboard" className="hover:text-amber-500 transition font-bold" style={{ color: t.text }}>
                OVERVIEW
              </Link>
              <Link to="/customer/create-job" className="flex items-center gap-1 hover:text-amber-500 transition" style={{ color: t.muted }}>
                <PlusCircle className="w-3.5 h-3.5" /> POST ORDER
              </Link>
            </>
          )}

          {isWorker && (
            <>
              <Link to="/worker/dashboard" className="hover:text-amber-500 transition font-bold" style={{ color: t.text }}>
                COMMAND CENTER
              </Link>
              <Link to="/worker/find-jobs" className="flex items-center gap-1 hover:text-amber-500 transition" style={{ color: t.muted }}>
                <Briefcase className="w-3.5 h-3.5" /> DISCOVERY FEED
              </Link>
            </>
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Mode Toggle */}
          {setMode && (
            <button
              type="button"
              onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
              className="wd-mono wd-btn text-[11px] font-bold px-2 py-1 flex items-center gap-2"
              style={{
                border: `1px solid ${t.border}`,
                background: 'transparent',
                color: t.text,
              }}
            >
              <span>{mode.toUpperCase()}</span>
              <span
                style={{
                  position: 'relative',
                  width: 22,
                  height: 12,
                  background: t.border,
                  display: 'inline-block',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 1,
                    left: 1,
                    width: 10,
                    height: 10,
                    background: t.accent,
                    transform: mode === 'dark' ? 'translateX(10px)' : 'translateX(0)',
                    transition: 'transform 100ms ease',
                  }}
                />
              </span>
            </button>
          )}

          {/* User Session Elements */}
          {user ? (
            <>
              {/* Notification Popper */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 border relative flex items-center justify-center"
                  style={{ borderColor: t.border, background: 'transparent', color: t.text }}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: t.accent }}
                  />
                </button>
                {notifOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 border p-3 text-[11px] z-50 wd-mono"
                    style={{ background: mode === 'light' ? '#EAE7DC' : '#1B1E23', borderColor: t.border }}
                  >
                    <p className="font-bold border-b pb-1 mb-2" style={{ borderColor: t.border, color: t.accent }}>
                      SYSTEM DISPATCH LOG
                    </p>
                    <p style={{ color: t.muted }}>Status checks updated for active requests.</p>
                  </div>
                )}
              </div>

              {/* Profile Shortcut */}
              <button
                type="button"
                onClick={() => navigate(isWorker ? '/worker/profile' : '/profile')}
                className="p-2 border flex items-center justify-center"
                style={{ borderColor: t.border, background: 'transparent', color: t.text }}
              >
                <User className="w-3.5 h-3.5" />
              </button>

              {/* Sign Out */}
              <button
                type="button"
                onClick={logout}
                className="wd-mono text-xs font-bold px-2 py-1 hover:underline"
                style={{ color: t.muted }}
              >
                EXIT
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="wd-mono text-xs font-bold px-3 py-1.5 hidden sm:block"
                style={{ color: t.text }}
              >
                LOG IN
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="wd-mono wd-btn text-xs font-bold px-4 py-2 flex items-center gap-1.5"
                style={{
                  background: t.accent,
                  color: mode === 'light' ? '#FFFFFF' : '#121416',
                  border: 'none',
                }}
              >
                GET STARTED <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}