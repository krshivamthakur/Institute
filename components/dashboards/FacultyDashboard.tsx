'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { UserProfileModal } from '@/components/layout/UserProfileModal';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Video,
  Clock,
  Plus,
  FileText,
  Send,
  Users,
  Check,
  X,
  Edit3,
} from 'lucide-react';

export function FacultyDashboard() {
  const { authUser, teachers, timetable, students, lmsMaterials, markAttendance, addAuditLog, setActiveModule } = useIMS();
  const [selectedClass, setSelectedClass] = useState('B.Tech CS - Year 2');
  const [attendanceTaken, setAttendanceTaken] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Dynamic Teacher resolution logic based on logged-in user session
  let activeTeacher: typeof teachers[0];
  const matched = teachers.find(
    (t) =>
      t.id === authUser?.id ||
      t.empId === authUser?.empIdOrRollNo ||
      t.id === authUser?.empIdOrRollNo ||
      t.email.toLowerCase() === authUser?.email?.toLowerCase() ||
      t.name.toLowerCase().includes(authUser?.name?.toLowerCase() || '') ||
      (authUser?.name && authUser.name.toLowerCase().includes(t.name.toLowerCase()))
  );

  if (matched) {
    activeTeacher = matched;
  } else if (authUser?.role === 'Teacher') {
    activeTeacher = {
      id: authUser?.id || 'TCH-5010',
      empId: authUser?.empIdOrRollNo || 'TEH-001',
      name: authUser?.name || 'Sumit Saourav',
      email: authUser?.email || 'info@gyanvidyamandir.in',
      phone: '+91 98765 12345',
      department: 'Computer Science',
      designation: 'Professor & HOD',
      subjectSpecialization: ['Data Structures', 'Machine Learning', 'Artificial Intelligence', 'Software Engineering'],
      branch: authUser?.branch || 'Main Campus - New Delhi',
      salary: 150000,
      status: 'Active',
      attendancePct: 98.5,
      rating: 4.9,
      joiningDate: '2019-03-15',
      avatar: authUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    };
  } else {
    activeTeacher = teachers[0];
  }

  const handleQuickAttendance = () => {
    setAttendanceTaken(true);
    addAuditLog('ATTENDANCE_MARK', `Faculty marked attendance for ${selectedClass}`);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/80 to-slate-900 border border-purple-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={authUser?.avatar || activeTeacher.avatar}
              alt={activeTeacher.name}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-purple-400 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-purple-400" /> Faculty Workspace
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  EMP ID: {activeTeacher.empId}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome, {activeTeacher.name}!
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {activeTeacher.designation} • <span className="text-purple-300">{activeTeacher.department}</span> ({activeTeacher.branch})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs border border-purple-500/40 shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Edit3 className="h-4 w-4 text-purple-400" /> Edit Profile
            </button>
            <button
              onClick={() => setActiveModule('attendance')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Mark Class Attendance
            </button>
            <button
              onClick={() => setActiveModule('lms')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <Video className="h-4 w-4" /> Upload LMS Material
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Quick KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lectures Today</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">4 Slots</p>
          <p className="text-[11px] text-purple-400 font-semibold mt-1">2 Lectures, 2 Labs</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Students</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">145</p>
          <p className="text-[11px] text-slate-400 mt-1">Across 3 Batches</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class Attendance Avg</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">93.2%</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ High Engagement</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Grading</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">12 Papers</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">Mid-Term Evaluation</p>
        </div>
      </div>

      {/* Quick Attendance Widget & Today's Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Attendance Widget */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center justify-between">
            <span>Express Attendance Marker</span>
            <CheckCircle2 className="h-5 w-5 text-purple-400" />
          </h3>
          <p className="text-xs text-slate-400">Instantly mark attendance for your current session.</p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Select Class Batch</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option>B.Tech CS - Year 2</option>
                <option>B.Tech CS - Year 3</option>
                <option>BCA - Year 1</option>
              </select>
            </div>

            {attendanceTaken ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                ✓ Attendance submitted successfully for {selectedClass}!
              </div>
            ) : (
              <button
                onClick={handleQuickAttendance}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30"
              >
                Mark Attendance Now ({students.length} Students)
              </button>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base">My Teaching Schedule Today</h3>
            <span className="text-xs text-purple-400 font-bold">Monday Schedule</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timetable.slice(0, 4).map((slot) => (
              <div key={slot.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{slot.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {slot.type}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Batch: {slot.classBatch}</span>
                  <span className="font-mono text-purple-400 font-bold">{slot.time}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Room: {slot.room}</span>
                  <button
                    onClick={() => setActiveModule('lms')}
                    className="text-purple-400 font-bold hover:underline"
                  >
                    Open LMS →
                  </button>
                </div>
                {slot.meetingLink && (
                  <a
                    href={slot.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Video className="h-3.5 w-3.5 text-indigo-400" /> Launch Meeting Link
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
