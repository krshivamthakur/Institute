'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  Home,
  Users,
  CheckCircle2,
  AlertCircle,
  Key,
} from 'lucide-react';

export function HostelDashboard() {
  const { hostelRooms, setActiveModule } = useIMS();

  const totalCapacity = hostelRooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = hostelRooms.reduce((acc, r) => acc + r.occupied, 0);
  const occupancyPct = totalCapacity > 0 ? ((occupiedBeds / totalCapacity) * 100).toFixed(1) : 85;

  return (
    <div className="space-y-6">
      {/* Hostel Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-violet-950/80 to-slate-900 border border-violet-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-violet-400" /> Residential & Hostel Operations
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Night Attendance Sync Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hostel Allocation & Resident Security
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Manage room bed allocation, review night outing pass requests, monitor hostel roll call attendance, and resolve room maintenance complaints.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('hostel')}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/30 flex items-center gap-2"
            >
              <Home className="h-4 w-4" /> Manage Hostel Rooms
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-violet-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hostel Occupancy</span>
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
              <Home className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{occupancyPct}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{occupiedBeds} / {totalCapacity} Beds Occupied</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Rooms</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Key className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{hostelRooms.length} Rooms</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">Across 2 Blocks (A & B)</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outing Passes Pending</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">4 Requests</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">Pending Approval</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Night Roll Call Status</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">100%</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ All Residents Accounted</p>
        </div>
      </div>
    </div>
  );
}
