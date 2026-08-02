'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useIMS } from '@/context/IMSContext';
import { MOCK_BRANCHES } from '@/lib/ims-data';
import {
  Search,
  Bell,
  Bot,
  Building2,
  GraduationCap,
  School,
  Crown,
  Shield,
  Sparkles,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';

export function Header() {
  const {
    authUser,
    logout,
    currentBranch,
    setCurrentBranch,
    searchQuery,
    setSearchQuery,
    isAiBotOpen,
    setIsAiBotOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    systemSettings,
  } = useIMS();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  // Logo Icon Resolver
  const renderHeaderLogo = () => {
    if (systemSettings?.logoUrl) {
      return (
        <img
          src={systemSettings.logoUrl}
          alt={systemSettings.projectName || 'Project Logo'}
          className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/20 shadow-lg shadow-blue-500/20"
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
      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
        <IconComp className="h-5 w-5 text-white" />
      </div>
    );
  };

  const renderProjectTitle = () => {
    const title = systemSettings?.projectName || 'AURA IMS';
    const parts = title.trim().split(' ');
    if (parts.length > 1) {
      const main = parts.slice(0, -1).join(' ');
      const last = parts[parts.length - 1];
      return (
        <span>
          {main} <span className="text-blue-400">{last}</span>
        </span>
      );
    }
    return <span>{title}</span>;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-3 sm:px-4 py-2.5 sm:py-3 text-slate-100 shadow-lg">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Button & Brand logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 transition lg:hidden"
            title="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 text-blue-400" /> : <Menu className="h-5 w-5" />}
          </button>

          {renderHeaderLogo()}
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-sm sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                {renderProjectTitle()}
              </h1>
              <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hidden xs:inline-block">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {systemSettings?.projectTagline || 'Next-Gen Institute Management Platform'}
            </p>
          </div>
        </div>

        {/* Center: Search & Campus Switcher */}
        <div className="flex-1 max-w-xl flex items-center gap-3">
          <div className="relative flex-1 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, faculty, courses, fee receipts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Branch Switcher */}
          <div className="relative hidden lg:block">
            <select
              value={currentBranch}
              onChange={(e) => setCurrentBranch(e.target.value)}
              className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {MOCK_BRANCHES.map((b) => (
                <option key={b.id} value={b.name} className="bg-slate-900 text-slate-100">
                  📍 {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: AI Bot, Mobile App, Notifications, User Profile & Logout */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiBotOpen(!isAiBotOpen)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/40 text-purple-200 text-xs font-medium transition shadow-md shadow-purple-900/20"
          >
            <Bot className="h-4 w-4 text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">EduBot AI</span>
            <Sparkles className="h-3 w-3 text-amber-300" />
          </button>

          {/* Notifications Center Button */}
          <div ref={notifRef} className="relative hidden md:block">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 transition"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel-glow border border-slate-700 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Bell className="h-3.5 w-3.5 text-blue-400" /> Notifications & Alerts
                  </h4>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllNotificationsAsRead();
                        }}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-0.5"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Mark Read All
                      </button>
                    )}
                    <span className="text-[10px] text-slate-400">{unreadCount} unread</span>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        n.read
                          ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                          : 'bg-blue-950/40 border-blue-800/60 text-slate-200 hover:border-blue-500/80'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-blue-300">{n.title}</span>
                        <span className="text-[9px] text-slate-500">{n.date}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-300">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Authenticated User Profile Badge & Logout Button */}
          {authUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs shadow-md">
                {authUser.avatar ? (
                  <img
                    src={authUser.avatar}
                    alt={authUser.name}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-purple-500/50"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-xs">
                    {authUser.name.charAt(0)}
                  </div>
                )}

                <div className="hidden sm:block text-left min-w-0">
                  <div className="font-bold text-white text-xs truncate flex items-center gap-1">
                    <span>{authUser.name}</span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">
                    {authUser.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition"
                title="Sign Out of Session"
              >
                <LogOut className="h-4 w-4 text-slate-400 hover:text-rose-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
