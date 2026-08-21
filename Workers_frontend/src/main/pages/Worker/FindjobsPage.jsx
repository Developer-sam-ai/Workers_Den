import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosClient';
import { THEME } from '../../../theme/tokens';

export default function FindJobsPage({ mode = 'light' }) {
  const t = THEME[mode];
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [error, setError] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/workers/me'),
      api.get('/jobs/worker/available'),
    ])
      .then(([resProf, resJobs]) => {
        setProfile(resProf.data);
        setJobs(resJobs.data);
      })
      .catch(() => setError('Failed to load eligible discovery queue'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaim = async (jobId) => {
    setError('');
    setClaimingId(jobId);
    try {
      await api.post(`/jobs/${jobId}/accept`);
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Job was claimed by another worker.');
      loadData();
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: t.muted }} className="wd-mono">
        QUERYING DISPATCH QUEUE...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="wd-mono" style={{ fontSize: 11, color: t.accent, letterSpacing: '0.06em' }}>
            DISPATCH ENGINE // MATCHED OPEN QUEUE
          </div>
          <h1 className="wd-display" style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 0 0', color: t.text }}>
            Available Work Orders
          </h1>
        </div>

        <div className="wd-mono" style={{ fontSize: 12, color: t.muted }}>
          FILTERED BY: <strong>{profile?.locality?.toUpperCase() || 'PUNE'}</strong> &nbsp;·&nbsp; {jobs.length} ORDERS
        </div>
      </div>

      {error && (
        <div
          className="wd-mono"
          style={{
            padding: '10px 14px',
            background: mode === 'light' ? '#FEE2E2' : '#3B1818',
            border: `1px solid ${mode === 'light' ? '#F87171' : '#7F2323'}`,
            color: mode === 'light' ? '#B91C1C' : '#F87171',
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <div className="wd-display" style={{ fontSize: 18, fontWeight: 700, color: t.text }}>
            No open jobs in your sector
          </div>
          <p style={{ fontSize: 13, color: t.muted, marginTop: 6, maxWidth: 460, margin: '6px auto 20px' }}>
            Work orders matching your trade skills and locality will automatically appear here as customers post them.
          </p>
          <button
            type="button"
            onClick={() => navigate('/worker/dashboard')}
            className="wd-btn wd-mono"
            style={{
              background: 'transparent',
              border: `1px solid ${t.border}`,
              color: t.text,
              padding: '10px 20px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            ← RETURN TO DASHBOARD
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {jobs.map((job) => (
            <div
              key={job.requestId}
              style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ maxWidth: 580 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span className="wd-mono" style={{ fontSize: 10, color: t.accent, fontWeight: 600 }}>
                    #{job.requestId} // {job.categoryName?.toUpperCase()}
                  </span>
                  <span
                    className="wd-mono"
                    style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      background: job.urgency === 'URGENT' ? (mode === 'light' ? '#FEE2E2' : '#451A1A') : t.accentSoft,
                      color: job.urgency === 'URGENT' ? '#DC2626' : t.accent,
                    }}
                  >
                    {job.urgency}
                  </span>
                </div>

                <div className="wd-display" style={{ fontSize: 17, fontWeight: 700, color: t.text }}>
                  {job.title}
                </div>

                <p style={{ fontSize: 13, color: t.muted, margin: '6px 0 10px', lineHeight: 1.5 }}>
                  {job.description || 'No additional scope of work provided.'}
                </p>

                <div className="wd-mono" style={{ fontSize: 11, color: t.muted }}>
                  LOC: {job.locality}, {job.address} &nbsp;·&nbsp; DATE: {job.preferredDate} ({job.preferredTime || 'Anytime'})
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ textAlign: 'right' }}>
                  <div className="wd-mono" style={{ fontSize: 10, color: t.muted }}>
                    GUARANTEED PAYOUT
                  </div>
                  <div className="wd-display" style={{ fontSize: 22, fontWeight: 800, color: t.accent }}>
                    ₹{job.workerPayout}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/jobs/${job.requestId}`)}
                    className="wd-btn wd-mono"
                    style={{
                      background: 'transparent',
                      border: `1px solid ${t.border}`,
                      color: t.text,
                      padding: '10px 14px',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    INSPECT
                  </button>

                  <button
                    type="button"
                    disabled={claimingId === job.requestId}
                    onClick={() => handleClaim(job.requestId)}
                    className="wd-btn wd-mono"
                    style={{
                      background: t.accent,
                      color: t.accentText,
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: claimingId === job.requestId ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {claimingId === job.requestId ? 'CLAIMING...' : 'ACCEPT JOB →'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}