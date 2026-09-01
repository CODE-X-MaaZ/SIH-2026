"use client";

import React, { useState } from 'react';
import './government-theme.css';
import AccessibilityToolbar from '@/components/auth/AccessibilityToolbar';
import GovernmentHeader from '@/components/auth/GovernmentHeader';
import CitizenLoginForm from '@/components/auth/CitizenLoginForm';
import CitizenRegisterForm from '@/components/auth/CitizenRegisterForm';
import OfficialLoginForm from '@/components/auth/OfficialLoginForm';
import { AuthProvider } from '@/context/AuthContext';

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<'citizen-login' | 'citizen-register' | 'official-login'>('citizen-login');

    const handleSuccess = (user: any) => {
        // Replace fake auth token with actual implementation if required in future
        alert("Login Mock Success for " + user.name);
        window.location.href = user.role === 'official' ? '/admin' : '/';
    };

    return (
        <AuthProvider>
            <div className="login-module-wrapper">
                <div className="tricolor-stripe"></div>
                <AccessibilityToolbar />
                <GovernmentHeader />

                <main className="gov-container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="gov-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'citizen-login' ? 'active' : ''}`}
                                onClick={() => setActiveTab('citizen-login')}
                            >
                                Citizen Login
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'citizen-register' ? 'active' : ''}`}
                                onClick={() => setActiveTab('citizen-register')}
                            >
                                Citizen Registration
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'official-login' ? 'active' : ''}`}
                                onClick={() => setActiveTab('official-login')}
                            >
                                Official Portal
                            </button>
                        </div>

                        {activeTab === 'citizen-login' && <CitizenLoginForm onSuccess={handleSuccess} />}
                        {activeTab === 'citizen-register' && <CitizenRegisterForm onSuccess={handleSuccess} />}
                        {activeTab === 'official-login' && <OfficialLoginForm onSuccess={handleSuccess} />}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
