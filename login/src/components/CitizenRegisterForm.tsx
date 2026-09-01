// ============================================================================
// src/components/CitizenRegisterForm.tsx
// Accessible Citizen Registration Form with Aadhaar & Address Validation
// ============================================================================

import React, { useState } from 'react';
import CaptchaChallenge from './CaptchaChallenge';

interface CitizenRegisterFormProps {
  onSuccess?: () => void;
}

export const CitizenRegisterForm: React.FC<CitizenRegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    aadhaarNumber: '',
    aadhaarConsent: false,
    residentialAddress: '',
    district: '',
    pinCode: '',
    password: '',
    confirmPassword: '',
    captchaAnswer: '',
    termsAccepted: false,
    privacyAccepted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit Indian mobile number starting with 6-9';
    }

    if (!/^\d{12}$/.test(formData.aadhaarNumber) || /^(\d)\1+$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Aadhaar must be 12 digits and not all identical numbers';
    }

    if (!formData.aadhaarConsent) {
      newErrors.aadhaarConsent = 'You must give consent for Aadhaar identity validation';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters with upper, lower, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Government Service Terms';
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'You must accept the Privacy Policy';
    }

    if (!formData.captchaAnswer) {
      newErrors.captchaAnswer = 'Please solve the security challenge';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Registration Successful! Your grievance tracking citizen portal ID has been dispatched to your mobile number.');
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <h2>
          <span>📝 Citizen Registration Form</span>
        </h2>
      </div>

      <div className="gov-card-body">
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name & Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name (as per Aadhaar) <span className="required-star">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-control"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {errors.fullName && <div className="form-error"><span>⚠️ {errors.fullName}</span></div>}
            </div>

            <div className="form-group">
              <label htmlFor="mobileNumber" className="form-label">
                Mobile Number <span className="required-star">*</span>
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                className="form-control"
                placeholder="10-digit Mobile"
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength={10}
                required
              />
              {errors.mobileNumber && <div className="form-error"><span>⚠️ {errors.mobileNumber}</span></div>}
            </div>
          </div>

          {/* Aadhaar Number */}
          <div className="form-group">
            <label htmlFor="aadhaarNumber" className="form-label">
              12-Digit Aadhaar Number <span className="required-star">*</span>
            </label>
            <input
              id="aadhaarNumber"
              name="aadhaarNumber"
              type="password"
              className="form-control"
              placeholder="•••• •••• ••••"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              maxLength={12}
              required
            />
            {errors.aadhaarNumber && <div className="form-error"><span>⚠️ {errors.aadhaarNumber}</span></div>}
          </div>

          {/* Aadhaar Consent */}
          <div className="form-group">
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                name="aadhaarConsent"
                checked={formData.aadhaarConsent}
                onChange={handleChange}
                required
              />
              <span>
                I hereby state that I have no objection in providing my Aadhaar number for authentication with UIDAI for grievance tracking services.
              </span>
            </label>
            {errors.aadhaarConsent && <div className="form-error"><span>⚠️ {errors.aadhaarConsent}</span></div>}
          </div>

          {/* Address & District */}
          <div className="form-group">
            <label htmlFor="residentialAddress" className="form-label">
              Residential Address <span className="required-star">*</span>
            </label>
            <input
              id="residentialAddress"
              name="residentialAddress"
              type="text"
              className="form-control"
              value={formData.residentialAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="district" className="form-label">
                District <span className="required-star">*</span>
              </label>
              <select
                id="district"
                name="district"
                className="form-control"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">-- Select District --</option>
                <option value="Central Delhi">Central Delhi</option>
                <option value="Mumbai City">Mumbai City</option>
                <option value="Bengaluru Urban">Bengaluru Urban</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pinCode" className="form-label">
                PIN Code <span className="required-star">*</span>
              </label>
              <input
                id="pinCode"
                name="pinCode"
                type="text"
                className="form-control"
                maxLength={6}
                value={formData.pinCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Passwords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Create Password <span className="required-star">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="form-error"><span>⚠️ {errors.password}</span></div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password <span className="required-star">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <div className="form-error"><span>⚠️ {errors.confirmPassword}</span></div>}
            </div>
          </div>

          {/* Terms & Privacy Checkboxes */}
          <div className="form-group">
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              I accept the Citizen Charter & Terms of Service
            </label>
            {errors.termsAccepted && <div className="form-error"><span>⚠️ {errors.termsAccepted}</span></div>}
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleChange}
              />
              I accept the Digital Personal Data Protection (DPDP) Act Policy
            </label>
            {errors.privacyAccepted && <div className="form-error"><span>⚠️ {errors.privacyAccepted}</span></div>}
          </div>

          {/* Captcha */}
          <CaptchaChallenge
            value={formData.captchaAnswer}
            onChange={(val) => setFormData((prev) => ({ ...prev, captchaAnswer: val }))}
            error={errors.captchaAnswer}
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering Citizen Profile...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CitizenRegisterForm;
