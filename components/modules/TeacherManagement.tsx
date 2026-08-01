'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Teacher } from '@/lib/ims-data';
import {
  GraduationCap,
  UserPlus,
  Search,
  DollarSign,
  Calendar,
  Star,
  CheckCircle,
  Clock,
  Check,
  X,
  Plus,
} from 'lucide-react';

export function TeacherManagement() {
  const { teachers, addTeacher } = useIMS();
  const [activeTab, setActiveTab] = useState<'directory' | 'payroll' | 'leaves' | 'performance'>('directory');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LV-1', empName: 'Prof. Rajesh Khanna', type: 'Casual Leave', dates: 'Aug 10 - Aug 12', reason: 'Family function', status: 'Pending' },
    { id: 'LV-2', empName: 'Dr. Kavita Reddy', type: 'Medical Leave', dates: 'Aug 04 - Aug 05', reason: 'Health checkup', status: 'Approved' },
  ]);

  const handleApproveLeave = (id: string) => {
    setLeaveRequests((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-400" /> Teacher & Staff Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Faculty profiles, payroll disbursements, leave approval workflow, and academic performance reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-500/20"
          >
            <UserPlus className="h-4 w-4" /> Add Faculty Member
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
        {[
          { id: 'directory', label: 'Faculty Directory' },
          { id: 'payroll', label: 'Salary & Payroll' },
          { id: 'leaves', label: 'Leave Requests' },
          { id: 'performance', label: 'Performance Review' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <div key={t.id} className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-purple-400" />
                  <div>
                    <h3 className="font-bold text-sm text-white">{t.name}</h3>
                    <p className="text-xs text-purple-300 font-semibold">{t.designation}</p>
                    <p className="text-[10px] text-slate-400">{t.department}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-300"><strong>Employee ID:</strong> {t.empId}</p>
                  <p className="text-slate-300"><strong>Specialization:</strong> {t.subjectSpecialization.join(', ')}</p>
                  <p className="text-slate-300"><strong>Campus:</strong> {t.branch}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /> {t.rating} / 5.0
                </span>
                <span className="text-slate-400">Attendance: <strong className="text-emerald-400">{t.attendancePct}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" /> Monthly Payroll Calculator & Disbursement
          </h3>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Faculty Name</th>
                <th className="p-3">Base Salary</th>
                <th className="p-3">HRA & Allowances</th>
                <th className="p-3">Deductions (TDS/PF)</th>
                <th className="p-3">Net Salary</th>
                <th className="p-3 text-right">Payroll Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {teachers.map((t) => {
                const hra = Math.round(t.salary * 0.2);
                const pf = Math.round(t.salary * 0.1);
                const net = t.salary + hra - pf;
                return (
                  <tr key={t.id}>
                    <td className="p-3 font-bold text-white">{t.name}</td>
                    <td className="p-3 font-mono">₹{t.salary.toLocaleString()}</td>
                    <td className="p-3 font-mono text-emerald-400">+₹{hra.toLocaleString()}</td>
                    <td className="p-3 font-mono text-rose-400">-₹{pf.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-emerald-300">₹{net.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]">
                        Disburse Salary
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-400" /> Faculty Leave Approval Portal
          </h3>
          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{req.empName}</h4>
                  <p className="text-slate-400 mt-0.5">{req.type} • {req.dates} ({req.reason})</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {req.status}
                  </span>
                  {req.status === 'Pending' && (
                    <button
                      onClick={() => handleApproveLeave(req.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Faculty Academic Appraisals & Feedback</h3>
          <div className="space-y-3">
            {teachers.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-slate-400">{t.subjectSpecialization.join(', ')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-amber-400 font-bold">Rating: {t.rating} / 5.0 ⭐</span>
                  <button className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px]">
                    Submit Appraisal Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
