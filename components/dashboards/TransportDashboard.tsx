'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';
import {
  Bus,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export function TransportDashboard() {
  const { transportRoutes, setActiveModule } = useIMS();

  const activeBuses = transportRoutes.length;
  const totalStudentsTransported = transportRoutes.reduce((acc, r) => acc + r.studentsAssigned, 0);

  return (
    <div className="space-y-6">
      {/* Transport Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-yellow-950/80 to-slate-900 border border-yellow-500/30 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1.5">
                <Bus className="h-3.5 w-3.5 text-yellow-400" /> Fleet Logistics & Live GPS
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Radio className="h-3 w-3 animate-pulse inline mr-1" /> GPS Tracking Live
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Transport Operations & Bus Fleet Control
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Track bus location in real-time, monitor driver compliance, review student route allocations, and manage fleet maintenance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveModule('transport')}
              className="px-4 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold transition shadow-lg shadow-yellow-600/30 flex items-center gap-2"
            >
              <Bus className="h-4 w-4" /> Live GPS Fleet Tracking
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-yellow-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bus Fleet</span>
            <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
              <Bus className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{activeBuses} Buses</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ All Vehicles Operational</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Transported</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{totalStudentsTransported}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across {activeBuses} City Routes</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">On-Time Arrival Rate</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">98.4%</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">Punctual Trips</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance Alerts</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">1 Vehicle</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">Scheduled Servicing</p>
        </div>
      </div>
    </div>
  );
}
