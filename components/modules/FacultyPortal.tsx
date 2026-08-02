'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { UserProfileModal } from '@/components/layout/UserProfileModal';
import {
  Briefcase,
  CheckCircle2,
  Upload,
  Award,
  Calendar,
  FileText,
  User,
  Users,
  Star,
  Video,
  Plus,
  BookOpen,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Clock,
  MapPin,
  Check,
  X,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Edit3,
} from 'lucide-react';

export function FacultyPortal() {
  const {
    authUser,
    currentRole,
    teachers,
    timetable,
    lmsMaterials,
    exams,
    students,
    markAttendance,
    addLmsMaterial,
    updateExamStudentResult,
    setActiveModule,
  } = useIMS();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'timetable' | 'lms' | 'gradebook' | 'roster'>('timetable');
  const [selectedDay, setSelectedDay] = useState<string>('All');

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: 'Data Structures',
    classBatch: 'B.Tech CS - Year 2',
    type: 'PDF Notes' as 'Video' | 'PDF Notes' | 'Assignment' | 'Quiz',
    url: '',
    durationOrPages: '15 Pages',
  });

  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [marksInput, setMarksInput] = useState<{ [studentId: string]: { marksObtained: number; grade: string } }>({});

  const [attendanceSuccessMsg, setAttendanceSuccessMsg] = useState<string | null>(null);

  // Allow admins/staff to switch teachers for demo/inspection purposes
  const canSwitchTeacher = ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Branch Head'].includes(currentRole);

  // Dynamic Teacher resolution logic based on logged-in user session
  let activeTeacher: typeof teachers[0];

  if (selectedTeacherId) {
    activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
  } else {
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
        subjectSpecialization: ['Data Structures', 'Machine Learning', 'Artificial Intelligence', 'Web Development'],
        branch: authUser?.branch || 'Main Campus - New Delhi',
        salary: 145000,
        status: 'Active',
        attendancePct: 98.0,
        rating: 4.9,
        joiningDate: '2019-03-15',
        avatar: authUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
      };
    } else {
      activeTeacher = teachers[0];
    }
  }

  // Display Avatar prioritizing logged-in authUser profile picture if user is a Teacher
  const displayAvatar =
    authUser?.role === 'Teacher' && (!selectedTeacherId || selectedTeacherId === activeTeacher.id || selectedTeacherId === authUser?.id) && authUser?.avatar
      ? authUser.avatar
      : activeTeacher.avatar;

  // Filtered timetable for this teacher
  const teacherTimetable = timetable.filter((slot) => {
    const isTeacherMatch = slot.teacher.toLowerCase().includes(activeTeacher.name.toLowerCase()) ||
      activeTeacher.name.toLowerCase().includes(slot.teacher.toLowerCase());
    const isSubjectMatch = activeTeacher.subjectSpecialization.some(
      (sub) => slot.subject.toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes(slot.subject.toLowerCase())
    );
    const matchesDay = selectedDay === 'All' || slot.day === selectedDay;

    return (isTeacherMatch || isSubjectMatch) && matchesDay;
  });

  // Filtered LMS materials for this teacher
  const teacherMaterials = lmsMaterials.filter((m) => {
    return (
      m.author.toLowerCase().includes(activeTeacher.name.toLowerCase()) ||
      activeTeacher.subjectSpecialization.some((s) => m.subject.toLowerCase().includes(s.toLowerCase()))
    );
  });

  // Filtered Exams for teacher's subjects
  const teacherExams = exams.filter((ex) =>
    activeTeacher.subjectSpecialization.some(
      (sub) => ex.subject.toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes(ex.subject.toLowerCase())
    )
  );

  // Roster students in batches taught by teacher (default to CS Year 2 / main batch)
  const rosterStudents = students.filter((s) => s.branch === activeTeacher.branch);

  const handleUploadMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.title.trim()) return;

    addLmsMaterial({
      subject: newMaterial.subject,
      classBatch: newMaterial.classBatch,
      title: newMaterial.title,
      type: newMaterial.type,
      author: activeTeacher.name,
      date: new Date().toISOString().split('T')[0],
      url: newMaterial.url || 'https://www.w3schools.com/html/mov_bbb.mp4',
      durationOrPages: newMaterial.durationOrPages || '10 Pages',
    });

    setIsUploadModalOpen(false);
    setNewMaterial({
      title: '',
      subject: activeTeacher.subjectSpecialization[0] || 'Data Structures',
      classBatch: 'B.Tech CS - Year 2',
      type: 'PDF Notes',
      url: '',
      durationOrPages: '15 Pages',
    });
  };

  const handleQuickMarkAttendance = (studentId: string, studentName: string, classBatch: string, status: 'Present' | 'Absent' | 'Late') => {
    markAttendance({
      date: new Date().toISOString().split('T')[0],
      studentId,
      studentName,
      classBatch,
      status,
      timeIn: status === 'Present' ? '09:00 AM' : undefined,
      method: 'Manual',
    });

    setAttendanceSuccessMsg(`Marked ${studentName} as ${status}`);
    setTimeout(() => setAttendanceSuccessMsg(null), 3000);
  };

  const handleSaveExamMarks = (examId: string) => {
    Object.entries(marksInput).forEach(([studentId, data]) => {
      updateExamStudentResult(examId, studentId, {
        marksObtained: Number(data.marksObtained),
        grade: data.grade || 'A',
      });
    });
    setIsMarksModalOpen(false);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Admin / Switcher Banner Notice */}
      {canSwitchTeacher && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold min-w-0">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="leading-snug">Admin View Active: Select any faculty member to inspect their portal:</span>
          </div>
          <select
            value={selectedTeacherId || activeTeacher.id}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-indigo-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-bold truncate"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.department} - {t.empId})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Hero Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 border border-indigo-500/30 glass-panel-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 z-10">
          <div className="relative">
            <img
              src={displayAvatar}
              alt={activeTeacher.name}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-xl"
            />
            <span
              className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-md ${
                activeTeacher.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            >
              {activeTeacher.status}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Faculty Workspace
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                EMP ID: {activeTeacher.empId}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{activeTeacher.name}</h2>
            <p className="text-xs text-slate-300 font-medium">
              {activeTeacher.designation} • <span className="text-indigo-300">{activeTeacher.department}</span>
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
              <span>{activeTeacher.branch}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {activeTeacher.rating} Rating
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Header Buttons */}
        <div className="flex items-center gap-2.5 z-10 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs border border-purple-500/40 shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Edit3 className="h-4 w-4 text-purple-400" /> Edit Profile
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
          >
            <Upload className="h-4 w-4" /> Upload LMS Material
          </button>
          <button
            onClick={() => setActiveModule('attendance')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 className="h-4 w-4" /> Mark Class Attendance
          </button>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Success Notification Alert */}
      {attendanceSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{attendanceSuccessMsg}</span>
        </div>
      )}

      {/* Dynamic Key Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 hover:border-indigo-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
            Weekly Lectures <Calendar className="h-4 w-4 text-indigo-400" />
          </span>
          <p className="text-2xl font-black text-white">{teacherTimetable.length}</p>
          <p className="text-[10px] text-slate-400">Assigned Timetable Slots</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 hover:border-purple-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
            Faculty Attendance <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </span>
          <p className="text-2xl font-black text-emerald-400">{activeTeacher.attendancePct}%</p>
          <p className="text-[10px] text-slate-400">Regularity & Punctuality</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 hover:border-amber-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
            Student Rating <Star className="h-4 w-4 text-amber-400" />
          </span>
          <p className="text-2xl font-black text-amber-300">{activeTeacher.rating} / 5.0</p>
          <p className="text-[10px] text-slate-400">Based on Student Feedback</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 hover:border-blue-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
            LMS Uploads <Upload className="h-4 w-4 text-blue-400" />
          </span>
          <p className="text-2xl font-black text-blue-400">{teacherMaterials.length}</p>
          <p className="text-[10px] text-slate-400">Notes, Videos & Quizzes</p>
        </div>
      </div>

      {/* Specialization Chips */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-indigo-400" /> Subject Specializations:
        </span>
        <div className="flex items-center gap-2">
          {activeTeacher.subjectSpecialization.map((spec) => (
            <span
              key={spec}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'timetable', label: '📅 My Lecture Timetable', count: teacherTimetable.length },
          { id: 'lms', label: '📚 LMS Materials & Notes', count: teacherMaterials.length },
          { id: 'gradebook', label: '🎯 Exam Marks & Gradebook', count: teacherExams.length },
          { id: 'roster', label: '👥 Class Roster & Attendance', count: rosterStudents.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/60 text-slate-300 font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: LECTURE TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" /> Weekly Lecture Schedule
            </h3>

            {/* Day Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    selectedDay === day ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {teacherTimetable.length === 0 ? (
            <div className="p-8 rounded-2xl glass-panel text-center text-slate-400 space-y-2 border border-slate-800">
              <Calendar className="h-8 w-8 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">No timetable slots found for the selected day filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacherTimetable.map((slot) => (
                <div
                  key={slot.id}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {slot.day}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        slot.type === 'Lab'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {slot.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-white text-base">{slot.subject}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Batch: {slot.classBatch}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" /> {slot.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-400" /> {slot.room}
                    </span>
                  </div>

                  {slot.meetingLink && (
                    <a
                      href={slot.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/30 transition flex items-center justify-center gap-1.5"
                    >
                      <Video className="h-3.5 w-3.5 text-indigo-400" /> Launch Virtual Classroom Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LMS MATERIALS & NOTES */}
      {activeTab === 'lms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Upload className="h-4 w-4 text-indigo-400" /> Uploaded LMS Course Materials
            </h3>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Upload Material
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherMaterials.map((mat) => (
              <div key={mat.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {mat.type}
                  </span>
                  <span className="text-[10px] text-slate-400">{mat.date}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-sm">{mat.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Subject: {mat.subject} • Batch: {mat.classBatch}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Author: {mat.author}</span>
                  {mat.durationOrPages && <span className="font-mono text-indigo-300">{mat.durationOrPages}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GRADEBOOK & EXAM MARKS */}
      {activeTab === 'gradebook' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" /> Exam Marks & Gradebook Entry
            </h3>
            <button
              onClick={() => setActiveModule('exams')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
            >
              Open Full Exam Module <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {teacherExams.map((exam) => (
              <div key={exam.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {exam.subject}
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-1">{exam.examName}</h4>
                    <p className="text-xs text-slate-400">
                      Batch: {exam.batch} • Total Marks: {exam.totalMarks} • Passing: {exam.passingMarks}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      const initialInput: any = {};
                      exam.results.forEach((r) => {
                        initialInput[r.studentId] = { marksObtained: r.marksObtained, grade: r.grade };
                      });
                      setMarksInput(initialInput);
                      setIsMarksModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Input & Edit Student Marks
                  </button>
                </div>

                {/* Results Preview Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-2.5">Roll No</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5">Marks Obtained</th>
                        <th className="p-2.5">Grade</th>
                        <th className="p-2.5">Batch Rank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {exam.results.map((res) => (
                        <tr key={res.studentId} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-mono text-indigo-300">{res.rollNo}</td>
                          <td className="p-2.5 font-bold">{res.studentName}</td>
                          <td className="p-2.5 font-extrabold text-white">
                            {res.marksObtained} / {exam.totalMarks}
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                              {res.grade}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-400">Rank #{res.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CLASS ROSTER & QUICK ATTENDANCE */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" /> Enrolled Class Roster & Attendance
            </h3>
            <span className="text-xs text-slate-400">Showing {rosterStudents.length} Students in Department</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rosterStudents.map((stu) => (
              <div key={stu.id} className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={stu.avatar} alt={stu.name} className="h-12 w-12 rounded-full object-cover border border-slate-700" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{stu.name}</h4>
                    <p className="text-xs text-slate-400">{stu.rollNo} • {stu.classBatch}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                      <span className="text-emerald-400 font-bold">Attn: {stu.attendancePct}%</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-300 font-bold">GPA: {stu.gpa}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuickMarkAttendance(stu.id, stu.name, stu.classBatch, 'Present')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-[11px] transition"
                    title="Mark Present"
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleQuickMarkAttendance(stu.id, stu.name, stu.classBatch, 'Absent')}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition"
                    title="Mark Absent"
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: UPLOAD STUDY MATERIAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel-glow border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Upload className="h-4 w-4 text-indigo-400" /> Upload LMS Study Material
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadMaterialSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title / Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Graph Algorithms & Dijkstra"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newMaterial.subject}
                    onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Class Batch</label>
                  <input
                    type="text"
                    required
                    value={newMaterial.classBatch}
                    onChange={(e) => setNewMaterial({ ...newMaterial, classBatch: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Material Type</label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="Video">Video Recording</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration / Pages</label>
                  <input
                    type="text"
                    placeholder="e.g. 24 Pages or 45 mins"
                    value={newMaterial.durationOrPages}
                    onChange={(e) => setNewMaterial({ ...newMaterial, durationOrPages: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">File / Video URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newMaterial.url}
                  onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-600/30 hover:from-blue-500 hover:to-indigo-500 transition"
              >
                Upload & Share with Class
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INPUT & EDIT EXAM MARKS */}
      {isMarksModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel-glow border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-amber-400" /> Gradebook Marks Entry
              </h3>
              <button onClick={() => setIsMarksModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {rosterStudents.map((stu) => {
                const currentData = marksInput[stu.id] || { marksObtained: 85, grade: 'A' };
                return (
                  <div key={stu.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-white">{stu.name}</p>
                      <p className="text-[10px] text-slate-400">{stu.rollNo}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentData.marksObtained}
                        onChange={(e) =>
                          setMarksInput({
                            ...marksInput,
                            [stu.id]: { ...currentData, marksObtained: Number(e.target.value) },
                          })
                        }
                        className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-center font-bold"
                      />
                      <input
                        type="text"
                        value={currentData.grade}
                        onChange={(e) =>
                          setMarksInput({
                            ...marksInput,
                            [stu.id]: { ...currentData, grade: e.target.value.toUpperCase() },
                          })
                        }
                        className="w-12 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-center font-bold"
                      />
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => handleSaveExamMarks(selectedExamId)}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold shadow-lg shadow-amber-600/30 transition"
              >
                Save & Update Gradebook Marks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
