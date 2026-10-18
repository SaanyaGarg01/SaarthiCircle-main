import React, { useState, useEffect } from 'react';
import { User, CheckCircle, Clock } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK = [
  { id: '1', name: 'Priya Sharma', city: 'Delhi', skills: 'Medical, Hindi', sessionsCompleted: 28, rating: 4.9, status: 'active', joinedAt: '2 months ago' },
  { id: '2', name: 'Rahul Kumar', city: 'Mumbai', skills: 'Tech, Marathi', sessionsCompleted: 15, rating: 4.7, status: 'active', joinedAt: '1 month ago' },
  { id: '3', name: 'Sunita Rao', city: 'Pune', skills: 'Telugu, Cooking', sessionsCompleted: 42, rating: 5.0, status: 'inactive', joinedAt: '3 months ago' },
];

const NGOVolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await storage.getItem('userToken');
        const res = await fetch(`${BACKEND_URL}/ngo/volunteers`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const data = await res.json(); setVolunteers(data.length ? data : MOCK); } else setVolunteers(MOCK);
      } catch { setVolunteers(MOCK); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>Our Volunteers</h1>
      {loading ? <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {volunteers.map(v => (
            <div key={v.id} id={`ngo-vol-${v.id}`} className="card" style={{ display: 'flex', gap: 'var(--sp-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="avatar avatar-lg" style={{ background: '#4CAF50', color: 'white', flexShrink: 0 }}>{v.name[0]?.toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>{v.name}</h3>
                <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)' }}>📍 {v.city} • {v.skills}</p>
                <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>
                  ✅ {v.sessionsCompleted} sessions • ⭐ {v.rating}/5 • Joined {v.joinedAt}
                </p>
              </div>
              <span className={v.status === 'active' ? 'badge badge-success' : 'badge badge-gray'}>
                {v.status === 'active' ? '🟢 Active' : '⚫ Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default NGOVolunteersPage;
