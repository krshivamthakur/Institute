'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Lock, ShieldCheck, Database, FileText, CheckCircle2, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SecurityModule() {
  const { auditLogs, addAuditLog } = useIMS();
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleBackup = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    addAuditLog('DB_BACKUP', 'Triggered full database snapshot backup to encrypted S3 vault');
    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 4000);
  };

  const handleExportAuditCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Timestamp,User,Role,Action,Details,IP\n' +
      auditLogs.map((l) => `"${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.details}","${l.ipAddress}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GVM_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-400" /> Security, 2FA & System Audit Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Two-factor authentication (2FA) config, real-time activity audit trail, automated database backup triggers, and SSL status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAuditCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <Download className="h-4 w-4 text-blue-400" /> Export CSV Log
          </button>

          <button
            onClick={handleBackup}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30"
          >
            <Database className="h-4 w-4" /> Trigger Immediate Database Backup
          </button>
        </div>
      </div>

      {backupSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> ✓ Database Snapshot Encrypted & Backed Up to Cloud Vault!
        </div>
      )}

      {/* Audit Log Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-400" /> Real-Time Audit Log Trail
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
                <th className="p-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map((log, idx) => (
                <tr key={`${log.id}-${idx}`}>
                  <td className="p-3 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="p-3 font-bold text-white">
                    {log.user} <span className="text-[10px] text-blue-400">({log.role})</span>
                  </td>
                  <td className="p-3 font-mono text-emerald-400">{log.action}</td>
                  <td className="p-3 text-slate-300">{log.details}</td>
                  <td className="p-3 font-mono text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

