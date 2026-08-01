'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { UserPlus, Search, CheckCircle, Clock, XCircle, Plus, FileCheck } from 'lucide-react';

export function AdmissionManagement() {
  const { leads, addLead } = useIMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-400" /> Admission & Lead CRM Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Online application intake, counselling stage follow-ups, document verification, and admission approval workflow.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search admission enquiries by applicant name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
        >
          <option value="All">All Stages</option>
          <option value="New">New Applications</option>
          <option value="Counselled">Counselled</option>
          <option value="Approved">Approved</option>
        </select>
      </div>

      <div className="rounded-2xl glass-panel border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3.5">Applicant Name</th>
              <th className="p-3.5">Interested Course</th>
              <th className="p-3.5">Contact & Email</th>
              <th className="p-3.5">Counsellor</th>
              <th className="p-3.5">Pipeline Stage</th>
              <th className="p-3.5 text-right">Approval Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td className="p-3.5 font-bold text-white">
                  {lead.studentName}
                  <span className="block text-[10px] text-slate-400 font-normal">Parent: {lead.parentName}</span>
                </td>
                <td className="p-3.5 text-slate-200 font-medium">{lead.interestedCourse}</td>
                <td className="p-3.5 font-mono text-slate-400">
                  {lead.phone}
                  <span className="block text-[10px] text-slate-500 font-sans">{lead.email}</span>
                </td>
                <td className="p-3.5 text-slate-300">{lead.counsellor}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      lead.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : lead.status === 'Counselled'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition">
                    Approve Admission
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
