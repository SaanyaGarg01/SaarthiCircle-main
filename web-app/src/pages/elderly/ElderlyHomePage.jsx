import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, HelpCircle, AlertTriangle, Phone, Mic } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ElderlyHome.css';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#4CAF50' },
  { id: 'okay',  emoji: '😐', label: 'Okay',  color: '#FFC107' },
  { id: 'sad',   emoji: '😞', label: 'Sad',   color: '#5B9BD5' },
];

const ElderlyHomePage = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const [greeting, setGreeting] = useState('Good Morning');

  const name = userProfile?.fullName || userProfile?.full_name || userProfile?.name || 'Friend';
  const city = userProfile?.city;

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good Morning');
    else if (h < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="elderly-home page-enter">
      {/* Header banner */}
      <div className="home-hero glass-card">
        <div>
          <p className="greeting-time">{greeting} 🌸</p>
          <h1 className="greeting-name">
            {name !== 'Friend' ? `Hello, ${name.split(' ')[0]}!` : t('home.greeting')}
          </h1>
          <p className="safe-msg">{t('home.safeMessage')}</p>
          {city && <p className="location-txt">📍 {city}</p>}
        </div>
        <div className="hero-avatar">
          <div style={{ fontSize: 48 }}>👴</div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="main-actions">
        <button id="talk-companion-btn" className="action-btn companion-btn" onClick={() => navigate('/elderly/companion')}>
          <Heart size={36} fill="white" />
          <span className="action-label">{t('home.talkToCompanion')}</span>
          <span className="action-sub">Connect with a friendly companion</span>
        </button>

        <button id="need-help-btn" className="action-btn help-btn" onClick={() => navigate('/elderly/help')}>
          <HelpCircle size={36} />
          <span className="action-label">{t('home.needHelp')}</span>
          <span className="action-sub">Get assistance with daily tasks</span>
        </button>

        <button id="sos-btn" className="action-btn sos-btn pulse" onClick={() => navigate('/elderly/sos')}>
          <AlertTriangle size={36} />
          <span className="action-label">{t('home.emergency')}</span>
          <span className="action-sub">Emergency help immediately</span>
        </button>
      </div>

      {/* Mood Check-in */}
      <div className="mood-section card">
        <h3 className="section-title">{t('home.moodQuestion')}</h3>
        <div className="mood-row">
          {MOODS.map(m => (
            <button
              key={m.id}
              id={`mood-${m.id}-btn`}
              className={`mood-btn ${mood === m.id ? 'selected' : ''}`}
              onClick={() => setMood(m.id)}
              style={mood === m.id ? { borderColor: m.color, background: `${m.color}22` } : {}}
            >
              <span style={{ fontSize: 40 }}>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
        {mood && (
          <div className="mood-response">
            <p>
              {mood === 'happy' && '😊 Wonderful! Your positivity brightens everyone around you!'}
              {mood === 'okay' && '😐 That\'s okay. Would you like to talk to a companion?'}
              {mood === 'sad' && '💙 We\'re here for you. Tap "Talk to a Companion" anytime.'}
            </p>
          </div>
        )}
        <button className="voice-mood-btn" onClick={() => navigate('/elderly/mood')} id="voice-mood-btn">
          <Mic size={20} color="var(--color-primary-main)" />
          <span>🎤 "How are you feeling today?"</span>
        </button>
      </div>

      {/* Quick help card */}
      <button className="quick-help-card card" onClick={() => navigate('/elderly/help')} id="quick-help-btn">
        <Phone size={36} color="var(--color-secondary-green)" />
        <div className="quick-help-text">
          <h4>{t('home.quickHelpTitle')}</h4>
          <p>{t('home.quickHelpSubtitle')}</p>
        </div>
        <span style={{ fontSize: 24 }}>›</span>
      </button>
    </div>
  );
};

export default ElderlyHomePage;
