// ============================================================================
// src/components/GovernmentHeader.tsx
// National Portal Emblem & Header Component
// ============================================================================

import React from 'react';

export const GovernmentHeader: React.FC = () => {
  return (
    <header role="banner">
      <div className="tricolor-stripe" />
      <div className="gov-header">
        <div className="gov-branding">
          <svg className="gov-emblem" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="50" cy="50" r="45" stroke="#f59e0b" strokeWidth="4" fill="#0f172a" />
            <path d="M50 20 L58 38 L78 38 L62 50 L68 70 L50 56 L32 70 L38 50 L22 38 L42 38 Z" fill="#f59e0b" />
          </svg>
          <div className="gov-title-group">
            <h1>NATIONAL GRIEVANCE CLASSIFICATION & PORTAL</h1>
            <p>Department of Administrative Reforms and Public Grievances (DARPG)</p>
          </div>
        </div>

        <div className="cert-in-badge">
          <span aria-hidden="true">🛡️</span>
          <span>CERT-In Secured & GIGW 3.0 Certified</span>
        </div>
      </div>
    </header>
  );
};

export default GovernmentHeader;
