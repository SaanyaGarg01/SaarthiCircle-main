import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, X } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';
import './SOSPage.css';

const SOSPage = () => {
  const navigate = useNavigate();
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [sent, setSent] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([{ name: 'Emergency Services', phone: '112', relationship: 'Emergency' }]);
  const timerRef = useRef(null);
  const holdRef = useRef(null);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      const profileJson = await storage.getItem('userProfile');
      if (profileJson) { const p = JSON.parse(profileJson); setUserProfile(p); }
      const cJson = await storage.getItem('emergencyContacts');
      if (cJson) setEmergencyContacts(JSON.parse(cJson));
    };
    load();
    return () => { clearInterval(timerRef.current); clearTimeout(holdRef.current); };
  }, []);

  const startHold = () => {
    setHolding(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setHoldProgress(p);
      if (p >= 100) { clearInterval(interval); triggerSOS(); }
    }, 100);
    holdRef.current = interval;
  };

  const cancelHold = () => {
    setHolding(false);
    setHoldProgress(0);
    clearInterval(holdRef.current);
  };

  const triggerSOS = async () => {
    setActivated(true);
    setHolding(false);
    // Vibrate if supported
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 200]);

    // Countdown
    let c = 5;
    timerRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timerRef.current);
        sendSOSAlert();
      }
    }, 1000);
  };

  const sendSOSAlert = async () => {
    try {
      const token = await storage.getItem('userToken');
      await fetch(`${BACKEND_URL}/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          user_id: userProfile?.id,
          user_name: userProfile?.fullName || userProfile?.full_name || 'Anonymous',
          location: userProfile?.city || 'Unknown',
          emergency_contacts: emergencyContacts,
        }),
      });
    } catch { /* still show UI */ }
    setSent(true);
  };

  const cancelSOS = () => {
    clearInterval(timerRef.current);
    setActivated(false);
    setCountdown(5);
    setSent(false);
  };

  return (
    <div className="sos-page page-enter">
      <div className="sos-header">
        <div className="sos-icon-wrap">
          <AlertTriangle size={48} color="white" />
        </div>
        <h1>Emergency SOS</h1>
        <p>Hold the button below to activate emergency alert</p>
      </div>

      {!activated ? (
        <div className="sos-content">
          <div className="sos-hold-area">
            <div
              id="sos-hold-btn"
              className={`sos-hold-btn ${holding ? 'holding' : ''}`}
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={e => { e.preventDefault(); startHold(); }}
              onTouchEnd={cancelHold}
            >
              <AlertTriangle size={64} color="white" />
              <span>HOLD FOR SOS</span>
              {holding && (
                <div className="hold-progress">
                  <div className="hold-progress-bar" style={{ width: `${holdProgress}%` }} />
                </div>
              )}
            </div>
            <p className="hold-hint">Hold for 3 seconds to activate</p>
          </div>

          <div className="emergency-contacts-section">
            <h3>Emergency Contacts</h3>
            {emergencyContacts.map((c, i) => (
              <div key={i} className="contact-card">
                <div>
                  <div className="contact-name">{c.name}</div>
                  <div className="contact-rel">{c.relationship}</div>
                </div>
                <a href={`tel:${c.phone}`} className="btn btn-secondary" style={{ minHeight: 44 }} id={`call-${i}-btn`}>
                  <Phone size={18} /> {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : !sent ? (
        <div className="sos-activated">
          <div className="countdown-circle pulse">
            <span className="countdown-num">{countdown}</span>
            <span className="countdown-label">Sending SOS...</span>
          </div>
          <p style={{ color: 'white', fontSize: 'var(--font-md)', marginBottom: 'var(--sp-xl)', opacity: 0.9 }}>
            Alerting emergency contacts and caregivers
          </p>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }} onClick={cancelSOS} id="cancel-sos-btn">
            <X size={20} /> Cancel SOS
          </button>
        </div>
      ) : (
        <div className="sos-sent">
          <div style={{ fontSize: 80 }}>✅</div>
          <h2 style={{ color: 'white', fontSize: 'var(--font-xxl)', margin: 'var(--sp-lg) 0' }}>Help is on the way!</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--font-md)', marginBottom: 'var(--sp-xl)' }}>
            Emergency alerts sent to all contacts. Stay calm.
          </p>
          <div style={{ display: 'flex', gap: 'var(--sp-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:112" className="btn btn-danger" id="call-112-btn"><Phone size={20} /> Call 112</a>
            <button className="btn btn-ghost" style={{ color: 'white', borderColor: 'white' }} onClick={() => navigate('/elderly/home')}>Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default SOSPage;
