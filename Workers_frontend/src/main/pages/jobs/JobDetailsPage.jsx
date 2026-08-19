import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosClient';
import { THEME } from '../../../theme/tokens';

export default function JobDetailsPage({ mode = 'light' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = THEME[mode];

  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [acting, setActing] = useState(false);

  const token = localStorage.getItem('token');
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role ? payload.role.replace('ROLE_', '') : null;
    } catch {
      localStorage.clear();
    }
  }

  const fetchJob = useCallback(() => {
    api.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => setError('Could not locate work order record.'));
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleAction = async (actionPath) => {
    setError('');
    setActing(true);
    try {
      await api.post(`/jobs/${id}/${actionPath}`);
      fetchJob();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to transition job status.`);
    } finally {
      setActing(false);
    }
  };

  if (!job) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }} className="wd-mono">
        {error || 'READING WORK ORDER DATA...'}
      </div>
    );
  }

  const isWorker = userRole === 'WORKER';
  const isCustomer = userRole === 'CUSTOMER';

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px' }}>
      {/* Physical Sheet Container */}
      <div
        style={{
          border: `1px solid ${t.border}`,
          background: mode === 'light' ? '#EAE8E2' : t.surface,
          padding: '24px 28px',
        }}
      >
        {/* Top Identification Bar */}
        <div
          style={{
            borderBottom: `1px solid ${t.border}`,
            paddingBottom: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div className="wd-mono" style={{ fontSize: 11, color: t.accent }}>
            WORK ORDER #{job.requestId} // {job.categoryName?.toUpperCase()}
          </div>
          <div
            className="wd-mono"
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 6px',
              border: `1px solid ${t.border}`,
            }}
          >
            STATUS: {job.status}
          </div>
        </div>

        {/* Title & Description */}
        <h1
          className="wd-display"
          style={{ fontSize: 22, fontWeight: 800, margin: '16px 0 8px' }}
        >
          {job.title}
        </h1>

        <p style={{ fontSize: 14, lineHeight: 1.6, color: t.text, margin: '0 0 20px' }}>
          {job.description || 'No additional scope of work specified.'}
        </p>

        {/* Perforated Stub Line */}
        <div style={{ borderTop: `1px dashed ${t.border}`, margin: '20px 0' }} />

        {/* Field Specs Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
          className="wd-mono"
        >
          <div>
            <div style={{ fontSize: 10, color: t.muted }}>SERVICE LOCATION</div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>
              {job.locality}, {job.address}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: t.muted }}>DISPATCH SCHEDULE</div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>
              {job.preferredDate} {job.preferredTime ? `· ${job.preferredTime}` : ''}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: t.muted }}>
              {isWorker ? 'WORKER PAYOUT' : 'STANDARD PRICE'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, color: t.accent }}>
              ₹{isWorker ? job.workerPayout : job.customerPrice}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: t.muted }}>
              {isWorker ? 'POSTED BY' : 'ASSIGNED OPERATOR'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>
              {isWorker
                ? `${job.customerName} (TEL: ${job.customerPhone || 'N/A'})`
                : (job.workerName ? `${job.workerName} (TEL: ${job.workerPhone || 'N/A'})` : 'UNASSIGNED')}
            </div>
          </div>
        </div>

        {/* Specific Blunt Error Banner */}
        {error && (
          <div
            className="wd-mono"
            style={{
              padding: '10px 14px',
              background: mode === 'light' ? '#D6CECE' : '#331B1B',
              border: '1px solid #994D4D',
              color: mode === 'light' ? '#801A1A' : '#FF9999',
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Execution Actions — Locked to Single Primary Action per Step */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', borderTop: `1px solid ${t.border}`, paddingTop: 16 }}>
          {isWorker && job.status === 'OPEN' && (
            <button
              type="button"
              disabled={acting}
              onClick={() => handleAction('accept')}
              className="wd-btn wd-mono"
              style={{
                background: t.accent,
                color: t.accentText,
                border: 'none',
                padding: '12px 24px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {acting ? 'CLAIMING RECORD...' : 'ACCEPT WORK ORDER'}
            </button>
          )}

          {isWorker && job.status === 'ACCEPTED' && (
            <button
              type="button"
              disabled={acting}
              onClick={() => handleAction('start')}
              className="wd-btn wd-mono"
              style={{
                background: t.accent,
                color: t.accentText,
                border: 'none',
                padding: '12px 24px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {acting ? 'UPDATING...' : 'START JOB'}
            </button>
          )}

          {isWorker && job.status === 'IN_PROGRESS' && (
            <button
              type="button"
              disabled={acting}
              onClick={() => handleAction('complete')}
              className="wd-btn wd-mono"
              style={{
                background: t.accent,
                color: t.accentText,
                border: 'none',
                padding: '12px 24px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {acting ? 'CLOSING OUT...' : 'MARK COMPLETED'}
            </button>
          )}

          {job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
            <button
              type="button"
              disabled={acting}
              onClick={() => handleAction('cancel')}
              className="wd-btn wd-mono"
              style={{
                background: 'transparent',
                border: `1px solid ${t.border}`,
                color: t.muted,
                padding: '12px 18px',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              CANCEL ORDER
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="wd-btn wd-mono"
            style={{
              background: 'transparent',
              border: `1px solid ${t.border}`,
              color: t.text,
              padding: '12px 18px',
              fontSize: 12,
              marginLeft: 'auto',
              cursor: 'pointer',
            }}
          >
            ← BACK TO DISPATCH
          </button>
        </div>
      </div>
    </div>
  );
}