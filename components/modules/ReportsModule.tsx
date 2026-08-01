'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { BarChart3, Download, Filter, FileText, CheckCircle2 } from 'lucide-react';

export function ReportsModule() {
  const { students, feeTransactions } = useIMS();
  const [reportCategory, setReportCategory] = useState('Fees');

  const handleExportCsv = () => {
    const csvRows = ['RollNo,Name,ClassBatch,AttendancePct,FeeStatus'];
    students.forEach((s) => csvRows.push(`${s.rollNo},${s.name},${s.classBatch},${s.attendancePct},${s.feeStatus}`));
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IMS_${reportCategory}_Report_2026.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" /> Reports & Custom Analytics Builder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate custom reports for Admissions, Attendance, Fee Collections, Student Performance, and Financial P&L with instant CSV export.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
        >
          <Download className="h-4 w-4" /> Export Report (CSV)
        </button>
      </div>

      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
        {['Fees', 'Attendance', 'Admissions', 'Performance', 'Financials'].map((cat) => (
          <button
            key={cat}
            onClick={() => setReportCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              reportCategory === cat ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat} Report
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Previewing Generated {reportCategory} Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Batch</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="p-3 font-bold text-white">{s.name}</td>
                  <td className="p-3 text-slate-300">{s.classBatch}</td>
                  <td className="p-3 font-bold text-emerald-400">{s.attendancePct}%</td>
                  <td className="p-3 font-bold text-purple-300">{s.feeStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
