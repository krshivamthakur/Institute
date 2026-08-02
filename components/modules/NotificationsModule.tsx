'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { NotificationItem } from '@/lib/ims-data';
import { BellRing, CheckCircle2, Plus, X, Send, Lock, Megaphone, Award, DollarSign, UserCheck } from 'lucide-react';

export function NotificationsModule() {
  const {
    currentRole,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useIMS();

  const canBroadcast = ['Super Admin', 'Director', 'Principal', 'Branch Head', 'Academic Coordinator', 'Teacher', 'Accountant', 'HR'].includes(currentRole);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  const [newNotice, setNewNotice] = useState({
    title: '',
    message: '',
    type: 'Announcement' as NotificationItem['type'],
    targetRole: 'All',
  });

  const handleOpenAddModal = () => {
    setNewNotice({
      title: '',
      message: '',
      type: 'Announcement',
      targetRole: 'All',
    });
    setIsAddModalOpen(true);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    setNotificationMsg('All notifications marked as read!');
    setTimeout(() => setNotificationMsg(''), 2500);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      title: newNotice.title,
      message: newNotice.message,
      type: newNotice.type,
      date: 'Just now',
      read: false,
      targetRole: newNotice.targetRole,
    });
    setIsAddModalOpen(false);
    setNewNotice({
      title: '',
      message: '',
      type: 'Announcement',
      targetRole: 'All',
    });
    setNotificationMsg('New announcement broadcasted successfully!');
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BellRing className="h-5 w-5 text-amber-400" /> Notifications & Triggered Reminders
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated triggers for fee due alerts, low attendance warnings, exam notifications, and broadcast circulars. ({unreadCount} Unread)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Mark All as Read
            </button>
          )}
          {canBroadcast && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/30"
            >
              <Plus className="h-4 w-4" /> Broadcast Announcement
            </button>
          )}
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {notificationMsg}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
              n.read
                ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                : 'bg-blue-950/40 border-blue-700 text-slate-100 font-medium shadow-md'
            }`}
          >
            <div className="flex justify-between items-center font-bold">
              <span className="text-blue-300 text-sm flex items-center gap-2">
                {!n.read && <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />}
                {n.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {n.type || 'Notice'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{n.date}</span>
              </div>
            </div>
            <p className="mt-1 text-slate-300">{n.message}</p>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Broadcast System Announcement</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Examination Schedule"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Notification Type</label>
                  <select
                    value={newNotice.type}
                    onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value as NotificationItem['type'] })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Fee Due">Fee Due</option>
                    <option value="Exam">Exam</option>
                    <option value="Attendance">Attendance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Role Audience</label>
                  <select
                    value={newNotice.targetRole}
                    onChange={(e) => setNewNotice({ ...newNotice, targetRole: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="All">All Roles</option>
                    <option value="Student">Students</option>
                    <option value="Teacher">Faculty</option>
                    <option value="Accountant">Accountants</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Message Content</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter notification broadcast message body..."
                  value={newNotice.message}
                  onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                />
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
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" /> Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
