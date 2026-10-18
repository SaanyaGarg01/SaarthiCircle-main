import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import { getSocket, identify } from '../../services/socketService';

const DUMMY_REQUESTS = [
  { id: 'dummy1', seniorName: 'Sharma Ji', helpType: 'Daily Assistance', priority: 'high', status: 'pending', description: 'Needs help with medicine pickup', time: '5 min ago', icon: '💊' },
  { id: 'dummy2', seniorName: 'Verma Aunty', helpType: 'Emotional Support', priority: 'medium', status: 'pending', description: 'Wants someone to talk to', time: '15 min ago', icon: '❤️' },
  { id: 'dummy3', seniorName: 'Gupta Uncle', helpType: 'Health-Related', priority: 'medium', status: 'pending', description: 'Feeling unwell, needs guidance', time: '30 min ago', icon: '🏥' },
  { id: 'dummy4', seniorName: 'Kumar Ji', helpType: 'Tech Help', priority: 'low', status: 'active', description: 'Needs help setting up video call', time: '1 hour ago', icon: '📱' },
  { id: 'dummy5', seniorName: 'Patel Uncle', helpType: 'Daily Assistance', priority: 'high', status: 'completed', description: 'Medicine pickup completed', time: 'Yesterday', icon: '✅' },
];

const priorityColors = { high: '#E53935', medium: '#FFC107', low: '#4CAF50' };
const statusColors = { pending: '#FFC107', active: '#4CAF50', completed: '#5B9BD5' };

const CaregiverDashboardPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({ pending: 0, active: 0, completed: 0 });

  useEffect(() => {
    loadData();
    const initSocket = async () => {
      const profileJson = await storage.getItem('userProfile');
      const profile = profileJson ? JSON.parse(profileJson) : {};
      if (profile?.id) identify({ userId: profile.id, role: 'VOLUNTEER' });
      const socket = getSocket();
      socket.on('new_request', () => loadData());
      return () => socket.off('new_request');
    };
    initSocket();
  }, []);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/help-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const reqs = data.length ? data : DUMMY_REQUESTS;
        setRequests(reqs);
        setStats({
          pending: reqs.filter(r => r.status === 'pending').length,
          active: reqs.filter(r => r.status === 'active').length,
          completed: reqs.filter(r => r.status === 'completed').length,
        });
      } else { setRequests(DUMMY_REQUESTS); }
    } catch { setRequests(DUMMY_REQUESTS); }
    setLoading(false);
    setRefreshing(false);
  }, []);

  const handleAccept = async (req) => {
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/help-requests/${req.id}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        showToast('Request accepted!', 'success');
        navigate('/caregiver/interaction', { state: { request: req, conversationId: data.conversationId } });
      } else { showToast('Failed to accept request', 'error'); }
    } catch {
      navigate('/caregiver/interaction', { state: { request: req } });
    }
  };

  const filtered = requests.filter(r => r.status === activeTab);

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>Caregiver Dashboard</h1>
        <button id="refresh-btn" className="btn btn-ghost" style={{ minHeight: 44 }} onClick={loadData} disabled={refreshing}>
          <RefreshCw size={18} className={refreshing ? 'spinning' : ''} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 'var(--sp-lg)' }}>
        {[
          { label: 'Pending', value: stats.pending, icon: Clock, color: '#FFC107', bg: '#FFF8E1' },
          { label: 'Active', value: stats.active, icon: CheckCircle, color: '#4CAF50', bg: '#E8F5E9' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#5B9BD5', bg: '#E8F4FD' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}><Icon size={24} color={s.color} /></div>
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label} Requests</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-lg)' }}>
        {['pending', 'active', 'completed'].map(tab => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px var(--sp-lg)', border: 'none', borderRadius: 'var(--br-full)',
              background: activeTab === tab ? 'var(--color-primary-main)' : 'var(--color-white)',
              color: activeTab === tab ? 'white' : 'var(--color-black)',
              fontFamily: 'inherit', fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', textTransform: 'capitalize',
            }}
          >
            {tab} ({requests.filter(r => r.status === tab).length})
          </button>
        ))}
      </div>

      {/* Requests */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-xxl)', color: 'var(--color-dark-gray)' }}>
          No {activeTab} requests at the moment.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {filtered.map(req => (
            <div
              key={req.id}
              id={`request-${req.id}`}
              className="request-card"
              style={{ borderLeftColor: priorityColors[req.priority] || 'var(--color-primary-main)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-sm)' }}>
                <div style={{ display: 'flex', gap: 'var(--sp-md)', alignItems: 'center' }}>
                  <div style={{ fontSize: 32 }}>{req.icon || '🤝'}</div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{req.seniorName || req.senior_name}</h3>
                    <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 2 }}>{req.helpType || req.help_type}</p>
                    <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 2 }}>🕐 {req.time || req.created_at}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--sp-xs)' }}>
                  <span style={{ background: `${priorityColors[req.priority]}22`, color: priorityColors[req.priority], padding: '4px 10px', borderRadius: 'var(--br-full)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                    {req.priority}
                  </span>
                  <span style={{ background: `${statusColors[req.status]}22`, color: statusColors[req.status], padding: '4px 10px', borderRadius: 'var(--br-full)', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>
                    {req.status}
                  </span>
                </div>
              </div>
              {req.description && <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-sm)', marginTop: 'var(--sp-sm)' }}>{req.description}</p>}
              {req.status === 'pending' && (
                <button
                  id={`accept-${req.id}`}
                  className="btn btn-secondary"
                  style={{ marginTop: 'var(--sp-md)', width: '100%', minHeight: 52 }}
                  onClick={() => handleAccept(req)}
                >
                  <CheckCircle size={20} /> Accept & Help
                </button>
              )}
              {req.status === 'active' && (
                <button
                  id={`chat-${req.id}`}
                  className="btn btn-primary"
                  style={{ marginTop: 'var(--sp-md)', width: '100%', minHeight: 52 }}
                  onClick={() => navigate('/caregiver/interaction', { state: { request: req } })}
                >
                  Continue Session →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default CaregiverDashboardPage;
