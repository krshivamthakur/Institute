'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Home, Users, UserPlus, AlertCircle, Plus, CheckCircle2, X, Wrench } from 'lucide-react';

export function HostelManagement() {
  const { hostelRooms, allocateHostelBed, students, addAuditLog } = useIMS();

  const [complaints, setComplaints] = useState([
    { id: 'CMP-101', room: 'Block A - 101', issue: 'AC cooling issue in Room 101', status: 'In Progress' },
    { id: 'CMP-102', room: 'Block B - 201', issue: 'Wi-Fi router power reset required', status: 'Resolved' },
  ]);

  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Allocation Form State
  const [allocation, setAllocation] = useState({
    studentName: students[0]?.name || 'Aarav Sharma',
    block: 'Block A',
    roomNo: '101',
    bedNo: 'A2',
  });

  // Complaint Form State
  const [newComplaint, setNewComplaint] = useState({
    room: 'Block A - 101',
    issue: 'Water heater maintenance required',
  });

  const handleResolveComplaint = (id: string) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Resolved' } : c)));
    setNotification('Maintenance complaint marked as Resolved!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      room: newComplaint.room,
      issue: newComplaint.issue,
      status: 'In Progress',
    };
    setComplaints((prev) => [created, ...prev]);
    setIsComplaintModalOpen(false);
    addAuditLog('HOSTEL_COMPLAINT', `Logged complaint for ${newComplaint.room}`);
    setNotification('Maintenance complaint ticket logged successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAllocateBed = (e: React.FormEvent) => {
    e.preventDefault();
    allocateHostelBed(allocation.block, allocation.roomNo, allocation.bedNo, allocation.studentName);
    setIsAllocateModalOpen(false);
    setNotification(`Bed ${allocation.bedNo} allocated to ${allocation.studentName}!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Home className="h-5 w-5 text-amber-400" /> Hostel & Residence Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Room allocation matrix, hostel fee tracking, visitor log desk, and student complaint ticketing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComplaintModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <Wrench className="h-4 w-4 text-amber-400" /> Report Issue
          </button>
          <button
            onClick={() => setIsAllocateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/30"
          >
            <Plus className="h-4 w-4" /> Allocate Room Bed
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Hostel Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hostelRooms.map((r) => (
          <div key={r.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-base">{r.block} - Room {r.roomNo}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${r.status === 'Full' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {r.status} ({r.occupied}/{r.capacity})
              </span>
            </div>

            <div className="space-y-1 text-xs">
              {r.occupants.map((occ) => (
                <div key={occ.bedNo} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-200 font-bold">{occ.name}</span>
                  <span className="text-amber-400 font-mono">Bed {occ.bedNo}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 font-mono">Fee: ₹{r.feePerTerm.toLocaleString()} / Term</p>
          </div>
        ))}
      </div>

      {/* Complaints */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400" /> Student Maintenance Complaints
          </h3>
          <button
            onClick={() => setIsComplaintModalOpen(true)}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            + New Ticket
          </button>
        </div>

        <div className="space-y-2">
          {complaints.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{c.room}: </span>
                <span className="text-slate-300">{c.issue}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {c.status}
                </span>
                {c.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolveComplaint(c.id)}
                    className="px-2 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-[10px] transition"
                  >
                    Mark Resolved ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocate Room Modal */}
      {isAllocateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Allocate Hostel Bed</h3>
              <button onClick={() => setIsAllocateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAllocateBed} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Student</label>
                <select
                  value={allocation.studentName}
                  onChange={(e) => setAllocation({ ...allocation, studentName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Hostel Block</label>
                  <select
                    value={allocation.block}
                    onChange={(e) => setAllocation({ ...allocation, block: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Block A">Block A (Boys)</option>
                    <option value="Block B">Block B (Girls)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={allocation.roomNo}
                    onChange={(e) => setAllocation({ ...allocation, roomNo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Bed Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bed A1 or Bed B2"
                  value={allocation.bedNo}
                  onChange={(e) => setAllocation({ ...allocation, bedNo: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30"
                >
                  Confirm Bed Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Ticket Modal */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Log Hostel Maintenance Complaint</h3>
              <button onClick={() => setIsComplaintModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddComplaint} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Room / Block</label>
                <input
                  type="text"
                  required
                  value={newComplaint.room}
                  onChange={(e) => setNewComplaint({ ...newComplaint, room: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Issue Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe maintenance or repair required..."
                  value={newComplaint.issue}
                  onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
