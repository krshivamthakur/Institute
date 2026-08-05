'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Smartphone, Bell, Calendar, CreditCard, Award, User, CheckCircle2 } from 'lucide-react';

export function MobileAppPreviewModule() {
  const { systemSettings } = useIMS();
  const [appRole, setAppRole] = useState<'Student' | 'Parent' | 'Teacher'>('Student');
  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'fees' | 'results'>('home');
  const instituteName = systemSettings?.projectName || 'AURA IMS';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-emerald-400" /> Mobile Native Application Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate native iOS / Android app experience for Student, Parent, and Teacher portals with push notification testing.
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-[320px] h-[580px] bg-slate-950 rounded-[40px] border-8 border-slate-800 shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/10">
          <div className="h-7 bg-slate-900 flex items-center justify-between px-4 text-[9px] text-slate-400 font-bold">
            <span>09:41 AM</span>
            <div className="h-3.5 w-16 bg-slate-800 rounded-full"></div>
            <span>5G ⚡</span>
          </div>

          <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">{instituteName}</p>
              <p className="text-xs font-bold">{appRole} View</p>
            </div>
            <Bell className="h-4 w-4 text-emerald-200" />
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-slate-100 bg-slate-900/60 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[9px] uppercase font-bold text-emerald-400">Status</span>
              <p className="text-sm font-extrabold text-white">92.5% Attendance</p>
            </div>
          </div>

          <div className="h-12 bg-slate-950 border-t border-slate-800 flex items-around text-slate-400 justify-around">
            <button onClick={() => setActiveTab('home')} className="text-[9px] font-bold text-emerald-400">Home</button>
            <button onClick={() => setActiveTab('fees')} className="text-[9px]">Fees</button>
            <button onClick={() => setActiveTab('results')} className="text-[9px]">Results</button>
          </div>
        </div>
      </div>
    </div>
  );
}
