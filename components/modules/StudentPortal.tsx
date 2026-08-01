'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import { User, Calendar, CreditCard, Award, Download, Video, CheckCircle2 } from 'lucide-react';

export function StudentPortal() {
  const { students, feeTransactions, setActiveModule } = useIMS();
  const student = students[0];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 glass-panel-glow flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={student.avatar} alt={student.name} className="h-16 w-16 rounded-full object-cover border-2 border-purple-400" />
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300">
              Student Dashboard
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">{student.name}</h2>
            <p className="text-xs text-slate-300">{student.rollNo} • {student.classBatch}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveModule('certificates')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" /> Download Certificates
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">My Attendance</span>
          <p className="text-2xl font-black text-emerald-400">{student.attendancePct}%</p>
          <p className="text-[11px] text-slate-400">Total 124/134 Lectures Attended</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Current CGPA</span>
          <p className="text-2xl font-black text-amber-300">{student.gpa} / 4.0</p>
          <p className="text-[11px] text-slate-400">Rank #1 in Class Batch</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Fee Status</span>
          <p className="text-2xl font-black text-white">₹{student.feeDue.toLocaleString()}</p>
          <button
            onClick={() => setActiveModule('fees')}
            className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs"
          >
            Pay Dues Online
          </button>
        </div>
      </div>
    </div>
  );
}
