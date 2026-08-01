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
  FileCheck,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';

export function LMSModule() {
  const { currentRole, lmsMaterials, addAuditLog } = useIMS();

  // Roles allowed to upload & edit courseware
  const canUpload = ['Teacher', 'Super Admin', 'Director', 'Principal', 'Branch Head', 'Academic Coordinator'].includes(currentRole);

  const [activeTab, setActiveTab] = useState<'Video' | 'PDF Notes' | 'Assignment' | 'Quiz'>('Video');
  const [materialsList, setMaterialsList] = useState<LMSCourseMaterial[]>(lmsMaterials);
  const [selectedMaterial, setSelectedMaterial] = useState<LMSCourseMaterial>(lmsMaterials[0] || {
    id: 'LMS-01',
    subject: 'Data Structures & Algorithms',
    classBatch: 'B.Tech CS - Sem 4',
    title: 'Advanced Graph Algorithms & Shortest Path',
    type: 'Video',
    author: 'Prof. Rajesh Kumar',
    date: '2026-08-01',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    durationOrPages: '45 Mins',
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Upload Form State
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: 'Data Structures & Algorithms',
    classBatch: 'B.Tech CS - Sem 4',
    type: 'Video' as 'Video' | 'PDF Notes' | 'Assignment' | 'Quiz',
    author: currentRole === 'Teacher' ? 'Prof. Faculty User' : `${currentRole} Admin`,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    durationOrPages: '30 Mins',
  });

  const filtered = materialsList.filter((m) => m.type === activeTab);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpload) return;

    const item: LMSCourseMaterial = {
      id: `LMS-${Date.now().toString().slice(-4)}`,
      title: newMaterial.title,
      subject: newMaterial.subject,
      classBatch: newMaterial.classBatch,
      type: newMaterial.type,
      author: newMaterial.author,
      date: new Date().toISOString().split('T')[0],
      url: newMaterial.url,
      durationOrPages: newMaterial.durationOrPages,
    };

    setMaterialsList((prev) => [item, ...prev]);
    setSelectedMaterial(item);
    setIsUploadModalOpen(false);
    setNewMaterial({
      title: '',
      subject: 'Data Structures & Algorithms',
      classBatch: 'B.Tech CS - Sem 4',
      type: 'Video',
      author: currentRole === 'Teacher' ? 'Prof. Faculty User' : `${currentRole} Admin`,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      durationOrPages: '30 Mins',
    });

    setUploadSuccessMsg('New study material published successfully!');
    setTimeout(() => setUploadSuccessMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {canUpload ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-purple-400" /> Instructor Upload Access Granted
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Lock className="h-3 w-3 text-amber-400" /> Read-Only Mode: Browse, Stream & Download Study Material
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Video className="h-5 w-5 text-purple-400" /> Learning Management System (LMS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Video lectures, downloadable PDF lecture notes, online assignments, and auto-graded quizzes.
          </p>
        </div>

        {/* Upload Button visible ONLY to authorized roles (Teacher, Admin, Super Admin) */}
        {canUpload ? (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30"
          >
            <Upload className="h-4 w-4" /> + Upload Courseware
          </button>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
            <Lock className="h-3.5 w-3.5 text-amber-400" /> Upload restricted to Faculty & Admins
          </div>
        )}
      </div>

      {uploadSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {uploadSuccessMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
        {(['Video', 'PDF Notes', 'Assignment', 'Quiz'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === t ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t}s
          </button>
        ))}
      </div>

      {/* Main Grid: Courseware Selection & Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Material List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available {activeTab}s</h3>
          {filtered.length > 0 ? (
            filtered.map((mat) => (
              <div
                key={mat.id}
                onClick={() => setSelectedMaterial(mat)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
                  selectedMaterial.id === mat.id ? 'bg-purple-950/60 border-purple-500 shadow-lg' : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <h3 className="font-bold text-white text-sm">{mat.title}</h3>
                <p className="text-purple-300 mt-1">{mat.subject} • {mat.author}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                  <span>Added: {mat.date}</span>
                  {mat.durationOrPages && <span className="font-mono text-purple-400 font-bold">{mat.durationOrPages}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-slate-400 text-xs text-center">
              No {activeTab} materials uploaded yet.
            </div>
          )}
        </div>

        {/* Right: Interactive Player / Viewer */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base">{selectedMaterial.title}</h3>
              <p className="text-xs text-purple-400 font-semibold">{selectedMaterial.subject} • Faculty: {selectedMaterial.author}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {selectedMaterial.type}
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
                <p className="text-xs text-slate-400 mt-1">High-resolution vector PDF notes published by {selectedMaterial.author}</p>
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
              <h4 className="font-bold text-white text-sm">Interactive Quiz: Data Structures & Algorithms</h4>
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

      {/* Upload Courseware Modal (Faculty & Admin Only) */}
      {isUploadModalOpen && canUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Upload New Courseware Material</h3>
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
                  placeholder="e.g. Graph Algorithms & Dijkstra's Algorithm"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Material Type</label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Video">Video</option>
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                  <select
                    value={newMaterial.subject}
                    onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Data Structures & Algorithms">Data Structures</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Database Management Systems">Database Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                  </select>
                </div>
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
    </div>
  );
}
