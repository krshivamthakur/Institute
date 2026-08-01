'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { PhoneCall, MessageSquare, Plus, CheckCircle, TrendingUp, X, CheckCircle2, Send } from 'lucide-react';

export function CRMModule() {
  const { leads, addLead, addAuditLog } = useIMS();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form State
  const [newLead, setNewLead] = useState({
    studentName: '',
    parentName: 'Guardian',
    phone: '',
    email: '',
    interestedCourse: 'B.Tech CS',
    source: 'Walk-In' as const,
    status: 'New' as const,
    counsellor: 'Reception Counsel',
    notes: 'Walk-in candidate inquiry',
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      studentName: newLead.studentName,
      parentName: newLead.parentName,
      phone: newLead.phone,
      email: newLead.email || `${newLead.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      interestedCourse: newLead.interestedCourse,
      source: newLead.source,
      status: newLead.status,
      counsellor: newLead.counsellor,
      date: new Date().toISOString().split('T')[0],
      notes: newLead.notes,
    });

    setIsAddModalOpen(false);
    setNewLead({
      studentName: '',
      parentName: 'Guardian',
      phone: '',
      email: '',
      interestedCourse: 'B.Tech CS',
      source: 'Walk-In',
      status: 'New',
      counsellor: 'Reception Counsel',
      notes: 'Walk-in candidate inquiry',
    });
    setNotification('New admission lead logged & SMS dispatched!');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-emerald-400" /> CRM & Admission Lead Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track prospective student enquiries, call history logs, WhatsApp follow-ups, and conversion metrics.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" /> Log New Lead Enquiry
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leads.map((l) => (
          <div key={l.id} className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex justify-between font-bold text-white text-sm">
              <span>{l.studentName}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {l.status}
              </span>
            </div>
            <p className="text-xs text-slate-300">Course: <span className="font-bold text-white">{l.interestedCourse}</span></p>
            <p className="text-[11px] text-slate-400 font-mono">Phone: {l.phone}</p>
            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">"{l.notes}"</p>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
              <button
                onClick={() => alert(`Calling candidate ${l.studentName} at ${l.phone}...`)}
                className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-[10px] transition flex items-center justify-center gap-1"
              >
                <PhoneCall className="h-3 w-3" /> Call Candidate
              </button>
              <button
                onClick={() => alert(`Sent WhatsApp info packet to ${l.studentName} (${l.phone})`)}
                className="flex-1 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[10px] transition flex items-center justify-center gap-1"
              >
                <MessageSquare className="h-3 w-3" /> Send WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Log New Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Log Candidate Admission Enquiry</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={newLead.studentName}
                  onChange={(e) => setNewLead({ ...newLead, studentName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 00000"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Interested Course</label>
                  <select
                    value={newLead.interestedCourse}
                    onChange={(e) => setNewLead({ ...newLead, interestedCourse: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="B.Tech CS">B.Tech CS</option>
                    <option value="B.Tech ECE">B.Tech ECE</option>
                    <option value="MBA">MBA</option>
                    <option value="BCA">BCA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Counsellor Notes</label>
                <textarea
                  rows={3}
                  placeholder="Notes from initial counselling conversation..."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" /> Save Lead & Dispatch SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
