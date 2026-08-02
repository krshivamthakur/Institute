'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Course } from '@/lib/ims-data';
import {
  BookOpen,
  Plus,
  FileText,
  Upload,
  ChevronRight,
  Layers,
  X,
  CheckCircle2,
  Edit2,
  Trash2,
  ShieldCheck,
  Save,
} from 'lucide-react';

export function CourseManagement() {
  const { currentRole, courses, addCourse, updateCourse, deleteCourse, addAuditLog } = useIMS();
  const canEditCourse = ['Super Admin', 'Director', 'Principal', 'Branch Head', 'Academic Coordinator'].includes(currentRole);

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // New Topic / Subject state for adding to a semester
  const [newTopicSemester, setNewTopicSemester] = useState<number>(1);
  const [newTopicName, setNewTopicName] = useState<string>('');

  // Add Form State
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

  // Edit Form State
  const [editForm, setEditForm] = useState({
    code: '',
    title: '',
    department: '',
    durationMonths: 48,
    semesters: 8,
    fees: 180000,
    activeBatches: 2,
    enrolledStudents: 120,
  });

  const openEditModal = (course: Course) => {
    setEditForm({
      code: course.code,
      title: course.title,
      department: course.department,
      durationMonths: course.durationMonths,
      semesters: course.semesters,
      fees: course.fees,
      activeBatches: course.activeBatches,
      enrolledStudents: course.enrolledStudents,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse({
      code: newCourse.code,
      title: newCourse.title,
      department: newCourse.department,
      durationMonths: Number(newCourse.durationMonths),
      semesters: Number(newCourse.semesters),
      fees: Number(newCourse.fees),
      activeBatches: Number(newCourse.activeBatches),
      enrolledStudents: Number(newCourse.enrolledStudents),
      syllabus: newCourse.syllabus,
    });
    setIsAddModalOpen(false);
    setNotification(`Degree course "${newCourse.title}" created successfully!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !canEditCourse) return;

    updateCourse(selectedCourse.id, {
      code: editForm.code,
      title: editForm.title,
      department: editForm.department,
      durationMonths: Number(editForm.durationMonths),
      semesters: Number(editForm.semesters),
      fees: Number(editForm.fees),
      activeBatches: Number(editForm.activeBatches),
      enrolledStudents: Number(editForm.enrolledStudents),
    });

    setIsEditModalOpen(false);
    setNotification(`Course program "${editForm.title}" updated successfully!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddTopicToSemester = (e: React.FormEvent, semesterNo: number) => {
    e.preventDefault();
    if (!selectedCourse || !newTopicName.trim() || !canEditCourse) return;

    const updatedSyllabus = selectedCourse.syllabus.map((sem) => {
      if (sem.semester === semesterNo) {
        return { ...sem, topics: [...sem.topics, newTopicName.trim()] };
      }
      return sem;
    });

    updateCourse(selectedCourse.id, { syllabus: updatedSyllabus });
    setNewTopicName('');
    setNotification(`Added subject component "${newTopicName.trim()}" to Semester ${semesterNo}!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleRemoveTopicFromSemester = (semesterNo: number, topicIndex: number) => {
    if (!selectedCourse || !canEditCourse) return;

    const updatedSyllabus = selectedCourse.syllabus.map((sem) => {
      if (sem.semester === semesterNo) {
        return { ...sem, topics: sem.topics.filter((_, idx) => idx !== topicIndex) };
      }
      return sem;
    });

    updateCourse(selectedCourse.id, { syllabus: updatedSyllabus });
    setNotification(`Removed subject component from Semester ${semesterNo}`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddSemester = () => {
    if (!selectedCourse || !canEditCourse) return;
    const nextSemNo = selectedCourse.syllabus.length + 1;
    const updatedSyllabus = [
      ...selectedCourse.syllabus,
      { semester: nextSemNo, topics: [`New Semester ${nextSemNo} Core Subject`] },
    ];
    updateCourse(selectedCourse.id, { syllabus: updatedSyllabus });
    setNotification(`Added Semester ${nextSemNo} structure to ${selectedCourse.code}!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeleteCourse = (course: Course) => {
    if (!canEditCourse) return;
    if (window.confirm(`Are you sure you want to delete ${course.title} (${course.code})?`)) {
      deleteCourse(course.id);
      setNotification(`Course "${course.title}" deleted.`);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {canEditCourse ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Admin & Super Admin Edit Access Granted
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Read-Only View
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" /> Course & Curriculum Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure degree courses, subject syllabi, semester structure, and uploaded study materials.
          </p>
        </div>

        {canEditCourse && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Plus className="h-4 w-4" /> Create New Course
          </button>
        )}
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
          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`p-4 rounded-2xl border text-xs cursor-pointer transition relative group ${
                selectedCourse?.id === c.id
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start font-bold">
                <span className="text-white text-sm">{c.code}</span>
                <span className="text-indigo-400">₹{c.fees.toLocaleString()} / yr</span>
              </div>
              <p className="text-slate-300 font-medium mt-1">{c.title}</p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                <span>{c.semesters} Semesters</span>
                <span>{c.enrolledStudents} Students</span>
              </div>
            </div>
          ))}
        </div>

        {/* Course Detailed Syllabus Tree & Edit Panel */}
        {selectedCourse && (
          <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <span>{selectedCourse.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                    {selectedCourse.code}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dept: {selectedCourse.department} • Annual Fee: ₹{selectedCourse.fees.toLocaleString()} • {selectedCourse.semesters} Semesters
                </p>
              </div>

              {canEditCourse && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(selectedCourse)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Program Details
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(selectedCourse)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition"
                    title="Delete Course Program"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Syllabus & Components Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" /> Curriculum Components & Subject Modules
                </h4>
                {canEditCourse && (
                  <button
                    onClick={handleAddSemester}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-[11px] transition border border-slate-700 flex items-center gap-1"
                  >
                    + Add Semester Breakdown
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {selectedCourse.syllabus.map((sem) => (
                  <div key={sem.semester} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3">
                    <div className="flex justify-between items-center font-bold text-slate-200">
                      <span>Semester {sem.semester} Modules</span>
                      <span className="text-indigo-400">{sem.topics.length} Subjects</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sem.topics.map((t, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{t}</span>
                          </div>
                          {canEditCourse && (
                            <button
                              onClick={() => handleRemoveTopicFromSemester(sem.semester, idx)}
                              className="text-slate-500 hover:text-rose-400 opacity-80 group-hover:opacity-100 transition p-1"
                              title="Delete Subject Component"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Component to this semester */}
                    {canEditCourse && (
                      <form
                        onSubmit={(e) => {
                          handleAddTopicToSemester(e, sem.semester);
                        }}
                        className="flex items-center gap-2 pt-1"
                      >
                        <input
                          type="text"
                          placeholder={`+ Add subject component to Semester ${sem.semester}...`}
                          value={newTopicSemester === sem.semester ? newTopicName : ''}
                          onChange={(e) => {
                            setNewTopicSemester(sem.semester);
                            setNewTopicName(e.target.value);
                          }}
                          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                        >
                          Add
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
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

      {/* Edit Course Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-indigo-400" /> Edit Degree Program Details
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Annual Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={editForm.fees}
                    onChange={(e) => setEditForm({ ...editForm, fees: Number(e.target.value) })}
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
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Total Semesters</label>
                  <input
                    type="number"
                    required
                    value={editForm.semesters}
                    onChange={(e) => setEditForm({ ...editForm, semesters: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Active Batches</label>
                  <input
                    type="number"
                    required
                    value={editForm.activeBatches}
                    onChange={(e) => setEditForm({ ...editForm, activeBatches: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Enrolled Students</label>
                  <input
                    type="number"
                    required
                    value={editForm.enrolledStudents}
                    onChange={(e) => setEditForm({ ...editForm, enrolledStudents: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
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
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Course Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
