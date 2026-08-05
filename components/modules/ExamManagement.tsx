'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { ExamRecord, ExamResult } from '@/lib/ims-data';
import {
  Award,
  Calendar,
  Printer,
  CheckCircle,
  FileText,
  X,
  Lock,
  User,
  Download,
  AlertCircle,
  Clock,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function ExamManagement() {
  const {
    authUser,
    currentRole,
    exams,
    students,
    addExam,
    updateExam,
    deleteExam,
    updateExamStudentResult,
    systemSettings,
  } = useIMS();
  const instituteName = systemSettings?.projectName || 'AURA IMS';

  const isPersonalScope = currentRole === 'Student' || currentRole === 'Parent';
  const isSuperAdmin = ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher'].includes(currentRole);

  const myStudent = currentRole === 'Parent'
    ? (students.find(
        (s) =>
          s.id === authUser?.childStudentId ||
          s.rollNo === authUser?.childStudentId ||
          (authUser?.name && s.parentName.toLowerCase().includes(authUser.name.toLowerCase().replace('(parent)', '').trim()))
      ) || students[0])
    : (students.find((s) => s.id === authUser?.empIdOrRollNo || s.rollNo === authUser?.empIdOrRollNo) || students[0]);

  const [selectedExam, setSelectedExam] = useState<ExamRecord>(exams[0] || {
    id: 'EXM-101',
    examName: 'Mid-Term Examinations 2026',
    course: 'B.Tech Computer Science',
    batch: 'B.Tech CS - Sem 4',
    date: '2026-06-15',
    subject: 'Data Structures & Algorithms',
    totalMarks: 100,
    passingMarks: 40,
    published: true,
    results: [],
  });

  const [selectedStudentAdmitCard, setSelectedStudentAdmitCard] = useState<any | null>(null);
  const [showAdmitCardModal, setShowAdmitCardModal] = useState(false);
  const [notification, setNotification] = useState('');

  // Admin Modals
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [isEditExamModalOpen, setIsEditExamModalOpen] = useState(false);
  const [isEditMarksModalOpen, setIsEditMarksModalOpen] = useState(false);

  const [selectedExamForEdit, setSelectedExamForEdit] = useState<ExamRecord | null>(null);
  const [selectedResultForEdit, setSelectedResultForEdit] = useState<any | null>(null);
  const [marksInput, setMarksInput] = useState('85');

  // Form for New Exam
  const [newExam, setNewExam] = useState({
    examName: 'Final Year Examinations 2026',
    course: 'B.Tech Computer Science',
    batch: 'B.Tech CS - Year 2',
    date: '2026-06-15',
    subject: 'Operating Systems & Kernels',
    totalMarks: 100,
    passingMarks: 40,
    published: true,
  });

  // Form for Edit Exam
  const [editExamForm, setEditExamForm] = useState({
    examName: '',
    course: '',
    batch: '',
    date: '',
    subject: '',
    totalMarks: 100,
    passingMarks: 40,
    published: true,
  });

  const handleOpenEditExam = (exam: ExamRecord) => {
    setSelectedExamForEdit(exam);
    setEditExamForm({
      examName: exam.examName,
      course: exam.course,
      batch: exam.batch,
      date: exam.date,
      subject: exam.subject,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      published: exam.published,
    });
    setIsEditExamModalOpen(true);
  };

  const handleOpenEditMarks = (res: any) => {
    setSelectedResultForEdit(res);
    setMarksInput(String(res.marksObtained));
    setIsEditMarksModalOpen(true);
  };

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    addExam({
      examName: newExam.examName,
      course: newExam.course,
      batch: newExam.batch,
      date: newExam.date,
      subject: newExam.subject,
      totalMarks: Number(newExam.totalMarks),
      passingMarks: Number(newExam.passingMarks),
      published: newExam.published,
      results: students.slice(0, 4).map((s, idx) => ({
        studentId: s.id,
        studentName: s.name,
        rollNo: s.rollNo,
        marksObtained: Math.floor(70 + Math.random() * 25),
        grade: 'A',
        rank: idx + 1,
      })),
    });

    setIsAddExamModalOpen(false);
    setNotification(`New examination schedule created: ${newExam.examName}!`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSaveEditExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !selectedExamForEdit) return;

    updateExam(selectedExamForEdit.id, {
      examName: editExamForm.examName,
      course: editExamForm.course,
      batch: editExamForm.batch,
      date: editExamForm.date,
      subject: editExamForm.subject,
      totalMarks: Number(editExamForm.totalMarks),
      passingMarks: Number(editExamForm.passingMarks),
      published: editExamForm.published,
    });

    setIsEditExamModalOpen(false);
    setSelectedExamForEdit(null);
    setNotification(`Exam schedule details updated for ${editExamForm.examName}!`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSaveMarksSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !selectedResultForEdit || !selectedExam) return;

    const score = Number(marksInput);
    let computedGrade = 'F';
    const pct = (score / selectedExam.totalMarks) * 100;
    if (pct >= 90) computedGrade = 'A+';
    else if (pct >= 80) computedGrade = 'A';
    else if (pct >= 70) computedGrade = 'B+';
    else if (pct >= 60) computedGrade = 'B';
    else if (pct >= 50) computedGrade = 'C';
    else if (pct >= 40) computedGrade = 'D';

    updateExamStudentResult(selectedExam.id, selectedResultForEdit.studentId, {
      marksObtained: score,
      grade: computedGrade,
    });

    setIsEditMarksModalOpen(false);
    setSelectedResultForEdit(null);
    setNotification(`Marks updated for ${selectedResultForEdit.studentName}: ${score}/${selectedExam.totalMarks} (${computedGrade})!`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleDeleteExam = (exam: ExamRecord) => {
    if (!isSuperAdmin) return;
    if (window.confirm(`Are you sure you want to delete exam schedule "${exam.examName}" (${exam.subject})?`)) {
      deleteExam(exam.id);
      if (selectedExam.id === exam.id) {
        setSelectedExam(exams.find((e) => e.id !== exam.id) || exams[0]);
      }
      setNotification(`Exam schedule ${exam.examName} removed.`);
      setTimeout(() => setNotification(''), 3500);
    }
  };

  // -------------------------------------------------------------
  // 1. STUDENT & PARENT PERSONAL EXAM & MARKSHEET VIEW
  // -------------------------------------------------------------
  if (isPersonalScope) {
    const student = myStudent || students[0];

    const myResults = exams
      .map((exam) => {
        const studentRes = exam.results.find(
          (r) => r.studentId === student.id || r.rollNo === student.rollNo || r.studentName === student.name
        );
        return {
          exam,
          result: studentRes || { marksObtained: 94, grade: 'A+', rank: 1 },
        };
      })
      .filter((item) => item.exam.published);

    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-500/30 glass-panel shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-amber-400" /> {currentRole === 'Parent' ? "My Child's Exam & Marksheet Hub" : "Student Examination Hub"}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> {currentRole === 'Parent' ? `Scoped to ${student.name}'s Marksheet` : "Scoped to Your Admit Card Only"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentRole === 'Parent' ? `${student.name}'s Admit Card & Marksheet Portal` : "My Admit Card & Examination Portal"}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Download official hall ticket admit card for upcoming examinations and review published year marksheet and gradebook.
              </p>
            </div>

            <button
              onClick={() => setShowAdmitCardModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold text-xs transition shadow-xl shadow-amber-600/30 flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> Download / Print Marksheet & Hall Ticket
            </button>
          </div>
        </div>

        {/* 2 Main Columns: My Hall Ticket Preview & My Gradebook */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" /> Candidate Examination Hall Ticket
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                ● ELIGIBLE FOR HALL ENTRY
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[#0a0f1d] border-2 border-amber-500/40 text-xs space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white tracking-wide uppercase font-sans">
                    {instituteName.toUpperCase()}
                  </h3>
                  <p className="text-xs font-bold text-amber-400 tracking-wider uppercase mt-0.5">
                    MID-TERM EXAMINATIONS 2026 - CANDIDATE HALL TICKET
                  </p>
                </div>
                <img
                  src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={student.name}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Candidate Name:</span>
                  <span className="text-sm font-extrabold text-white block">{student.name}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Roll Number:</span>
                  <span className="text-sm font-extrabold text-amber-400 block font-mono">{student.rollNo}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Enrolled Course / Batch:</span>
                  <span className="text-sm font-extrabold text-white block">{student.classBatch}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Assigned Examination Center:</span>
                  <span className="text-sm font-extrabold text-blue-400 block">Main Campus Hall 101</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  Approved Examination Dates & Timings:
                </h4>

                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">DATE</th>
                        <th className="p-3">SUBJECT NAME</th>
                        <th className="p-3">TIME SLOT</th>
                        <th className="p-3 text-right">HALL NO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">2026-06-15</td>
                        <td className="p-3 font-extrabold text-white">Data Structures & Algorithms</td>
                        <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                        <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 101</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">2026-06-18</td>
                        <td className="p-3 font-extrabold text-white">Operating Systems & Kernels</td>
                        <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                        <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 102</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">2026-06-21</td>
                        <td className="p-3 font-extrabold text-white">Database Management Systems</td>
                        <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                        <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 101</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">2026-06-24</td>
                        <td className="p-3 font-extrabold text-white">Computer Networks & Security</td>
                        <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                        <td className="p-3 text-right text-slate-300 font-medium">Lab Hall 204</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Personal Published Marksheet */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-400" /> Published Year Marksheet
            </h3>

            <div className="space-y-3">
              {myResults.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">{item.exam.subject}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      Grade {item.result.grade}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Marks:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {item.result.marksObtained} / {item.exam.totalMarks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal for Admit Card Print */}
        {showAdmitCardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl printable-area my-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 no-print">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" /> Candidate Examination Hall Ticket
                </h3>
                <button onClick={() => setShowAdmitCardModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#0a0f1d] border-2 border-amber-500/40 text-xs space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-wide uppercase font-sans">
                      {instituteName.toUpperCase()}
                    </h3>
                    <p className="text-xs font-bold text-amber-400 tracking-wider uppercase mt-0.5">
                      MID-TERM EXAMINATIONS 2026 - CANDIDATE HALL TICKET
                    </p>
                  </div>
                  <img
                    src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={student.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Candidate Name:</span>
                    <span className="text-sm font-extrabold text-white block">{student.name}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Roll Number:</span>
                    <span className="text-sm font-extrabold text-amber-400 block font-mono">{student.rollNo}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Enrolled Course / Batch:</span>
                    <span className="text-sm font-extrabold text-white block">{student.classBatch}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Assigned Examination Center:</span>
                    <span className="text-sm font-extrabold text-blue-400 block">Main Campus Hall 101</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                    Approved Examination Dates & Timings:
                  </h4>

                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3">DATE</th>
                          <th className="p-3">SUBJECT NAME</th>
                          <th className="p-3">TIME SLOT</th>
                          <th className="p-3 text-right">HALL NO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                        <tr>
                          <td className="p-3 font-mono font-bold text-amber-400">2026-06-15</td>
                          <td className="p-3 font-extrabold text-white">Data Structures & Algorithms</td>
                          <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                          <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 101</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-amber-400">2026-06-18</td>
                          <td className="p-3 font-extrabold text-white">Operating Systems & Kernels</td>
                          <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                          <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 102</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-amber-400">2026-06-21</td>
                          <td className="p-3 font-extrabold text-white">Database Management Systems</td>
                          <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                          <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 101</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-amber-400">2026-06-24</td>
                          <td className="p-3 font-extrabold text-white">Computer Networks & Security</td>
                          <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                          <td className="p-3 text-right text-slate-300 font-medium">Lab Hall 204</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end no-print">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition"
                >
                  <Printer className="h-4 w-4" /> Download / Print Hall Ticket (PDF)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. SUPER ADMIN & FACULTY EXAM MANAGEMENT SUITE
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Super Admin & Executive Exam Controller Active
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" /> Examination & Marksheet Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Schedule exams, edit candidate marks, calculate GPA grades, publish year marksheets, and generate hall tickets.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setIsAddExamModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/30"
          >
            <Plus className="h-4 w-4" /> Schedule New Examination
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Cards List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Scheduled Exams ({exams.length})</h3>
          {exams.map((e) => (
            <div
              key={e.id}
              onClick={() => setSelectedExam(e)}
              className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
                selectedExam?.id === e.id ? 'bg-amber-950/60 border-amber-500 shadow-lg' : 'glass-panel border-slate-800'
              }`}
            >
              <div className="flex justify-between items-center font-bold text-white">
                <span>{e.examName}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      updateExam(e.id, { published: !e.published });
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      e.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {e.published ? 'Published ✓' : 'Draft ✎'}
                  </button>

                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenEditExam(e);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Edit Exam"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteExam(e);
                        }}
                        className="p-1 text-rose-400 hover:text-rose-300"
                        title="Delete Exam"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-slate-400 mt-1">{e.subject} • {e.batch}</p>
              <p className="text-[10px] text-slate-500 mt-2">Date: {e.date} • Total Marks: {e.totalMarks}</p>
            </div>
          ))}
        </div>

        {/* Gradebook & Marksheet Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base">{selectedExam?.examName || 'Examination Gradebook'}</h3>
              <p className="text-xs text-amber-400 font-semibold">
                {selectedExam?.subject} (Max Marks: {selectedExam?.totalMarks || 100} • Pass Marks: {selectedExam?.passingMarks || 40})
              </p>
            </div>

            {isSuperAdmin && selectedExam && (
              <button
                onClick={() => handleOpenEditExam(selectedExam)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" /> Edit Exam Details
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Marks Obtained</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3 text-right">Super Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(selectedExam?.results || []).map((res) => (
                  <tr key={res.studentId} className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-amber-400">#{res.rank}</td>
                    <td className="p-3 font-bold text-white">{res.studentName}</td>
                    <td className="p-3 font-mono text-slate-400">{res.rollNo}</td>
                    <td className="p-3 font-bold text-emerald-400">
                      {res.marksObtained} / {selectedExam.totalMarks}
                    </td>
                    <td className="p-3 font-bold text-purple-300">{res.grade}</td>
                    <td className="p-3 text-right space-x-1.5">
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleOpenEditMarks(res)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-[10px] transition inline-flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" /> Edit Marks
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedStudentAdmitCard(res)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-[10px] transition"
                      >
                        Hall Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Student Marks / Marksheet Modal */}
      {isEditMarksModalOpen && selectedResultForEdit && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit className="h-4 w-4 text-emerald-400" /> Edit Student Candidate Marksheet
              </h3>
              <button onClick={() => setIsEditMarksModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
              <p className="font-bold text-white">{selectedResultForEdit.studentName}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Roll No: {selectedResultForEdit.rollNo} • Exam: {selectedExam.subject}</p>
            </div>

            <form onSubmit={handleSaveMarksSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Marks Obtained (Max: {selectedExam.totalMarks})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={selectedExam.totalMarks}
                  value={marksInput}
                  onChange={(e) => setMarksInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditMarksModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Marksheet Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Exam Modal */}
      {isAddExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-amber-400" /> Schedule New Examination
              </h3>
              <button onClick={() => setIsAddExamModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExamSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  value={newExam.examName}
                  onChange={(e) => setNewExam({ ...newExam, examName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newExam.subject}
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Class / Batch</label>
                  <input
                    type="text"
                    required
                    value={newExam.batch}
                    onChange={(e) => setNewExam({ ...newExam, batch: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={newExam.totalMarks}
                    onChange={(e) => setNewExam({ ...newExam, totalMarks: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Passing Marks</label>
                  <input
                    type="number"
                    required
                    value={newExam.passingMarks}
                    onChange={(e) => setNewExam({ ...newExam, passingMarks: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30"
                >
                  Create Examination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Exam Details Modal */}
      {isEditExamModalOpen && selectedExamForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit className="h-4 w-4 text-amber-400" /> Edit Exam Details
              </h3>
              <button onClick={() => setIsEditExamModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditExamSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  value={editExamForm.examName}
                  onChange={(e) => setEditExamForm({ ...editExamForm, examName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={editExamForm.subject}
                  onChange={(e) => setEditExamForm({ ...editExamForm, subject: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Batch</label>
                  <input
                    type="text"
                    required
                    value={editExamForm.batch}
                    onChange={(e) => setEditExamForm({ ...editExamForm, batch: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={editExamForm.date}
                    onChange={(e) => setEditExamForm({ ...editExamForm, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={editExamForm.totalMarks}
                    onChange={(e) => setEditExamForm({ ...editExamForm, totalMarks: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Passing Marks</label>
                  <input
                    type="number"
                    required
                    value={editExamForm.passingMarks}
                    onChange={(e) => setEditExamForm({ ...editExamForm, passingMarks: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30"
                >
                  Save Exam Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admit Card Modal for Admins */}
      {selectedStudentAdmitCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl printable-area my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 no-print">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" /> Candidate Examination Hall Ticket
              </h3>
              <button onClick={() => setSelectedStudentAdmitCard(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#0a0f1d] border-2 border-amber-500/40 text-xs space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white tracking-wide uppercase font-sans">
                    {instituteName.toUpperCase()}
                  </h3>
                  <p className="text-xs font-bold text-amber-400 tracking-wider uppercase mt-0.5">
                    MID-TERM EXAMINATIONS 2026 - CANDIDATE HALL TICKET
                  </p>
                </div>
                <img
                  src={selectedStudentAdmitCard.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'}
                  alt={selectedStudentAdmitCard.studentName}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Candidate Name:</span>
                  <span className="text-sm font-extrabold text-white block">{selectedStudentAdmitCard.studentName}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Roll Number:</span>
                  <span className="text-sm font-extrabold text-amber-400 block font-mono">{selectedStudentAdmitCard.rollNo}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Enrolled Course / Batch:</span>
                  <span className="text-sm font-extrabold text-white block">{selectedStudentAdmitCard.classBatch || 'B.Tech CS - Sem 4'}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Assigned Examination Center:</span>
                  <span className="text-sm font-extrabold text-blue-400 block">Main Campus Hall 101</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  Approved Examination Dates & Timings:
                </h4>

                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">DATE</th>
                        <th className="p-3">SUBJECT NAME</th>
                        <th className="p-3">TIME SLOT</th>
                        <th className="p-3 text-right">HALL NO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">2026-06-15</td>
                        <td className="p-3 font-extrabold text-white">Data Structures & Algorithms</td>
                        <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                        <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 101</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">2026-06-18</td>
                        <td className="p-3 font-extrabold text-white">Operating Systems & Kernels</td>
                        <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                        <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 102</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">2026-06-21</td>
                        <td className="p-3 font-extrabold text-white">Database Management Systems</td>
                        <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                        <td className="p-3 text-right text-slate-300 font-medium">Main Exam Hall 101</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">2026-06-24</td>
                        <td className="p-3 font-extrabold text-white">Computer Networks & Security</td>
                        <td className="p-3 font-mono text-slate-300">09:30 AM - 12:30 PM</td>
                        <td className="p-3 text-right text-slate-300 font-medium">Lab Hall 204</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end no-print">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition"
              >
                <Printer className="h-4 w-4" /> Download / Print Hall Ticket (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
