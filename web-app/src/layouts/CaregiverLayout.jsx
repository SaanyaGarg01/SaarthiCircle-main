import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, UserCheck, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CaregiverLayout.css';

const NAV = [
  { to: '/caregiver/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/caregiver/sos-alerts', icon: AlertTriangle, label: 'SOS Alerts' },
  { to: '/caregiver/session', icon: UserCheck, label: 'Active Session' },
  { to: '/caregiver/profile', icon: User, label: 'My Profile' },
];

const CaregiverLayout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const name = userProfile?.fullName || userProfile?.full_name || userProfile?.name || 'Volunteer';

  return (
    <div className="app-shell cg-shell">
      <aside className="sidebar cg-sidebar">
        <div className="sidebar-logo">
          <Heart size={28} color="white" fill="rgba(255,255,255,0.4)" />
          <span>SaathiCircle</span>
        </div>
        <div className="sidebar-user">
          <div className="avatar" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
            {name[0]?.toUpperCase() || 'V'}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 'var(--font-sm)' }}>{name}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Volunteer</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={22} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="nav-item logout-btn" onClick={async () => { await logout(); navigate('/login', { replace: true }); }}>
          <LogOut size={22} /><span>Sign Out</span>
        </button>
      </aside>
      <div className="main-content">
        <div className="topbar"><span style={{ fontWeight: 700, fontSize: 'var(--font-md)', color: 'var(--color-black)' }}>Caregiver Portal</span></div>
        <div className="page-body"><Outlet /></div>
      </div>
      <nav className="bottom-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={22} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
export default CaregiverLayout;
