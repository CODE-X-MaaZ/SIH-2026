// ============================================================================
// src/context/AuthContext.tsx
// Global authentication state management
// ============================================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthUser, AuthToken, UserRole } from '@/types/auth.types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: AuthToken | null;
  login: (token: AuthToken, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from sessionStorage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
    const storedUser = sessionStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        setToken(JSON.parse(storedToken));
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authUser');
      }
    }
  }, []);

  const login = useCallback((newToken: AuthToken, newUser: AuthUser) => {
    sessionStorage.setItem('authToken', JSON.stringify(newToken));
    sessionStorage.setItem('authUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!token?.refreshToken) {
      logout();
      return false;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Refresh-Token': token.refreshToken
        }
      });

      if (!response.ok) {
        logout();
        return false;
      }

      const newToken = await response.json();
      setToken(newToken);
      sessionStorage.setItem('authToken', JSON.stringify(newToken));
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token, logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    token,
    login,
    logout,
    setUser,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
