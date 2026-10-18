import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', desc: 'I feel great today!', color: '#4CAF50' },
  { id: 'excited', emoji: '🤩', label: 'Excited', desc: 'Something to look forward to', color: '#FF8C42' },
  { id: 'calm', emoji: '😌', label: 'Calm', desc: 'Peaceful and relaxed', color: '#5B9BD5' },
  { id: 'okay', emoji: '😐', label: 'Okay', desc: 'Neither good nor bad', color: '#FFC107' },
  { id: 'tired', emoji: '😴', label: 'Tired', desc: 'Need some rest', color: '#9E9E9E' },
  { id: 'sad', emoji: '😢', label: 'Sad', desc: 'Feeling a bit down', color: '#7B68EE' },
  { id: 'worried', emoji: '😟', label: 'Worried', desc: 'Something on my mind', color: '#FF7043' },
  { id: 'lonely', emoji: '🥺', label: 'Lonely', desc: 'Could use some company', color: '#E91E63' },
];

const MoodCheckInPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [listening, setListening] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => navigate('/elderly/home'), 3000);
  };

  const toggleVoice = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new SR();
      r.lang = 'hi-IN';
      r.onresult = e => { setNote(e.results[0][0].transcript); };
      r.onend = () => setListening(false);
      r.start();
      setListening(true);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', gap: 'var(--sp-lg)' }}>
        <div style={{ fontSize: 80 }}>{MOODS.find(m => m.id === selected)?.emoji}</div>
        <h2>Thank you for sharing! 💙</h2>
        <p style={{ color: 'var(--color-dark-gray)' }}>We're here for you, always.</p>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 'var(--sp-xl)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>🌸 How are you feeling today?</h1>
        <p style={{ color: 'var(--color-dark-gray)', marginTop: 8, fontSize: 'var(--font-sm)' }}>
          Choose the mood that best describes how you feel right now.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--sp-xl)' }}>
        {MOODS.map(m => (
          <button
            key={m.id}
            id={`mood-select-${m.id}`}
            onClick={() => setSelected(m.id)}
            style={{
              padding: 'var(--sp-md)', border: `2px solid ${selected === m.id ? m.color : 'var(--color-medium-gray)'}`,
              borderRadius: 'var(--br-lg)', background: selected === m.id ? `${m.color}22` : 'white',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: 36 }}>{m.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: selected === m.id ? m.color : 'var(--color-black)' }}>{m.label}</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 'var(--sp-lg)' }}>
        <label className="input-label" style={{ marginBottom: 'var(--sp-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
          Would you like to tell us more?
          <button onClick={toggleVoice} style={{ background: 'none', border: 'none', cursor: 'pointer', color: listening ? 'var(--color-accent-red)' : 'var(--color-primary-main)' }}>
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </label>
        <textarea
          className="input"
          style={{ minHeight: 80 }}
          placeholder={listening ? 'Listening...' : 'Optional: Say or type how you feel...'}
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      <button
        id="submit-mood-btn"
        className="btn btn-primary w-full"
        onClick={handleSubmit}
        disabled={!selected}
        style={{ minHeight: 64 }}
      >
        Share My Mood
      </button>
    </div>
  );
};
export default MoodCheckInPage;
