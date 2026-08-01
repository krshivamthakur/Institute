'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  PhoneCall,
  UserPlus,
  Users,
  Calendar,
  CheckCircle2,
  Plus,
  Clock,
  Send,
} from 'lucide-react';

export function ReceptionistDashboard() {
  const { leads, addLead, setActiveModule } = useIMS();
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [interestedCourse, setInterestedCourse] = useState('B.Tech CS');
  const [added, setAdded] = useState(false);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone) return;
    addLead({
      studentName,
      parentName: 'Guardian',
      phone,
      email: `${studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      interestedCourse,
      source: 'Walk-In',
      status: 'New',
      counsellor: 'Reception Desk',
      date: new Date().toISOString().split('T')[0],
      notes: 'Logged at front desk',
    });
    setStudentName('');
    setPhone('');
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Receptionist Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5 text-cyan-400" /> Front Desk & Admissions CRM
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Visitor Gate Sync Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Reception Desk & Walk-In Admissions Hub
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Log new student admission inquiries, schedule counselling walk-ins, track phone leads, and issue gate passes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('crm')}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-600/30 flex items-center gap-2"
            >
              <PhoneCall className="h-4 w-4" /> Full CRM Pipeline
            </button>
            <button
              onClick={() => setActiveModule('admissions')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" /> New Admission Form
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads Logged</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <PhoneCall className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{leads.length}</p>
          <p className="text-[11px] text-cyan-400 font-semibold mt-1">Admission Enquiries</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Walk-Ins Today</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">14</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">Logged at Reception</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Counselled Leads</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">8</p>
          <p className="text-[11px] text-slate-400 mt-1">Ready for Admission</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointments Today</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">6 Slots</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">Principal & HOD Meetings</p>
        </div>
      </div>

      {/* Quick Lead Form & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center justify-between">
            <span>Quick Walk-In Logger</span>
            <UserPlus className="h-5 w-5 text-cyan-400" />
          </h3>
          <p className="text-xs text-slate-400">Record candidate inquiry details instantly.</p>

          <form onSubmit={handleAddLead} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Candidate Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Interested Course</label>
              <select
                value={interestedCourse}
                onChange={(e) => setInterestedCourse(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option>B.Tech CS</option>
                <option>BCA</option>
                <option>MBA</option>
                <option>BBA</option>
              </select>
            </div>

            {added ? (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold text-center">
                ✓ Lead Logged Successfully!
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-600/30"
              >
                Log Lead & Send SMS
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base">Recent Front Desk Enquiries</h3>
          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{lead.studentName}</h4>
                  <p className="text-[11px] text-slate-400">{lead.interestedCourse} • Source: {lead.source}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
