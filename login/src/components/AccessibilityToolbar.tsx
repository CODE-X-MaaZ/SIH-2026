// ============================================================================
// src/components/AccessibilityToolbar.tsx
// WCAG 2.1 AA & GIGW 3.0 Compliant Accessibility Control Panel
// Provides Text Resizing (A-, A, A+), High Contrast Toggle, Screen Reader Live Updates
// ============================================================================

import React, { useState, useEffect } from 'react';

export const AccessibilityToolbar: React.FC = () => {
  const [fontScale, setFontScale] = useState<number>(1);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  const handleDecreaseFont = () => {
    if (fontScale > 0.85) {
      const next = parseFloat((fontScale - 0.1).toFixed(2));
      setFontScale(next);
      announce(`Text size decreased to ${Math.round(next * 100)}%`);
    }
  };

  const handleResetFont = () => {
    setFontScale(1);
    announce('Text size reset to default 100%');
  };

  const handleIncreaseFont = () => {
    if (fontScale < 1.3) {
      const next = parseFloat((fontScale + 0.1).toFixed(2));
      setFontScale(next);
      announce(`Text size increased to ${Math.round(next * 100)}%`);
    }
  };

  const toggleHighContrast = () => {
    const nextState = !isHighContrast;
    setIsHighContrast(nextState);
    announce(nextState ? 'High contrast mode enabled' : 'High contrast mode disabled');
  };

  const announce = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  return (
    <nav className="access-toolbar" aria-label="Accessibility & Language Settings">
      <div className="gov-info">
        <span>🇮🇳 Government of India | National Grievance Redressal Portal</span>
      </div>

      <div className="access-btn-group">
        <span id="text-resize-label" className="sr-only">Adjust Text Size:</span>
        <button
          className="access-btn"
          onClick={handleDecreaseFont}
          aria-label="Decrease text size (A-)"
          title="Decrease text size"
        >
          A-
        </button>
        <button
          className="access-btn"
          onClick={handleResetFont}
          aria-label="Reset text size to default (A)"
          title="Standard text size"
        >
          A
        </button>
        <button
          className="access-btn"
          onClick={handleIncreaseFont}
          aria-label="Increase text size (A+)"
          title="Increase text size"
        >
          A+
        </button>

        <button
          className={`access-btn ${isHighContrast ? 'active' : ''}`}
          onClick={toggleHighContrast}
          aria-pressed={isHighContrast}
          aria-label="Toggle High Contrast Mode"
          title="High Contrast View"
        >
          {isHighContrast ? '⚡ Normal View' : '⚡ High Contrast'}
        </button>

        <button className="access-btn" aria-label="Switch Language to Hindi">
          हिंदी
        </button>
      </div>

      {/* Screen Reader Live Announcement Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </nav>
  );
};

export default AccessibilityToolbar;
