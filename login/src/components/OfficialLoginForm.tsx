// ============================================================================
// src/components/OfficialLoginForm.tsx
// Dedicated Government Official Authentication Form (@gov.in / @nic.in with MFA)
// ============================================================================

import React, { useState } from 'react';
import { IndianDepartments } from '../types/auth.types';
import CaptchaChallenge from './CaptchaChallenge';

interface OfficialLoginFormProps {
  onSuccess?: (userData: any) => void;
}

export const OfficialLoginForm: React.FC<OfficialLoginFormProps> = ({ onSuccess }) => {
  const [employeeId, setEmployeeId] = useState<string>('');
  const [departmentalEmail, setDepartmentalEmail] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mfaCode, setMfaCode] = useState<string>('');
  const [captchaAnswer, setCaptchaAnswer] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!employeeId || employeeId.length < 5) {
      newErrors.employeeId = 'Employee ID must be at least 5 characters';
    }

    if (!departmentalEmail || !/@gov\.in$|@nic\.in$/i.test(departmentalEmail)) {
      newErrors.departmentalEmail = 'Must be an official government email ending with @gov.in or @nic.in';
    }

    if (!department) {
      newErrors.department = 'Please select your government department';
    }

    if (!password) {
      newErrors.password = 'Official account password is required';
    }

    if (!mfaCode || !/^\d{6}$/.test(mfaCode)) {
      newErrors.mfaCode = 'Multi-Factor Passcode (MFA) must be 6 digits';
    }

    if (!captchaAnswer) {
      newErrors.captchaAnswer = 'Please complete the CAPTCHA challenge';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const user = {
        id: employeeId,
        role: 'official',
        name: `Officer ${employeeId}`,
        email: departmentalEmail,
        department: department,
        mobileNumber: 'N/A',
        lastLogin: new Date()
      };
      if (onSuccess) onSuccess(user);
    }, 1200);
  };

  return (
    <div className="gov-card">
      <div className="gov-card-header" style={{ background: '#0f172a' }}>
        <h2>
          <span>🏛️ Government Official Clearance Portal</span>
        </h2>
      </div>

      <div className="gov-card-body">
        <form onSubmit={handleSubmit} noValidate>
          {/* Employee ID & Department */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="employeeId" className="form-label">
                Official Employee ID <span className="required-star">*</span>
              </label>
              <input
                id="employeeId"
                type="text"
                className="form-control"
                placeholder="e.g. EMP-78942"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
              {errors.employeeId && <div className="form-error"><span>⚠️ {errors.employeeId}</span></div>}
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department / Ministry <span className="required-star">*</span>
              </label>
              <select
                id="department"
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">-- Select Department --</option>
                {Object.entries(IndianDepartments).map(([key, label]) => (
                  <option key={key} value={label}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.department && <div className="form-error"><span>⚠️ {errors.department}</span></div>}
            </div>
          </div>

          {/* Departmental Email */}
          <div className="form-group">
            <label htmlFor="departmentalEmail" className="form-label">
              Official Government Email (@gov.in / @nic.in) <span className="required-star">*</span>
            </label>
            <input
              id="departmentalEmail"
              type="email"
              className="form-control"
              placeholder="officer.name@nic.in"
              value={departmentalEmail}
              onChange={(e) => setDepartmentalEmail(e.target.value)}
              required
            />
            {errors.departmentalEmail && <div className="form-error"><span>⚠️ {errors.departmentalEmail}</span></div>}
          </div>

          {/* Password & MFA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="officialPassword" className="form-label">
                Password <span className="required-star">*</span>
              </label>
              <input
                id="officialPassword"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <div className="form-error"><span>⚠️ {errors.password}</span></div>}
            </div>

            <div className="form-group">
              <label htmlFor="mfaCode" className="form-label">
                6-Digit Authenticator MFA Code <span className="required-star">*</span>
              </label>
              <input
                id="mfaCode"
                type="text"
                className="form-control"
                placeholder="123456"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                required
              />
              {errors.mfaCode && <div className="form-error"><span>⚠️ {errors.mfaCode}</span></div>}
            </div>
          </div>

          {/* Captcha */}
          <CaptchaChallenge
            value={captchaAnswer}
            onChange={setCaptchaAnswer}
            error={errors.captchaAnswer}
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying Official Credentials...' : 'Official Clearance Sign-In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfficialLoginForm;
