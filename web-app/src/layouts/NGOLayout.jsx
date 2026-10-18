import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users, Bell, History, UserCog, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/ngo/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ngo/requests', icon: ClipboardList, label: 'Open Requests' },
  { to: '/ngo/volunteers', icon: Users, label: 'Volunteers' },
  { to: '/ngo/alerts', icon: Bell, label: 'Emergency Alerts' },
  { to: '/ngo/cases', icon: History, label: 'Case History' },
  { to: '/ngo/profile', icon: UserCog, label: 'NGO Profile' },
];

const NGOLayout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const name = userProfile?.ngo_name || userProfile?.displayName || 'NGO';

  return (
    <div className="app-shell" style={{ background: '#F8F4FF' }}>
      <aside className="sidebar" style={{ background: 'linear-gradient(180deg, #4527A0 0%, #311B92 100%)', boxShadow: '4px 0 24px rgba(69,39,160,0.35)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--sp-sm)', padding:'var(--sp-xl) var(--sp-lg)', borderBottom:'1px solid rgba(255,255,255,0.15)', fontSize:'var(--font-md)', fontWeight:800, color:'white' }}>
          <Building2 size={28} color="white" /><span>SaathiCircle</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--sp-md)', padding:'var(--sp-lg)', borderBottom:'1px solid rgba(255,255,255,0.15)' }}>
          <div className="avatar" style={{ background:'rgba(255,255,255,0.2)', color:'white' }}>{name[0]?.toUpperCase()}</div>
          <div>
            <div style={{ color:'white', fontWeight:700, fontSize:'var(--font-sm)' }}>{name}</div>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:14 }}>NGO Partner</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'var(--sp-md) 0', display:'flex', flexDirection:'column' }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="nav-item" style={{ marginTop:'auto', color:'rgba(255,255,255,0.6)' }} onClick={async () => { await logout(); navigate('/login', { replace: true }); }}>
          <LogOut size={20} /><span>Sign Out</span>
        </button>
      </aside>
      <div className="main-content">
        <div className="topbar"><span style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>NGO Portal</span></div>
        <div className="page-body"><Outlet /></div>
      </div>
      <nav className="bottom-nav">
        {NAV.slice(0, 5).map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={20} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
export default NGOLayout;
