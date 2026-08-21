import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import CustomerNavbar from '../../pages/Customer/CustomerNavbar';
import { 
  ArrowRight, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Radio, 
  Wrench, 
  Sparkles,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';

const STATIC_CATEGORY_METADATA = [
  { catName: 'Plumbing', code: 'TR-01', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80', defaultPrice: 499 },
  { catName: 'Electrical', code: 'TR-02', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80', defaultPrice: 399 },
  { catName: 'Carpentry', code: 'TR-03', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80', defaultPrice: 599 },
  { catName: 'Painting', code: 'TR-04', image: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=600&auto=format&fit=crop&q=80', defaultPrice: 799 },
  { catName: 'Cleaning', code: 'TR-05', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80', defaultPrice: 349 },
  { catName: 'AC Repair', code: 'TR-06', image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80', defaultPrice: 449 },
  { catName: 'Appliance Fix', code: 'TR-07', image: 'https://images.unsplash.com/photo-1581092921461-7031e4bf6315?w=600&auto=format&fit=crop&q=80', defaultPrice: 549 },
  { catName: 'General Help', code: 'TR-08', image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&auto=format&fit=crop&q=80', defaultPrice: 299 },
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();

  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve user session info
  let user = null;
  try {
    const rawUser = localStorage.getItem('user');
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }

  const customerName = user?.fullName || user?.user_name || user?.email?.split('@')[0] || 'Operator';
  const customerInitials = customerName.substring(0, 2).toUpperCase();

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      api.get('/Categories'),
      api.get('/jobs/customer/my-jobs'),
    ])
      .then(([catResult, jobsResult]) => {
        if (!isMounted) return;

        if (catResult.status === 'fulfilled' && Array.isArray(catResult.value.data) && catResult.value.data.length > 0) {
          const merged = catResult.value.data.map((cat, idx) => {
            const meta = STATIC_CATEGORY_METADATA.find(
              (m) => m.catName.toLowerCase() === (cat.catName || '').toLowerCase()
            ) || STATIC_CATEGORY_METADATA[idx % STATIC_CATEGORY_METADATA.length];

            return {
              id: cat.id || cat.catId || idx + 1,
              catName: cat.catName || meta.catName,
              customerPrice: cat.customerPrice || meta.defaultPrice,
              code: meta.code || `TR-0${idx + 1}`,
              image: meta.image,
              description: cat.description || 'Standard inspection, diagnostics, and verified resolution.',
            };
          });
          setCategories(merged);
        } else {
          setCategories(
            STATIC_CATEGORY_METADATA.map((m, idx) => ({
              id: idx + 1,
              catName: m.catName,
              customerPrice: m.defaultPrice,
              code: m.code,
              image: m.image,
              description: 'Standard inspection, diagnostics, and verified resolution.',
            }))
          );
        }

        if (jobsResult.status === 'fulfilled' && Array.isArray(jobsResult.value.data)) {
          setJobs(jobsResult.value.data);
        } else {
          setJobs([]);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories(
            STATIC_CATEGORY_METADATA.map((m, idx) => ({
              id: idx + 1,
              catName: m.catName,
              customerPrice: m.defaultPrice,
              code: m.code,
              image: m.image,
              description: 'Standard inspection, diagnostics, and verified resolution.',
            }))
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeJob = Array.isArray(jobs) 
    ? jobs.find((j) => j?.status === 'ACCEPTED' || j?.status === 'IN_PROGRESS' || j?.status === 'OPEN') 
    : null;
    
  const recentJobs = Array.isArray(jobs) 
    ? jobs.filter((j) => j?.requestId !== activeJob?.requestId) 
    : [];

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'OPEN':
        return { bg: t.accentSoft, border: t.accent, color: t.accent };
      case 'ACCEPTED':
      case 'IN_PROGRESS':
        return { bg: mode === 'light' ? '#FEF3C7' : '#451A03', border: '#F59E0B', color: '#D97706' };
      case 'COMPLETED':
        return { bg: mode === 'light' ? '#DCFCE7' : '#064E3B', border: '#10B981', color: '#10B981' };
      default:
        return { bg: t.cardHover, border: t.border, color: t.muted };
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center font-mono text-xs"
        style={{ background: t.bg, color: t.muted }}
      >
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center">
          [SYS_INIT] Synchronizing customer dispatch catalog...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ background: t.bg, color: t.text }}
      className="relative min-h-screen flex flex-col font-sans transition-colors duration-150 overflow-x-hidden"
    >
      {/* ─── 1. INDUSTRIAL WALLPAPER & SCHEMATIC GRID BACKDROP ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
          alt="Technical Blueprint Grid Background"
          className="w-full h-full object-cover grayscale contrast-125 transition-opacity duration-300"
          style={{
            opacity: mode === 'light' ? 0.04 : 0.03,
          }}
        />
      </div>

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${t.border} 1px, transparent 1px),
            linear-gradient(to bottom, ${t.border} 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <CustomerNavbar />

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        
        {/* ─── 2. HERO PROFILE HEADER CARD ─── */}
        <section
          className="border p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm backdrop-blur-xs"
          style={{
            background: mode === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(23, 29, 42, 0.90)',
            borderColor: t.border,
          }}
        >
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Monogram Badge */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 border flex items-center justify-center font-black text-lg sm:text-xl tracking-wider shrink-0 shadow-xs"
              style={{
                borderColor: t.accent,
                background: t.accentSoft,
                color: t.accent,
              }}
            >
              {customerInitials}
            </div>

            <div className="space-y-1">
              <div className="wd-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: t.accent }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.accent }} />
                CLIENT CONSOLE // ACTIVE OPERATOR
              </div>
              <h1 className="wd-display font-black text-2xl sm:text-3xl uppercase tracking-tight" style={{ color: t.text }}>
                {customerName}
              </h1>
              <p className="text-xs wd-mono" style={{ color: t.muted }}>
                Identity: <strong style={{ color: t.text }}>{user?.email || 'customer@workersden.com'}</strong> • Locality: <strong style={{ color: t.text }}>Pune Metro</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => navigate('/customer/create-job')}
              className="w-full sm:w-auto wd-mono wd-btn text-xs font-bold px-6 py-3.5 flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              style={{
                background: t.accent,
                color: t.accentText,
                border: 'none',
              }}
            >
              <PlusCircle size={15} strokeWidth={2.5} /> POST WORK ORDER
            </button>
          </div>
        </section>

        {/* ─── 3. ACTIVE IN-FLIGHT ORDER HERO CARD ─── */}
        {activeJob && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio size={14} className="animate-pulse text-amber-500" />
                <h2 className="wd-mono text-xs font-bold uppercase tracking-wider" style={{ color: t.accent }}>
                  ACTIVE DISPATCH IN FLIGHT
                </h2>
              </div>
              <span className="wd-mono text-[10px] uppercase tracking-wider" style={{ color: t.muted }}>
                LIVE TELEMETRY
              </span>
            </div>

            <div
              className="border p-6 transition-all hover:border-current cursor-pointer shadow-sm backdrop-blur-xs group"
              style={{
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(23, 29, 42, 0.90)',
                borderColor: t.border,
              }}
              onClick={() => navigate(`/jobs/${activeJob.requestId}`)}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 mb-4" style={{ borderColor: t.border }}>
                <div>
                  <span className="wd-mono text-[10px] font-bold tracking-widest" style={{ color: t.accent }}>
                    TICKET #{activeJob.requestId} // {activeJob.categoryName?.toUpperCase() || 'GENERAL'}
                  </span>
                  <h3 className="wd-display font-black text-lg sm:text-xl uppercase tracking-tight mt-0.5" style={{ color: t.text }}>
                    {activeJob.title}
                  </h3>
                </div>

                <span
                  className="wd-mono text-xs font-bold px-3 py-1 border self-start sm:self-auto"
                  style={getStatusBadgeStyle(activeJob.status)}
                >
                  [{activeJob.status}]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 wd-mono text-xs mb-4" style={{ color: t.muted }}>
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: t.accent }} />
                  <span>Sector: {activeJob.locality || 'Pune'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: t.accent }} />
                  <span>Scheduled: {activeJob.preferredDate} ({activeJob.preferredTime || 'Standard Slot'})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench size={14} style={{ color: t.accent }} />
                  <span>{activeJob.workerName ? `Technician: ${activeJob.workerName}` : 'Awaiting worker claim...'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: t.border }}>
                <span className="wd-mono text-xs font-bold" style={{ color: t.text }}>
                  Standard Fee: ₹{activeJob.customerPrice}
                </span>
                <span className="wd-mono text-xs font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform" style={{ color: t.accent }}>
                  OPEN WORK ORDER <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ─── 4. IMAGE-DRIVEN DISPATCH CATALOG ─── */}
        <section className="space-y-4">
          <div className="flex justify-between items-baseline border-b pb-3" style={{ borderColor: t.border }}>
            <div className="flex items-center gap-2">
              <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>01 //</span>
              <h2 className="wd-display font-black text-xl uppercase tracking-tight" style={{ color: t.text }}>
                Service Catalog
              </h2>
            </div>
            <span className="wd-mono text-xs" style={{ color: t.muted }}>CLICK IMAGE TO DISPATCH</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id || cat.catName}
                onClick={() => navigate(`/customer/create-job?catId=${cat.id}`)}
                className="group relative border overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-200 hover:-translate-y-1 shadow-sm"
                style={{
                  background: t.surface,
                  borderColor: t.border,
                  minHeight: 230,
                }}
              >
                {/* Visual Category Backdrop Image */}
                <img
                  src={cat.image}
                  alt={cat.catName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{
                    filter: mode === 'dark' ? 'brightness(0.65) contrast(1.1)' : 'brightness(0.82) contrast(1.05)',
                  }}
                />

                {/* Readable Gradient Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-200"
                  style={{
                    background: mode === 'dark'
                      ? 'linear-gradient(to top, rgba(15, 18, 25, 0.96) 0%, rgba(15, 18, 25, 0.4) 60%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(28, 21, 40, 0.92) 0%, rgba(28, 21, 40, 0.35) 60%, transparent 100%)',
                  }}
                />

                {/* Card Content */}
                <div className="relative z-10 p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="wd-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: '#34D399' }}>
                      {cat.code}
                    </span>
                    <span className="wd-mono text-[10px] text-white/80 border border-white/30 px-1.5 py-0.5">
                      INSTANT
                    </span>
                  </div>

                  <div className="wd-display font-black text-lg text-white uppercase tracking-tight">
                    {cat.catName}
                  </div>

                  <p className="text-[11px] text-white/70 line-clamp-1">
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="wd-mono text-xs font-bold text-white">
                      ₹{cat.customerPrice}
                    </span>
                    <span className="wd-mono text-[11px] font-bold text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" style={{ color: '#34D399' }}>
                      BOOK NOW →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. RECENT WORK ORDERS LOG ─── */}
        <section className="space-y-4">
          <div className="flex justify-between items-baseline border-b pb-3" style={{ borderColor: t.border }}>
            <div className="flex items-center gap-2">
              <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>02 //</span>
              <h2 className="wd-display font-black text-xl uppercase tracking-tight" style={{ color: t.text }}>
                Recent Work Orders
              </h2>
            </div>
            <span className="wd-mono text-xs" style={{ color: t.muted }}>{jobs.length} TOTAL LOGGED</span>
          </div>

          {recentJobs.length > 0 ? (
            <div className="space-y-2.5">
              {recentJobs.map((job) => (
                <div
                  key={job.requestId}
                  onClick={() => navigate(`/jobs/${job.requestId}`)}
                  className="p-4 border flex flex-col sm:flex-row justify-between sm:items-center gap-3 cursor-pointer hover:border-current transition-colors backdrop-blur-xs"
                  style={{
                    background: mode === 'light' ? 'rgba(255, 255, 255, 0.90)' : 'rgba(23, 29, 42, 0.85)',
                    borderColor: t.border,
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="wd-mono text-[10px] font-bold" style={{ color: t.accent }}>
                        #{job.requestId}
                      </span>
                      <span className="wd-display font-bold text-sm" style={{ color: t.text }}>
                        {job.title}
                      </span>
                    </div>
                    <div className="wd-mono text-xs flex items-center gap-3" style={{ color: t.muted }}>
                      <span>{job.preferredDate}</span>
                      <span>•</span>
                      <span>₹{job.customerPrice}</span>
                      <span>•</span>
                      <span>{job.locality}</span>
                    </div>
                  </div>

                  <span
                    className="wd-mono text-xs font-bold px-2.5 py-1 border self-start sm:self-auto"
                    style={getStatusBadgeStyle(job.status)}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-8 border text-center wd-mono text-xs backdrop-blur-xs"
              style={{
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(23, 29, 42, 0.8)',
                borderColor: t.border,
                color: t.muted,
              }}
            >
              No archived service tickets yet. Select a category above to dispatch your first order[cite: 1].
            </div>
          )}
        </section>

      </main>
    </div>
  );
}