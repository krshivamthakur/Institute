'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { TimetableSlot } from '@/lib/ims-data';
import { Calendar, Clock, Video, MapPin, Plus, User, CheckCircle2, X, Trash2, Edit } from 'lucide-react';

export function ClassManagement() {
  const { timetable, addAuditLog, currentRole } = useIMS();
  const isReadOnlyRole = currentRole === 'Student' || currentRole === 'Parent';

  const [timetableState, setTimetableState] = useState<TimetableSlot[]>(timetable);
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form State
  const [newSlot, setNewSlot] = useState({
    subject: '',
    classBatch: 'B.Tech CS - Year 2',
    teacher: 'Prof. Rajesh Kumar',
    room: 'Hall 101',
    time: '09:00 AM - 10:00 AM',
    type: 'Lecture' as 'Lecture' | 'Lab' | 'Tutorial',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
  const filteredSlots = timetableState.filter((t) => t.day === selectedDay);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TimetableSlot = {
      id: `TS-${Math.floor(1000 + Math.random() * 9000)}`,
      day: selectedDay,
      subject: newSlot.subject,
      classBatch: newSlot.classBatch,
      teacher: newSlot.teacher,
      room: newSlot.room,
      time: newSlot.time,
      type: newSlot.type,
      meetingLink: newSlot.meetingLink,
    };
    setTimetableState((prev) => [...prev, created]);
    setIsAddModalOpen(false);
    setNewSlot({
      subject: '',
      classBatch: 'B.Tech CS - Year 2',
      teacher: 'Prof. Rajesh Kumar',
      room: 'Hall 101',
      time: '09:00 AM - 10:00 AM',
      type: 'Lecture',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
    });
    addAuditLog('TIMETABLE_ADD', `Added class period slot for ${newSlot.subject} on ${selectedDay}`);
    setNotification(`Successfully added new class slot for ${selectedDay}!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeleteSlot = (id: string) => {
    setTimetableState((prev) => prev.filter((t) => t.id !== id));
    setNotification('Class period slot removed from timetable.');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" /> Class Scheduling & Timetable
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Weekly timetable builder, classroom allocation matrix, and virtual class links (Zoom / Google Meet).
          </p>
        </div>

        {!isReadOnlyRole && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" /> Add Period Slot
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Day Selector */}
      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedDay === day ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.length === 0 ? (
          <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center col-span-3 text-slate-400 text-xs">
            No scheduled classes for {selectedDay}. {!isReadOnlyRole && 'Click "+ Add Period Slot" to allocate a period.'}
          </div>
        ) : (
          filteredSlots.map((slot) => (
            <div key={slot.id} className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {slot.time}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${slot.type === 'Lab' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {slot.type}
                  </span>
                  {!isReadOnlyRole && (
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="text-slate-500 hover:text-rose-400 transition opacity-0 group-hover:opacity-100"
                      title="Delete period slot"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base">{slot.subject}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{slot.classBatch}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="h-3.5 w-3.5 text-blue-400" />
                  <span>{slot.teacher}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-purple-400" />
                  <span>{slot.room}</span>
                </div>
              </div>

              {slot.meetingLink && (
                <a
                  href={slot.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Video className="h-4 w-4 text-blue-400" /> Join Live Virtual Class
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Schedule New Class Period ({selectedDay})</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & ML"
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Class Batch</label>
                  <select
                    value={newSlot.classBatch}
                    onChange={(e) => setNewSlot({ ...newSlot, classBatch: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="B.Tech CS - Year 2">B.Tech CS - Year 2</option>
                    <option value="B.Tech ECE - Year 2">B.Tech ECE - Year 2</option>
                    <option value="MBA - Year 1">MBA - Year 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Period Type</label>
                  <select
                    value={newSlot.type}
                    onChange={(e) => setNewSlot({ ...newSlot, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab Session</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Faculty Teacher</label>
                  <input
                    type="text"
                    required
                    value={newSlot.teacher}
                    onChange={(e) => setNewSlot({ ...newSlot, teacher: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Classroom / Room</label>
                  <input
                    type="text"
                    required
                    value={newSlot.room}
                    onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Time Slot</label>
                <input
                  type="text"
                  required
                  placeholder="09:00 AM - 10:00 AM"
                  value={newSlot.time}
                  onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
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
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Schedule Period Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
