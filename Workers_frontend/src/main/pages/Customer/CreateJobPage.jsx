import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../api/axiosClient';
import { THEME } from '../../../theme/tokens';

export default function CreateJobPage({ mode = 'light' }) {
  const t = THEME[mode];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(searchParams.get('catId') || '');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locality: 'Kothrud',
    address: '',
    preferredDate: '',
    preferredTime: '10:00 AM - 01:00 PM',
    urgency: 'NORMAL',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/Categories')
      .then((res) => {
        setCategories(res.data);
        if (!selectedCatId && res.data.length > 0) {
          setSelectedCatId(res.data[0].id.toString());
        }
      })
      .catch(() => setError('Could not fetch service categories'));
  }, [selectedCatId]);

  const selectedCat = categories.find((c) => c.id.toString() === selectedCatId.toString());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCatId) {
      setError('Please select a service category');
      return;
    }
    if (!formData.preferredDate) {
      setError('Please choose a preferred service date');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        categoryId: Number(selectedCatId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        locality: formData.locality,
        address: formData.address.trim(),
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        urgency: formData.urgency,
      };

      const res = await api.post('/jobs/create', payload);
      navigate(`/jobs/${res.data.requestId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post service request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          padding: '32px 28px',
        }}
      >
        <div style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: 16, marginBottom: 24 }}>
          <div className="wd-mono" style={{ fontSize: 11, color: t.accent, letterSpacing: '0.06em' }}>
            ORDER DISPATCH // NEW SERVICE REQUEST
          </div>
          <h1 className="wd-display" style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 0 0', color: t.text }}>
            Post a Service Order
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
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <div>
            <label className="wd-mono" style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 8 }}>
              1. SELECT CATEGORY
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {categories.map((c) => {
                const isSelected = c.id.toString() === selectedCatId.toString();
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCatId(c.id.toString())}
                    style={{
                      background: isSelected ? t.accentSoft : 'transparent',
                      border: `1px solid ${isSelected ? t.accent : t.border}`,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'border-color 150ms ease',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? t.accent : t.text }}>
                      {c.catName}
                    </div>
                    <div className="wd-mono" style={{ fontSize: 11, color: isSelected ? t.accent : t.muted, marginTop: 2 }}>
                      ₹{c.customerPrice}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="wd-mono" style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 6 }}>
              2. TASK TITLE
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Kitchen sink pipe leaking underneath basin"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 13,
                border: `1px solid ${t.border}`,
                background: 'transparent',
                color: t.text,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="wd-mono" style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 6 }}>
              3. PROBLEM DESCRIPTION
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue, tools required, or access instructions..."
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 13,
                border: `1px solid ${t.border}`,
                background: 'transparent',
                color: t.text,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div>
              <label className="wd-mono" style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 6 }}>
                4. LOCALITY / SECTOR
              </label>
              <select
                name="locality"
                value={formData.locality}
                onChange={handleChange}
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
                5. PREFERRED DATE
              </label>
              <input
                type="date"
                name="preferredDate"
                required
                value={formData.preferredDate}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  fontSize: 13,
                  border: `1px solid ${t.border}`,
                  background: 'transparent',
                  color: t.text,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label className="wd-mono" style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 6 }}>
              6. COMPLETE ADDRESS
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Flat / House No., Building Name, Landmark"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 13,
                border: `1px solid ${t.border}`,
                background: 'transparent',
                color: t.text,
                outline: 'none',
              }}
            />
          </div>

          <div
            style={{
              background: t.accentSoft,
              border: `1px solid ${t.accent}`,
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 10,
            }}
          >
            <div>
              <div className="wd-mono" style={{ fontSize: 10, color: t.accent, letterSpacing: '0.06em' }}>
                LOCKED PLATFORM PRICING
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginTop: 2 }}>
                {selectedCat?.catName || 'Selected Service'} — Standard Inspection & Work Fee
              </div>
            </div>
            <div className="wd-display" style={{ fontSize: 22, fontWeight: 800, color: t.accent }}>
              ₹{selectedCat?.customerPrice || 0}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button
              type="submit"
              disabled={submitting}
              className="wd-btn wd-mono"
              style={{
                flex: 1,
                background: t.accent,
                color: t.accentText,
                border: 'none',
                padding: '14px 20px',
                fontSize: 13,
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'DISPATCHING ORDER...' : 'CONFIRM & POST ORDER →'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/customer/dashboard')}
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
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}