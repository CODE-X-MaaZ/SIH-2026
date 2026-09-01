// ============================================================================
// src/components/CaptchaChallenge.tsx
// Visual & Audio Accessible Captcha Challenge Component
// ============================================================================

import React, { useState, useEffect } from 'react';

interface CaptchaChallengeProps {
  onVerify?: (isValid: boolean, code: string) => void;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const CaptchaChallenge: React.FC<CaptchaChallengeProps> = ({
  onChange,
  value,
  error
}) => {
  const [captchaCode, setCaptchaCode] = useState<string>('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleAudioPlay = () => {
    if ('speechSynthesis' in window) {
      const textToRead = captchaCode.split('').join(' ');
      const utterance = new SpeechSynthesisUtterance(`Security Code is: ${textToRead}`);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Audio Captcha Code: ${captchaCode.split('').join(' ')}`);
    }
  };

  return (
    <div className="form-group captcha-container">
      <label htmlFor="captchaAnswer" className="form-label">
        Security Challenge (CAPTCHA) <span className="required-star">*</span>
      </label>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div
          tabIndex={0}
          aria-label={`Visual Captcha: ${captchaCode}`}
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: '#f59e0b',
            fontFamily: 'monospace',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            letterSpacing: '6px',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            userSelect: 'none',
            border: '2px dashed #94a3b8',
            textDecoration: 'line-through'
          }}
        >
          {captchaCode}
        </div>

        <button
          type="button"
          className="access-btn"
          onClick={generateCaptcha}
          aria-label="Refresh Captcha Challenge"
          title="Refresh Captcha"
          style={{ padding: '0.5rem' }}
        >
          🔄 Refresh
        </button>

        <button
          type="button"
          className="access-btn"
          onClick={handleAudioPlay}
          aria-label="Listen to Audio Captcha Code"
          title="Audio Captcha"
          style={{ padding: '0.5rem' }}
        >
          🔊 Audio
        </button>
      </div>

      <input
        id="captchaAnswer"
        name="captchaAnswer"
        type="text"
        className="form-control"
        placeholder="Enter characters shown above"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={error ? 'captcha-error' : undefined}
        maxLength={6}
        required
      />

      {error && (
        <div id="captcha-error" className="form-error" role="alert">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
};

export default CaptchaChallenge;
