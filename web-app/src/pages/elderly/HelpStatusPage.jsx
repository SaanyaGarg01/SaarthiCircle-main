import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK_STATUS = [
  { id: '1', helpType: 'Medical Help', status: 'accepted', caregiverName: 'Priya Sharma', time: '5 min ago', priority: 'high' },
  { id: '2', helpType: 'Tech Help', status: 'pending', caregiverName: null, time: '10 min ago', priority: 'low' },
  { id: '3', helpType: 'Grocery Shopping', status: 'completed', caregiverName: 'Ramesh Kumar', time: 'Yesterday', priority: 'medium' },
];

const statusConfig = {
  pending: { color: '#FFC107', bg: '#FFF8E1', icon: Clock, label: 'Pending' },
  accepted: { color: '#4CAF50', bg: '#E8F5E9', icon: CheckCircle, label: 'Accepted' },
  completed: { color: '#5B9BD5', bg: '#E8F4FD', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: '#E53935', bg: '#FFEBEE', icon: XCircle, label: 'Cancelled' },
};

const HelpStatusPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/help-requests/my`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setRequests(data.length ? data : MOCK_STATUS); }
      else setRequests(MOCK_STATUS);
    } catch { setRequests(MOCK_STATUS); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>My Help Requests</h1>
        <button className="btn btn-ghost" style={{ minHeight: 44 }} onClick={loadRequests} id="refresh-btn">
          <RefreshCw size={18} /> Refresh
        </button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-xxl)', color: 'var(--color-dark-gray)' }}>
          <p>No help requests yet.</p>
          <button className="btn btn-primary" style={{ marginTop: 'var(--sp-lg)' }} onClick={() => navigate('/elderly/help')}>Request Help Now</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {requests.map(r => {
            const cfg = statusConfig[r.status] || statusConfig.pending;
            const Icon = cfg.icon;
            return (
              <div key={r.id} className="request-card" style={{ borderLeftColor: cfg.color }} id={`request-${r.id}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{r.helpType || r.help_type}</h3>
                    {r.description && <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>{r.description}</p>}
                    {r.caregiverName && <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-primary-main)', marginTop: 6, fontWeight: 600 }}>👤 {r.caregiverName}</p>}
                    <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 4 }}>🕐 {r.time || r.created_at}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: cfg.bg, color: cfg.color, padding: '6px 12px', borderRadius: 'var(--br-full)', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    <Icon size={14} /> {cfg.label}
                  </div>
                </div>
                {r.status === 'accepted' && (
                  <button className="btn btn-primary" style={{ marginTop: 'var(--sp-md)', minHeight: 48 }} onClick={() => navigate('/elderly/chat', { state: { requestId: r.id } })}>
                    Start Chat with Caregiver
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default HelpStatusPage;
