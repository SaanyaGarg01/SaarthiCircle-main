import React, { useState, useEffect } from 'react';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK = [
  { id: '1', senior: 'Gupta Ji', location: 'Sector 15, Noida', time: '5 min ago', status: 'active', phone: '+919876543210', details: 'Fell down, needs immediate help' },
  { id: '2', senior: 'Patel Aunty', location: 'Bandra, Mumbai', time: '25 min ago', status: 'resolved', phone: '+919876543211', details: 'Medical emergency - resolved by volunteer' },
];

const NGOEmergencyAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await storage.getItem('userToken');
        const res = await fetch(`${BACKEND_URL}/ngo/alerts`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const data = await res.json(); setAlerts(data.length ? data : MOCK); } else setAlerts(MOCK);
      } catch { setAlerts(MOCK); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)', display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
        <AlertTriangle size={30} color="var(--color-accent-red)" /> Emergency Alerts
      </h1>
      {loading ? <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {alerts.map(a => (
            <div key={a.id} id={`ngo-alert-${a.id}`} className="request-card urgent" style={{ borderLeftColor: a.status === 'active' ? 'var(--color-accent-red)' : 'var(--color-secondary-green)', background: a.status === 'active' ? '#FFEBEE' : 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-sm)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>🚨 {a.senior}</h3>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={14} /> {a.location}
                  </p>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>{a.details}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 4 }}>🕐 {a.time}</p>
                </div>
                <span style={{ background: a.status === 'active' ? 'var(--color-danger-light)' : '#E8F5E9', color: a.status === 'active' ? 'var(--color-accent-red)' : 'var(--color-success)', padding: '6px 14px', borderRadius: 'var(--br-full)', fontSize: 13, fontWeight: 700 }}>
                  {a.status === 'active' ? '🔴 ACTIVE' : '✅ RESOLVED'}
                </span>
              </div>
              {a.status === 'active' && (
                <div style={{ display: 'flex', gap: 'var(--sp-md)', marginTop: 'var(--sp-md)' }}>
                  <a href={`tel:${a.phone}`} className="btn btn-danger" style={{ flex: 1, minHeight: 48 }} id={`call-ngo-${a.id}`}>
                    <Phone size={18} /> Call Now
                  </a>
                  <button id={`dispatch-${a.id}`} className="btn btn-secondary" style={{ flex: 1, minHeight: 48 }} onClick={() => setAlerts(prev => prev.map(al => al.id === a.id ? { ...al, status: 'resolved' } : al))}>
                    Dispatch Volunteer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default NGOEmergencyAlertsPage;
