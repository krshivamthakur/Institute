'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  CheckCircle2,
  QrCode,
  Fingerprint,
  Users,
  Search,
  Calendar,
  Check,
  X,
  Clock,
  Sparkles,
  Lock,
  User,
  AlertCircle,
  FileText,
  Send,
  Award,
  BookOpen,
} from 'lucide-react';

export function AttendanceManagement() {
  const { authUser, currentRole, students, attendance, markAttendance } = useIMS();
  const isPersonalScope = currentRole === 'Student' || currentRole === 'Parent';

  const myStudent = currentRole === 'Parent'
    ? (students.find(
        (s) =>
          s.id === authUser?.childStudentId ||
          s.rollNo === authUser?.childStudentId ||
          (authUser?.name && s.parentName.toLowerCase().includes(authUser.name.toLowerCase().replace('(parent)', '').trim()))
      ) || students[0])
    : (students.find((s) => s.id === authUser?.empIdOrRollNo || s.rollNo === authUser?.empIdOrRollNo) || students[0]);

  // Admin View state
  const [selectedBatch, setSelectedBatch] = useState('B.Tech CS - Sem 4');
  const [selectedDate, setSelectedDate] = useState('2026-08-01');
  const [activeTab, setActiveTab] = useState<'register' | 'qrcode' | 'biometric'>('register');
  const [qrScanSuccess, setQrScanSuccess] = useState(false);

  // Student/Parent Leave Request state
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState('Sick Leave / Health');
  const [leaveNotes, setLeaveNotes] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const handleQuickMark = (studentId: string, studentName: string, status: 'Present' | 'Absent' | 'Late') => {
    markAttendance({
      date: selectedDate,
      studentId,
      studentName,
      classBatch: selectedBatch,
      status,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: 'Manual',
    });
  };

  const handleSimulateQr = () => {
    const randomStudent = students[0];
    markAttendance({
      date: new Date().toISOString().split('T')[0],
      studentId: randomStudent.id,
      studentName: randomStudent.name,
      classBatch: randomStudent.classBatch,
      status: 'Present',
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: 'QR Code',
    });
    setQrScanSuccess(true);
    setTimeout(() => setQrScanSuccess(false), 3000);
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSubmitted(true);
    setLeaveNotes('');
    setTimeout(() => setLeaveSubmitted(false), 4000);
  };

  // -------------------------------------------------------------
  // 1. STUDENT & PARENT PERSONAL ATTENDANCE VIEW (Restricted to Child Record)
  // -------------------------------------------------------------
  if (isPersonalScope) {
    const student = myStudent || students[0];
    const myAttendanceRecords = attendance.filter((a) => a.studentId === student.id || a.studentName === student.name);

    const subjectBreakdown = [
      { subject: 'Data Structures & Algorithms', conducted: 25, attended: 24, pct: 96 },
      { subject: 'Operating Systems & Kernel', conducted: 24, attended: 22, pct: 91.6 },
      { subject: 'Computer Networks & Security', conducted: 20, attended: 19, pct: 95 },
      { subject: 'Database Management Systems', conducted: 20, attended: 18, pct: 90 },
    ];

    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-500/30 glass-panel shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-400" /> {currentRole === 'Parent' ? "My Child's Attendance Record" : "My Attendance Record"}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> {currentRole === 'Parent' ? `Scoped to ${student.name}'s Attendance` : "Scoped to Your Attendance History Only"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentRole === 'Parent' ? `${student.name}'s Attendance Log & Presence` : "Attendance Log & Presence Summary"}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Track your daily lecture presence, subject-wise attendance percentage, exam eligibility threshold, and submit absence leave requests.
              </p>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Attendance</span>
              <span className="text-2xl font-black text-emerald-400">{student.attendancePct || 94.5}%</span>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">{student.attendancePct || 94.5}%</p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ High Regularity</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lectures Present</span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">83 / 89</p>
            <p className="text-[11px] text-blue-400 font-semibold mt-1">Sessions Attended</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exam Eligibility</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">Eligible</p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ Exceeds 75% Requirement</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leaves Approved</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">2 Days</p>
            <p className="text-[11px] text-slate-400 mt-1">Approved Medical Leave</p>
          </div>
        </div>

        {/* Subject Breakdown & Leave Application Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject-Wise Breakdown Table */}
          <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center justify-between">
              <span>Subject-Wise Attendance Ratio</span>
              <BookOpen className="h-4 w-4 text-emerald-400" />
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Subject</th>
                    <th className="p-3 text-center">Conducted</th>
                    <th className="p-3 text-center">Attended</th>
                    <th className="p-3 text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subjectBreakdown.map((sb, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-bold text-white">{sb.subject}</td>
                      <td className="p-3 text-center text-slate-400">{sb.conducted}</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">{sb.attended}</td>
                      <td className="p-3 text-right font-black text-emerald-400">{sb.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Attendance Log Entries */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs">Recent Daily Verification Logs</h4>
              <div className="space-y-2">
                {myAttendanceRecords.length > 0 ? (
                  myAttendanceRecords.map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{r.date}</span>
                        <span className="text-[11px] text-slate-400 block">Method: {r.method}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {r.status}
                        </span>
                        {r.timeIn && <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{r.timeIn}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">2026-08-01 (Today)</span>
                      <span className="text-[11px] text-slate-400 block">Method: Biometric Terminal</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      PRESENT ✓
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Absence Leave Application */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center justify-between">
              <span>Apply for Absence Leave</span>
              <FileText className="h-5 w-5 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">Request formal leave approval from class coordinator.</p>

            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Leave Date</label>
                <input
                  type="date"
                  required
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Reason Category</label>
                <select
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Sick Leave / Health">Sick Leave / Health</option>
                  <option value="Family Function">Family Function</option>
                  <option value="Competitive Exam">Competitive Exam</option>
                  <option value="Other Personal">Other Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Details & Remarks</label>
                <textarea
                  rows={3}
                  value={leaveNotes}
                  onChange={(e) => setLeaveNotes(e.target.value)}
                  placeholder="Provide brief details for your leave request..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {leaveSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                  ✓ Leave Request Submitted to Class Coordinator!
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" /> Submit Leave Application
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ADMIN & FACULTY ATTENDANCE MANAGEMENT SUITE
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Admin & Faculty Scoped View
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Attendance Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Student & Faculty register, QR Code scanner simulator, biometric device logs, and attendance analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('qrcode')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-500/20"
          >
            <QrCode className="h-4 w-4" /> Scan Student QR
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
        {[
          { id: 'register', label: 'Daily Register' },
          { id: 'qrcode', label: 'QR Scanner Simulator' },
          { id: 'biometric', label: 'Biometric Hardware Sync' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'register' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl glass-panel border border-slate-800 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-bold text-slate-300">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-bold text-slate-300">Select Class:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
              >
                <option value="B.Tech CS - Sem 4">B.Tech CS - Sem 4</option>
                <option value="B.Tech ECE - Sem 4">B.Tech ECE - Sem 4</option>
                <option value="MBA - Sem 2">MBA - Sem 2</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Roll Number</th>
                  <th className="p-3.5">Attendance Rate</th>
                  <th className="p-3.5 text-right">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <img src={s.avatar} alt={s.name} className="h-7 w-7 rounded-full object-cover" />
                      <span>{s.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{s.rollNo}</td>
                    <td className="p-3.5 font-bold text-emerald-400">{s.attendancePct}%</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickMark(s.id, s.name, 'Present')}
                          className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold transition text-[11px]"
                        >
                          Present ✓
                        </button>
                        <button
                          onClick={() => handleQuickMark(s.id, s.name, 'Absent')}
                          className="px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold transition text-[11px]"
                        >
                          Absent ✗
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'qrcode' && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 max-w-md mx-auto text-center space-y-4">
          <QrCode className="h-16 w-16 text-emerald-400 mx-auto animate-pulse" />
          <h3 className="text-base font-extrabold text-white">QR Code Contactless Attendance</h3>
          <p className="text-xs text-slate-400">
            Students scan their ID card QR code at the campus entrance terminal or teacher mobile app.
          </p>

          <button
            onClick={handleSimulateQr}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            Simulate QR Scanner Tap
          </button>

          {qrScanSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
              ✓ Attendance Logged: Aarav Sharma (2026-CS-001) Marked Present!
            </div>
          )}
        </div>
      )}

      {activeTab === 'biometric' && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 max-w-md mx-auto text-center space-y-4">
          <Fingerprint className="h-16 w-16 text-blue-400 mx-auto" />
          <h3 className="text-base font-extrabold text-white">Biometric Device Hardware Sync</h3>
          <p className="text-xs text-slate-400">
            Connected to ZKTeco / Essl Biometric Devices on Gate 1 & Gate 2. Auto-syncing logs.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono">
            ● Status: Hardware Connected (Ping: 14ms)
          </div>
        </div>
      )}
    </div>
  );
}
