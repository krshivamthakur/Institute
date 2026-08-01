'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import { LayoutDashboard, Menu, Bot, Bell, Search, X } from 'lucide-react';

export function MobileBottomNav() {
  const {
    activeModule,
    setActiveModule,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isAiBotOpen,
    setIsAiBotOpen,
    notifications,
    searchQuery,
    setSearchQuery,
  } = useIMS();

  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="fixed top-[57px] left-0 right-0 z-40 bg-slate-900/95 border-b border-slate-800 p-3 shadow-xl animate-in slide-in-from-top-2 lg:hidden">
          <div className="relative flex items-center gap-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search students, faculty, fees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Fixed Mobile & Tablet Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 text-slate-300 shadow-2xl lg:hidden">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Home / Dashboard */}
          <button
            onClick={() => {
              setActiveModule('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              activeModule === 'dashboard'
                ? 'text-blue-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px]">Home</span>
          </button>

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              isMobileMenuOpen
                ? 'text-blue-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px]">Menu</span>
          </button>

          {/* EduBot AI */}
          <button
            onClick={() => {
              setIsAiBotOpen(!isAiBotOpen);
              setIsMobileMenuOpen(false);
            }}
            className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              isAiBotOpen
                ? 'text-purple-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Bot className="h-5 w-5 text-purple-400" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-purple-500 animate-ping" />
            </div>
            <span className="text-[10px] text-purple-300">EduBot</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => {
              setActiveModule('notifications');
              setIsMobileMenuOpen(false);
            }}
            className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              activeModule === 'notifications'
                ? 'text-amber-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">Alerts</span>
          </button>

          {/* Quick Search */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              showMobileSearch
                ? 'text-blue-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px]">Search</span>
          </button>
        </div>
      </nav>
    </>
  );
}
