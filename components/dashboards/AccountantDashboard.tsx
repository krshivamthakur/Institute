'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DAILY_COLLECTION_DATA = [
  { day: 'Mon', collection: 120000 },
  { day: 'Tue', collection: 185000 },
  { day: 'Wed', collection: 240000 },
  { day: 'Thu', collection: 190000 },
  { day: 'Fri', collection: 310000 },
  { day: 'Sat', collection: 150000 },
];

export function AccountantDashboard() {
  const { feeTransactions, students, addFeeTransaction, setActiveModule } = useIMS();
  const [studentId, setStudentId] = useState('STU-1001');
  const [amount, setAmount] = useState('15000');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'Bank Transfer' | 'Cash'>('UPI');
  const [paid, setPaid] = useState(false);

  const totalFeeCollected = feeTransactions.reduce((acc, t) => acc + t.amount, 0);

  const handleQuickCollect = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId) || students[0];
    addFeeTransaction({
      studentId: st.id,
      studentName: st.name,
      rollNo: st.rollNo,
      classBatch: st.classBatch,
      amount: Number(amount),
      feeType: 'Tuition Fee',
      paymentMode: paymentMode === 'UPI' ? 'UPI (PhonePe)' : paymentMode === 'Card' ? 'Card' : paymentMode === 'Bank Transfer' ? 'Bank Transfer' : 'Cash',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setPaid(true);
    setTimeout(() => setPaid(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Accountant Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/90 to-slate-900 border border-emerald-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Accounts & Finance Hub
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                FY 2025-26 Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Finance & Fee Collection Control
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Process student tuition fee receipts, track pending overdue payments, manage institutional expenses, and export financial audit logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('fees')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> Full Fee Registry
            </button>
            <button
              onClick={() => setActiveModule('finance')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" /> Financial Entries
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue Collected</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">₹{(totalFeeCollected / 100000).toFixed(2)}L</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" /> +16.8% this term
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Overdue Dues</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">₹4.25L</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">18 Students Overdue</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transactions</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{feeTransactions.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Verified Receipts</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Cash Desk</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">₹1.95L</p>
          <p className="text-[11px] text-indigo-400 font-semibold mt-1">12 Receipts Issued Today</p>
        </div>
      </div>

      {/* Express Fee Collection Form & Daily Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Express Fee Collection Widget */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center justify-between">
            <span>Express Fee Cashier Desk</span>
            <CreditCard className="h-5 w-5 text-emerald-400" />
          </h3>
          <p className="text-xs text-slate-400">Record quick student fee collection receipt.</p>

          <form onSubmit={handleQuickCollect} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo}) - Dues: ₹{s.feeDue}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Payment Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {(['UPI', 'Card', 'Bank Transfer', 'Cash'] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setPaymentMode(m)}
                    className={`p-2 rounded-xl text-xs font-bold border transition ${
                      paymentMode === m
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {paid ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                ✓ Receipt Issued & Payment Saved!
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30"
              >
                Collect ₹{amount} & Generate Receipt
              </button>
            )}
          </form>
        </div>

        {/* Daily Collection Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Weekly Collection Flow</h3>
              <p className="text-xs text-slate-400">Daily collection trend across all counter desks.</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_COLLECTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`]}
                />
                <Bar dataKey="collection" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
