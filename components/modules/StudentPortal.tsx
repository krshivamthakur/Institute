'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { UserProfileModal } from '@/components/layout/UserProfileModal';
import {
  User,
  Calendar,
  CreditCard,
  Award,
  Download,
  Video,
  CheckCircle2,
  BookOpen,
  FileCheck,
  Home,
  Bus,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Phone,
  Mail,
  FileText,
  Printer,
  Sparkle,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function StudentPortal() {
  const {
    authUser,
    currentRole,
    students,
    feeTransactions,
    timetable,
    exams,
    lmsMaterials,
    certificates,
    hostelRooms,
    transportRoutes,
    addFeeTransaction,
    updateStudent,
    setActiveModule,
  } = useIMS();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'timetable' | 'exams' | 'lms' | 'fees' | 'certificates' | 'services'>('timetable');

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPayFeeModalOpen, setIsPayFeeModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'Online (Razorpay)' | 'UPI (PhonePe)' | 'Bank Transfer'>('Online (Razorpay)');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const [selectedCertModal, setSelectedCertModal] = useState<any | null>(null);

  // Can switch student for inspection/demo purposes
  const canSwitchStudent = ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Branch Head', 'Teacher', 'Parent'].includes(currentRole);

  // Dynamic Student resolution logic based on logged-in user session
  let activeStudent: typeof students[0];

  if (selectedStudentId) {
    activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  } else {
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
      activeStudent = matched;
    } else if (authUser?.role === 'Student') {
      activeStudent = {
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
      activeStudent = students[0];
    }
  }

  // Display Avatar prioritizing logged-in authUser profile picture if user is a Student
  const displayAvatar =
    authUser?.role === 'Student' && (!selectedStudentId || selectedStudentId === activeStudent.id || selectedStudentId === authUser?.id) && authUser?.avatar
      ? authUser.avatar
      : activeStudent.avatar;

  // Filtered Timetable for student's class batch
  const studentTimetable = timetable.filter((slot) => {
    return (
      slot.classBatch.toLowerCase().includes(activeStudent.classBatch.toLowerCase()) ||
      activeStudent.classBatch.toLowerCase().includes(slot.classBatch.toLowerCase()) ||
      slot.classBatch.toLowerCase().includes('year 2') ||
      slot.classBatch.toLowerCase().includes('sem 4')
    );
  });

  // Filtered Exam Results for this student
  const studentExams = exams.map((exam) => {
    const studentResult = exam.results.find(
      (r) =>
        r.studentId === activeStudent.id ||
        r.rollNo === activeStudent.rollNo ||
        r.studentName.toLowerCase() === activeStudent.name.toLowerCase()
    );
    return {
      exam,
      result: studentResult,
    };
  }).filter((item) => item.result || item.exam.batch.toLowerCase().includes(activeStudent.classBatch.toLowerCase()));

  // Filtered LMS materials for student batch
  const studentMaterials = lmsMaterials.filter((m) => {
    return (
      m.classBatch.toLowerCase().includes(activeStudent.classBatch.toLowerCase()) ||
      activeStudent.classBatch.toLowerCase().includes(m.classBatch.toLowerCase()) ||
      m.classBatch.includes('Year 2')
    );
  });

  // Filtered Fee Transactions for student
  const studentFeeTransactions = feeTransactions.filter(
    (tx) =>
      tx.studentId === activeStudent.id ||
      tx.rollNo === activeStudent.rollNo ||
      tx.studentName.toLowerCase().includes(activeStudent.name.toLowerCase())
  );

  // Filtered Certificates for student
  const studentCertificates = certificates.filter(
    (c) =>
      c.studentId === activeStudent.id ||
      c.studentName.toLowerCase().includes(activeStudent.name.toLowerCase())
  );

  // Hostel & Transport Info
  const hostelInfo = hostelRooms.find((room) =>
    room.occupants.some((occ) => occ.studentId === activeStudent.id || occ.name.toLowerCase() === activeStudent.name.toLowerCase())
  );

  const transportInfo = transportRoutes[0]; // Primary campus route

  const handlePayFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    setIsProcessingPayment(true);

    setTimeout(() => {
      const newTxnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;

      addFeeTransaction({
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        rollNo: activeStudent.rollNo,
        classBatch: activeStudent.classBatch,
        amount: payAmount,
        feeType: 'Tuition Fee',
        paymentMode,
        transactionId: newTxnId,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        receiptUrl: '#',
      });

      const newDue = Math.max(0, activeStudent.feeDue - payAmount);
      updateStudent(activeStudent.id, {
        feeDue: newDue,
        feeStatus: newDue === 0 ? 'Paid' : 'Partial',
      });

      setIsProcessingPayment(false);
      setIsPayFeeModalOpen(false);
      setPaymentSuccessMsg(`Payment of ₹${payAmount.toLocaleString()} successful! Transaction ID: ${newTxnId}`);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => setPaymentSuccessMsg(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Admin / Switcher Banner Notice */}
      {canSwitchStudent && (
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-300 font-semibold min-w-0">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="leading-snug">Multi-Account Switcher: Select any student to preview their personal portal:</span>
          </div>
          <select
            value={selectedStudentId || activeStudent.id}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold truncate"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo} - {s.classBatch})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Hero Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/80 via-slate-900 to-indigo-900/80 border border-purple-500/30 glass-panel-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 z-10">
          <div className="relative">
            <img
              src={displayAvatar}
              alt={activeStudent.name}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-purple-400 shadow-xl"
            />
            <span
              className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-md ${
                activeStudent.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              {activeStudent.status}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Student Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Roll No: {activeStudent.rollNo}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{activeStudent.name}</h2>
            <p className="text-xs text-slate-300 font-medium">
              {activeStudent.classBatch} • <span className="text-purple-300">{activeStudent.branch}</span>
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
              <span>Parent: {activeStudent.parentName}</span>
              <span>•</span>
              <span className="text-slate-300">{activeStudent.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Header Buttons */}
        <div className="flex items-center gap-2.5 z-10 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs border border-purple-500/40 shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Edit3 className="h-4 w-4 text-purple-400" /> Edit Profile
          </button>
          <button
            onClick={() => {
              setPayAmount(activeStudent.feeDue || 25000);
              setIsPayFeeModalOpen(true);
            }}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
          >
            <CreditCard className="h-4 w-4" /> Pay Dues Online
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition"
          >
            <Download className="h-4 w-4" /> View Certificates
          </button>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Success Notification Alert */}
      {paymentSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{paymentSuccessMsg}</span>
        </div>
      )}

      {/* Dynamic Key Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 hover:border-emerald-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
            Attendance Rate <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </span>
          <p className="text-2xl font-black text-emerald-400">{activeStudent.attendancePct}%</p>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full ${
                activeStudent.attendancePct >= 85 ? 'bg-emerald-500' : activeStudent.attendancePct >= 75 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, activeStudent.attendancePct)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 hover:border-amber-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
            Current CGPA <Award className="h-4 w-4 text-amber-400" />
          </span>
          <p className="text-2xl font-black text-amber-300">{activeStudent.gpa} / 4.0</p>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300">
            Batch Rank #1
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 hover:border-purple-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
            Fee Dues Status <CreditCard className="h-4 w-4 text-purple-400" />
          </span>
          <p className="text-2xl font-black text-white">₹{activeStudent.feeDue.toLocaleString()}</p>
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
              activeStudent.feeStatus === 'Paid'
                ? 'bg-emerald-500/20 text-emerald-300'
                : activeStudent.feeStatus === 'Partial'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-rose-500/20 text-rose-300'
            }`}
          >
            {activeStudent.feeStatus}
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 hover:border-blue-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
            Certificates <FileCheck className="h-4 w-4 text-blue-400" />
          </span>
          <p className="text-2xl font-black text-blue-400">{studentCertificates.length}</p>
          <p className="text-[10px] text-slate-400">Issued & Verified Credentials</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'timetable', label: '📅 My Timetable', count: studentTimetable.length },
          { id: 'exams', label: '📊 Exam Grades & Marksheet', count: studentExams.length },
          { id: 'lms', label: '📖 LMS Study Notes & Videos', count: studentMaterials.length },
          { id: 'fees', label: '💳 Fee History & Payment', count: studentFeeTransactions.length },
          { id: 'certificates', label: '📜 Official Certificates', count: studentCertificates.length },
          { id: 'services', label: '🏡 Hostel & Transport', count: 2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
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

      {/* TAB 1: MY TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" /> Class Lecture & Lab Schedule
            </h3>
            <span className="text-xs text-slate-400">Batch: {activeStudent.classBatch}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentTimetable.map((slot) => (
              <div key={slot.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {slot.day}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {slot.type}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-base">{slot.subject}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Faculty: {slot.teacher}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-purple-400" /> {slot.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" /> {slot.room}
                  </span>
                </div>

                {slot.meetingLink && (
                  <a
                    href={slot.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs border border-purple-500/30 transition flex items-center justify-center gap-1.5"
                  >
                    <Video className="h-3.5 w-3.5 text-purple-400" /> Join Live Online Class
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EXAMS & MARKSHEET */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" /> Exam Marksheet & Score Card
            </h3>
            <button
              onClick={() => setActiveModule('exams')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
            >
              Full Gradebook <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {studentExams.map(({ exam, result }) => (
              <div key={exam.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {exam.subject}
                    </span>
                    <h4 className="text-lg font-black text-white mt-1">{exam.examName}</h4>
                    <p className="text-xs text-slate-400">Date: {exam.date} • Batch: {exam.batch}</p>
                  </div>

                  {result && (
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">
                        {result.marksObtained} / {exam.totalMarks}
                      </span>
                      <p className="text-xs text-amber-300 font-bold">Grade: {result.grade} (Rank #{result.rank})</p>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>Passing Score: {exam.passingMarks} Marks</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" /> Result Verified & Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LMS STUDY MATERIALS */}
      {activeTab === 'lms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" /> LMS Course Study Materials
            </h3>
            <span className="text-xs text-slate-400">Showing materials for {activeStudent.classBatch}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentMaterials.map((mat) => (
              <div key={mat.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {mat.type}
                  </span>
                  <span className="text-[10px] text-slate-400">{mat.date}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-base">{mat.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Subject: {mat.subject} • Faculty: {mat.author}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400">{mat.durationOrPages || 'Study Notes'}</span>
                  <a
                    href={mat.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white font-bold text-xs transition flex items-center gap-1"
                  >
                    Open Resource <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FEE PAYMENT & RECEIPTS */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-400" /> Fee Dues & Transaction History
            </h3>
            <button
              onClick={() => {
                setPayAmount(activeStudent.feeDue || 25000);
                setIsPayFeeModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <DollarSign className="h-4 w-4" /> Pay Dues Now
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-panel">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Fee Type</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {studentFeeTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-purple-300 font-bold">{tx.transactionId}</td>
                    <td className="p-3 font-bold">{tx.feeType}</td>
                    <td className="p-3 text-slate-300">{tx.paymentMode}</td>
                    <td className="p-3 text-slate-400">{tx.date}</td>
                    <td className="p-3 font-extrabold text-white">₹{tx.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CERTIFICATES & CREDENTIALS */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-purple-400" /> Issued Academic Certificates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentCertificates.map((cert) => (
              <div key={cert.id} className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {cert.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{cert.certificateNo}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-base">{cert.type} Certificate</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Purpose: {cert.purpose}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Issued By: {cert.issuedBy}</span>
                  <button
                    onClick={() => setSelectedCertModal(cert)}
                    className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white font-bold text-xs transition flex items-center gap-1"
                  >
                    Download Certificate <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: HOSTEL & TRANSPORT */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hostel Info */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <Home className="h-4 w-4 text-indigo-400" /> Campus Hostel Allocation
            </div>
            {hostelInfo ? (
              <div className="space-y-2 text-xs text-slate-300">
                <p><span className="font-bold text-slate-400">Block:</span> {hostelInfo.block}</p>
                <p><span className="font-bold text-slate-400">Room No:</span> {hostelInfo.roomNo}</p>
                <p><span className="font-bold text-slate-400">Term Fee:</span> ₹{hostelInfo.feePerTerm.toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Day scholar student (No active hostel allocation).</p>
            )}
          </div>

          {/* Transport Info */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <Bus className="h-4 w-4 text-emerald-400" /> Campus Bus Route & GPS
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><span className="font-bold text-slate-400">Route:</span> {transportInfo.routeName}</p>
              <p><span className="font-bold text-slate-400">Bus No:</span> {transportInfo.busNumber}</p>
              <p><span className="font-bold text-slate-400">Driver:</span> {transportInfo.driverName} ({transportInfo.driverPhone})</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PAY FEE DUES ONLINE */}
      {isPayFeeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel-glow border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-400" /> Online Fee Payment Gateway
              </h3>
              <button onClick={() => setIsPayFeeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePayFeeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Student Name & Roll No</label>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold">
                  {activeStudent.name} ({activeStudent.rollNo})
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Gateway Option</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                >
                  <option value="Online (Razorpay)">Online (Razorpay / Credit Card / Debit Card)</option>
                  <option value="UPI (PhonePe)">UPI Instant (PhonePe / Google Pay)</option>
                  <option value="Bank Transfer">Direct Bank Transfer / NEFT</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <span className="animate-pulse">Processing Secure Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Confirm & Pay ₹{payAmount.toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CERTIFICATE PREVIEW & DOWNLOAD */}
      {selectedCertModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel-glow border border-purple-500/40 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-purple-400" /> Digital Certificate Card
              </h3>
              <button onClick={() => setSelectedCertModal(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-purple-950/40 border border-purple-500/30 text-center space-y-3">
              <Sparkles className="h-8 w-8 mx-auto text-amber-400" />
              <h4 className="text-lg font-black text-white">{selectedCertModal.type} Certificate</h4>
              <p className="text-xs text-slate-300">Certificate No: {selectedCertModal.certificateNo}</p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                This certifies that <strong className="text-white">{activeStudent.name}</strong> (Roll: {activeStudent.rollNo}) has been officially issued this document for {selectedCertModal.purpose}.
              </div>
              <p className="text-[11px] text-slate-400">Issued On: {selectedCertModal.issueDate} • Authority: {selectedCertModal.issuedBy}</p>
            </div>

            <button
              onClick={() => {
                alert(`Downloaded Certificate: ${selectedCertModal.certificateNo}.pdf`);
                setSelectedCertModal(null);
              }}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" /> Save PDF Certificate Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
