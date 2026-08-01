'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  UserCheck,
  CheckCircle2,
  Award,
  CreditCard,
  MessageSquare,
  Calendar,
  AlertCircle,
  Bell,
  Heart,
} from 'lucide-react';

export function ParentDashboard() {
  const { students, feeTransactions, setActiveModule } = useIMS();
  const child = students[0]; // Ward context

  return (
    <div className="space-y-6">
      {/* Parent Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/80 to-slate-900 border border-teal-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-teal-400" /> Parent Portal
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Ward: {child?.name || 'Aarav Sharma'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Parent Guardian Portal
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Monitor your ward's daily attendance, academic progress, exam results, teacher remarks, and fee status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('parent-portal')}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-lg shadow-teal-600/30 flex items-center gap-2"
            >
              <Heart className="h-4 w-4" /> Full Ward Summary
            </button>
            <button
              onClick={() => setActiveModule('fees')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> Pay School Fee
            </button>
          </div>
        </div>
      </div>

      {/* Ward Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-teal-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ward Attendance</span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{child?.attendancePct || 94.5}%</p>
          <p className="text-[11px] text-teal-400 font-semibold mt-1">✓ Regular & Punctual</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Grade</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">A+ Grade</p>
          <p className="text-[11px] text-blue-400 font-semibold mt-1">GPA: {child?.gpa || 3.8} / 4.0</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Dues</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">₹{child?.feeDue || 0}</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ Up to Date</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class Batch</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">B.Tech Sem 4</p>
          <p className="text-[11px] text-slate-400 mt-1">Main Campus Delhi</p>
        </div>
      </div>
    </div>
  );
}
