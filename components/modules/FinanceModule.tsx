'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { FinancialEntry } from '@/lib/ims-data';
import { DollarSign, TrendingUp, TrendingDown, FileSpreadsheet, Plus, X, CheckCircle2 } from 'lucide-react';

export function FinanceModule() {
  const { financials, addAuditLog } = useIMS();
  const [financialsList, setFinancialsList] = useState<FinancialEntry[]>(financials);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form State
  const [newEntry, setNewEntry] = useState({
    type: 'Expense' as 'Income' | 'Expense',
    category: 'Lab Supplies' as 'Tuition Fees' | 'Payroll' | 'Infrastructure' | 'Lab Supplies' | 'Utilities' | 'Events',
    description: 'Hardware Lab Oscilloscopes Purchase',
    amount: 45000,
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Bank Transfer',
    branch: 'Main Campus - New Delhi',
    gstAmount: 8100,
  });

  const totalIncome = financialsList.filter((f) => f.type === 'Income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = financialsList.filter((f) => f.type === 'Expense').reduce((a, b) => a + b.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FinancialEntry = {
      id: `FIN-${Math.floor(100 + Math.random() * 900)}`,
      type: newEntry.type,
      category: newEntry.category,
      description: newEntry.description,
      amount: Number(newEntry.amount),
      date: newEntry.date,
      paymentMode: newEntry.paymentMode,
      branch: newEntry.branch,
      gstAmount: Number(newEntry.gstAmount),
    };
    setFinancialsList((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    addAuditLog('FINANCE_ADD', `Logged ${newEntry.type} entry of ₹${newEntry.amount} for ${newEntry.description}`);
    setNotification(`Financial ${newEntry.type} of ₹${newEntry.amount.toLocaleString()} recorded successfully!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" /> Accounts & Financial Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Income & expense entries, GST tax reports export, bank reconciliation, and P&L statements.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30"
        >
          <Plus className="h-4 w-4" /> Log Expense / Income
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue (Income)</span>
          <p className="text-2xl font-black text-emerald-400">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Expenses</span>
          <p className="text-2xl font-black text-rose-400">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Net Institute Surplus</span>
          <p className="text-2xl font-black text-blue-300">₹{netProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Mode</th>
              <th className="p-3.5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {financialsList.map((f) => (
              <tr key={f.id}>
                <td className="p-3.5 font-bold text-white">{f.category}</td>
                <td className="p-3.5 text-slate-300">{f.description}</td>
                <td className="p-3.5 font-bold">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${f.type === 'Income' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {f.type}
                  </span>
                </td>
                <td className="p-3.5 font-mono font-bold text-white">₹{f.amount.toLocaleString()}</td>
                <td className="p-3.5 text-slate-400">{f.paymentMode}</td>
                <td className="p-3.5 text-slate-400">{f.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Finance Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Log Financial Ledger Entry</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Entry Type</label>
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Tuition Fees">Tuition Fees</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Lab Supplies">Lab Supplies</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={newEntry.paymentMode}
                    onChange={(e) => setNewEntry({ ...newEntry, paymentMode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash Counter</option>
                  </select>
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
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
