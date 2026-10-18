import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const MOCK_INCIDENTS = [
  { id: '1', type: 'SOS', senior: 'Sharma Ji', description: 'Fell down at home, needed emergency help', priority: 'critical', status: 'resolved', time: '2 hours ago' },
  { id: '2', type: 'Complaint', senior: 'Verma Aunty', description: 'Volunteer did not show up for scheduled visit', priority: 'high', status: 'open', time: '5 hours ago' },
  { id: '3', type: 'Medical', senior: 'Gupta Uncle', description: 'Medication mix-up, wrong medicine delivered', priority: 'high', status: 'investigating', time: '1 day ago' },
  { id: '4', type: 'Fraud', senior: 'Patel Ji', description: 'Suspicious volunteer asking for money', priority: 'critical', status: 'resolved', time: '2 days ago' },
];

const priorityColors = { critical: '#E53935', high: '#FF8C42', medium: '#FFC107', low: '#4CAF50' };
const statusConfig = { open: { color: '#E53935', label: '🔴 Open' }, investigating: { color: '#FFC107', label: '🟡 Investigating' }, resolved: { color: '#4CAF50', label: '✅ Resolved' } };

const IncidentManagementPage = () => {
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [filter, setFilter] = useState('all');

  const filtered = incidents.filter(i => filter === 'all' || i.status === filter);

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>Incident Management</h1>
      <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap' }}>
        {['all', 'open', 'investigating', 'resolved'].map(f => (
          <button key={f} id={`incident-filter-${f}`} onClick={() => setFilter(f)} style={{ padding: '8px var(--sp-lg)', border: 'none', borderRadius: 'var(--br-full)', background: filter === f ? 'var(--color-primary-main)' : 'white', color: filter === f ? 'white' : 'var(--color-black)', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: 'var(--shadow-sm)', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
        {filtered.map(inc => (
          <div key={inc.id} id={`incident-${inc.id}`} className="card" style={{ borderLeft: `4px solid ${priorityColors[inc.priority]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
              <div>
                <div style={{ display: 'flex', gap: 'var(--sp-sm)', alignItems: 'center', marginBottom: 'var(--sp-sm)' }}>
                  <span style={{ background: `${priorityColors[inc.priority]}22`, color: priorityColors[inc.priority], padding: '3px 10px', borderRadius: 'var(--br-full)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{inc.priority}</span>
                  <span style={{ background: '#E8F4FD', color: '#1565C0', padding: '3px 10px', borderRadius: 'var(--br-full)', fontSize: 12, fontWeight: 700 }}>{inc.type}</span>
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{inc.senior}</h3>
                <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>{inc.description}</p>
                <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 6 }}>🕐 {inc.time}</p>
              </div>
              <div>
                <span style={{ color: statusConfig[inc.status]?.color, fontWeight: 700, fontSize: 'var(--font-xs)' }}>
                  {statusConfig[inc.status]?.label}
                </span>
              </div>
            </div>
            {inc.status === 'open' && (
              <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginTop: 'var(--sp-md)' }}>
                <button id={`investigate-${inc.id}`} className="btn btn-ghost" style={{ minHeight: 44, flex: 1 }} onClick={() => setIncidents(prev => prev.map(i => i.id === inc.id ? { ...i, status: 'investigating' } : i))}>
                  <AlertCircle size={16} /> Investigate
                </button>
                <button id={`resolve-${inc.id}`} className="btn btn-secondary" style={{ minHeight: 44, flex: 1 }} onClick={() => setIncidents(prev => prev.map(i => i.id === inc.id ? { ...i, status: 'resolved' } : i))}>
                  <CheckCircle size={16} /> Mark Resolved
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default IncidentManagementPage;
