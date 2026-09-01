// ============================================================================
// src/services/api.service.ts
// Axios instance with security headers and token management
// Implements CERT-In security guidelines & GIGW 3.0 standards
// ============================================================================

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';
import { AuthToken, AuthResponse } from '../types/auth.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.grievance-portal.gov.in';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

// Request tracking for rate limiting (client-side indicator)
const requestLog: { timestamp: number; endpoint: string }[] = [];

class ApiService {
  private client: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      withCredentials: true, // Include cookies in requests
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-API-Version': 'v1'
      }
    });

    // Request interceptor: Add auth token and security headers
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = sessionStorage.getItem('authToken');

        if (token) {
          try {
            const { accessToken } = JSON.parse(token);
            config.headers.Authorization = `Bearer ${accessToken}`;
          } catch (error) {
            console.error('Invalid token format:', error);
          }
        }

        // Security headers per GIGW 3.0 (Government of India)
        config.headers['X-Content-Type-Options'] = 'nosniff';
        config.headers['X-Frame-Options'] = 'DENY';
        config.headers['X-XSS-Protection'] = '1; mode=block';
        config.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
        config.headers['Content-Security-Policy'] = "default-src 'self'";

        // Add CSRF token if available
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }

        // Rate limiting indicator (client-side tracking)
        this.logRequest(config.url || '');

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle errors, rate limits, and token refresh
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!originalRequest) {
          return Promise.reject(error);
        }

        // Handle 401 Unauthorized (Expired JWT Access Token)
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const storedToken = sessionStorage.getItem('authToken');
            if (!storedToken) throw new Error('No refresh token available');

            const { refreshToken } = JSON.parse(storedToken);
            const refreshResponse = await axios.post<AuthToken>(
              `${API_BASE_URL}/api/auth/refresh`,
              {},
              { headers: { 'X-Refresh-Token': refreshToken } }
            );

            const newToken = refreshResponse.data;
            sessionStorage.setItem('authToken', JSON.stringify(newToken));

            this.processQueue(null, newToken.accessToken);
            originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
            return this.client(originalRequest);
          } catch (refreshErr) {
            this.processQueue(refreshErr, null);
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('authUser');
            window.dispatchEvent(new Event('auth:unauthorized'));
            return Promise.reject(refreshErr);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle 429 Rate Limit Exceeded
        if (error.response?.status === 429) {
          console.warn('CERT-In Security Alert: Rate limit exceeded. Request throttled.');
        }

        return Promise.reject(error);
      }
    );
  }

  private logRequest(endpoint: string) {
    const now = Date.now();
    requestLog.push({ timestamp: now, endpoint });
    // Keep window clean
    while (requestLog.length > 0 && requestLog[0].timestamp < now - RATE_LIMIT_WINDOW) {
      requestLog.shift();
    }
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
