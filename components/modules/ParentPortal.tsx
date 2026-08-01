'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { UserCheck, CheckCircle2, CreditCard, Award, BookOpen, MessageSquare, Send, Calendar, FileText, ChevronRight, CheckCircle } from 'lucide-react';

export function ParentPortal() {
  const { students, setActiveModule } = useIMS();
  const child = students[0]; // Aarav Sharma

  const [messageSent, setMessageSent] = useState(false);
  const [msgInput, setMsgInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setMessageSent(true);
    setMsgInput('');
    setTimeout(() => setMessageSent(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 glass-panel-glow flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={child.avatar} alt={child.name} className="h-16 w-16 rounded-full object-cover border-2 border-blue-400 shadow-xl" />
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Parent Scoped Dashboard
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">Child Academic Overview: {child.name}</h2>
            <p className="text-xs text-slate-300">Roll No: {child.rollNo} • Batch: {child.classBatch} • Section A</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('attendance')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/30 transition flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" /> View Attendance
          </button>
          <button
            onClick={() => setActiveModule('exam')}
            className="px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-xs border border-amber-500/30 transition flex items-center gap-1.5"
          >
            <Award className="h-4 w-4" /> View Marksheet & Exam
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveModule('attendance')}
          className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Child Attendance Percentage</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{child.attendancePct}%</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Punctual & Regular</span>
            <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-0.5">
              Open Log <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveModule('exam')}
          className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/50 transition cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Semester Gradebook / Marksheet</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-300">{child.gpa} / 4.0 GPA</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Rank #1 in B.Tech CS</span>
            <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-0.5">
              Open Marksheet <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveModule('fees')}
          className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/50 transition cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Fee Dues & Statements</span>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white">₹{child.feeDue.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="text-emerald-400 font-bold">Status: {child.feeStatus}</span>
            <span className="text-blue-400 font-bold group-hover:underline flex items-center gap-0.5">
              Receipts <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Direct Teacher Messaging */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-400" /> Direct Communication with Class Teacher (Dr. Meenakshi S.)
        </h3>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Type a message or inquiry to Dr. Meenakshi S..."
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1">
            <Send className="h-3.5 w-3.5" /> Send Message
          </button>
        </form>

        {messageSent && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" /> Message sent to Class Teacher Dr. Meenakshi S.!
          </div>
        )}
      </div>
    </div>
  );
}
