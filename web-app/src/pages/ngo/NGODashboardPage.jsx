import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Users, Bell, History, TrendingUp } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK_STATS = { openRequests: 8, activeVolunteers: 12, resolvedCases: 45, pendingAlerts: 2 };

const NGODashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await storage.getItem('userToken');
        const res = await fetch(`${BACKEND_URL}/ngo/stats`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const data = await res.json(); setStats({ ...MOCK_STATS, ...data }); }
      } catch { }
      setLoading(false);
    };
    load();
  }, []);

  const CARDS = [
    { label: 'Open Requests', value: stats.openRequests, icon: ClipboardList, color: '#FF8C42', bg: '#FFF3E0', to: '/ngo/requests' },
    { label: 'Active Volunteers', value: stats.activeVolunteers, icon: Users, color: '#4CAF50', bg: '#E8F5E9', to: '/ngo/volunteers' },
    { label: 'Resolved Cases', value: stats.resolvedCases, icon: TrendingUp, color: '#5B9BD5', bg: '#E8F4FD', to: '/ngo/cases' },
    { label: 'Emergency Alerts', value: stats.pendingAlerts, icon: Bell, color: '#E53935', bg: '#FFEBEE', to: '/ngo/alerts' },
  ];

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>NGO Dashboard</h1>
      <div className="grid-2" style={{ marginBottom: 'var(--sp-xl)' }}>
        {CARDS.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.label} id={`ngo-card-${c.label.toLowerCase().replace(/ /g, '-')}`} className="stat-card" onClick={() => navigate(c.to)} style={{ cursor: 'pointer', textAlign: 'left' }}>
              <div className="stat-icon" style={{ background: c.bg }}><Icon size={28} color={c.color} /></div>
              <div className="stat-number" style={{ color: c.color, fontSize: 'var(--font-xxl)' }}>{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </button>
          );
        })}
      </div>
      <div className="card">
        <h3 className="section-title">Quick Navigation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
          {[
            { label: '📋 View Open Requests', to: '/ngo/requests' },
            { label: '👥 Manage Volunteers', to: '/ngo/volunteers' },
            { label: '🚨 Emergency Alerts', to: '/ngo/alerts' },
            { label: '📁 Case History', to: '/ngo/cases' },
            { label: '🏛️ NGO Profile', to: '/ngo/profile' },
          ].map(item => (
            <button key={item.to} id={`ngo-nav-${item.to.split('/').pop()}`} className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start', minHeight: 52 }} onClick={() => navigate(item.to)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NGODashboardPage;
