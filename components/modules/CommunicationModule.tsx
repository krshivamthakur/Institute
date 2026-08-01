'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { MessageSquare, Send, Mail, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function CommunicationModule() {
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [recipientGroup, setRecipientGroup] = useState('All Students');
  const [messageText, setMessageText] = useState('Dear Student/Parent, mid-term examination timetable has been published on the Aura Portal. Please download your admit card.');
  const [sentNotice, setSentNotice] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-400" /> Multi-Channel Communication Broadcast
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch automated bulk WhatsApp messages, SMS notifications, email circulars, and event announcements.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-slate-800 max-w-xl mx-auto space-y-4">
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {(['WhatsApp', 'SMS', 'Email'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                channel === ch ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ch} Gateway
            </button>
          ))}
        </div>

        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Target Audience Group</label>
            <select
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
            >
              <option value="All Students">All Enrolled Students (340 Records)</option>
              <option value="All Parents">All Registered Parents</option>
              <option value="Faculty & Staff">Faculty & Department Staff</option>
              <option value="Fee Defaulters">Students with Pending Fee Dues</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Broadcast Message Body</label>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" /> Dispatch Bulk {channel} Broadcast
          </button>
        </form>

        {sentNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
            ✓ Sent broadcast via {channel} API to {recipientGroup}!
          </div>
        )}
      </div>
    </div>
  );
}
