'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  Users,
  GraduationCap,
  CreditCard,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const REVENUE_TREND_DATA = [
  { month: 'Jan', revenue: 4500000, expenses: 2100000 },
  { month: 'Feb', revenue: 5200000, expenses: 2300000 },
  { month: 'Mar', revenue: 6800000, expenses: 2800000 },
  { month: 'Apr', revenue: 5900000, expenses: 2400000 },
  { month: 'May', revenue: 7400000, expenses: 3100000 },
  { month: 'Jun', revenue: 8900000, expenses: 3500000 },
  { month: 'Jul', revenue: 9500000, expenses: 3800000 },
];

const BRANCH_PERFORMANCE = [
  { name: 'Main Campus (Delhi)', students: 1240, revenue: '₹48.5L', rating: 4.9 },
  { name: 'North Campus (Blr)', students: 860, revenue: '₹32.1L', rating: 4.8 },
  { name: 'Tech Campus (Pune)', students: 620, revenue: '₹24.8L', rating: 4.7 },
];

export function ExecutiveDashboard() {
  const { students, teachers, feeTransactions, auditLogs, setActiveModule } = useIMS();

  const totalFeeCollected = feeTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Executive Overview
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                All 3 Campuses Sync Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Governance & Enterprise Hub
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              High-level strategic metrics across institution revenue, total enrolments, multi-branch operations, and real-time compliance logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('multi-branch')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" /> Multi-Branch Admin
            </button>
            <button
              onClick={() => setActiveModule('rbac')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <Layers className="h-4 w-4" /> RBAC & Security
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Strategic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolments</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">2,720</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" /> +14.2% YoY Growth
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Fee Collection</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">₹1.05 Cr</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="h-3.5 w-3.5" /> +18.5% this quarter
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Strength</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{teachers.length + 18}</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-semibold">
            <span>Across 12 Departments</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operating Campuses</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">3 Campuses</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400 font-semibold">
            <Activity className="h-3.5 w-3.5" /> 100% Operational
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart & Branch Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Institutional Revenue vs Expenditure</h3>
              <p className="text-xs text-slate-400">Monthly breakdown across tuition fees, payroll, and infrastructure.</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              FY 2025-26
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="execRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="execExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${(Number(val) / 100000).toFixed(1)} Lakhs`]}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#execRevenueGrad)" />
                <Area type="monotone" dataKey="expenses" name="Expenditure" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#execExpenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Branch Performance Ranking */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center justify-between">
            <span>Branch Performance</span>
            <Building2 className="h-4 w-4 text-indigo-400" />
          </h3>
          <p className="text-xs text-slate-400">Live operational stats by campus.</p>

          <div className="space-y-3">
            {BRANCH_PERFORMANCE.map((b, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{b.name}</span>
                  <span className="text-[11px] font-extrabold text-emerald-400">{b.revenue}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Enroled: {b.students} Students</span>
                  <span className="text-amber-400 font-bold">★ {b.rating} Rating</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Governance Audit Trail Table */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Recent Security & Governance Audit Trail
          </h3>
          <button
            onClick={() => setActiveModule('security')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
          >
            View Full Security Audit Log →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
                <th className="p-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.slice(0, 5).map((log, idx) => (
                <tr key={`${log.id}-${idx}`} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="p-3 font-bold text-white">
                    {log.user} <span className="text-indigo-400 font-normal">({log.role})</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{log.details}</td>
                  <td className="p-3 text-right font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
