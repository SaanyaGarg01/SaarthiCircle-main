import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Star, User, Loader } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK_COMPANIONS = [
  { id: '1', name: 'Priya Sharma', language: 'Hindi, English', interest: 'Music & Bhajans', rating: 4.9, available: true, avatar: '👩' },
  { id: '2', name: 'Ramesh Kumar', language: 'Hindi, Telugu', interest: 'Daily Life & Health', rating: 4.8, available: true, avatar: '👨' },
  { id: '3', name: 'Sunita Patel', language: 'Gujarati, English', interest: 'Spirituality & Yoga', rating: 4.7, available: true, avatar: '🧕' },
  { id: '4', name: 'Arjun Singh', language: 'Punjabi, Hindi', interest: 'Cricket & Sports', rating: 4.6, available: false, avatar: '👴' },
];

const CompanionMatchingPage = () => {
  const navigate = useNavigate();
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const token = await storage.getItem('userToken');
        const res = await fetch(`${BACKEND_URL}/volunteers/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCompanions(data.length ? data : MOCK_COMPANIONS);
        } else {
          setCompanions(MOCK_COMPANIONS);
        }
      } catch {
        setCompanions(MOCK_COMPANIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanions();
  }, []);

  const handleVoiceCall = (companion) => {
    navigate('/elderly/voice-call', { state: { companion } });
  };

  const handleTextChat = (companion) => {
    navigate('/elderly/chat', { state: { companion, mode: 'text' } });
  };

  return (
    <div className="page-enter" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 'var(--sp-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>💬 Talk to a Companion</h1>
        <p style={{ color: 'var(--color-dark-gray)', marginTop: 8, fontSize: 'var(--font-sm)' }}>
          Choose someone to chat or talk with. All companions are verified and trained.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-xxl)' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {companions.map(c => (
            <div
              key={c.id}
              className="card"
              style={{ cursor: 'pointer', border: selected?.id === c.id ? '2px solid var(--color-primary-main)' : '2px solid transparent', opacity: c.available === false ? 0.6 : 1 }}
              onClick={() => c.available !== false && setSelected(c)}
              id={`companion-${c.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-lg)' }}>
                <div style={{ fontSize: 48, lineHeight: 1 }}>{c.avatar || '👤'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{c.name || c.full_name}</h3>
                    {c.available !== false && <span className="badge badge-success">Available</span>}
                    {c.available === false && <span className="badge badge-gray">Busy</span>}
                  </div>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>
                    🗣️ {c.language || 'Hindi, English'}
                  </p>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 2 }}>
                    ❤️ {c.interest || c.skills || 'Friendly conversations'}
                  </p>
                  {c.rating && (
                    <p style={{ color: '#FFB300', fontSize: 'var(--font-xs)', marginTop: 2 }}>
                      ⭐ {c.rating}/5
                    </p>
                  )}
                </div>
              </div>
              {selected?.id === c.id && c.available !== false && (
                <div style={{ display: 'flex', gap: 'var(--sp-md)', marginTop: 'var(--sp-lg)' }}>
                  <button id={`voice-call-${c.id}`} className="btn btn-primary" style={{ flex: 1, minHeight: 56 }} onClick={() => handleVoiceCall(c)}>
                    <Phone size={20} /> Voice Call
                  </button>
                  <button id={`text-chat-${c.id}`} className="btn btn-secondary" style={{ flex: 1, minHeight: 56 }} onClick={() => handleTextChat(c)}>
                    <MessageCircle size={20} /> Text Chat
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
export default CompanionMatchingPage;
