import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, MapPin, RefreshCw } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK_ALERTS = [
  { id: '1', seniorName: 'Sharma Ji', location: 'Sector 15, Noida', time: '2 min ago', status: 'active', phone: '+919876543210' },
  { id: '2', seniorName: 'Verma Aunty', location: 'Lajpat Nagar, Delhi', time: '8 min ago', status: 'active', phone: '+919876543211' },
  { id: '3', seniorName: 'Gupta Uncle', location: 'Bandra, Mumbai', time: '25 min ago', status: 'resolved', phone: '+919876543212' },
];

const SOSAlertsPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/sos/active`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setAlerts(data.length ? data : MOCK_ALERTS); }
      else setAlerts(MOCK_ALERTS);
    } catch { setAlerts(MOCK_ALERTS); }
    setLoading(false);
  };

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
          <AlertTriangle size={28} color="var(--color-accent-red)" /> SOS Alerts
        </h1>
        <button id="refresh-sos-btn" className="btn btn-ghost" style={{ minHeight: 44 }} onClick={loadAlerts}><RefreshCw size={18} /> Refresh</button>
      </div>

      {alerts.filter(a => a.status === 'active').length > 0 && (
        <div style={{ background: 'var(--color-danger-light)', border: '2px solid var(--color-accent-red)', borderRadius: 'var(--br-lg)', padding: 'var(--sp-md) var(--sp-lg)', marginBottom: 'var(--sp-lg)', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
          <AlertTriangle size={24} color="var(--color-accent-red)" />
          <span style={{ color: 'var(--color-accent-red)', fontWeight: 700, fontSize: 'var(--font-sm)' }}>
            {alerts.filter(a => a.status === 'active').length} active SOS alert(s) require immediate attention!
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {alerts.map(alert => (
            <div key={alert.id} id={`alert-${alert.id}`} className="request-card urgent" style={{ borderLeftColor: alert.status === 'active' ? 'var(--color-accent-red)' : 'var(--color-secondary-green)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>🚨 {alert.seniorName || alert.senior_name}</h3>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={14} /> {alert.location || alert.address || 'Location unknown'}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 4 }}>🕐 {alert.time || alert.created_at}</p>
                </div>
                <span style={{
                  background: alert.status === 'active' ? 'var(--color-danger-light)' : '#E8F5E9',
                  color: alert.status === 'active' ? 'var(--color-accent-red)' : 'var(--color-success)',
                  padding: '6px 14px', borderRadius: 'var(--br-full)', fontSize: 13, fontWeight: 700,
                }}>
                  {alert.status === 'active' ? '🔴 ACTIVE' : '✅ RESOLVED'}
                </span>
              </div>
              {alert.status === 'active' && (
                <div style={{ display: 'flex', gap: 'var(--sp-md)', marginTop: 'var(--sp-md)' }}>
                  <a href={`tel:${alert.phone}`} className="btn btn-danger" style={{ flex: 1, minHeight: 52 }} id={`call-${alert.id}-btn`}>
                    <Phone size={18} /> Call Now
                  </a>
                  <button className="btn btn-primary" style={{ flex: 1, minHeight: 52 }} onClick={() => navigate('/caregiver/dashboard')} id={`respond-${alert.id}-btn`}>
                    Respond to SOS
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
export default SOSAlertsPage;
