import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const VolunteerPendingPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-cream))' }}>
      <div className="glass-card" style={{ maxWidth:480, width:'100%', padding:'var(--sp-xxl)', textAlign:'center', margin:'var(--sp-lg)' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--color-secondary-cream)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto var(--sp-lg)' }}>
          <Clock size={40} color="var(--color-accent-orange)" />
        </div>
        <h1 style={{ fontSize:'var(--font-xl)', fontWeight:700, marginBottom:'var(--sp-md)' }}>Application Under Review</h1>
        <p style={{ color:'var(--color-dark-gray)', fontSize:'var(--font-sm)', lineHeight:1.6, marginBottom:'var(--sp-xl)' }}>
          Thank you for applying to be a volunteer with SaathiCircle! Your application is being reviewed by our team. 
          You'll receive a notification once it's approved. This usually takes 1–2 business days.
        </p>
        <div style={{ background:'var(--color-secondary-green-light)', borderRadius:'var(--br-lg)', padding:'var(--sp-lg)', marginBottom:'var(--sp-lg)', textAlign:'left' }}>
          <p style={{ fontWeight:700, marginBottom:'var(--sp-sm)', color:'#2E7D32' }}>What happens next?</p>
          <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'var(--sp-xs)' }}>
            {['Background verification', 'Training material sent to your email', 'Account activation', 'Welcome to the SaathiCircle family!'].map((s, i) => (
              <li key={i} style={{ color:'var(--color-dark-gray)', fontSize:'var(--font-xs)' }}>✅ {s}</li>
            ))}
          </ul>
        </div>
        <button className="btn btn-ghost w-full" onClick={async () => { await logout(); navigate('/login'); }}>Sign Out</button>
      </div>
    </div>
  );
};
export default VolunteerPendingPage;
