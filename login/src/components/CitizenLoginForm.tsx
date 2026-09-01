// ============================================================================
// src/components/CitizenLoginForm.tsx
// Accessible Citizen Authentication Form (Password & OTP Modes)
// ============================================================================

import React, { useState } from 'react';
import { AuthenticationMethod } from '../types/auth.types';
import CaptchaChallenge from './CaptchaChallenge';

interface CitizenLoginFormProps {
  onSuccess?: (userData: any) => void;
}

export const CitizenLoginForm: React.FC<CitizenLoginFormProps> = ({ onSuccess }) => {
  const [authMethod, setAuthMethod] = useState<AuthenticationMethod>(AuthenticationMethod.PASSWORD);
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [captchaAnswer, setCaptchaAnswer] = useState<string>('');

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSendOTP = () => {
    if (!identifier) {
      setFieldErrors({ identifier: 'Please enter your registered Mobile Number or Email' });
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
      alert(`OTP sent successfully to registered mobile ending with ****${identifier.slice(-4)}`);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!identifier) {
      errors.identifier = 'Mobile number, Email, or Citizen ID is required';
    }

    if (authMethod === AuthenticationMethod.PASSWORD && !password) {
      errors.password = 'Password is required';
    }

    if (authMethod === AuthenticationMethod.OTP && (!otpSent || !otpCode)) {
      errors.otpCode = 'Please request and enter the 6-digit OTP';
    }

    if (!captchaAnswer) {
      errors.captchaAnswer = 'Please enter the Security CAPTCHA code';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      const user = {
        id: 'CIT-' + Math.floor(100000 + Math.random() * 900000),
        role: 'citizen',
        name: 'Citizens Portal User',
        email: identifier.includes('@') ? identifier : 'citizen@example.gov.in',
        mobileNumber: identifier,
        lastLogin: new Date()
      };
      if (onSuccess) onSuccess(user);
    }, 1200);
  };

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <h2>
          <span>👤 Citizen Access Portal</span>
        </h2>
      </div>

      <div className="gov-card-body">
        {errorMessage && (
          <div className="form-error" role="alert" style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* Auth Method Selector */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="radio"
              name="authMethod"
              value={AuthenticationMethod.PASSWORD}
              checked={authMethod === AuthenticationMethod.PASSWORD}
              onChange={() => setAuthMethod(AuthenticationMethod.PASSWORD)}
            />
            Login via Password
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="radio"
              name="authMethod"
              value={AuthenticationMethod.OTP}
              checked={authMethod === AuthenticationMethod.OTP}
              onChange={() => setAuthMethod(AuthenticationMethod.OTP)}
            />
            Login via OTP
          </label>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Identifier Input */}
          <div className="form-group">
            <label htmlFor="citizen-identifier" className="form-label">
              Mobile Number / Email ID / Citizen ID <span className="required-star">*</span>
            </label>
            <input
              id="citizen-identifier"
              type="text"
              className="form-control"
              placeholder="e.g. 9876543210 or citizen@nic.in"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              aria-describedby={fieldErrors.identifier ? 'identifier-error' : 'identifier-help'}
              required
            />
            <div id="identifier-help" className="help-text">
              Enter your registered 10-digit mobile number or government citizen email.
            </div>
            {fieldErrors.identifier && (
              <div id="identifier-error" className="form-error" role="alert">
                <span>⚠️ {fieldErrors.identifier}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          {authMethod === AuthenticationMethod.PASSWORD && (
            <div className="form-group">
              <label htmlFor="citizen-password" className="form-label">
                Account Password <span className="required-star">*</span>
              </label>
              <input
                id="citizen-password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                required
              />
              {fieldErrors.password && (
                <div id="password-error" className="form-error" role="alert">
                  <span>⚠️ {fieldErrors.password}</span>
                </div>
              )}
            </div>
          )}

          {/* OTP Field */}
          {authMethod === AuthenticationMethod.OTP && (
            <div className="form-group">
              <label htmlFor="citizen-otp" className="form-label">
                One-Time Password (OTP) <span className="required-star">*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  id="citizen-otp"
                  type="text"
                  className="form-control"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  disabled={!otpSent}
                  required
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSendOTP}
                  disabled={isSubmitting}
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              </div>
              {fieldErrors.otpCode && (
                <div className="form-error" role="alert">
                  <span>⚠️ {fieldErrors.otpCode}</span>
                </div>
              )}
            </div>
          )}

          {/* Captcha Challenge */}
          <CaptchaChallenge
            value={captchaAnswer}
            onChange={setCaptchaAnswer}
            error={fieldErrors.captchaAnswer}
          />

          <button
            type="submit"
            className="btn btn-saffron"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CitizenLoginForm;
