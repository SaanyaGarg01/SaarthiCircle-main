import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, MessageCircle } from 'lucide-react';

const VolunteerSessionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const request = state?.request;

  if (!request) {
    return (
      <div className="page-enter" style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}>
        <div style={{ fontSize: 64, marginBottom: 'var(--sp-lg)' }}>😊</div>
        <h2>No Active Session</h2>
        <p style={{ color: 'var(--color-dark-gray)', margin: 'var(--sp-md) 0 var(--sp-lg)' }}>
          You don't have an active session right now. Check the dashboard for pending requests.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/caregiver/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  const seniorName = request.seniorName || request.senior_name || 'Senior';

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-xxl)', background: 'linear-gradient(135deg, #E8F5E9, white)' }}>
        <div className="avatar avatar-xl" style={{ background: '#2E7D32', color: 'white', fontSize: 40, margin: '0 auto var(--sp-lg)' }}>{seniorName[0]?.toUpperCase()}</div>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{seniorName}</h2>
        <p style={{ color: 'var(--color-dark-gray)', marginTop: 8 }}>{request.helpType || 'Assistance'}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 'var(--sp-md)' }}>
          <Clock size={18} color="var(--color-accent-orange)" />
          <span style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)' }}>Session started {request.time || 'now'}</span>
        </div>
        <span className="badge badge-success" style={{ marginTop: 'var(--sp-md)', fontSize: 'var(--font-xs)' }}>
          <CheckCircle size={14} style={{ marginRight: 4 }} /> Active Session
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)', marginTop: 'var(--sp-lg)' }}>
        <button id="open-chat-btn" className="btn btn-primary btn-xl" onClick={() => navigate('/caregiver/interaction', { state: { request } })}>
          <MessageCircle size={24} /> Open Chat
        </button>
        <button id="mark-complete-btn" className="btn btn-secondary btn-xl" onClick={() => navigate('/caregiver/dashboard')}>
          <CheckCircle size={24} /> Mark as Completed
        </button>
      </div>
    </div>
  );
};
export default VolunteerSessionPage;
