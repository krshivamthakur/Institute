'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { LMSCourseMaterial } from '@/lib/ims-data';
import {
  Video,
  FileText,
  HelpCircle,
  Upload,
  CheckCircle2,
  Play,
  Download,
  Lock,
  Plus,
  X,
  Edit,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  Send,
  BookOpen,
  Layers,
  GraduationCap,
  Tag,
} from 'lucide-react';

export function LMSModule() {
  const {
    currentRole,
    lmsMaterials,
    courses,
    addLmsMaterial,
    updateLmsMaterial,
    deleteLmsMaterial,
  } = useIMS();

  // Concern Person permission check (Super Admin, Inventory Manager, Faculty, Academic Leadership)
  const canManageLMS = ['Super Admin', 'Director', 'Principal', 'Branch Head', 'Academic Coordinator', 'Teacher', 'Inventory Manager', 'Accountant'].includes(currentRole);

  const [activeTab, setActiveTab] = useState<'All' | 'Video' | 'PDF Notes' | 'Assignment' | 'Quiz'>('All');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(lmsMaterials[0]?.id || '');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterialForEdit, setSelectedMaterialForEdit] = useState<LMSCourseMaterial | null>(null);

  const [successMsg, setSuccessMsg] = useState('');

  // Course Options
  const courseOptions = [
    'B.Tech CS - Sem 4',
    'B.Tech ECE - Sem 4',
    'MBA - Sem 2',
    ...courses.map((c) => c.code),
  ];

  // Subject Options
  const subjectOptions = [
    'Data Structures & Algorithms',
    'Operating Systems',
    'Database Management Systems',
    'Machine Learning',
    'Financial Analytics',
    'Computer Networks',
  ];

  // Unique list for filtering
  const availableCourses = Array.from(new Set(['All', ...lmsMaterials.map((m) => m.classBatch), ...courseOptions]));
  const availableSubjects = Array.from(new Set(['All', ...lmsMaterials.map((m) => m.subject), ...subjectOptions]));

  // Upload Form State
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: 'Data Structures & Algorithms',
    classBatch: 'B.Tech CS - Sem 4',
    type: 'Video' as LMSCourseMaterial['type'],
    author: currentRole === 'Teacher' ? 'Prof. Faculty User' : `${currentRole} Manager`,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    durationOrPages: '30 Mins',
  });

  // Edit Form State
  const [editMaterialForm, setEditMaterialForm] = useState({
    title: '',
    subject: '',
    classBatch: '',
    type: 'Video' as LMSCourseMaterial['type'],
    author: '',
    url: '',
    durationOrPages: '',
  });

  const filteredMaterials = lmsMaterials.filter((m) => {
    const matchesTab = activeTab === 'All' || m.type === activeTab;
    const matchesCourse = selectedCourseFilter === 'All' || m.classBatch === selectedCourseFilter;
    const matchesSubject = selectedSubjectFilter === 'All' || m.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.classBatch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesCourse && matchesSubject && matchesSearch;
  });

  const selectedMaterial =
    lmsMaterials.find((m) => m.id === selectedMaterialId) ||
    filteredMaterials[0] ||
    lmsMaterials[0] || {
      id: 'LMS-01',
      subject: 'Data Structures & Algorithms',
      classBatch: 'B.Tech CS - Sem 4',
      title: 'Advanced Graph Algorithms & Shortest Path',
      type: 'Video',
      author: 'Prof. Rajesh Kumar',
      date: '2026-08-01',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      durationOrPages: '45 Mins',
    };

  const handleOpenEditModal = (mat: LMSCourseMaterial) => {
    setSelectedMaterialForEdit(mat);
    setEditMaterialForm({
      title: mat.title,
      subject: mat.subject,
      classBatch: mat.classBatch,
      type: mat.type,
      author: mat.author,
      url: mat.url || '',
      durationOrPages: mat.durationOrPages || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageLMS) return;

    addLmsMaterial({
      title: newMaterial.title,
      subject: newMaterial.subject,
      classBatch: newMaterial.classBatch,
      type: newMaterial.type,
      author: newMaterial.author,
      date: new Date().toISOString().split('T')[0],
      url: newMaterial.url,
      durationOrPages: newMaterial.durationOrPages,
    });

    setIsUploadModalOpen(false);
    setNewMaterial({
      title: '',
      subject: 'Data Structures & Algorithms',
      classBatch: 'B.Tech CS - Sem 4',
      type: 'Video',
      author: currentRole === 'Teacher' ? 'Prof. Faculty User' : `${currentRole} Manager`,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      durationOrPages: '30 Mins',
    });

    setSuccessMsg('New e-learning courseware published successfully!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageLMS || !selectedMaterialForEdit) return;

    updateLmsMaterial(selectedMaterialForEdit.id, {
      title: editMaterialForm.title,
      subject: editMaterialForm.subject,
      classBatch: editMaterialForm.classBatch,
      type: editMaterialForm.type,
      author: editMaterialForm.author,
      url: editMaterialForm.url,
      durationOrPages: editMaterialForm.durationOrPages,
    });

    setIsEditModalOpen(false);
    setSelectedMaterialForEdit(null);
    setSuccessMsg(`Courseware material "${editMaterialForm.title}" updated!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleDeleteMaterial = (mat: LMSCourseMaterial) => {
    if (!canManageLMS) return;
    if (window.confirm(`Are you sure you want to delete courseware material "${mat.title}"?`)) {
      deleteLmsMaterial(mat.id);
      setSuccessMsg(`Material ${mat.title} removed from LMS library.`);
      setTimeout(() => setSuccessMsg(''), 3500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {canManageLMS ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-purple-400" /> Super Admin & Concern Manager LMS Control Active
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Lock className="h-3 w-3 text-amber-400" /> Student & Parent View Mode: Stream & Download
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Video className="h-5 w-5 text-purple-400" /> Learning Management System (LMS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Course-classified & subject-wise e-learning material, video lectures, downloadable notes, and quizzes.
          </p>
        </div>

        {canManageLMS ? (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30"
          >
            <Upload className="h-4 w-4" /> + Upload Courseware
          </button>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
            <Lock className="h-3.5 w-3.5 text-amber-400" /> Upload restricted to authorized personnel
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {successMsg}
        </div>
      )}

      {/* Classification Filters Header */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-400" /> E-Learning Content Classification Controls
          </h3>
          <span className="text-[11px] text-slate-400">
            Showing <strong className="text-white">{filteredMaterials.length}</strong> of {lmsMaterials.length} Materials
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Format Tabs */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Content Type</label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              <option value="All">All Formats</option>
              <option value="Video">Videos</option>
              <option value="PDF Notes">PDF Notes</option>
              <option value="Assignment">Assignments</option>
              <option value="Quiz">Quizzes</option>
            </select>
          </div>

          {/* Course Classification Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <GraduationCap className="h-3 w-3 text-indigo-400" /> Filter by Course / Batch
            </label>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Degree Programs / Batches' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Classification Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Tag className="h-3 w-3 text-purple-400" /> Filter by Subject
            </label>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Academic Subjects' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search topic or faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Courseware Selection & Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Material List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Classified E-Learning Content ({filteredMaterials.length})
          </h3>
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => setSelectedMaterialId(mat.id)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
                  selectedMaterial?.id === mat.id ? 'bg-purple-950/60 border-purple-500 shadow-lg' : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-sm leading-snug">{mat.title}</h3>
                  {canManageLMS && (
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(mat);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Edit Material"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMaterial(mat);
                        }}
                        className="p-1 text-rose-400 hover:text-rose-300"
                        title="Delete Material"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Course: {mat.classBatch}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Subject: {mat.subject}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5">
                  <span>Author: <strong className="text-slate-300">{mat.author}</strong></span>
                  {mat.durationOrPages && <span className="font-mono text-purple-400 font-bold">{mat.durationOrPages}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-slate-400 text-xs text-center">
              No e-learning content found for the selected course or subject filter.
            </div>
          )}
        </div>

        {/* Right: Interactive Player / Viewer */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="font-extrabold text-white text-base">{selectedMaterial.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-purple-400 font-semibold">{selectedMaterial.subject}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-indigo-300 font-semibold">{selectedMaterial.classBatch}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Faculty: {selectedMaterial.author}</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 self-start sm:self-center">
              Format: {selectedMaterial.type}
            </span>
          </div>

          {selectedMaterial.type === 'Video' && (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-black flex items-center justify-center relative shadow-2xl">
                <video controls className="w-full h-full object-cover">
                  <source src={selectedMaterial.url || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
                </video>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>HD Stream Available</span>
                <span>Duration: {selectedMaterial.durationOrPages || '45 Mins'}</span>
              </div>
            </div>
          )}

          {selectedMaterial.type === 'PDF Notes' && (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
              <FileText className="h-14 w-14 text-purple-400 mx-auto animate-pulse" />
              <div>
                <h4 className="font-bold text-white text-base">{selectedMaterial.title}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Vector PDF lecture notes for {selectedMaterial.subject} ({selectedMaterial.classBatch}) published by {selectedMaterial.author}
                </p>
              </div>
              <button
                onClick={() => alert(`Downloading: ${selectedMaterial.title}.pdf`)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
              >
                <Download className="h-4 w-4" /> Download PDF Notes Document
              </button>
            </div>
          )}

          {selectedMaterial.type === 'Assignment' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm">Course Assignment Task</h4>
              <p className="text-slate-300">
                Complete the problem set on algorithm efficiency and submit your solution source code file before the deadline.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => alert('Assignment downloaded successfully!')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" /> Download Assignment Brief
                </button>
              </div>
            </div>
          )}

          {selectedMaterial.type === 'Quiz' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm">Interactive Quiz: {selectedMaterial.subject}</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="font-bold text-slate-200">Q1. What is the time complexity of searching an element in a Balanced Binary Search Tree (AVL)?</p>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="radio" name="q1" className="text-purple-600 focus:ring-purple-500" /> O(log N)
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="radio" name="q1" className="text-purple-600 focus:ring-purple-500" /> O(N)
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="radio" name="q1" className="text-purple-600 focus:ring-purple-500" /> O(1)
                  </label>
                </div>
              </div>
              <button
                onClick={() => alert('Quiz submitted! Result: 100% Score!')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
              >
                Submit Quiz & View Auto-Graded Result
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Courseware Modal */}
      {isUploadModalOpen && canManageLMS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Upload className="h-4 w-4 text-purple-400" /> Upload & Classify Courseware Material
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Material Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Algorithms & Shortest Path Notes"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Classify by Course / Batch</label>
                  <select
                    value={newMaterial.classBatch}
                    onChange={(e) => setNewMaterial({ ...newMaterial, classBatch: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    {availableCourses.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Classify by Subject</label>
                  <input
                    type="text"
                    required
                    value={newMaterial.subject}
                    onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Material Format</label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Video">Video</option>
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Author / Faculty</label>
                  <input
                    type="text"
                    required
                    value={newMaterial.author}
                    onChange={(e) => setNewMaterial({ ...newMaterial, author: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration / Page Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 Mins or 24 Pages"
                    value={newMaterial.durationOrPages}
                    onChange={(e) => setNewMaterial({ ...newMaterial, durationOrPages: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Media / Video URL</label>
                  <input
                    type="url"
                    value={newMaterial.url}
                    onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" /> Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Courseware Modal */}
      {isEditModalOpen && selectedMaterialForEdit && canManageLMS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit className="h-4 w-4 text-purple-400" /> Edit & Re-Classify Courseware Material
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Material Title</label>
                <input
                  type="text"
                  required
                  value={editMaterialForm.title}
                  onChange={(e) => setEditMaterialForm({ ...editMaterialForm, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Classify by Course / Batch</label>
                  <input
                    type="text"
                    required
                    value={editMaterialForm.classBatch}
                    onChange={(e) => setEditMaterialForm({ ...editMaterialForm, classBatch: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Classify by Subject</label>
                  <input
                    type="text"
                    required
                    value={editMaterialForm.subject}
                    onChange={(e) => setEditMaterialForm({ ...editMaterialForm, subject: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Material Format</label>
                  <select
                    value={editMaterialForm.type}
                    onChange={(e) => setEditMaterialForm({ ...editMaterialForm, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Video">Video</option>
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Author / Faculty</label>
                  <input
                    type="text"
                    required
                    value={editMaterialForm.author}
                    onChange={(e) => setEditMaterialForm({ ...editMaterialForm, author: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration / Page Count</label>
                  <input
                    type="text"
                    value={editMaterialForm.durationOrPages}
                    onChange={(e) => setEditMaterialForm({ ...editMaterialForm, durationOrPages: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Media / Video URL</label>
                  <input
                    type="url"
                    value={editMaterialForm.url}
                    onChange={(e) => setEditMaterialForm({ ...editMaterialForm, url: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]"
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
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" /> Save Material Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
