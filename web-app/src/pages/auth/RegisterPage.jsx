import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, User, MapPin, Calendar, Building, Hash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BACKEND_URL } from '../../config/backend';
import './RegisterPage.css';

const ROLES = [
  { id: 'elderly', label: '👴 I am a Senior', desc: 'Looking for companionship and support', color: '#5B9BD5' },
  { id: 'volunteer', label: '🤝 I am a Volunteer/Caregiver', desc: 'Want to help seniors in my community', color: '#8FBC8F' },
  { id: 'ngo', label: '🏛️ I represent an NGO', desc: 'Connecting seniors with resources', color: '#FF8C42' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const params = location.state || {};
  const [email] = useState(params.email || '');
  const [phone] = useState(params.phone || '');
  const [token] = useState(params.token || '');
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', age: '', city: '', address: '', gender: 'male',
    skills: '', whyVolunteer: '', ngoName: '', registrationNumber: '',
    contactPerson: '', areasOfOperation: '', servicesOffered: '',
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleRegister = async () => {
    if (!role) { showToast('Please select your role', 'error'); return; }
    if (!formData.fullName.trim()) { showToast('Please enter your name', 'error'); return; }
    setLoading(true);
    try {
      const payload = {
        email, phone, token,
        role,
        full_name: formData.fullName,
        age: formData.age ? parseInt(formData.age) : undefined,
        city: formData.city,
        address: formData.address,
        gender: formData.gender,
        ...(role === 'volunteer' && { skills: formData.skills, why_volunteer: formData.whyVolunteer }),
        ...(role === 'ngo' && {
          ngo_name: formData.ngoName,
          registration_number: formData.registrationNumber,
          contact_person: formData.contactPerson,
          areas_of_operation: formData.areasOfOperation,
          services_offered: formData.servicesOffered,
        }),
      };
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Registration failed', 'error'); return; }
      const finalRole = data.role || data.user?.role || role;
      await login(data.access_token || token, finalRole, data.user || payload);
      showToast('Registration successful! Welcome 🎉', 'success');
      const routes = { elderly: '/elderly/home', volunteer: '/pending-volunteer', ngo: '/pending-ngo' };
      navigate(routes[role] || '/login', { replace: true });
    } catch {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="login-bg" />
      <div className="register-container page-enter">
        <div className="register-header">
          <Heart size={40} color="var(--color-primary-main)" fill="var(--color-primary-light)" />
          <h1>Join SaathiCircle</h1>
          <p>Create your account and get connected</p>
        </div>

        {/* Role selection */}
        <div className="register-card glass-card">
          <h3 style={{ marginBottom: 'var(--sp-md)' }}>I am a...</h3>
          <div className="role-grid">
            {ROLES.map(r => (
              <button
                key={r.id}
                id={`role-${r.id}-btn`}
                className={`role-card ${role === r.id ? 'selected' : ''}`}
                style={{ '--role-color': r.color }}
                onClick={() => setRole(r.id)}
              >
                <div className="role-label">{r.label}</div>
                <div className="role-desc">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        {role && (
          <div className="register-card glass-card">
            <h3 style={{ marginBottom: 'var(--sp-lg)' }}>
              {role === 'ngo' ? 'NGO Details' : 'Personal Information'}
            </h3>

            {role === 'ngo' ? (
              <>
                <div className="input-group">
                  <label className="input-label">NGO Name *</label>
                  <input className="input" value={formData.ngoName} onChange={e => update('ngoName', e.target.value)} placeholder="Organisation name" />
                </div>
                <div className="input-group">
                  <label className="input-label">Registration Number *</label>
                  <input className="input" value={formData.registrationNumber} onChange={e => update('registrationNumber', e.target.value)} placeholder="Registration / CIN number" />
                </div>
                <div className="input-group">
                  <label className="input-label">Contact Person *</label>
                  <input className="input" value={formData.contactPerson} onChange={e => update('contactPerson', e.target.value)} placeholder="Primary contact name" />
                </div>
                <div className="input-group">
                  <label className="input-label">Areas of Operation *</label>
                  <input className="input" value={formData.areasOfOperation} onChange={e => update('areasOfOperation', e.target.value)} placeholder="Cities / regions covered" />
                </div>
                <div className="input-group">
                  <label className="input-label">Services Offered</label>
                  <textarea className="input" style={{ minHeight: 80 }} value={formData.servicesOffered} onChange={e => update('servicesOffered', e.target.value)} placeholder="What services does your NGO provide?" />
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input className="input" value={formData.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Your full name" />
                </div>
                <div className="form-row">
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Age</label>
                    <input className="input" type="number" min={1} max={120} value={formData.age} onChange={e => update('age', e.target.value)} placeholder="Age" />
                  </div>
                  <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">City</label>
                    <input className="input" value={formData.city} onChange={e => update('city', e.target.value)} placeholder="Your city" />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Gender</label>
                  <select className="input" value={formData.gender} onChange={e => update('gender', e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </div>
                {role === 'volunteer' && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Skills / Expertise</label>
                      <input className="input" value={formData.skills} onChange={e => update('skills', e.target.value)} placeholder="e.g. Medical, Cooking, Tech, Hindi" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Why do you want to volunteer?</label>
                      <textarea className="input" style={{ minHeight: 80 }} value={formData.whyVolunteer} onChange={e => update('whyVolunteer', e.target.value)} placeholder="Tell us your motivation..." />
                    </div>
                  </>
                )}
              </>
            )}

            <button
              id="register-btn"
              className="btn btn-primary w-full"
              onClick={handleRegister}
              disabled={loading}
              style={{ marginTop: 'var(--sp-md)' }}
            >
              {loading ? <span className="spinner spinner-sm spinner-white" /> : 'Create Account'}
            </button>
          </div>
        )}

        <button className="link-btn" style={{ textAlign: 'center', display: 'block', margin: '0 auto' }} onClick={() => navigate('/login')}>
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
