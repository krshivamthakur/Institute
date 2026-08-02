'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { FeeTransaction } from '@/lib/ims-data';
import {
  CreditCard,
  Plus,
  Printer,
  DollarSign,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  Send,
  Lock,
  User,
  Download,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function FeeManagement() {
  const { authUser, currentRole, students, feeTransactions, addFeeTransaction } = useIMS();
  const isStudentRole = currentRole === 'Student';
  const isParentRole = currentRole === 'Parent';
  const isPersonalScope = isStudentRole || isParentRole;

  const targetStudent = isParentRole
    ? (students.find(
        (s) =>
          s.id === authUser?.childStudentId ||
          s.rollNo === authUser?.childStudentId ||
          (authUser?.name && s.parentName.toLowerCase().includes(authUser.name.toLowerCase().replace('(parent)', '').trim()))
      ) || students[0])
    : (students.find((s) => s.id === 'STU-1001') || students[0]);

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState(targetStudent?.feeDue ? String(targetStudent.feeDue) : '25000');
  const [paymentFeeType, setPaymentFeeType] = useState<'Tuition Fee' | 'Exam Fee' | 'Hostel Fee' | 'Transport Fee' | 'Lab Fee'>('Tuition Fee');
  const [paymentMode, setPaymentMode] = useState<'Online (Razorpay)' | 'UPI (PhonePe)' | 'Bank Transfer'>('Online (Razorpay)');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<FeeTransaction | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    const txnId = `pay_${Math.random().toString(36).substring(2, 11)}`;
    const currentStudentObj = isPersonalScope ? targetStudent : selectedStudent;

    const newTx: FeeTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      studentId: currentStudentObj.id,
      studentName: currentStudentObj.name,
      rollNo: currentStudentObj.rollNo,
      classBatch: currentStudentObj.classBatch,
      amount,
      feeType: paymentFeeType,
      paymentMode,
      transactionId: txnId,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
    };

    addFeeTransaction(newTx);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setIsCheckoutOpen(false);
    setActiveReceipt(newTx);
  };

  // -------------------------------------------------------------
  // 1. STUDENT & PARENT PERSONAL FEE PORTAL
  // -------------------------------------------------------------
  if (isPersonalScope) {
    const student = targetStudent;
    const myTransactions = feeTransactions.filter(
      (tx) => tx.studentId === student.id || tx.rollNo === student.rollNo || tx.studentName === student.name
    );

    const totalPaid = myTransactions.reduce((acc, t) => acc + (t.status === 'Completed' ? t.amount : 0), 0);

    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-500/30 glass-panel shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  {isParentRole ? 'Parent Child Fee & Payment Portal' : 'Student Fee & Receipt Portal'}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Scoped View: {student.name} ({student.rollNo})
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isParentRole ? `Fee Statement for ${student.name}` : 'My Fee Statement & Payment Receipts'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {isParentRole
                  ? `Review your child ${student.name}'s tuition fee statement, track receipt history, pay pending dues online, and download verified payment receipts.`
                  : 'View your tuition fee statement, track payment receipts, pay outstanding semester dues online, and download official fee receipts.'}
              </p>
            </div>

            {student.feeDue > 0 ? (
              <button
                onClick={() => {
                  setPaymentAmount(String(student.feeDue));
                  setIsCheckoutOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs transition shadow-xl shadow-emerald-600/30 flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" /> Pay Pending Dues (₹{student.feeDue.toLocaleString()})
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" /> All Dues Cleared
              </div>
            )}
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fees Paid</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">₹{totalPaid.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ Receipts Verified</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Fee Due</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">₹{student.feeDue.toLocaleString()}</p>
            <p className={`text-[11px] font-semibold mt-1 ${student.feeDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {student.feeDue > 0 ? 'Due Next Term' : 'No Outstanding Balance'}
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Status</span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <FileCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2 uppercase text-emerald-400">{student.feeStatus || 'Paid'}</p>
            <p className="text-[11px] text-slate-400 mt-1">B.Tech CS - Sem 4</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transactions</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">{myTransactions.length}</p>
            <p className="text-[11px] text-purple-300 mt-1">Official Payment Receipts</p>
          </div>
        </div>

        {/* Transactions Table for Logged-In Student Only */}
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">My Payment Transactions & Receipts</h3>
            <span className="text-xs text-emerald-400 font-bold">● Secure SSL Gateway</span>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Txn ID</th>
                <th className="p-3.5">Fee Type</th>
                <th className="p-3.5">Amount Paid</th>
                <th className="p-3.5">Payment Mode</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {myTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="p-3.5 font-mono text-slate-400">{tx.transactionId}</td>
                  <td className="p-3.5 font-bold text-white">{tx.feeType}</td>
                  <td className="p-3.5 font-bold text-emerald-300 font-mono">₹{tx.amount.toLocaleString()}</td>
                  <td className="p-3.5 text-slate-400">{tx.paymentMode}</td>
                  <td className="p-3.5 text-slate-400">{tx.date}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setActiveReceipt(tx)}
                      className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[11px] transition flex items-center gap-1.5 ml-auto"
                    >
                      <Download className="h-3 w-3" /> View / Download Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Printable Receipt Modal */}
        {activeReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl printable-area">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 no-print">
                <h3 className="font-bold text-sm text-white">Official Payment Receipt</h3>
                <button onClick={() => setActiveReceipt(null)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 text-xs space-y-3 font-mono">
                <div className="text-center border-b border-slate-800 pb-2">
                  <h4 className="font-extrabold text-sm text-white font-sans">AURA INSTITUTE OF TECHNOLOGY</h4>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">FEE PAYMENT RECEIPT</p>
                </div>

                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p><strong>Receipt No:</strong> {activeReceipt.transactionId}</p>
                  <p><strong>Student Name:</strong> {activeReceipt.studentName}</p>
                  <p><strong>Roll Number:</strong> {activeReceipt.rollNo}</p>
                  <p><strong>Fee Head:</strong> {activeReceipt.feeType}</p>
                  <p><strong>Amount Paid:</strong> ₹{activeReceipt.amount.toLocaleString()}</p>
                  <p><strong>Payment Mode:</strong> {activeReceipt.paymentMode}</p>
                  <p><strong>Date:</strong> {activeReceipt.date}</p>
                  <p className="text-emerald-400 font-bold mt-1">STATUS: PAYMENT VERIFIED & PAID</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end no-print">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4" /> Print / Download PDF Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ADMIN & ACCOUNTANT MANAGEMENT SUITE
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Admin & Cashier Scoped View
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-400" /> Fee & Collection Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fee structure configuration, installment plans, online payment gateway (Razorpay/Stripe), and receipt generation.
          </p>
        </div>

        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-500/20"
        >
          <CreditCard className="h-4 w-4" /> Collect Student Fee
        </button>
      </div>

      {/* Transactions History */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-x-auto shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Recent Payment Transactions</h3>
          <span className="text-xs text-emerald-400 font-bold">● Payment Gateways Active</span>
        </div>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3.5">Txn ID</th>
              <th className="p-3.5">Student</th>
              <th className="p-3.5">Fee Type</th>
              <th className="p-3.5">Amount Paid</th>
              <th className="p-3.5">Payment Mode</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {feeTransactions.map((tx) => (
              <tr key={tx.id}>
                <td className="p-3.5 font-mono text-slate-400">{tx.transactionId}</td>
                <td className="p-3.5 font-bold text-white">
                  {tx.studentName} <span className="text-[10px] text-slate-400 font-normal">({tx.rollNo})</span>
                </td>
                <td className="p-3.5 text-slate-300">{tx.feeType}</td>
                <td className="p-3.5 font-bold text-emerald-300 font-mono">₹{tx.amount.toLocaleString()}</td>
                <td className="p-3.5 text-slate-400">{tx.paymentMode}</td>
                <td className="p-3.5 text-slate-400">{tx.date}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => setActiveReceipt(tx)}
                    className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[11px] transition"
                  >
                    View Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cashier Payment Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Collect Student Tuition Fee</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              {!isPersonalScope ? (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => {
                      setSelectedStudentId(e.target.value);
                      const found = students.find((s) => s.id === e.target.value);
                      if (found) setPaymentAmount(String(found.feeDue || 25000));
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo}) - Due: ₹{s.feeDue.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                  <span className="text-slate-400 font-semibold block">Paying Fee For:</span>
                  <p className="font-extrabold text-white text-sm mt-0.5">{targetStudent.name} ({targetStudent.rollNo})</p>
                  <p className="text-[11px] text-emerald-400 font-mono mt-0.5">Outstanding Balance: ₹{targetStudent.feeDue.toLocaleString()}</p>
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Fee Head / Type</label>
                <select
                  value={paymentFeeType}
                  onChange={(e) => setPaymentFeeType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Tuition Fee">Tuition Fee</option>
                  <option value="Exam Fee">Exam Fee</option>
                  <option value="Hostel Fee">Hostel Fee</option>
                  <option value="Transport Fee">Transport Fee</option>
                  <option value="Lab Fee">Lab Fee</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Amount to Pay (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Online (Razorpay)">Online Gateway (Razorpay/Cards)</option>
                  <option value="UPI (PhonePe)">UPI (PhonePe / GPay)</option>
                  <option value="Bank Transfer">Bank Transfer / NEFT</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" /> Process & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal for Admins */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl printable-area">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 no-print">
              <h3 className="font-bold text-sm text-white">Official Fee Receipt</h3>
              <button onClick={() => setActiveReceipt(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 text-xs space-y-3 font-mono">
              <div className="text-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm text-white font-sans">AURA INSTITUTE OF TECHNOLOGY</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase">FEE PAYMENT RECEIPT</p>
              </div>

              <div className="space-y-1 text-slate-300 text-[11px]">
                <p><strong>Receipt No:</strong> {activeReceipt.transactionId}</p>
                <p><strong>Student Name:</strong> {activeReceipt.studentName}</p>
                <p><strong>Roll Number:</strong> {activeReceipt.rollNo}</p>
                <p><strong>Fee Head:</strong> {activeReceipt.feeType}</p>
                <p><strong>Amount Paid:</strong> ₹{activeReceipt.amount.toLocaleString()}</p>
                <p><strong>Payment Mode:</strong> {activeReceipt.paymentMode}</p>
                <p><strong>Date:</strong> {activeReceipt.date}</p>
                <p className="text-emerald-400 font-bold mt-1">STATUS: COMPLETED</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Download / Print PDF Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
