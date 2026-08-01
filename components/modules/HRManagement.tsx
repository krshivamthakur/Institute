'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { UserPlus2, CheckCircle2, FileText, Briefcase, Plus, X, Send } from 'lucide-react';

export function HRManagement() {
  const { addAuditLog } = useIMS();
  const [openings, setOpenings] = useState([
    { id: 'JOB-1', title: 'Assistant Prof - AI & Machine Learning', dept: 'Computer Science', applicants: 14, status: 'Screening' },
    { id: 'JOB-2', title: 'Associate Prof - VLSI Design', dept: 'Electronics', applicants: 8, status: 'Interviewing' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const [newJob, setNewJob] = useState({
    title: 'Senior Lecturer - Cloud Computing',
    dept: 'Computer Science',
  });

  const handlePostVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
      title: newJob.title,
      dept: newJob.dept,
      applicants: 0,
      status: 'Open',
    };
    setOpenings((prev) => [created, ...prev]);
    setIsModalOpen(false);
    addAuditLog('HR_VACANCY', `Posted faculty vacancy: ${newJob.title}`);
    setNotification(`Faculty job opening "${newJob.title}" posted successfully!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <UserPlus2 className="h-5 w-5 text-purple-400" /> Human Resources & Employee Onboarding
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Faculty recruitment pipeline, employee onboarding checklists, HR leave policy, and appraisals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30"
        >
          <Plus className="h-4 w-4" /> Post Faculty Vacancy
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 col-span-2">
          <h3 className="font-bold text-white text-sm">Active Faculty Recruitment Openings</h3>
          <div className="space-y-2">
            {openings.map((job) => (
              <div key={job.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-purple-300">{job.title}</h4>
                  <p className="text-slate-400 text-[11px]">{job.dept} • {job.applicants} Applicants</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-sm">Onboarding Checklist</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Document Verification
            </p>
            <p className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Biometric Enrollment
            </p>
            <p className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Salary Account Setup
            </p>
          </div>
        </div>
      </div>

      {/* Vacancy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Post Faculty Vacancy Position</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePostVacancy} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assistant Professor - Cloud Computing"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Department</label>
                <select
                  value={newJob.dept}
                  onChange={(e) => setNewJob({ ...newJob, dept: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Management Studies">Management Studies</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" /> Publish Job Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
