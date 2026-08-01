'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Course } from '@/lib/ims-data';
import { BookOpen, Plus, FileText, Upload, ChevronRight, Layers, X, CheckCircle2 } from 'lucide-react';

export function CourseManagement() {
  const { courses, addAuditLog } = useIMS();
  const [coursesList, setCoursesList] = useState<Course[]>(courses);
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form State
  const [newCourse, setNewCourse] = useState({
    code: 'B.Tech-AI',
    title: 'B.Tech Artificial Intelligence & Data Science',
    department: 'Computer Science',
    durationMonths: 48,
    semesters: 8,
    fees: 180000,
    activeBatches: 2,
    enrolledStudents: 120,
    syllabus: [
      { semester: 1, topics: ['Python Programming', 'Linear Algebra', 'Data Analytics Basic'] },
      { semester: 2, topics: ['Deep Learning & PyTorch', 'Computer Vision', 'NLP'] },
    ],
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Course = {
      id: `CRS-${Math.floor(100 + Math.random() * 900)}`,
      code: newCourse.code,
      title: newCourse.title,
      department: newCourse.department,
      durationMonths: Number(newCourse.durationMonths),
      semesters: Number(newCourse.semesters),
      fees: Number(newCourse.fees),
      activeBatches: Number(newCourse.activeBatches),
      enrolledStudents: Number(newCourse.enrolledStudents),
      syllabus: newCourse.syllabus,
    };
    setCoursesList((prev) => [created, ...prev]);
    setSelectedCourse(created);
    setIsAddModalOpen(false);
    addAuditLog('COURSE_ADD', `Created new degree program: ${newCourse.title}`);
    setNotification(`Degree course "${newCourse.title}" created successfully!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" /> Course & Curriculum Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure degree courses, subject syllabi, semester structure, and uploaded study materials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
        >
          <Plus className="h-4 w-4" /> Create New Course
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Degree Programs</h3>
          {coursesList.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCourse(c)}
              className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
                selectedCourse.id === c.id
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start font-bold">
                <span className="text-white text-sm">{c.code}</span>
                <span className="text-indigo-400">₹{c.fees.toLocaleString()} / yr</span>
              </div>
              <p className="text-slate-300 font-medium mt-1">{c.title}</p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>{c.semesters} Semesters</span>
                <span>{c.enrolledStudents} Students Enrolled</span>
              </div>
            </div>
          ))}
        </div>

        {/* Course Detailed Syllabus Tree */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base">{selectedCourse.title}</h3>
              <p className="text-xs text-indigo-300 font-mono">{selectedCourse.code} • {selectedCourse.department}</p>
            </div>
            <button
              onClick={() => alert(`Course syllabus document for ${selectedCourse.title} uploaded!`)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Upload className="h-3.5 w-3.5 text-indigo-400" /> Upload Syllabus PDF
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" /> Syllabus Breakdown
            </h4>
            <div className="space-y-3">
              {selectedCourse.syllabus.map((sem) => (
                <div key={sem.semester} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>Semester {sem.semester} Modules</span>
                    <span className="text-indigo-400">{sem.topics.length} Subjects</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {sem.topics.map((t, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Create New Degree Course Program</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Artificial Intelligence"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Annual Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCourse.fees}
                    onChange={(e) => setNewCourse({ ...newCourse, fees: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newCourse.department}
                    onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Total Semesters</label>
                  <input
                    type="number"
                    required
                    value={newCourse.semesters}
                    onChange={(e) => setNewCourse({ ...newCourse, semesters: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
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
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Create Degree Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
