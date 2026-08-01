'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { PRESET_USERS, UserRole } from '@/lib/ims-data';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  User,
  Building2,
  GraduationCap,
  School,
  Sparkles,
  Shield,
  Crown,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkle,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function LoginScreen() {
  const { login, systemSettings } = useIMS();

  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const res = login(userIdInput, passwordInput);
      setLoading(false);
      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 400);
  };

  const handleQuickLogin = (preset: (typeof PRESET_USERS)[number]) => {
    setErrorMessage('');
    setUserIdInput(preset.id);
    setPasswordInput('admin123');

    const res = login(preset.id, 'admin123');
    if (res.success) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  // Render Preset Icon Resolver
  const renderLogoIcon = () => {
    if (systemSettings?.logoUrl) {
      return (
        <img
          src={systemSettings.logoUrl}
          alt={systemSettings.projectName || 'Logo'}
          className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white/20 shadow-xl shadow-blue-500/30"
        />
      );
    }
    const preset = systemSettings?.logoPreset || 'Building2';
    let IconComp = Building2;
    if (preset === 'GraduationCap') IconComp = GraduationCap;
    else if (preset === 'School') IconComp = School;
    else if (preset === 'Sparkles') IconComp = Sparkles;
    else if (preset === 'Shield') IconComp = Shield;
    else if (preset === 'Crown') IconComp = Crown;

    return (
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/30 ring-1 ring-white/20 shrink-0">
        <IconComp className="h-6 w-6 text-white" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel-glow border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Brand & Logo Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          {renderLogoIcon()}
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              {systemSettings?.projectName || 'AURA IMS'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {systemSettings?.projectTagline || 'Next-Gen Institute Management Platform'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-purple-400" /> Protected Access Portal
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              User ID / Email / Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Enter User ID (e.g. ADM-001 or STU-1001 or admin@auraims.edu)"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Account Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Password (Default: admin123)"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition duration-200"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating Credentials...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Sign In to System
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Selector Chips */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> 1-Click Quick Demo Login:
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Pass: admin123</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: '⚡ Super Admin', role: 'Super Admin' },
              { label: '🎓 Student (Aarav)', role: 'Student' },
              { label: '👨‍🏫 Teacher (Dr. Meenakshi)', role: 'Teacher' },
              { label: '💰 Accountant', role: 'Accountant' },
              { label: '👔 Director', role: 'Director' },
              { label: '👨‍👩‍👦 Parent', role: 'Parent' },
            ].map((chip) => {
              const presetUser = PRESET_USERS.find((u) => u.role === chip.role) || PRESET_USERS[0];
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleQuickLogin(presetUser)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-950/40 text-slate-300 hover:text-white border border-slate-800 hover:border-purple-500/40 text-[10px] font-bold transition text-left truncate"
                  title={`Log in as ${presetUser.name} (${presetUser.id})`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> System Authentication Policy
          </p>
          <p>
            Users are authenticated based on their ID & Password. Role permissions are enforced automatically upon login.
          </p>
        </div>
      </div>
    </div>
  );
}
