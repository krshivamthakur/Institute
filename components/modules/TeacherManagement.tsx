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
  CheckCircle2,
} from 'lucide-react';

export function TeacherManagement() {
  const { teachers, addTeacher, addFinancialEntry, addAuditLog } = useIMS();
  const [activeTab, setActiveTab] = useState<'directory' | 'payroll' | 'leaves' | 'performance'>('directory');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [disbursedStaff, setDisbursedStaff] = useState<Record<string, boolean>>({});

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LV-1', empName: 'Prof. Rajesh Khanna', type: 'Casual Leave', dates: 'Aug 10 - Aug 12', reason: 'Family function', status: 'Pending' },
    { id: 'LV-2', empName: 'Dr. Kavita Reddy', type: 'Medical Leave', dates: 'Aug 04 - Aug 05', reason: 'Health checkup', status: 'Approved' },
  ]);

  // New Faculty Form State
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    salary: 85000,
    subjectSpecialization: 'AI & Data Analytics',
    branch: 'Main Campus - New Delhi',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const handleApproveLeave = (id: string) => {
    setLeaveRequests((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l)));
    setNotification('Faculty leave request approved!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDisburseSalary = (t: Teacher, netAmount: number) => {
    addFinancialEntry({
      type: 'Expense',
      category: 'Payroll',
      description: `Faculty Monthly Salary Disbursed to ${t.name} (${t.empId})`,
      amount: netAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'Bank Transfer',
      branch: t.branch,
      gstAmount: 0,
    });
    setDisbursedStaff((prev) => ({ ...prev, [t.id]: true }));
    setNotification(`Salary of ₹${netAmount.toLocaleString()} disbursed to ${t.name}!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const empId = `EMP-TCH-${Math.floor(100 + Math.random() * 900)}`;
    addTeacher({
      empId,
      name: newFaculty.name,
      email: newFaculty.email,
      phone: newFaculty.phone,
      department: newFaculty.department,
      designation: newFaculty.designation,
      subjectSpecialization: [newFaculty.subjectSpecialization],
      salary: Number(newFaculty.salary),
      rating: 4.8,
      status: 'Active',
      joiningDate: newFaculty.joiningDate,
      attendancePct: 98,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      branch: newFaculty.branch,
    });
    setIsAddModalOpen(false);
    setNotification(`Faculty member "${newFaculty.name}" added successfully!`);
    setTimeout(() => setNotification(''), 3000);
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

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs text-slate-300">
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
                  const isPaid = disbursedStaff[t.id];
                  return (
                    <tr key={t.id}>
                      <td className="p-3 font-bold text-white">{t.name}</td>
                      <td className="p-3 font-mono">₹{t.salary.toLocaleString()}</td>
                      <td className="p-3 font-mono text-emerald-400">+₹{hra.toLocaleString()}</td>
                      <td className="p-3 font-mono text-rose-400">-₹{pf.toLocaleString()}</td>
                      <td className="p-3 font-mono font-bold text-emerald-300">₹{net.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        {isPaid ? (
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                            Disbursed ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDisburseSalary(t, net)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                          >
                            Disburse Salary
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
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
                  <button
                    onClick={() => {
                      addAuditLog('APPRAISAL_SUBMIT', `Submitted appraisal for ${t.name}`);
                      setNotification(`Appraisal report submitted for ${t.name}!`);
                      setTimeout(() => setNotification(''), 3000);
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition"
                  >
                    Submit Appraisal Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Add New Faculty Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFaculty} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Anand Verma"
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="anand@auraims.edu"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={newFaculty.phone}
                    onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department</label>
                  <select
                    value={newFaculty.department}
                    onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical Eng.">Mechanical Eng.</option>
                    <option value="Management Studies">Management Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={newFaculty.designation}
                    onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Base Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={newFaculty.salary}
                    onChange={(e) => setNewFaculty({ ...newFaculty, salary: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={newFaculty.subjectSpecialization}
                    onChange={(e) => setNewFaculty({ ...newFaculty, subjectSpecialization: e.target.value })}
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
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30"
                >
                  Register Faculty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
