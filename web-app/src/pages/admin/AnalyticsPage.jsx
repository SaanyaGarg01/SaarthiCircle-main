import React from 'react';
import { TrendingUp, Users, Clock, Star, Heart, AlertTriangle } from 'lucide-react';

const STATS = [
  { label: 'Total Help Sessions', value: '2,847', change: '+12%', icon: Heart, color: '#5B9BD5' },
  { label: 'Avg Response Time', value: '8.2 min', change: '-2.1 min', icon: Clock, color: '#4CAF50' },
  { label: 'Senior Satisfaction', value: '4.8/5', change: '+0.2', icon: Star, color: '#FFC107' },
  { label: 'Active Caregivers', value: '142', change: '+8', icon: Users, color: '#8FBC8F' },
  { label: 'SOS Incidents', value: '23', change: '-5', icon: AlertTriangle, color: '#E53935' },
  { label: 'Help Categories', value: '6 types', change: '', icon: TrendingUp, color: '#7B68EE' },
];

const MONTHLY = [
  { month: 'Jan', sessions: 180 }, { month: 'Feb', sessions: 220 }, { month: 'Mar', sessions: 198 },
  { month: 'Apr', sessions: 275 }, { month: 'May', sessions: 302 }, { month: 'Jun', sessions: 348 },
];

const maxSessions = Math.max(...MONTHLY.map(m => m.sessions));

const AnalyticsPage = () => (
  <div className="page-enter">
    <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>Analytics & Insights</h1>

    <div className="grid-3" style={{ marginBottom: 'var(--sp-xl)' }}>
      {STATS.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="stat-card" id={`analytics-${s.label.toLowerCase().replace(/ /g, '-')}`}>
            <div className="stat-icon" style={{ background: `${s.color}22` }}><Icon size={24} color={s.color} /></div>
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            {s.change && <div style={{ fontSize: 13, color: s.change.startsWith('+') ? 'var(--color-success)' : 'var(--color-accent-red)', fontWeight: 700 }}>{s.change} this month</div>}
          </div>
        );
      })}
    </div>

    <div className="card" style={{ marginBottom: 'var(--sp-lg)' }}>
      <h3 className="section-title">Monthly Help Sessions</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-md)', height: 200, padding: 'var(--sp-md) 0' }}>
        {MONTHLY.map(m => (
          <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-xs)' }}>
            <span style={{ fontSize: 13, color: 'var(--color-dark-gray)', fontWeight: 600 }}>{m.sessions}</span>
            <div style={{ width: '100%', background: 'var(--color-primary-main)', borderRadius: 'var(--br-sm) var(--br-sm) 0 0', height: `${(m.sessions / maxSessions) * 140}px`, transition: 'height 0.5s ease' }} />
            <span style={{ fontSize: 13, color: 'var(--color-dark-gray)', fontWeight: 700 }}>{m.month}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid-2">
      <div className="card">
        <h3 className="section-title">Help Categories</h3>
        {[
          { label: 'Emotional Support', pct: 35, color: '#8FBC8F' },
          { label: 'Medical Help', pct: 25, color: '#E53935' },
          { label: 'Daily Assistance', pct: 20, color: '#5B9BD5' },
          { label: 'Tech Help', pct: 10, color: '#7B68EE' },
          { label: 'Grocery', pct: 6, color: '#FF8C42' },
          { label: 'Transport', pct: 4, color: '#FFC107' },
        ].map(c => (
          <div key={c.label} style={{ marginBottom: 'var(--sp-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{c.label}</span>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)' }}>{c.pct}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--color-light-gray)', borderRadius: 'var(--br-full)' }}>
              <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 'var(--br-full)', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="section-title">Top Cities</h3>
        {[
          { city: 'Delhi', seniors: 312 }, { city: 'Mumbai', seniors: 287 }, { city: 'Bangalore', seniors: 198 },
          { city: 'Pune', seniors: 143 }, { city: 'Hyderabad', seniors: 126 },
        ].map((c, i) => (
          <div key={c.city} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-sm) 0', borderBottom: '1px solid var(--color-light-gray)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: 'var(--color-primary-main)' }}>{i + 1}</span>
              <span style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{c.city}</span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--color-primary-main)' }}>{c.seniors}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default AnalyticsPage;
