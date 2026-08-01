'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  Library,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
} from 'lucide-react';

export function LibraryDashboard() {
  const { books, setActiveModule } = useIMS();

  const totalCopies = books.reduce((acc, b) => acc + b.copiesTotal, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.copiesAvailable, 0);

  return (
    <div className="space-y-6">
      {/* Library Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Library className="h-3.5 w-3.5 text-amber-400" /> Library & E-Resource Operations
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Library Catalog & Book Circulation
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Issue and return books, track overdue student borrowing penalties, and manage physical & digital catalog inventory.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('library')}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/30 flex items-center gap-2"
            >
              <Library className="h-4 w-4" /> Library Management
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Catalog Volumes</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{totalCopies}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across {books.length} Titles</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available on Shelves</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{availableCopies}</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">Ready to Issue</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Books Issued Currently</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Library className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{totalCopies - availableCopies}</p>
          <p className="text-[11px] text-blue-400 font-semibold mt-1">Borrowed by Students</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overdue Returns</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">6 Books</p>
          <p className="text-[11px] text-rose-400 font-semibold mt-1">Notice Issued</p>
        </div>
      </div>
    </div>
  );
}
