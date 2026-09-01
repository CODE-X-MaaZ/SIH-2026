// ============================================================================
// src/types/auth.types.ts
// Centralized type definitions for Indian Government Grievance Authentication Module
// Compliant with CERT-In & GIGW 3.0 standards
// ============================================================================

export enum UserRole {
  CITIZEN = 'citizen',
  OFFICIAL = 'official'
}

export enum AuthenticationMethod {
  PASSWORD = 'password',
  OTP = 'otp'
}

export interface CitizenRegisterFormData {
  fullName: string;
  mobileNumber: string;
  email?: string;
  aadhaarNumber: string;
  aadhaarConsent: boolean;
  residentialAddress: string;
  district: string;
  wardNumber?: string;
  pinCode: string;
  password: string;
  confirmPassword: string;
  captchaAnswer?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface CitizenLoginFormData {
  identifier: string; // Mobile, Email, or Citizen ID
  authMethod: AuthenticationMethod;
  password?: string;
  otpCode?: string;
  captchaAnswer?: string;
}

export interface OfficialLoginFormData {
  employeeId: string;
  departmentalEmail: string;
  department: string;
  password: string;
  mfaCode?: string;
  captchaAnswer?: string;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  mobileNumber: string;
  department?: string;
  employeeId?: string;
  lastLogin?: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  tokenType: 'Bearer';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: AuthToken;
  mfaRequired?: boolean; // For officials
  otpSent?: boolean; // For citizen OTP login
  errors?: Record<string, string[]>;
}

export enum IndianDepartments {
  PUBLIC_WORKS = 'Public Works Department (PWD)',
  WATER_SUPPLY = 'Water Supply & Sewerage Board',
  MUNICIPAL_CORP = 'Municipal Corporation',
  ELECTRICITY_BOARD = 'State Electricity Board',
  POLICE = 'Law Enforcement & Police',
  HEALTH_DEPT = 'Health & Family Welfare',
  EDUCATION = 'Department of Education',
  TRANSPORT = 'State Transport Authority',
  REVENUE = 'Revenue & Land Records'
}
