import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

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

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'CUSTOMER') return '/customer/dashboard';
    if (user.role === 'WORKER') return '/worker/dashboard';
    return '/';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
          Workers Den
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          {user ? (
            <>
              <Link to={getDashboardPath()} className="text-slate-700 hover:text-blue-600 transition">
                Dashboard
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setNotifOpen(!notifOpen)} 
                  className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs z-50">
                    <p className="font-semibold text-slate-800 border-b pb-2 mb-2">Notifications</p>
                    <p className="text-slate-600 mb-2">Worker assigned to your request</p>
                    <p className="text-slate-400">10m ago</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate(user.role === 'WORKER' ? '/worker/profile' : '/profile')}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  <User className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={logout} 
                className="text-xs text-slate-500 hover:text-slate-800 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-blue-600">
                Log In
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="sm:hidden p-2 text-slate-600 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 text-sm">
          {user ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-700">
                Dashboard
              </Link>
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="block text-left w-full py-1 text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-700">
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-blue-600 font-semibold">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}