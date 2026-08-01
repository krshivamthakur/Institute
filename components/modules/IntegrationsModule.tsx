'use client';

import React from 'react';
import { Link, CheckCircle2, RefreshCw, Key, ShieldCheck } from 'lucide-react';

export function IntegrationsModule() {
  const integrations = [
    { name: 'Razorpay Payment Gateway', category: 'Payments', status: 'Connected', key: 'rzp_live_998127391823' },
    { name: 'PhonePe Business UPI', category: 'Payments', status: 'Connected', key: 'merchant_phonepe_0912' },
    { name: 'WhatsApp Business API', category: 'Communication', status: 'Connected', key: 'waba_v18_tok_8829' },
    { name: 'Fast2SMS Gateway', category: 'SMS', status: 'Connected', key: 'sms_api_key_8891' },
    { name: 'Zoom Video Conferencing', category: 'Virtual Classes', status: 'Connected', key: 'zoom_oauth_client_091' },
    { name: 'Google Meet & Calendar API', category: 'Integrations', status: 'Connected', key: 'gsuite_service_acc_key' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Link className="h-5 w-5 text-indigo-400" /> API & Integration Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Status, API Key secret store, and live test sandboxes for Razorpay, WhatsApp, SMS, Zoom, and Google Drive.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((ig, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-bold text-white text-sm">{ig.name}</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                {ig.status} ✓
              </span>
            </div>
            <p className="text-xs text-slate-400">Category: {ig.category}</p>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <Key className="h-3.5 w-3.5 text-indigo-400" />
              <span className="truncate">{ig.key}</span>
            </div>
            <button className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition">
              Test Connection Sandbox
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
