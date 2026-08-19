import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosClient';
import { THEME } from '../../../theme/tokens';
import { IconClipboard, IconWrench, IconCheckSquare } from '../../Component/common/IndustrialIcons';

export default function WorkerDashboard({ mode = 'light' }) {
  const t = THEME[mode];
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/workers/me'),
      api.get('/jobs/worker/available'),
      api.get('/jobs/worker/my-jobs'),
    ])
      .then(([resProf, resAvail, resMy]) => {
        setProfile(resProf.data);
        setAvailableJobs(resAvail.data);
        setActiveJobs(
          resMy.data.filter(
            (j) => j.status === 'ACCEPTED' || j.status === 'IN_PROGRESS'
          )
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }} className="wd-mono">
        READING WORK ORDERS...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px' }}>
      {/* Ticket Header */}
      <div
        style={{
          borderBottom: `1px solid ${t.border}`,
          paddingBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div className="wd-mono" style={{ fontSize: 11, color: t.muted }}>
            OPERATOR: {profile?.userName?.toUpperCase() || 'UNREGISTERED'}
          </div>
          <h1
            className="wd-display"
            style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 0 0' }}
          >
            COMMAND CENTER
          </h1>
        </div>

        <div className="wd-mono" style={{ fontSize: 12, display: 'flex', gap: 16 }}>
          <span>
            SECTOR:{' '}
            <strong style={{ color: t.text }}>
              {profile?.locality?.toUpperCase() || 'NONE'}
            </strong>
          </span>
          <span>
            CAPACITY:{' '}
            <strong style={{ color: t.text }}>
              {activeJobs.length} / {profile?.maxCapacity || 3}
            </strong>
          </span>
          <span>
            STATUS:{' '}
            <strong
              style={{
                color: profile?.isAvailable ? t.accent : t.muted,
              }}
            >
              {profile?.isAvailable ? 'AVAILABLE' : 'STANDBY'}
            </strong>
          </span>
        </div>
      </div>

      {/* Perforated Stub Tear-Line */}
      <div style={{ borderTop: `1px dashed ${t.border}`, margin: '16px 0 24px' }} />

      {/* Primary Action — Discovery Order Card */}
      <div
        style={{
          border: `1px solid ${t.border}`,
          background: mode === 'light' ? '#DBD8D0' : t.surface,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <div className="wd-mono" style={{ fontSize: 11, color: t.accent }}>
            W-DISPATCH // LOCAL QUEUE
          </div>
          <div
            className="wd-display"
            style={{ fontSize: 18, fontWeight: 800, margin: '4px 0' }}
          >
            {availableJobs.length} OPEN WORK ORDERS MATCHING YOUR TRADE
          </div>
          <div style={{ fontSize: 13, color: t.muted }}>
            Filtered strictly by sector ({profile?.locality || 'N/A'}) and active skills.
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/worker/find-jobs')}
          className="wd-btn wd-mono"
          style={{
            background: t.accent,
            color: t.accentText,
            border: 'none',
            padding: '12px 20px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          VIEW OPEN ORDERS →
        </button>
      </div>

      {/* In-Flight Work Orders */}
      <div>
        <div
          className="wd-mono"
          style={{
            fontSize: 11,
            color: t.muted,
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>ACTIVE RUNNING TASKS [{activeJobs.length}]</span>
          <span>EXECUTION DISPATCH</span>
        </div>

        {activeJobs.length === 0 ? (
          <div
            style={{
              border: `1px solid ${t.border}`,
              padding: '32px 20px',
              textAlign: 'center',
              color: t.muted,
              fontSize: 13,
            }}
            className="wd-mono"
          >
            NO ACTIVE JOBS CLAIMED. CHECK THE DISPATCH QUEUE ABOVE.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {activeJobs.map((job) => (
              <div
                key={job.requestId}
                style={{
                  border: `1px solid ${t.border}`,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <div className="wd-mono" style={{ fontSize: 10, color: t.accent }}>
                    ORDER #{job.requestId} &nbsp;·&nbsp; {job.categoryName?.toUpperCase()}
                  </div>
                  <div
                    className="wd-display"
                    style={{ fontSize: 16, fontWeight: 700, margin: '2px 0' }}
                  >
                    {job.title}
                  </div>
                  <div className="wd-mono" style={{ fontSize: 12, color: t.muted }}>
                    LOC: {job.locality} &nbsp;·&nbsp; DATE: {job.preferredDate} &nbsp;·&nbsp; PAYOUT: ₹{job.workerPayout}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    className="wd-mono"
                    style={{
                      fontSize: 11,
                      padding: '4px 8px',
                      border: `1px solid ${t.border}`,
                      color: job.status === 'IN_PROGRESS' ? t.accent : t.text,
                    }}
                  >
                    {job.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'ACCEPTED'}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/jobs/${job.requestId}`)}
                    className="wd-btn wd-mono"
                    style={{
                      background: 'transparent',
                      border: `1px solid ${t.border}`,
                      color: t.text,
                      padding: '8px 14px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    OPEN SHEET →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Production Stats */}
      <div
        style={{
          marginTop: 32,
          borderTop: `1px solid ${t.border}`,
          paddingTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
        }}
      >
        <div style={{ border: `1px solid ${t.border}`, padding: '12px 16px' }}>
          <div className="wd-mono" style={{ fontSize: 10, color: t.muted }}>
            JOBS CLOSED OUT
          </div>
          <div className="wd-display" style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
            {profile?.completedJobs || 0}
          </div>
        </div>

        <div style={{ border: `1px solid ${t.border}`, padding: '12px 16px' }}>
          <div className="wd-mono" style={{ fontSize: 10, color: t.muted }}>
            DISPATCH RATING
          </div>
          <div className="wd-display" style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
            {profile?.rating ? `${profile.rating} / 5.0` : 'UNRATED'}
          </div>
        </div>
      </div>
    </div>
  );
}