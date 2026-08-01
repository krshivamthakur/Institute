'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { ShieldAlert, Check, X, Save, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function RBACModule() {
  const { currentRole, addAuditLog } = useIMS();

  const [matrix, setMatrix] = useState([
    { module: 'Student Admission & Profiles', admin: true, teacher: true, student: false, parent: false, accountant: true },
    { module: 'Fee Collection & Receipting', admin: true, teacher: false, student: true, parent: true, accountant: true },
    { module: 'Exam Marks Entry & Grading', admin: true, teacher: true, student: false, parent: false, accountant: false },
    { module: 'Payroll & Faculty Salary', admin: true, teacher: false, student: false, parent: false, accountant: true },
    { module: 'Library Book Issue / Return', admin: true, teacher: true, student: true, parent: false, accountant: false },
    { module: 'Hostel Room Allocation', admin: true, teacher: false, student: false, parent: false, accountant: false },
  ]);

  const [notification, setNotification] = useState('');
  const isSuperAdmin = currentRole === 'Super Admin';

  const handleTogglePermission = (idx: number, roleKey: 'admin' | 'teacher' | 'student' | 'parent' | 'accountant') => {
    if (!isSuperAdmin) {
      alert('Only Super Admin can modify system permission matrix policies.');
      return;
    }
    setMatrix((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [roleKey]: !row[roleKey] } : row))
    );
  };

  const handleSavePolicy = () => {
    if (!isSuperAdmin) {
      alert('Only Super Admin can save system permission policies.');
      return;
    }
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    addAuditLog('RBAC_UPDATE', 'Updated global Role-Based Access Control permission matrix policy');
    setNotification('RBAC Permission Policy updated and applied across all session roles!');
    setTimeout(() => setNotification(''), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" /> Role-Based Access Control (RBAC) Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure permission scopes across all system roles and restrict administrative module access.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleSavePolicy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30"
          >
            <Save className="h-4 w-4" /> Save RBAC Policy
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Interactive Permissions Matrix */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">System Module Permission Matrix</h3>
          <span className="text-xs text-slate-400 font-mono">
            {isSuperAdmin ? 'Click cells to toggle access' : '🔒 Read-Only Policy View'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Module Capability</th>
                <th className="p-3.5 text-center">Super Admin</th>
                <th className="p-3.5 text-center">Faculty / Teacher</th>
                <th className="p-3.5 text-center">Student</th>
                <th className="p-3.5 text-center">Parent</th>
                <th className="p-3.5 text-center">Accountant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {matrix.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/40 transition">
                  <td className="p-3.5 font-bold text-slate-200">{row.module}</td>
                  {(['admin', 'teacher', 'student', 'parent', 'accountant'] as const).map((rKey) => {
                    const isAllowed = row[rKey];
                    return (
                      <td
                        key={rKey}
                        onClick={() => handleTogglePermission(i, rKey)}
                        className={`p-3.5 text-center cursor-pointer transition ${
                          isSuperAdmin ? 'hover:bg-slate-800/80' : ''
                        }`}
                      >
                        {isAllowed ? (
                          <span className="inline-flex p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex p-1.5 rounded-lg bg-slate-900 text-slate-600 border border-slate-800">
                            <X className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
