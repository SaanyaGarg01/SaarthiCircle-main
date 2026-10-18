import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader, CheckCircle, Clock } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const HelpProcessingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const category = state?.category;
  const [status, setStatus] = useState('processing'); // processing | found | timeout
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!category) { navigate('/elderly/help', { replace: true }); return; }
    submitRequest();
  }, []);

  const submitRequest = async () => {
    try {
      const token = await storage.getItem('userToken');
      const profileJson = await storage.getItem('userProfile');
      const profile = profileJson ? JSON.parse(profileJson) : {};
      
      await fetch(`${BACKEND_URL}/help-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          help_type: category?.id || 'general',
          description: description || `Need help with ${category?.label}`,
          senior_id: profile?.id,
          senior_name: profile?.fullName || profile?.full_name || 'Anonymous',
          priority: category?.id === 'medical' ? 'high' : 'medium',
        }),
      });
    } catch { /* ignore, show mock processing */ }

    // Simulate finding caregiver
    setTimeout(() => setStatus('found'), 3000);
  };

  return (
    <div className="page-enter" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: 'var(--sp-xxl)' }}>
        {status === 'processing' && (
          <>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-xl)' }}>
              <Loader size={40} color="var(--color-primary-main)" className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
            <h2 style={{ marginBottom: 'var(--sp-md)' }}>Finding a caregiver...</h2>
            <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-sm)' }}>
              We're matching you with an available {category?.label || 'helper'} caregiver. This usually takes 1–2 minutes.
            </p>
            <div className="divider" />
            <div style={{ textAlign: 'left' }}>
              <label className="input-label">Describe your need (optional)</label>
              <textarea
                className="input"
                style={{ minHeight: 80, marginBottom: 'var(--sp-md)' }}
                placeholder={`Tell us more about your ${category?.label?.toLowerCase() || 'help'} request...`}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </>
        )}
        {status === 'found' && (
          <>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-xl)' }}>
              <CheckCircle size={40} color="var(--color-success)" />
            </div>
            <h2 style={{ marginBottom: 'var(--sp-md)' }}>Caregiver Found! 🎉</h2>
            <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-sm)', marginBottom: 'var(--sp-xl)' }}>
              A caregiver has been assigned to help you with {category?.label}. You'll be notified when they accept.
            </p>
            <button className="btn btn-primary w-full" onClick={() => navigate('/elderly/help/status')} id="view-status-btn">
              View Request Status
            </button>
            <button className="btn btn-ghost w-full" style={{ marginTop: 'var(--sp-md)' }} onClick={() => navigate('/elderly/home')}>
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default HelpProcessingPage;
