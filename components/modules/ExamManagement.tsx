'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { ExamRecord } from '@/lib/ims-data';
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
} from 'lucide-react';

export function ExamManagement() {
  const { currentRole, exams, students } = useIMS();
  const isPersonalScope = currentRole === 'Student' || currentRole === 'Parent';
  const myStudent = students[0]; // Logged-in student / child context

  const [selectedExam, setSelectedExam] = useState(exams[0]);
  const [selectedStudentAdmitCard, setSelectedStudentAdmitCard] = useState<any | null>(null);
  const [showAdmitCardModal, setShowAdmitCardModal] = useState(false);

  // -------------------------------------------------------------
  // 1. STUDENT & PARENT PERSONAL EXAM & MARKSHEET VIEW (Restricted to Child Record)
  // -------------------------------------------------------------
  if (isPersonalScope) {
    const student = myStudent || students[0];

    // Filter results for the logged in student / child only
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

    const examSchedule = [
      { date: '2026-06-15', time: '09:30 AM - 12:30 PM', subject: 'Data Structures & Algorithms', hall: 'Main Exam Hall 101' },
      { date: '2026-06-18', time: '09:30 AM - 12:30 PM', subject: 'Operating Systems & Kernels', hall: 'Main Exam Hall 102' },
      { date: '2026-06-21', time: '09:30 AM - 12:30 PM', subject: 'Database Management Systems', hall: 'Main Exam Hall 101' },
      { date: '2026-06-24', time: '09:30 AM - 12:30 PM', subject: 'Computer Networks & Security', hall: 'Lab Hall 204' },
    ];

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
                Download official hall ticket admit card for upcoming examinations and review published semester marksheet and gradebook.
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
          {/* Column 1 & 2: Personal Admit Card Preview */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" /> Official Hall Ticket / Admit Card Details
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STATUS: VERIFIED & ISSUED
              </span>
            </div>

            {/* Hall Ticket Card Layout */}
            <div className="p-6 rounded-2xl bg-slate-950 border-2 border-amber-500/40 text-xs space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-black text-base text-white tracking-wide">AURA INSTITUTE OF TECHNOLOGY</h4>
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    MID-TERM EXAMINATIONS 2026 - CANDIDATE HALL TICKET
                  </p>
                </div>
                <img src={student.avatar} alt={student.name} className="h-14 w-14 rounded-xl object-cover border border-amber-500/50" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300 font-medium">
                <div>
                  <span className="text-[10px] text-slate-400 block">Candidate Name:</span>
                  <span className="font-extrabold text-white">{student.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Roll Number:</span>
                  <span className="font-mono font-bold text-amber-400">{student.rollNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Enrolled Course / Batch:</span>
                  <span className="font-bold text-slate-200">{student.classBatch}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Assigned Examination Center:</span>
                  <span className="font-bold text-blue-400">Main Campus Hall 101</span>
                </div>
              </div>

              {/* Exam Schedule Table */}
              <div className="pt-2">
                <h5 className="font-bold text-xs text-amber-300 mb-2">Approved Examination Dates & Timings:</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[9px] border-b border-slate-800">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Subject Name</th>
                        <th className="p-2">Time Slot</th>
                        <th className="p-2 text-right">Hall No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {examSchedule.map((ex, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-mono text-amber-400 font-bold">{ex.date}</td>
                          <td className="p-2 font-bold text-white">{ex.subject}</td>
                          <td className="p-2 font-mono text-slate-400">{ex.time}</td>
                          <td className="p-2 text-right text-slate-300">{ex.hall}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAdmitCardModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-600/30"
              >
                <Printer className="h-4 w-4" /> Download Printable Hall Ticket (PDF)
              </button>
            </div>
          </div>

          {/* Column 3: My Exam Gradebook & Results */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" /> My Published Results
            </h3>

            <div className="space-y-3">
              {myResults.map(({ exam, result }, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{exam.examName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Grade: {result.grade}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{exam.subject}</span>
                    <span className="font-bold text-emerald-400">{result.marksObtained} / {exam.totalMarks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal for Admit Card Print */}
        {showAdmitCardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Official Student Admit Card</h3>
                <button onClick={() => setShowAdmitCardModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 text-xs space-y-3">
                <div className="text-center border-b border-slate-800 pb-2">
                  <h4 className="font-extrabold text-sm text-white">AURA INSTITUTE OF TECHNOLOGY</h4>
                  <p className="text-[10px] text-amber-300 font-bold uppercase">OFFICIAL EXAM ADMIT CARD - 2026</p>
                </div>

                <div className="space-y-1 text-slate-300">
                  <p><strong>Candidate Name:</strong> {student.name}</p>
                  <p><strong>Roll Number:</strong> {student.rollNo}</p>
                  <p><strong>Batch:</strong> {student.classBatch}</p>
                  <p><strong>Exam Hall:</strong> Main Examination Hall 101</p>
                  <p><strong>Reporting Time:</strong> 09:00 AM</p>
                  <p><strong>Status:</strong> ELIGIBLE TO APPEAR</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4" /> Print / Save Admit Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ADMIN & FACULTY EXAM MANAGEMENT SUITE
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Admin & Faculty Scoped View
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" /> Examination & Gradebook Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Exam schedules, marks entry, CGPA calculation, result publishing toggle, and admit card generation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Scheduled Exams</h3>
          {exams.map((e) => (
            <div
              key={e.id}
              onClick={() => setSelectedExam(e)}
              className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
                selectedExam.id === e.id ? 'bg-amber-950/60 border-amber-500 shadow-lg' : 'glass-panel border-slate-800'
              }`}
            >
              <div className="flex justify-between font-bold text-white">
                <span>{e.examName}</span>
                <span className="text-amber-400">{e.published ? 'Published ✓' : 'Draft'}</span>
              </div>
              <p className="text-slate-400 mt-1">{e.subject} • {e.batch}</p>
              <p className="text-[10px] text-slate-500 mt-2">Date: {e.date}</p>
            </div>
          ))}
        </div>

        {/* Gradebook Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base">{selectedExam.examName} - Gradebook</h3>
              <p className="text-xs text-amber-400 font-semibold">{selectedExam.subject} (Max Marks: {selectedExam.totalMarks})</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Marks Obtained</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3 text-right">Admit Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {selectedExam.results.map((res) => (
                  <tr key={res.studentId}>
                    <td className="p-3 font-bold text-amber-400">#{res.rank}</td>
                    <td className="p-3 font-bold text-white">{res.studentName}</td>
                    <td className="p-3 font-mono text-slate-400">{res.rollNo}</td>
                    <td className="p-3 font-bold text-emerald-400">{res.marksObtained} / {selectedExam.totalMarks}</td>
                    <td className="p-3 font-bold text-purple-300">{res.grade}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedStudentAdmitCard(res)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-[10px] transition"
                      >
                        Admit Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admit Card Modal for Admins */}
      {selectedStudentAdmitCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Official Examination Admit Card</h3>
              <button onClick={() => setSelectedStudentAdmitCard(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 text-xs space-y-3">
              <div className="text-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm text-white">AURA INSTITUTE OF TECHNOLOGY</h4>
                <p className="text-[10px] text-amber-300 font-bold uppercase">EXAMINATION ADMIT CARD - 2026</p>
              </div>

              <div className="space-y-1 text-slate-300">
                <p><strong>Candidate Name:</strong> {selectedStudentAdmitCard.studentName}</p>
                <p><strong>Roll Number:</strong> {selectedStudentAdmitCard.rollNo}</p>
                <p><strong>Exam Name:</strong> {selectedExam.examName}</p>
                <p><strong>Subject:</strong> {selectedExam.subject}</p>
                <p><strong>Exam Date:</strong> {selectedExam.date}</p>
                <p><strong>Exam Center:</strong> Main Examination Hall 101</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Download / Print Admit Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
