import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Globe, Phone, Mail, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BACKEND_URL } from '../../config/backend';
import i18n from '../../i18n/index.js';
import './LoginPage.css';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [loading, setLoading] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const [devOtp, setDevOtp] = useState('');

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const formatPhone = (v) => v.replace(/\D/g, '').slice(0, 10);

  const handleSendOtp = async () => {
    if (!validateEmail(email)) { showToast(t('login.enterValidEmail'), 'error'); return; }
    if (phone.length !== 10) { showToast(t('login.enterValidPhone'), 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), phone: `+91${phone}` }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || data.message || 'Failed to send OTP', 'error'); return; }
      setStep('otp');
      if (data.devCode) {
        setDevOtp(data.devCode);
        setOtp(data.devCode);
        showToast(`OTP Sent! (Dev OTP: ${data.devCode})`, 'success');
      } else {
        showToast(t('login.otpSentTo', { email }), 'success');
      }
    } catch {
      showToast('Failed to send OTP. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { showToast('Please enter the 6-digit OTP', 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), phone: `+91${phone}`, token: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || data.message || 'Invalid OTP', 'error');
        return;
      }

      if (data.access_token) {
        const role = data.user?.role;
        const isNewUser = data.isNew === true || !role || role === 'user';
        await login(data.access_token, role || 'user', data.user || {});
        if (isNewUser) {
          // New user — go to registration to pick role and fill profile
          navigate('/register', { state: { email: email.trim(), phone: `+91${phone}`, token: data.access_token } });
        } else {
          redirectByRole(role, navigate);
        }
      } else {
        showToast('Authentication failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Failed to verify OTP. Is the backend running on port 4002?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    const demoProfile = {
      id: `demo_${role}_${Date.now()}`,
      email: `demo_${role}@saathicircle.com`,
      phone: '+919999999999',
      displayName: role === 'admin' ? 'Admin Demo' : role === 'volunteer' ? 'Volunteer Demo' : 'Senior Demo',
      role,
    };
    await login(`demo_${role}_${Date.now()}`, role, demoProfile);
    redirectByRole(role, navigate);
    setLoading(false);
  };

  const redirectByRole = (role, nav) => {
    const routes = {
      elderly: '/elderly/home',
      volunteer: '/caregiver/dashboard',
      admin: '/admin/home',
      superadmin: '/admin/home',
      ngo: '/ngo/dashboard',
      volunteer_pending: '/pending-volunteer',
      ngo_pending: '/pending-ngo',
    };
    nav(routes[role] || '/register', { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      {/* Language button */}
      <button className="lang-btn" onClick={() => setShowLangModal(true)} id="lang-selector-btn">
        <Globe size={18} />
        <span>{LANGUAGES.find(l => l.code === i18n.language)?.native || 'English'}</span>
      </button>

      <div className="login-container page-enter">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-circle">
            <Heart size={52} color="var(--color-primary-main)" fill="var(--color-primary-light)" />
          </div>
          <h1 className="logo-name">{t('login.appName')}</h1>
          <p className="logo-tagline">{t('login.tagline')}</p>
        </div>

        {/* Form card */}
        <div className="login-card glass-card">
          {step === 'credentials' ? (
            <>
              <h2 className="card-title">{t('login.title')}</h2>

              <div className="input-group">
                <label className="input-label" htmlFor="email-input">
                  <Mail size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {t('login.emailLabel')}
                </label>
                <input
                  id="email-input"
                  className="input"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="phone-input">
                  <Phone size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {t('login.phoneLabel')}
                </label>
                <div className="phone-row">
                  <div className="country-code">+91</div>
                  <input
                    id="phone-input"
                    className="input"
                    type="tel"
                    placeholder={t('login.phonePlaceholder')}
                    value={phone}
                    maxLength={10}
                    onChange={e => setPhone(formatPhone(e.target.value))}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                id="send-otp-btn"
                className="btn btn-primary w-full"
                onClick={handleSendOtp}
                disabled={loading || !validateEmail(email) || phone.length !== 10}
              >
                {loading ? <span className="spinner spinner-sm spinner-white" /> : t('login.sendOtp')}
              </button>
            </>
          ) : (
            <>
              <h2 className="card-title">{t('login.enterOtp')}</h2>
              <p className="otp-hint">{t('login.otpSentTo', { email })}</p>

              {devOtp && (
                <div style={{ background: '#FFF8E1', border: '1px solid #FFC107', borderRadius: 'var(--br-md)', padding: 'var(--sp-sm) var(--sp-md)', marginBottom: 'var(--sp-md)', textAlign: 'center', fontSize: 'var(--font-xs)', color: '#B78103' }}>
                  🔑 <strong>Dev Mode OTP Code:</strong> <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, letterSpacing: 2 }}>{devOtp}</span>
                </div>
              )}

              <input
                id="otp-input"
                className="input otp-input"
                type="tel"
                placeholder={t('login.otpPlaceholder')}
                value={otp}
                maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />

              <button
                id="verify-otp-btn"
                className="btn btn-primary w-full"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? <span className="spinner spinner-sm spinner-white" /> : t('login.verify')}
              </button>

              <div className="otp-actions">
                <button className="link-btn" onClick={() => { setOtp(''); handleSendOtp(); }} id="resend-otp-btn">
                  {t('login.resendOtp')}
                </button>
                <button className="link-btn" onClick={() => { setStep('credentials'); setOtp(''); }} id="change-details-btn">
                  {t('login.changeContact')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Demo logins */}
        <div className="demo-section">
          <p className="demo-label">— {t('login.demoMode')} —</p>
          <div className="demo-grid">
            {[
              { role: 'elderly', label: '👴 Senior', color: '#5B9BD5' },
              { role: 'volunteer', label: '🤝 Caregiver', color: '#8FBC8F' },
              { role: 'admin', label: '🛡️ Admin', color: '#7B68EE' },
              { role: 'ngo', label: '🏛️ NGO', color: '#FF8C42' },
            ].map(({ role, label, color }) => (
              <button
                key={role}
                id={`demo-${role}-btn`}
                className="demo-btn"
                style={{ background: color }}
                onClick={() => handleDemoLogin(role)}
                disabled={loading}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="terms-text">{t('login.terms')}</p>
      </div>

      {/* Language Modal */}
      {showLangModal && (
        <div className="overlay" onClick={() => setShowLangModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 'var(--sp-lg)', textAlign: 'center' }}>Select Language / भाषा चुनें</h3>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                id={`lang-${lang.code}-btn`}
                className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                onClick={() => { i18n.changeLanguage(lang.code); setShowLangModal(false); }}
              >
                <span>{lang.native} ({lang.label})</span>
                {i18n.language === lang.code && <span style={{ color: 'var(--color-primary-main)' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
