import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, User } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK = [
  { id: '1', senior: 'Sharma Ji', helpType: 'Medical Help', description: 'Need medicine pickup from pharmacy', priority: 'high', time: '30 min ago', city: 'Delhi', status: 'open' },
  { id: '2', senior: 'Verma Aunty', helpType: 'Emotional Support', description: 'Lonely, needs someone to talk to', priority: 'medium', time: '1 hour ago', city: 'Noida', status: 'open' },
  { id: '3', senior: 'Patel Ji', helpType: 'Daily Assistance', description: 'Need help with grocery list', priority: 'low', time: '2 hours ago', city: 'Pune', status: 'assigned' },
];

const priorityColors = { high: '#E53935', medium: '#FFC107', low: '#4CAF50' };

const NGOOpenRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await storage.getItem('userToken');
        const res = await fetch(`${BACKEND_URL}/ngo/requests`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const data = await res.json(); setRequests(data.length ? data : MOCK); } else setRequests(MOCK);
      } catch { setRequests(MOCK); }
      setLoading(false);
    };
    load();
  }, []);

  const assign = (id) => { setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'assigned' } : r)); };

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>Open Help Requests</h1>
      {loading ? <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {requests.map(r => (
            <div key={r.id} id={`ngo-req-${r.id}`} className="request-card" style={{ borderLeftColor: priorityColors[r.priority] || 'var(--color-primary-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-sm)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>{r.senior || r.senior_name}</h3>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)' }}>{r.helpType || r.help_type} • 📍 {r.city}</p>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>{r.description}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 4 }}>🕐 {r.time}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ background: `${priorityColors[r.priority]}22`, color: priorityColors[r.priority], padding: '4px 10px', borderRadius: 'var(--br-full)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{r.priority}</span>
                  <span className={r.status === 'open' ? 'badge badge-warning' : 'badge badge-success'}>{r.status}</span>
                </div>
              </div>
              {r.status === 'open' && (
                <button id={`assign-${r.id}`} className="btn btn-secondary" style={{ marginTop: 'var(--sp-md)', width: '100%', minHeight: 48 }} onClick={() => assign(r.id)}>
                  <User size={18} /> Assign Volunteer
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default NGOOpenRequestsPage;
