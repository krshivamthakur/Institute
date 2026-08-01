'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  UserPlus2,
  Users,
  GraduationCap,
  Briefcase,
  DollarSign,
  Calendar,
  Star,
  Plus,
} from 'lucide-react';

export function HRDashboard() {
  const { teachers, setActiveModule } = useIMS();

  return (
    <div className="space-y-6">
      {/* HR Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-pink-950/80 to-slate-900 border border-pink-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1.5">
                <UserPlus2 className="h-3.5 w-3.5 text-pink-400" /> Human Resources & Staffing
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Staff Onboarding Sync
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Human Resources & Payroll Portal
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Manage faculty onboarding, staff attendance records, monthly payroll disbursements, and leave approvals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('hr')}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition shadow-lg shadow-pink-600/30 flex items-center gap-2"
            >
              <UserPlus2 className="h-4 w-4" /> Add New Staff / Faculty
            </button>
            <button
              onClick={() => setActiveModule('teachers')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" /> Staff Directory
            </button>
          </div>
        </div>
      </div>

      {/* HR Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-pink-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Staff</span>
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{teachers.length + 12}</p>
          <p className="text-[11px] text-slate-400 mt-1">Faculty & Support Staff</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Attendance %</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">96.8%</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ High Attendance</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Payroll</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">₹18.4L</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">Disbursed for July</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Rating Avg</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Star className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">4.8 / 5</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">Student Feedback</p>
        </div>
      </div>
    </div>
  );
}
