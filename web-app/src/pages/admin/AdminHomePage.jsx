import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, AlertTriangle, TrendingUp, Clock, Activity, Bell, RefreshCw } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';
import { getSocket, identify } from '../../services/socketService';

const DEFAULT_STATS = { totalSeniors: 1247, activeCaregivers: 89, pendingRequests: 23, sosAlerts: 2, helpResolved: 456, avgResponseTime: '12 min' };
const DEFAULT_ACTIVITY = [
  { id: '1', type: 'sos', message: 'SOS Alert from Verma Ji', time: '2 mins ago' },
  { id: '2', type: 'request', message: 'New help request assigned', time: '5 mins ago' },
  { id: '3', type: 'resolved', message: 'Medicine pickup completed', time: '10 mins ago' },
  { id: '4', type: 'caregiver', message: 'New caregiver registered', time: '15 mins ago' },
  { id: '5', type: 'mood', message: 'Low mood alert for 3 seniors', time: '30 mins ago' },
];

const activityIcons = { sos: '🚨', request: '🤝', resolved: '✅', caregiver: '👤', mood: '😢' };

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [activity, setActivity] = useState(DEFAULT_ACTIVITY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setStats({ ...DEFAULT_STATS, ...data }); }
      const actRes = await fetch(`${BACKEND_URL}/admin/activity`, { headers: { Authorization: `Bearer ${token}` } });
      if (actRes.ok) { const data = await actRes.json(); setActivity(data.length ? data : DEFAULT_ACTIVITY); }
    } catch { }
    setLoading(false);
    setRefreshing(false);
  };

  const STAT_CARDS = [
    { label: 'Total Seniors', value: stats.totalSeniors, icon: Users, color: '#5B9BD5', bg: '#E8F4FD', to: '/admin/users' },
    { label: 'Active Caregivers', value: stats.activeCaregivers, icon: UserCheck, color: '#4CAF50', bg: '#E8F5E9', to: '/admin/volunteers' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: '#FFC107', bg: '#FFF8E1', to: '/admin/incidents' },
    { label: 'SOS Alerts', value: stats.sosAlerts, icon: AlertTriangle, color: '#E53935', bg: '#FFEBEE', to: '/admin/incidents' },
    { label: 'Help Resolved', value: stats.helpResolved, icon: TrendingUp, color: '#8FBC8F', bg: '#E8F5E9', to: '/admin/analytics' },
    { label: 'Avg Response', value: stats.avgResponseTime, icon: Activity, color: '#7B68EE', bg: '#EDE7F6', to: '/admin/analytics' },
  ];

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-lg)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--color-dark-gray)', marginTop: 4 }}>SaathiCircle operations overview</p>
        </div>
        <button id="refresh-admin-btn" className="btn btn-ghost" style={{ minHeight: 44 }} onClick={loadData} disabled={refreshing}>
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid-3" style={{ marginBottom: 'var(--sp-xl)' }}>
        {STAT_CARDS.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.label} id={`stat-${s.label.toLowerCase().replace(/ /g, '-')}`} className="stat-card" onClick={() => navigate(s.to)} style={{ cursor: 'pointer', textAlign: 'left' }}>
              <div className="stat-icon" style={{ background: s.bg }}><Icon size={24} color={s.color} /></div>
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-lg)' }}>
        <div className="card">
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
            <Activity size={20} /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
            {activity.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', padding: 'var(--sp-sm) 0', borderBottom: '1px solid var(--color-light-gray)' }}>
                <span style={{ fontSize: 24 }}>{activityIcons[a.type] || '📌'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{a.message}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 2 }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
            <Bell size={20} /> Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
            {[
              { label: '👥 Manage Users', to: '/admin/users' },
              { label: '✅ Approve Volunteers', to: '/admin/volunteers' },
              { label: '🏛️ Approve NGOs', to: '/admin/ngos' },
              { label: '📊 View Analytics', to: '/admin/analytics' },
              { label: '🧠 AI Risk Dashboard', to: '/admin/ai-risk' },
              { label: '⚠️ Incident Reports', to: '/admin/incidents' },
            ].map(a => (
              <button key={a.label} id={`quick-${a.to.replace('/admin/', '')}`} className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start', minHeight: 48, fontSize: 'var(--font-xs)' }} onClick={() => navigate(a.to)}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminHomePage;
