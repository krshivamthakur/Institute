'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Building,
  TrendingUp,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const CLASS_ATTENDANCE_DATA = [
  { class: 'B.Tech CS - S4', pct: 94 },
  { class: 'B.Tech CS - S6', pct: 88 },
  { class: 'BCA - Sem 2', pct: 91 },
  { class: 'MBA - Sem 1', pct: 96 },
  { class: 'BBA - Sem 4', pct: 85 },
];

export function AcademicAdminDashboard() {
  const { students, teachers, courses, timetable, currentBranch, setActiveModule } = useIMS();

  return (
    <div className="space-y-6">
      {/* Academic Admin Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-blue-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-blue-400" /> Academic & Branch Management
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                📍 {currentBranch}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Academic Operations & Curriculum Control
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Monitor campus class schedules, student attendance rates, departmental faculty allocation, and exam readiness.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('classes')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" /> Manage Timetable
            </button>
            <button
              onClick={() => setActiveModule('courses')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" /> Curriculum & Courses
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Branch Enrolments</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{students.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Active Batch Enrolment</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Attendance Avg</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">91.4%</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ Meets 85% Target</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Courses</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{courses.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 Departments</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Lectures Today</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{timetable.length}</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">Live Timetable Slots</p>
        </div>
      </div>

      {/* Class Attendance Breakdown & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Class Attendance Ratio by Batch</h3>
              <p className="text-xs text-slate-400">Average student presence percentage across current active batches.</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              This Week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLASS_ATTENDANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="class" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}% Attendance`]}
                />
                <Bar dataKey="pct" name="Attendance %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timetable Monitor Panel */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base">Today's Class Slots</h3>
            <span className="text-xs text-blue-400 font-bold">{timetable.length} Active</span>
          </div>
          <div className="space-y-3">
            {timetable.slice(0, 4).map((slot) => (
              <div key={slot.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{slot.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {slot.time}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Batch: {slot.classBatch}</span>
                  <span>Room: {slot.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
