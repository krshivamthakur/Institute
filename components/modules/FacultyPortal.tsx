'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import { Briefcase, CheckCircle2, Upload, Award, Calendar, FileText } from 'lucide-react';

export function FacultyPortal() {
  const { teachers, setActiveModule } = useIMS();
  const teacher = teachers[0];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 glass-panel-glow flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={teacher.avatar} alt={teacher.name} className="h-16 w-16 rounded-full object-cover border-2 border-indigo-400" />
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300">
              Faculty Workspace
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">{teacher.name}</h2>
            <p className="text-xs text-slate-300">{teacher.designation} • {teacher.department}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveModule('attendance')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <CheckCircle2 className="h-4 w-4" /> Quick Mark Class Attendance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveModule('lms')}
          className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition space-y-2"
        >
          <Upload className="h-6 w-6 text-indigo-400" />
          <h3 className="font-bold text-white text-sm">Upload Study Material & Assignments</h3>
          <p className="text-xs text-slate-400">Share PDF lecture notes, video recordings, and quizzes with students.</p>
        </div>

        <div
          onClick={() => setActiveModule('exams')}
          className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 cursor-pointer transition space-y-2"
        >
          <Award className="h-6 w-6 text-amber-400" />
          <h3 className="font-bold text-white text-sm">Marks Entry Gradebook</h3>
          <p className="text-xs text-slate-400">Input mid-term and year exam marks for auto grade calculation.</p>
        </div>

        <div
          onClick={() => setActiveModule('classes')}
          className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 cursor-pointer transition space-y-2"
        >
          <Calendar className="h-6 w-6 text-purple-400" />
          <h3 className="font-bold text-white text-sm">My Weekly Lecture Timetable</h3>
          <p className="text-xs text-slate-400">View period allocations, assigned classrooms, and Zoom links.</p>
        </div>
      </div>
    </div>
  );
}
