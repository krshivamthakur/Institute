'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Smartphone, X, Bell, Calendar, CreditCard, Award, User, CheckCircle2 } from 'lucide-react';

export function MobilePreviewModal() {
  const { isMobilePreviewOpen, setIsMobilePreviewOpen, students, feeTransactions } = useIMS();
  const [appRole, setAppRole] = useState<'Student' | 'Parent' | 'Teacher'>('Student');
  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'fees' | 'results'>('home');

  if (!isMobilePreviewOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm glass-panel-glow border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
        {/* Modal Controls */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">Mobile App Live Simulator</h3>
          </div>
          <button
            onClick={() => setIsMobilePreviewOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full mb-4">
          {(['Student', 'Parent', 'Teacher'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setAppRole(r)}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition ${
                appRole === r ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r} App
            </button>
          ))}
        </div>

        {/* Smartphone Hardware Frame */}
        <div className="w-[300px] h-[520px] bg-slate-950 rounded-[36px] border-4 border-slate-800 shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/10">
          {/* Notch / Top Bar */}
          <div className="h-6 bg-slate-900 flex items-center justify-between px-4 text-[9px] text-slate-400 font-bold">
            <span>09:41 AM</span>
            <div className="h-3 w-12 bg-slate-800 rounded-full"></div>
            <span>5G ⚡</span>
          </div>

          {/* App Header */}
          <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                {appRole[0]}
              </div>
              <div>
                <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">Aura Mobile</p>
                <p className="text-xs font-bold leading-tight">
                  {appRole === 'Student' ? 'Aarav Sharma' : appRole === 'Parent' ? 'Rajesh Sharma' : 'Dr. Meenakshi S.'}
                </p>
              </div>
            </div>
            <Bell className="h-4 w-4 text-emerald-200" />
          </div>

          {/* App Body Content */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-slate-100 bg-slate-900/60">
            {activeTab === 'home' && (
              <>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30">
                  <span className="text-[9px] uppercase font-bold text-emerald-400">Quick Status</span>
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      <p className="text-[10px] text-slate-400">Attendance Rate</p>
                      <p className="text-base font-extrabold text-emerald-300">92.5% Present</p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400">Today's Class Schedule</h4>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>Data Structures</span>
                      <span className="text-emerald-400">09:00 AM</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Hall 301 • Dr. Meenakshi S.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>Operating Systems Lab</span>
                      <span className="text-blue-400">10:15 AM</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Lab 402 • Prof. Rajesh Khanna</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase text-slate-400">Monthly Attendance Log</h4>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span>Aug 01, 2026</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Present (08:55 AM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jul 31, 2026</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Present (08:50 AM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jul 30, 2026</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">Absent</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase text-slate-400">Fee Status & Payments</h4>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                  <p className="text-[10px] text-slate-400">Semester 4 Tuition Fee</p>
                  <p className="text-base font-bold text-emerald-400">₹60,000 (Paid)</p>
                  <p className="text-[9px] text-slate-500 mt-1">Txn ID: pay_N8zL90kQx12</p>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase text-slate-400">Mid-Term Grade Card</h4>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Data Structures</span>
                    <span className="text-emerald-400">94/100 (A+)</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Rank #1 in Class Batch</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom App Navigation */}
          <div className="h-12 bg-slate-950 border-t border-slate-800 flex items-center justify-around text-slate-400">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center text-[9px] ${activeTab === 'home' ? 'text-emerald-400 font-bold' : ''}`}
            >
              <Calendar className="h-3.5 w-3.5" /> Home
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex flex-col items-center text-[9px] ${activeTab === 'attendance' ? 'text-emerald-400 font-bold' : ''}`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Attendance
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`flex flex-col items-center text-[9px] ${activeTab === 'fees' ? 'text-emerald-400 font-bold' : ''}`}
            >
              <CreditCard className="h-3.5 w-3.5" /> Fees
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex flex-col items-center text-[9px] ${activeTab === 'results' ? 'text-emerald-400 font-bold' : ''}`}
            >
              <Award className="h-3.5 w-3.5" /> Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
