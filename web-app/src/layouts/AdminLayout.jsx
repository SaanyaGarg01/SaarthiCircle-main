import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Building2, AlertCircle, BarChart3, Bell, Brain, UserCog, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const NAV = [
  { to: '/admin/home', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/volunteers', icon: UserCheck, label: 'Volunteer Approval' },
  { to: '/admin/ngos', icon: Building2, label: 'NGO Approval' },
  { to: '/admin/incidents', icon: AlertCircle, label: 'Incidents' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/ai-risk', icon: Brain, label: 'AI Risk Dashboard' },
  { to: '/admin/profile', icon: UserCog, label: 'Admin Profile' },
];

const AdminLayout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const name = userProfile?.displayName || userProfile?.full_name || 'Admin';

  return (
    <div className="app-shell admin-shell">
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-logo">
          <Shield size={28} color="white" />
          <span>SaathiCircle</span>
        </div>
        <div className="sidebar-user">
          <div className="avatar" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 'var(--font-sm)' }}>{name}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Administrator</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="nav-item logout-btn" onClick={async () => { await logout(); navigate('/login', { replace: true }); }}>
          <LogOut size={20} /><span>Sign Out</span>
        </button>
      </aside>
      <div className="main-content">
        <div className="topbar admin-topbar">
          <span style={{ fontWeight: 700, fontSize: 'var(--font-md)', color: 'white' }}>Admin Control Panel</span>
        </div>
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
export default AdminLayout;
