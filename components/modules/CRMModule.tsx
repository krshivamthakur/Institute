'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { LeadEnquiry } from '@/lib/ims-data';
import { PhoneCall, MessageSquare, Plus, CheckCircle, TrendingUp, X, CheckCircle2, Send, Edit2 } from 'lucide-react';

export function CRMModule() {
  const { currentRole, leads, courses, addLead, updateLead, addAuditLog } = useIMS();
  const canManageCRM = ['Super Admin', 'Director', 'Principal', 'Branch Head', 'Academic Coordinator', 'Teacher', 'Accountant', 'HR'].includes(currentRole);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<LeadEnquiry | null>(null);

  const [notification, setNotification] = useState('');

  // Add Lead Form State
  const [newLead, setNewLead] = useState({
    studentName: '',
    parentName: 'Guardian',
    phone: '',
    email: '',
    interestedCourse: 'B.Tech Computer Science',
    source: 'Walk-In' as const,
    status: 'New' as const,
    counsellor: 'Admission Desk',
    notes: '',
  });

  // Edit Lead Form State
  const [editLeadForm, setEditLeadForm] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    interestedCourse: '',
    status: 'New' as LeadEnquiry['status'],
    counsellor: '',
    notes: '',
  });

  const handleOpenAddModal = () => {
    setNewLead({
      studentName: '',
      parentName: 'Guardian',
      phone: '',
      email: '',
      interestedCourse: courses[0]?.title || 'B.Tech Computer Science',
      source: 'Walk-In',
      status: 'New',
      counsellor: 'Admission Desk',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (lead: LeadEnquiry) => {
    setSelectedLeadForEdit(lead);
    setEditLeadForm({
      studentName: lead.studentName,
      parentName: lead.parentName || 'Guardian',
      phone: lead.phone,
      email: lead.email,
      interestedCourse: lead.interestedCourse,
      status: lead.status,
      counsellor: lead.counsellor || 'Admission Desk',
      notes: lead.notes,
    });
    setIsEditModalOpen(true);
  };

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
      notes: newLead.notes || 'Walk-in candidate inquiry',
    });

    setIsAddModalOpen(false);
    setNewLead({
      studentName: '',
      parentName: 'Guardian',
      phone: '',
      email: '',
      interestedCourse: courses[0]?.title || 'B.Tech Computer Science',
      source: 'Walk-In',
      status: 'New',
      counsellor: 'Admission Desk',
      notes: '',
    });
    setNotification('New admission lead logged & SMS dispatched!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSaveEditLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForEdit || !canManageCRM) return;

    updateLead(selectedLeadForEdit.id, {
      studentName: editLeadForm.studentName,
      parentName: editLeadForm.parentName,
      phone: editLeadForm.phone,
      email: editLeadForm.email,
      interestedCourse: editLeadForm.interestedCourse,
      status: editLeadForm.status,
      counsellor: editLeadForm.counsellor,
      notes: editLeadForm.notes,
    });

    setIsEditModalOpen(false);
    setNotification(`Enquiry details for "${editLeadForm.studentName}" updated successfully!`);
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

        {canManageCRM && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="h-4 w-4" /> Log New Lead Enquiry
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leads.map((l) => (
          <div key={l.id} className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3 relative group">
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
                <PhoneCall className="h-3 w-3" /> Call
              </button>
              <button
                onClick={() => alert(`Sent WhatsApp info packet to ${l.studentName} (${l.phone})`)}
                className="flex-1 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[10px] transition flex items-center justify-center gap-1"
              >
                <MessageSquare className="h-3 w-3" /> WhatsApp
              </button>
              {canManageCRM && (
                <button
                  onClick={() => openEditModal(l)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-[10px] transition flex items-center gap-1"
                  title="Edit Lead Details"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              )}
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.code}
                      </option>
                    ))}
                    {!courses.some((c) => c.code === 'B.Tech CS') && <option value="B.Tech CS">B.Tech CS</option>}
                    {!courses.some((c) => c.code === 'B.Tech ECE') && <option value="B.Tech ECE">B.Tech ECE</option>}
                    {!courses.some((c) => c.code === 'MBA') && <option value="MBA">MBA</option>}
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

      {/* Edit Lead Details Modal */}
      {isEditModalOpen && selectedLeadForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-amber-400" /> Edit Admission Lead Enquiry
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={editLeadForm.studentName}
                  onChange={(e) => setEditLeadForm({ ...editLeadForm, studentName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editLeadForm.phone}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Interested Course</label>
                  <select
                    value={editLeadForm.interestedCourse}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, interestedCourse: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title} ({c.code})
                      </option>
                    ))}
                    {!courses.some((c) => c.title === editLeadForm.interestedCourse) && (
                      <option value={editLeadForm.interestedCourse}>{editLeadForm.interestedCourse}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Parent/Guardian Name</label>
                  <input
                    type="text"
                    value={editLeadForm.parentName}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, parentName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Pipeline Stage</label>
                  <select
                    value={editLeadForm.status}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, status: e.target.value as LeadEnquiry['status'] })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="New">New</option>
                    <option value="Counselled">Counselled</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Counsellor Notes</label>
                <textarea
                  rows={3}
                  value={editLeadForm.notes}
                  onChange={(e) => setEditLeadForm({ ...editLeadForm, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" /> Save Lead Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
