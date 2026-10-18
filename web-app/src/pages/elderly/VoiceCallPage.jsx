import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react';
import './VoiceCallPage.css';

const VoiceCallPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const companion = state?.companion;
  const [callStatus, setCallStatus] = useState('connecting'); // connecting | active | ended
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Simulate connection
    setTimeout(() => setCallStatus('active'), 2000);
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const endCall = () => {
    clearInterval(timerRef.current);
    setCallStatus('ended');
    setTimeout(() => navigate('/elderly/home'), 2000);
  };

  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const name = companion?.name || companion?.full_name || 'Companion';

  return (
    <div className="voice-call-page page-enter">
      <div className="call-bg" />
      <div className="call-content">
        <div className={`call-avatar-wrap ${callStatus === 'active' ? 'pulse' : ''}`}>
          <div className="call-avatar">{name[0]?.toUpperCase()}</div>
        </div>
        <h2 className="call-name">{name}</h2>
        <p className="call-status">
          {callStatus === 'connecting' && '📞 Connecting...'}
          {callStatus === 'active' && `🟢 Connected • ${formatDuration(duration)}`}
          {callStatus === 'ended' && '📵 Call Ended'}
        </p>

        {callStatus === 'active' && (
          <div className="call-controls">
            <button
              id="mute-btn"
              className={`call-ctrl ${muted ? 'active' : ''}`}
              onClick={() => setMuted(!muted)}
            >
              {muted ? <MicOff size={28} /> : <Mic size={28} />}
              <span>{muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button id="end-call-btn" className="call-ctrl end-call" onClick={endCall}>
              <PhoneOff size={28} />
              <span>End Call</span>
            </button>
            <button id="speaker-btn" className="call-ctrl">
              <Volume2 size={28} />
              <span>Speaker</span>
            </button>
          </div>
        )}

        {callStatus === 'connecting' && (
          <button className="btn btn-danger" style={{ marginTop: 'var(--sp-xl)' }} onClick={() => navigate('/elderly/home')} id="cancel-call-btn">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
export default VoiceCallPage;
