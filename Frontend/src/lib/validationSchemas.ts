// ============================================================================
// src/lib/validationSchemas.ts
// Comprehensive validation logic using Zod for government compliance
// ============================================================================

import { z } from 'zod';

// Password strength validation: min 8 chars, uppercase, lowercase, number, symbol
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character');

// Aadhaar validation: 12-digit number (masked in UI)
const aadhaarSchema = z
  .string()
  .regex(/^\d{12}$/, 'Invalid Aadhaar number. Must be exactly 12 digits.')
  .refine((val) => !isAllSameDigits(val), 'Aadhaar cannot be all identical digits');

// Indian mobile number: 10 digits starting with 6-9
const indianMobileSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number format (Must be 10 digits starting with 6-9)');

// PIN code validation: 6 digits
const pinCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'PIN code must be 6 digits');

// Helper function to check all digits are same
function isAllSameDigits(value: string): boolean {
  return /^(\d)\1+$/.test(value);
}

// ==================== CITIZEN REGISTRATION ====================
export const citizenRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Full name must be at least 3 characters')
      .max(100, 'Full name must not exceed 100 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
    mobileNumber: indianMobileSchema,
    email: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    aadhaarNumber: aadhaarSchema,
    aadhaarConsent: z.boolean().refine((val) => val === true, {
      message: 'You must consent to Aadhaar verification'
    }),
    residentialAddress: z
      .string()
      .min(10, 'Address must be at least 10 characters')
      .max(200, 'Address must not exceed 200 characters'),
    district: z
      .string()
      .min(2, 'Please select a valid district')
      .max(50, 'District name is too long'),
    wardNumber: z
      .string()
      .optional()
      .or(z.literal('')),
    pinCode: pinCodeSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    captchaAnswer: z
      .string()
      .min(1, 'Please solve the verification challenge'),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms of Service'
    }),
    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Privacy Policy'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

// ==================== CITIZEN LOGIN ====================
export const citizenLoginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Mobile number, email, or Citizen ID is required')
    .refine(
      (val) => {
        const isMobile = /^[6-9]\d{9}$/.test(val);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isCitizenId = /^[A-Z0-9]{6,}$/i.test(val);
        return isMobile || isEmail || isCitizenId;
      },
      'Please enter a valid mobile number, email, or Citizen ID'
    ),
  authMethod: z.enum(['password', 'otp']),
  password: z.string().optional(),
  otpCode: z.string().optional(),
  captchaAnswer: z.string().min(1, 'Please solve the verification challenge')
});

// ==================== OFFICIAL LOGIN ====================
export const officialLoginSchema = z.object({
  employeeId: z
    .string()
    .min(5, 'Employee ID must be at least 5 characters')
    .max(20, 'Employee ID must not exceed 20 characters'),
  departmentalEmail: z
    .string()
    .email('Invalid departmental email')
    .regex(/@gov\.in$|@nic\.in$/, 'Must be an official government email (.gov.in or .nic.in)'),
  department: z
    .string()
    .min(1, 'Please select a department'),
  password: passwordSchema,
  mfaCode: z
    .string()
    .regex(/^\d{6}$/, 'MFA code must be 6 digits')
    .optional(),
  captchaAnswer: z
    .string()
    .min(1, 'Please solve the verification challenge')
});

// Type inference for form data
export type CitizenRegisterFormSchema = z.infer<typeof citizenRegisterSchema>;
export type CitizenLoginFormSchema = z.infer<typeof citizenLoginSchema>;
export type OfficialLoginFormSchema = z.infer<typeof officialLoginSchema>;
