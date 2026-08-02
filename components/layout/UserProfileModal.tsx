'use client';

import React, { useState, useEffect } from 'react';
import { useIMS } from '@/context/IMSContext';
import { MOCK_BRANCHES } from '@/lib/ims-data';
import { User, Mail, Phone, Lock, Building2, Camera, Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
];

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { authUser, updateUser, updateUserPassword, teachers, updateTeacher, students, updateStudent } = useIMS();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 12345');
  const [avatar, setAvatar] = useState('');
  const [branch, setBranch] = useState('Main Campus - New Delhi');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || '');
      setEmail(authUser.email || '');
      setAvatar(authUser.avatar || PRESET_AVATARS[0]);
      setBranch(authUser.branch || 'Main Campus - New Delhi');
      setNewPassword('');

      // Find matching teacher/student phone if available
      const matchingTeacher = teachers.find((t) => t.id === authUser.id || t.email === authUser.email);
      const matchingStudent = students.find((s) => s.id === authUser.id || s.email === authUser.email);

      if (matchingTeacher) setPhone(matchingTeacher.phone);
      else if (matchingStudent) setPhone(matchingStudent.phone);
    }
  }, [authUser, teachers, students, isOpen]);

  if (!isOpen || !authUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // 1. Update global authUser and users list
    updateUser(authUser.id, {
      name: name.trim(),
      email: email.trim(),
      avatar: avatar.trim(),
      branch,
    });

    // 2. Update password if changed
    if (newPassword.trim().length >= 4) {
      updateUserPassword(authUser.id, newPassword.trim());
    }

    // 3. Update matching teacher if user is a teacher
    const matchingTeacher = teachers.find(
      (t) => t.id === authUser.id || t.empId === authUser.empIdOrRollNo || t.email === authUser.email || t.name === authUser.name
    );
    if (matchingTeacher) {
      updateTeacher(matchingTeacher.id, {
        name: name.trim(),
        email: email.trim(),
        avatar: avatar.trim(),
        branch,
        phone,
      });
    }

    // 4. Update matching student if user is a student
    const matchingStudent = students.find(
      (s) => s.id === authUser.id || s.rollNo === authUser.empIdOrRollNo || s.email === authUser.email || s.name === authUser.name
    );
    if (matchingStudent) {
      updateStudent(matchingStudent.id, {
        name: name.trim(),
        email: email.trim(),
        avatar: avatar.trim(),
        branch,
        phone,
      });
    }

    setSuccessMsg('Profile updated successfully!');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto select-none">
      <div className="w-full max-w-lg max-h-[85vh] sm:max-h-[88vh] flex flex-col glass-panel-glow border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight truncate">Edit Profile Account</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Update personal details, avatar photo & security</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition shrink-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Success Alert */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Selector & Photo Preview */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <label className="block text-slate-300 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Camera className="h-4 w-4 text-purple-400" /> Profile Picture Avatar
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Role: {authUser.role}</span>
              </label>

              <div className="flex items-center gap-4">
                <img
                  src={avatar || PRESET_AVATARS[0]}
                  alt="Avatar Preview"
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-purple-500/50 shadow-xl shrink-0"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-[10px] text-slate-400 block truncate">Select preset photo below or paste custom image URL</span>
                </div>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`h-9 w-9 rounded-xl border overflow-hidden shrink-0 transition ${
                      avatar === url ? 'ring-2 ring-purple-400 border-purple-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* User Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-blue-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Phone & Campus Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-emerald-400" /> Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-amber-400" /> Campus Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {MOCK_BRANCHES.map((b) => (
                    <option key={b.id} value={b.name} className="bg-slate-900 text-slate-100">
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Security Password Change */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-rose-400" /> Update Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="profile-edit-form"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4" /> Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );
}
