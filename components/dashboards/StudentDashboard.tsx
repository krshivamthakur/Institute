'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  CreditCard,
  Award,
  Video,
  Clock,
  Download,
  FileText,
  Sparkles,
} from 'lucide-react';

export function StudentDashboard() {
  const { authUser, students, timetable, lmsMaterials, feeTransactions, setActiveModule } = useIMS();

  // Dynamic Student resolution logic based on logged-in user session
  let student: typeof students[0];
  const matched = students.find(
    (s) =>
      s.id === authUser?.id ||
      s.rollNo === authUser?.empIdOrRollNo ||
      s.id === authUser?.empIdOrRollNo ||
      s.email.toLowerCase() === authUser?.email?.toLowerCase() ||
      s.id === authUser?.childStudentId ||
      s.name.toLowerCase().includes(authUser?.name?.toLowerCase() || '') ||
      (authUser?.name && authUser.name.toLowerCase().includes(s.name.toLowerCase()))
  );

  if (matched) {
    student = matched;
  } else if (authUser?.role === 'Student') {
    student = {
      id: authUser?.id || 'STU-1001',
      rollNo: authUser?.empIdOrRollNo || '2026-CS-001',
      name: authUser?.name || 'Aarav Sharma',
      email: authUser?.email || 'aarav.sharma@institute.edu',
      phone: '+91 98765 43210',
      classBatch: 'B.Tech CS - Sem 4',
      branch: authUser?.branch || 'Main Campus - New Delhi',
      gender: 'Male',
      dob: '2004-05-14',
      admissionDate: '2024-08-01',
      status: 'Active',
      parentName: 'Rajesh Sharma',
      parentPhone: '+91 98765 00001',
      attendancePct: 92.5,
      feeStatus: 'Paid',
      feeDue: 0,
      gpa: 3.85,
      avatar: authUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      documentsUploaded: { aadhar: true, marksheet: true, photo: true },
    };
  } else {
    student = students[0];
  }

  return (
    <div className="space-y-6">
      {/* Student Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-400" /> Student Learning Portal
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Roll No: {student?.rollNo || '2026-CS-001'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{student?.name || 'Aarav Sharma'}</span>!
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Track your academic attendance, upcoming class schedules, exam dates, fee dues, and LMS course notes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('lms')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Video className="h-4 w-4" /> My LMS Material
            </button>
            <button
              onClick={() => setActiveModule('fees')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> Fee Dues & Receipts
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Attendance</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{student?.attendancePct || 94.5}%</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ Eligible for Exams (&gt;75%)</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current GPA</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{student?.gpa || 3.8} / 4.0</p>
          <p className="text-[11px] text-blue-400 font-semibold mt-1">Top 5% in Batch</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Course</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">Year 2</p>
          <p className="text-[11px] text-slate-400 mt-1">B.Tech Computer Science</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Balance</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">₹{student?.feeDue || 0}</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ All Dues Paid</p>
        </div>
      </div>

      {/* Today's Timetable & LMS Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" /> Today's Lecture Schedule
            </h3>
            <span className="text-xs text-slate-400">Year 2</span>
          </div>

          <div className="space-y-3">
            {timetable.slice(0, 3).map((slot) => (
              <div key={slot.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{slot.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {slot.time}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Faculty: {slot.teacher}</span>
                  <span>Room: {slot.room}</span>
                </div>
                {slot.meetingLink && (
                  <a
                    href={slot.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Video className="h-3.5 w-3.5 text-emerald-400" /> Join Virtual Meeting Class
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Course LMS Downloads */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-400" /> Recent Course Materials & Notes
            </h3>
            <button onClick={() => setActiveModule('lms')} className="text-xs text-blue-400 font-bold hover:underline">
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {lmsMaterials.slice(0, 3).map((mat) => (
              <div key={mat.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white">{mat.title}</h4>
                  <p className="text-[11px] text-slate-400">{mat.subject} • {mat.type}</p>
                </div>
                <button
                  onClick={() => setActiveModule('lms')}
                  className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                  title="Download Notes"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
