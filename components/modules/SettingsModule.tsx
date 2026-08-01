'use client';

import React, { useState, useRef } from 'react';
import { useIMS } from '@/context/IMSContext';
import { SystemSettings } from '@/lib/ims-data';
import {
  Settings,
  Building2,
  GraduationCap,
  School,
  Sparkles,
  Shield,
  Crown,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  RotateCcw,
  Save,
  Lock,
  ShieldCheck,
  ShieldAlert,
  SlidersHorizontal,
  BookOpen,
  DollarSign,
  KeyRound,
  Bell,
  HardDrive,
  Download,
  AlertTriangle,
  ChevronRight,
  Eye,
  Trash2,
  Check,
  Globe,
  Clock,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function SettingsModule() {
  const { currentRole, logout, systemSettings, updateSystemSettings, resetSystemSettings, addAuditLog } = useIMS();

  const isSuperAdmin = currentRole === 'Super Admin';

  const [activeTab, setActiveTab] = useState<
    'branding' | 'academics' | 'fees' | 'security' | 'notifications' | 'system'
  >('branding');

  // Form State initialized from Context
  const [formData, setFormData] = useState<SystemSettings>(systemSettings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state if systemSettings changes externally
  React.useEffect(() => {
    setFormData(systemSettings);
  }, [systemSettings]);

  // Handle Form Change Helper
  const handleChange = (field: keyof SystemSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent: 'paymentGateways', key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value,
      },
    }));
  };

  // Handle Custom Logo Upload (File -> Base64 Data URL)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange('logoUrl', base64String);
        handleChange('logoPreset', 'Custom');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded logo image
  const handleRemoveLogo = () => {
    handleChange('logoUrl', null);
    handleChange('logoPreset', 'Building2');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick Preset Branding Selector
  const applyBrandingPreset = (name: string, tagline: string, presetIcon: SystemSettings['logoPreset']) => {
    setFormData((prev) => ({
      ...prev,
      projectName: name,
      projectTagline: tagline,
      logoPreset: presetIcon,
      logoUrl: null,
    }));
  };

  // Save Settings Form
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSystemSettings(formData);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setSaveSuccessMsg('System settings successfully updated & saved!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Reset Settings
  const handleConfirmReset = () => {
    resetSystemSettings();
    setShowResetConfirm(false);
    setSaveSuccessMsg('System settings reset to factory defaults.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // JSON Backup Download
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `IMS_Settings_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addAuditLog('DATA_EXPORT', 'Downloaded system settings JSON backup file');
  };

  // -------------------------------------------------------------
  // SUPER ADMIN ACCESS GUARD
  // -------------------------------------------------------------
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95">
        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-5 shadow-2xl shadow-rose-950/50">
          <ShieldAlert className="h-16 w-16" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-3">
          Security Role Enforcement
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight">Access Restricted: Super Admin Only</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          The System Settings module manages global institute branding, financial thresholds, security rules, and data operations. You are currently logged in as <span className="font-bold text-amber-400">{currentRole}</span>.
        </p>

        <div className="mt-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm w-full text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Lock className="h-4 w-4 text-amber-400" />
            <span>Elevate Privileges to Super Admin</span>
          </div>
          <p className="text-xs text-slate-400">
            To view or modify system settings, please sign out of your current account and log in with Super Admin credentials.
          </p>
          <button
            onClick={logout}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
          >
            <ShieldCheck className="h-4 w-4 text-purple-200" />
            Sign Out & Log In as Super Admin
          </button>
        </div>
      </div>
    );
  }

  // Preset Icon Component Resolver
  const PresetIconComp = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return GraduationCap;
      case 'School': return School;
      case 'Sparkles': return Sparkles;
      case 'Shield': return Shield;
      case 'Crown': return Crown;
      default: return Building2;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-purple-950/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-white/20">
            <Settings className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">System Settings & Branding</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Super Admin Only
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure institute branding, project logo, academic policies, fee rules, security locks & system gateways.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
          >
            <Save className="h-4 w-4" />
            Save All Changes
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Changes active instantly across header & platform</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'branding', label: 'Branding & Logo', icon: ImageIcon },
          { id: 'academics', label: 'Academics & Batches', icon: BookOpen },
          { id: 'fees', label: 'Fees & Financials', icon: DollarSign },
          { id: 'security', label: 'Security & Access', icon: KeyRound },
          { id: 'notifications', label: 'Gateways & Alerts', icon: Bell },
          { id: 'system', label: 'Maintenance & Backup', icon: HardDrive },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition duration-150 flex items-center gap-2 shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/50 shadow-md shadow-purple-600/20'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Containers */}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">

        {/* -------------------------------------------------------------
            TAB 1: BRANDING & GENERAL SETTINGS
        ------------------------------------------------------------- */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            
            {/* Left Column: Input Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Project Name & Tagline */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <SlidersHorizontal className="h-4 w-4 text-purple-400" />
                  <h3 className="font-bold text-sm text-white">Project Identity & Header Title</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project / Institute Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.projectName}
                      onChange={(e) => handleChange('projectName', e.target.value)}
                      placeholder="e.g. AURA IMS or Oxford Institute"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">Displayed in top navigation bar and reports header.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.projectTagline}
                      onChange={(e) => handleChange('projectTagline', e.target.value)}
                      placeholder="e.g. Next-Gen Institute Management Platform"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">Visible under logo in header on desktop screens.</p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-2">
                    Quick Sample Presets:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'AURA IMS', tagline: 'Next-Gen Institute Management Platform', icon: 'Building2' as const },
                      { name: 'ST. XAVIER ACADEMY', tagline: 'Excellence in Higher Education & Research', icon: 'GraduationCap' as const },
                      { name: 'SILICON VALLEY STEM', tagline: 'Innovation & Technology Campus', icon: 'Sparkles' as const },
                      { name: 'ROYAL GLOBAL UNIVERSITY', tagline: 'Empowering Future Leaders Worldwide', icon: 'Crown' as const },
                    ].map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => applyBrandingPreset(p.name, p.tagline, p.icon)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-800 hover:border-purple-500/40 transition"
                      >
                        ⚡ {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logo Selection & Image Upload */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ImageIcon className="h-4 w-4 text-blue-400" />
                  <h3 className="font-bold text-sm text-white">Project Logo Customization</h3>
                </div>

                {/* Custom Image Upload vs Preset Icon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Upload Box */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-300">
                      Option A: Upload Custom Logo Image
                    </label>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 hover:border-purple-500 text-center transition flex flex-col items-center justify-center gap-2">
                      {formData.logoUrl ? (
                        <div className="relative group">
                          <img
                            src={formData.logoUrl}
                            alt="Uploaded Logo"
                            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-purple-500 shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-500 transition"
                            title="Remove Logo Image"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 rounded-2xl bg-slate-900 text-slate-400 border border-slate-800">
                            <Upload className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Upload PNG, JPG, or SVG</p>
                            <p className="text-[10px] text-slate-500">Max size 2MB (Square ratio recommended)</p>
                          </div>
                        </>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-file-upload"
                      />
                      <label
                        htmlFor="logo-file-upload"
                        className="mt-2 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md transition"
                      >
                        {formData.logoUrl ? 'Change Image File' : 'Browse Files'}
                      </label>
                    </div>
                  </div>

                  {/* Preset Vector Icons Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-300">
                      Option B: Choose Preset Icon Logo
                    </label>
                    <p className="text-[10px] text-slate-500">Selected if no custom image file is uploaded.</p>

                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'Building2', name: 'Institute', icon: Building2 },
                        { id: 'GraduationCap', name: 'Academy', icon: GraduationCap },
                        { id: 'School', name: 'Campus', icon: School },
                        { id: 'Sparkles', name: 'AI / Tech', icon: Sparkles },
                        { id: 'Shield', name: 'Security', icon: Shield },
                        { id: 'Crown', name: 'University', icon: Crown },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = !formData.logoUrl && formData.logoPreset === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              handleChange('logoUrl', null);
                              handleChange('logoPreset', item.id);
                            }}
                            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition border ${
                              isSelected
                                ? 'bg-purple-600/20 text-purple-300 border-purple-500 ring-1 ring-purple-500'
                                : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-[10px] font-bold">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional & System Preferences */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Regional & System Format Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Session Year</label>
                    <select
                      value={formData.academicYear}
                      onChange={(e) => handleChange('academicYear', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="2025 - 2026">2025 - 2026</option>
                      <option value="2026 - 2027">2026 - 2027</option>
                      <option value="2027 - 2028">2027 - 2028</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Currency Symbol</label>
                    <select
                      value={formData.currencySymbol}
                      onChange={(e) => handleChange('currencySymbol', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500 font-mono"
                    >
                      <option value="₹">₹ (INR - Indian Rupee)</option>
                      <option value="$">$ (USD - US Dollar)</option>
                      <option value="€">€ (EUR - Euro)</option>
                      <option value="£">£ (GBP - British Pound)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Timezone</label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                      <option value="America/New_York (EST)">America/New_York (EST)</option>
                      <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                      <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Header Branding Preview Box */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl glass-panel-glow border border-purple-500/40 bg-gradient-to-b from-purple-950/30 to-slate-900/90 space-y-4 sticky top-[80px]">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                  <h4 className="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                    <Eye className="h-4 w-4" /> Live Header Preview
                  </h4>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Realtime Sync
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  This preview shows exactly how your customized logo, project name, and tagline will look in the top navbar for all users:
                </p>

                {/* Mock Header Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex items-center gap-3">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Preview"
                      className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/20 shadow-lg shadow-blue-500/20"
                    />
                  ) : (
                    (() => {
                      const IconComp = PresetIconComp(formData.logoPreset);
                      return (
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
                          <IconComp className="h-5 w-5 text-white" />
                        </div>
                      );
                    })()
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="font-bold text-base tracking-tight text-white truncate">
                        {formData.projectName ? (
                          (() => {
                            const parts = formData.projectName.trim().split(' ');
                            if (parts.length > 1) {
                              const main = parts.slice(0, -1).join(' ');
                              const last = parts[parts.length - 1];
                              return (
                                <span>
                                  {main} <span className="text-blue-400">{last}</span>
                                </span>
                              );
                            }
                            return formData.projectName;
                          })()
                        ) : (
                          'AURA IMS'
                        )}
                      </h1>
                      <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        v4.2
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {formData.projectTagline || 'Next-Gen Institute Management Platform'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 space-y-2 text-[11px] text-slate-400">
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                    <span>Active Session:</span>
                    <span className="font-bold text-slate-200">{formData.academicYear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Currency Unit:</span>
                    <span className="font-mono font-bold text-amber-300">{formData.currencySymbol}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Branding Mode:</span>
                    <span className="font-bold text-purple-300">
                      {formData.logoUrl ? 'Custom Image' : `Preset (${formData.logoPreset})`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: ACADEMICS & BATCHES
        ------------------------------------------------------------- */}
        {activeTab === 'academics' && (
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <h3 className="font-bold text-sm text-white">Academic Rules & Attendance Policies</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Minimum Mandatory Attendance Threshold (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={formData.attendanceThreshold}
                    onChange={(e) => handleChange('attendanceThreshold', Number(e.target.value))}
                    className="flex-1 accent-purple-500 cursor-pointer"
                  />
                  <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-extrabold text-sm border border-purple-500/30">
                    {formData.attendanceThreshold}%
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Students falling below this percentage receive automated low-attendance warnings.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Grading Scale System
                </label>
                <select
                  value={formData.gradingSystem}
                  onChange={(e) => handleChange('gradingSystem', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="CGPA (10-Point Scale)">CGPA (10-Point Scale - standard university)</option>
                  <option value="Percentage (0-100%)">Percentage Marks (0-100%)</option>
                  <option value="Letter Grade (A+ to F)">Letter Grade (A+ to F)</option>
                  <option value="GPA (4-Point Scale)">GPA (4-Point Scale)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Automatic Student Roll Number Prefix
                </label>
                <input
                  type="text"
                  value={formData.rollNumberPrefix}
                  onChange={(e) => handleChange('rollNumberPrefix', e.target.value)}
                  placeholder="e.g. AUR-2026-"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Standard Class Lecture Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={formData.classDurationMinutes}
                  onChange={(e) => handleChange('classDurationMinutes', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Auto-Publish Exam Results</h4>
                <p className="text-[11px] text-slate-400">Instantly publish marksheet to student and parent portals after evaluation.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.autoPublishExams}
                onChange={(e) => handleChange('autoPublishExams', e.target.checked)}
                className="h-5 w-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: FEES & FINANCIALS
        ------------------------------------------------------------- */}
        {activeTab === 'fees' && (
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Fee Management & Payment Gateway Rules</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Overdue Fine Rate per Day ({formData.currencySymbol})
                </label>
                <input
                  type="number"
                  value={formData.lateFeeDailyRate}
                  onChange={(e) => handleChange('lateFeeDailyRate', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Default GST / Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.gstTaxPercentage}
                  onChange={(e) => handleChange('gstTaxPercentage', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Payment Gateways Config */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Active Integrated Payment Options</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'razorpay', label: 'Razorpay Instant' },
                  { id: 'stripe', label: 'Stripe International' },
                  { id: 'upi', label: 'UPI / QR Code' },
                  { id: 'cash', label: 'Cash at Desk' },
                ].map((gw) => (
                  <label
                    key={gw.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      formData.paymentGateways[gw.id as keyof typeof formData.paymentGateways]
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold">{gw.label}</span>
                    <input
                      type="checkbox"
                      checked={formData.paymentGateways[gw.id as keyof typeof formData.paymentGateways]}
                      onChange={(e) => handleNestedChange('paymentGateways', gw.id, e.target.checked)}
                      className="h-4 w-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Receipt Header / Legal Disclaimer Note
              </label>
              <textarea
                rows={2}
                value={formData.receiptHeaderNote}
                onChange={(e) => handleChange('receiptHeaderNote', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: SECURITY & ACCESS
        ------------------------------------------------------------- */}
        {activeTab === 'security' && (
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <KeyRound className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Security Controls & Password Policy</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  min="6"
                  max="32"
                  value={formData.minPasswordLength}
                  onChange={(e) => handleChange('minPasswordLength', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Session Inactivity Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={formData.sessionTimeoutMinutes}
                  onChange={(e) => handleChange('sessionTimeoutMinutes', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Audit Log Retention Period (Days)
                </label>
                <input
                  type="number"
                  value={formData.auditLogRetentionDays}
                  onChange={(e) => handleChange('auditLogRetentionDays', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Require Special Characters in Password</h4>
                  <p className="text-[11px] text-slate-400">Passwords must include numbers & special characters (@, #, $).</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.requireSpecialChar}
                  onChange={(e) => handleChange('requireSpecialChar', e.target.checked)}
                  className="h-5 w-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Enforce Two-Factor Authentication (2FA) for Admins</h4>
                  <p className="text-[11px] text-slate-400">Require OTP validation via Email/SMS for admin role logins.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.twoFactorAuth}
                  onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  className="h-5 w-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 5: NOTIFICATIONS & GATEWAYS
        ------------------------------------------------------------- */}
        {activeTab === 'notifications' && (
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bell className="h-4 w-4 text-purple-400" />
              <h3 className="font-bold text-sm text-white">SMS, WhatsApp & Email Gateway Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">SMS Gateway Provider</label>
                <input
                  type="text"
                  value={formData.smsGateway}
                  onChange={(e) => handleChange('smsGateway', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">SMTP Host Server</label>
                <input
                  type="text"
                  value={formData.emailSmtpHost}
                  onChange={(e) => handleChange('emailSmtpHost', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-200">Instant Automated Alert Triggers</h4>
              {[
                { key: 'notifyAbsenceInstant', title: 'Instant Parent Absence Alerts', desc: 'Send immediate SMS/WhatsApp to parents when student is marked absent.' },
                { key: 'notifyFeeDueReminder', title: 'Automated Fee Overdue Alerts', desc: 'Send reminder SMS 5 days prior to fee due date.' },
                { key: 'notifyExamResults', title: 'Exam Result Announcement Alerts', desc: 'Notify students and parents when exam results are published.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(formData as any)[item.key]}
                    onChange={(e) => handleChange(item.key as any, e.target.checked)}
                    className="h-5 w-5 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 6: SYSTEM MAINTENANCE & BACKUPS
        ------------------------------------------------------------- */}
        {activeTab === 'system' && (
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <HardDrive className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">System Backups & Data Maintenance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Download className="h-4 w-4 text-purple-400" /> One-Click JSON Backup Download
                </h4>
                <p className="text-[11px] text-slate-400">
                  Export complete configuration schema, branding parameters, and system state for safe offsite backup.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Download className="h-4 w-4" /> Download Backup File (.json)
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-rose-400" /> Factory Reset System Settings
                </h4>
                <p className="text-[11px] text-slate-400">
                  Revert all institute branding, logo choices, financial rules, and preferences back to initial default values.
                </p>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Reset Settings to Default
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
          >
            <Save className="h-4 w-4" /> Save System Settings
          </button>
        </div>
      </form>

      {/* Safety Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/30">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Confirm Reset to Defaults</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              Are you sure you want to reset all institute branding, logo settings, financial rules, and security preferences back to initial system defaults?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" /> Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
