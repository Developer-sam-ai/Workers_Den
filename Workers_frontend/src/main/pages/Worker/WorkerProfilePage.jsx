import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosClient';
import { THEME } from '../../../theme/tokens';

export default function WorkerProfilePage({ mode = 'light' }) {
  const t = THEME[mode];
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [locality, setLocality] = useState('Kothrud');
  const [maxCapacity, setMaxCapacity] = useState(3);
  const [isAvailable, setIsAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/workers/me'),
      api.get('/Categories'),
    ])
      .then(([resProf, resCat]) => {
        const p = resProf.data;
        setProfile(p);
        setCategories(resCat.data);
        setLocality(p.locality || 'Kothrud');
        setMaxCapacity(p.maxCapacity || 3);
        setIsAvailable(p.isAvailable ?? true);
        setSelectedCategoryIds(p.categoryIds || []);
      })
      .catch(() => setError('Could not load profile configuration'));
  }, []);

  const toggleCategory = (catId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        locality,
        maxCapacity: Number(maxCapacity),
        isAvailable,
        categoryIds: selectedCategoryIds,
      };

      const res = await api.put('/workers/me', payload);
      setProfile(res.data);
      setSuccess('Profile and operational dispatch settings updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px' }}>
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          padding: '32px 28px',
        }}
      >
        <div style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: 16, marginBottom: 24 }}>
          <div className="wd-mono" style={{ fontSize: 11, color: t.accent, letterSpacing: '0.06em' }}>
            OPERATOR SETTINGS // SERVICE CONFIGURATION
          </div>
          <h1 className="wd-display" style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 0 0', color: t.text }}>
            Worker Operations Profile
          </h1>
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
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="wd-mono"
            style={{
              padding: '10px 14px',
              background: mode === 'light' ? '#DCFCE7' : '#143823',
              border: `1px solid ${mode === 'light' ? '#86EFAC' : '#1E6B3C'}`,
              color: mode === 'light' ? '#15803D' : '#4ADE80',
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 24 }}>
          {/* Availability Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: `1px solid ${t.border}`,
              padding: '16px 20px',
              background: t.accentSoft,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>
                Availability Dispatch Status
              </div>
              <div className="wd-mono" style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
                {isAvailable ? 'Actively receiving matched open orders' : 'Paused — hidden from new dispatch leads'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className="wd-btn wd-mono"
              style={{
                background: isAvailable ? t.success : t.muted,
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isAvailable ? 'AVAILABLE' : 'PAUSED'}
            </button>
          </div>

          {/* Operational Area & Capacity */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label className="wd-mono" style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 6 }}>
                PRIMARY SERVICE LOCALITY
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: 13,
                  border: `1px solid ${t.border}`,
                  background: t.surface,
                  color: t.text,
                  outline: 'none',
                }}
              >
                <option value="Kothrud">Kothrud</option>
                <option value="Karve Nagar">Karve Nagar</option>
                <option value="Warje">Warje</option>
                <option value="Baner">Baner</option>
                <option value="Viman Nagar">Viman Nagar</option>
                <option value="Hinjawadi">Hinjawadi</option>
              </select>
            </div>

            <div>
              <label className="wd-mono" style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 6 }}>
                MAX CONCURRENT CAPACITY
              </label>
              <select
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: 13,
                  border: `1px solid ${t.border}`,
                  background: t.surface,
                  color: t.text,
                  outline: 'none',
                }}
              >
                <option value={1}>1 Task at a time</option>
                <option value={2}>2 Concurrent Tasks</option>
                <option value={3}>3 Concurrent Tasks (Standard)</option>
                <option value={5}>5 Concurrent Tasks (High Capacity)</option>
              </select>
            </div>
          </div>

          {/* Skill / Trade Category Selection */}
          <div>
            <label className="wd-mono" style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 8 }}>
              QUALIFIED TRADE CATEGORIES
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {categories.map((c) => {
                const isSelected = selectedCategoryIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleCategory(c.id)}
                    style={{
                      background: isSelected ? t.accentSoft : 'transparent',
                      border: `1px solid ${isSelected ? t.accent : t.border}`,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? t.accent : t.text }}>
                        {c.catName}
                      </div>
                      <div className="wd-mono" style={{ fontSize: 11, color: t.muted }}>
                        Earn ₹{c.workerPayout}
                      </div>
                    </div>
                    <span className="wd-mono" style={{ fontSize: 12, color: isSelected ? t.accent : t.muted }}>
                      {isSelected ? '[✓]' : '[ ]'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="submit"
              disabled={saving}
              className="wd-btn wd-mono"
              style={{
                flex: 1,
                background: t.accent,
                color: t.accentText,
                border: 'none',
                padding: '14px 20px',
                fontSize: 13,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'UPDATING PROFILE...' : 'SAVE SETTINGS →'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/worker/dashboard')}
              className="wd-btn wd-mono"
              style={{
                background: 'transparent',
                border: `1px solid ${t.border}`,
                color: t.text,
                padding: '14px 20px',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              DASHBOARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}