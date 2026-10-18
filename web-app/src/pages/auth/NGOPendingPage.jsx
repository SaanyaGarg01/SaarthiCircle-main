import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NGOPendingPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #FFF3E0, #FFF8E7)' }}>
      <div className="glass-card" style={{ maxWidth:480, width:'100%', padding:'var(--sp-xxl)', textAlign:'center', margin:'var(--sp-lg)' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#FFF3E0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto var(--sp-lg)' }}>
          <Building2 size={40} color="var(--color-accent-orange)" />
        </div>
        <h1 style={{ fontSize:'var(--font-xl)', fontWeight:700, marginBottom:'var(--sp-md)' }}>NGO Verification Pending</h1>
        <p style={{ color:'var(--color-dark-gray)', fontSize:'var(--font-sm)', lineHeight:1.6, marginBottom:'var(--sp-xl)' }}>
          Your NGO registration is under verification. Our admin team is reviewing your documents. 
          You will be notified via email once the verification is complete. This typically takes 2–5 business days.
        </p>
        <button className="btn btn-ghost w-full" onClick={async () => { await logout(); navigate('/login'); }}>Sign Out</button>
      </div>
    </div>
  );
};
export default NGOPendingPage;
