'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { AuthUser, MOCK_ROLES, MOCK_BRANCHES, UserRole } from '@/lib/ims-data';
import {
  ShieldAlert,
  Check,
  X,
  Save,
  CheckCircle2,
  UserPlus,
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Link2,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function RBACModule() {
  const {
    currentRole,
    users,
    students,
    addUser,
    updateUser,
    deleteUser,
    updateUserRole,
    updateUserPassword,
    linkParentToChild,
    addAuditLog,
  } = useIMS();

  const isSuperAdmin = currentRole === 'Super Admin';
  const [activeTab, setActiveTab] = useState<'users' | 'rbac'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLinkParentModalOpen, setIsLinkParentModalOpen] = useState(false);

  const [selectedUserForEdit, setSelectedUserForEdit] = useState<AuthUser | null>(null);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<AuthUser | null>(null);
  const [selectedParentForLink, setSelectedParentForLink] = useState<AuthUser | null>(null);
  const [selectedChildStudentId, setSelectedChildStudentId] = useState<string>('');

  const [notification, setNotification] = useState('');

  // Password Visibility Toggle
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Add User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    empIdOrRollNo: '',
    role: 'Teacher' as UserRole,
    branch: 'Main Campus - New Delhi',
    password: 'admin123',
    childStudentId: '',
  });

  // Edit User Form State
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    empIdOrRollNo: '',
    role: 'Teacher' as UserRole,
    branch: 'Main Campus - New Delhi',
    password: '',
    childStudentId: '',
  });

  // RBAC Permission Matrix State
  const [matrix, setMatrix] = useState([
    { module: 'Student Admission & Profiles', admin: true, teacher: true, student: false, parent: false, accountant: true },
    { module: 'Fee Collection & Receipting', admin: true, teacher: false, student: true, parent: true, accountant: true },
    { module: 'Exam Marks Entry & Grading', admin: true, teacher: true, student: false, parent: false, accountant: false },
    { module: 'Payroll & Faculty Salary', admin: true, teacher: false, student: false, parent: false, accountant: true },
    { module: 'Library Book Issue / Return', admin: true, teacher: true, student: true, parent: false, accountant: false },
    { module: 'Hostel Room Allocation', admin: true, teacher: false, student: false, parent: false, accountant: false },
    { module: 'Inventory & Asset Tracking', admin: true, teacher: false, student: false, parent: false, accountant: true },
    { module: 'Transport Fleet Management', admin: true, teacher: true, student: false, parent: false, accountant: false },
  ]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.empIdOrRollNo && u.empIdOrRollNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRoleFilter === 'All' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenEditUser = (user: AuthUser) => {
    setSelectedUserForEdit(user);
    setEditUserForm({
      name: user.name,
      email: user.email,
      empIdOrRollNo: user.empIdOrRollNo || '',
      role: user.role,
      branch: user.branch || 'Main Campus - New Delhi',
      password: user.password || '',
      childStudentId: user.childStudentId || '',
    });
    setIsEditUserModalOpen(true);
  };

  const handleOpenPasswordModal = (user: AuthUser) => {
    setSelectedUserForPassword(user);
    setPasswordInput(user.password || 'admin123');
    setShowPassword(false);
    setIsPasswordModalOpen(true);
  };

  const handleOpenLinkModal = (parentUser: AuthUser) => {
    setSelectedParentForLink(parentUser);
    setSelectedChildStudentId(parentUser.childStudentId || students[0]?.id || 'STU-1001');
    setIsLinkParentModalOpen(true);
  };

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let pass = 'Pass';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordInput(pass);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Only Super Admin can add new user accounts.');
      return;
    }

    addUser({
      name: newUser.name,
      email: newUser.email,
      empIdOrRollNo: newUser.empIdOrRollNo || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      role: newUser.role,
      branch: newUser.branch,
      password: newUser.password || 'admin123',
      childStudentId: newUser.role === 'Parent' ? newUser.childStudentId : undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    });

    setIsAddUserModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      empIdOrRollNo: '',
      role: 'Teacher',
      branch: 'Main Campus - New Delhi',
      password: 'admin123',
      childStudentId: '',
    });
    setNotification(`New user account created for ${newUser.name} as ${newUser.role}!`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSaveEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !selectedUserForEdit) return;

    const payload: Partial<AuthUser> = {
      name: editUserForm.name,
      email: editUserForm.email,
      empIdOrRollNo: editUserForm.empIdOrRollNo,
      role: editUserForm.role,
      branch: editUserForm.branch,
      childStudentId: editUserForm.role === 'Parent' ? editUserForm.childStudentId : undefined,
    };
    if (editUserForm.password) {
      payload.password = editUserForm.password;
    }

    updateUser(selectedUserForEdit.id, payload);

    if (editUserForm.role === 'Parent' && editUserForm.childStudentId) {
      linkParentToChild(selectedUserForEdit.id, editUserForm.childStudentId);
    }

    setIsEditUserModalOpen(false);
    setSelectedUserForEdit(null);
    setNotification(`User account details updated for ${editUserForm.name}!`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSavePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !selectedUserForPassword) return;

    if (!passwordInput || passwordInput.trim().length < 3) {
      alert('Password must be at least 3 characters long.');
      return;
    }

    updateUserPassword(selectedUserForPassword.id, passwordInput.trim());
    setIsPasswordModalOpen(false);
    confetti({ particleCount: 50, spread: 40, origin: { y: 0.7 } });
    setNotification(`Password for ${selectedUserForPassword.name} updated to "${passwordInput.trim()}"!`);
    setSelectedUserForPassword(null);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleSaveLinkParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !selectedParentForLink || !selectedChildStudentId) return;

    linkParentToChild(selectedParentForLink.id, selectedChildStudentId);
    setIsLinkParentModalOpen(false);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });

    const linkedStudent = students.find((s) => s.id === selectedChildStudentId || s.rollNo === selectedChildStudentId);
    setNotification(
      `Parent account "${selectedParentForLink.name}" connected to child student "${linkedStudent?.name || selectedChildStudentId}"!`
    );
    setSelectedParentForLink(null);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteUserAccount = (user: AuthUser) => {
    if (!isSuperAdmin) return;
    if (window.confirm(`Are you sure you want to delete user account "${user.name}" (${user.role})?`)) {
      deleteUser(user.id);
      setNotification(`User account ${user.name} removed.`);
      setTimeout(() => setNotification(''), 3500);
    }
  };

  const handleQuickRoleChange = (userId: string, newRole: UserRole) => {
    if (!isSuperAdmin) {
      alert('Only Super Admin can change user roles.');
      return;
    }
    updateUserRole(userId, newRole);
    setNotification(`User role updated to ${newRole}!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleTogglePermission = (idx: number, roleKey: 'admin' | 'teacher' | 'student' | 'parent' | 'accountant') => {
    if (!isSuperAdmin) {
      alert('Only Super Admin can modify system permission matrix policies.');
      return;
    }
    setMatrix((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [roleKey]: !row[roleKey] } : row))
    );
  };

  const handleSavePolicy = () => {
    if (!isSuperAdmin) {
      alert('Only Super Admin can save system permission policies.');
      return;
    }
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    addAuditLog('RBAC_UPDATE', 'Updated global Role-Based Access Control permission matrix policy');
    setNotification('RBAC Permission Policy updated and applied across all session roles!');
    setTimeout(() => setNotification(''), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isSuperAdmin ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Shield className="h-3 w-3 text-rose-400" /> Super Admin Full Governance Access Active
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🔒 Read-Only Policy View
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" /> User Directory, Parent-Child Link & Access Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage user credentials, connect Parent accounts to Child student accounts, assign user roles, and enforce RBAC rules.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
          >
            <UserPlus className="h-4 w-4" /> Add New User Account
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {notification}
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" /> User Accounts & Parent-Child Linker ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'rbac' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="h-4 w-4" /> Role Permission Matrix Policy
        </button>
      </div>

      {/* Tab 1: User Management & Directory */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* User Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold">Total Accounts</span>
              <p className="text-xl font-extrabold text-white mt-1">{users.length}</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold">Admin & Executives</span>
              <p className="text-xl font-extrabold text-rose-400 mt-1">
                {users.filter((u) => ['Super Admin', 'Director', 'Principal', 'Branch Head'].includes(u.role)).length}
              </p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold">Faculty & Staff</span>
              <p className="text-xl font-extrabold text-blue-400 mt-1">
                {users.filter((u) => ['Teacher', 'Academic Coordinator', 'HR', 'Accountant'].includes(u.role)).length}
              </p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold">Parent Accounts</span>
              <p className="text-xl font-extrabold text-purple-400 mt-1">
                {users.filter((u) => u.role === 'Parent').length}
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="All">All User Roles</option>
                {MOCK_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">User Identity</th>
                    <th className="p-3.5">Email & ID</th>
                    <th className="p-3.5">Assigned User Role</th>
                    <th className="p-3.5">Child Link Status</th>
                    <th className="p-3.5">Campus Branch</th>
                    {isSuperAdmin && <th className="p-3.5 text-right">Super Admin Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => {
                    const linkedChild = students.find(
                      (s) =>
                        s.id === u.childStudentId ||
                        s.rollNo === u.childStudentId ||
                        s.parentName.toLowerCase().includes(u.name.toLowerCase().replace('(parent)', '').trim())
                    );

                    return (
                      <tr key={u.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <p className="font-bold text-white leading-snug">{u.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">ID: {u.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <p className="text-slate-300 font-medium">{u.email}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{u.empIdOrRollNo || 'N/A'}</p>
                        </td>

                        <td className="p-3.5">
                          {isSuperAdmin ? (
                            <select
                              value={u.role}
                              onChange={(e) => handleQuickRoleChange(u.id, e.target.value as UserRole)}
                              className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-rose-300 font-bold focus:outline-none focus:border-rose-500"
                            >
                              {MOCK_ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {u.role}
                            </span>
                          )}
                        </td>

                        {/* Child Link Status Column */}
                        <td className="p-3.5">
                          {u.role === 'Parent' ? (
                            linkedChild ? (
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1">
                                  <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
                                  {linkedChild.name} ({linkedChild.rollNo})
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                                <X className="h-3 w-3" /> Unlinked Child
                              </span>
                            )
                          ) : (
                            <span className="text-slate-600 text-[10px]">—</span>
                          )}
                        </td>

                        <td className="p-3.5 text-slate-300 font-mono text-[11px]">{u.branch || 'Main Campus'}</td>

                        {isSuperAdmin && (
                          <td className="p-3.5 text-right space-x-1.5">
                            {u.role === 'Parent' && (
                              <button
                                onClick={() => handleOpenLinkModal(u)}
                                className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-[11px] font-bold transition inline-flex items-center gap-1"
                                title="Connect Parent to Child Student"
                              >
                                <Link2 className="h-3.5 w-3.5" /> Connect Child
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenPasswordModal(u)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 text-[11px] font-bold transition inline-flex items-center gap-1"
                              title="Edit User Password"
                            >
                              <KeyRound className="h-3.5 w-3.5" /> Password
                            </button>

                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
                              title="Edit User Details"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteUserAccount(u)}
                              className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition"
                              title="Delete User Account"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">System Module Permission Matrix</h3>
            {isSuperAdmin && (
              <button
                onClick={handleSavePolicy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
              >
                <Save className="h-4 w-4" /> Save Permission Policy
              </button>
            )}
          </div>

          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Module Capability</th>
                    <th className="p-3.5 text-center">Super Admin</th>
                    <th className="p-3.5 text-center">Faculty / Teacher</th>
                    <th className="p-3.5 text-center">Student</th>
                    <th className="p-3.5 text-center">Parent</th>
                    <th className="p-3.5 text-center">Accountant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {matrix.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5 font-bold text-slate-200">{row.module}</td>
                      {(['admin', 'teacher', 'student', 'parent', 'accountant'] as const).map((rKey) => {
                        const isAllowed = row[rKey];
                        return (
                          <td
                            key={rKey}
                            onClick={() => handleTogglePermission(i, rKey)}
                            className={`p-3.5 text-center cursor-pointer transition ${
                              isSuperAdmin ? 'hover:bg-slate-800/80' : ''
                            }`}
                          >
                            {isAllowed ? (
                              <span className="inline-flex p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            ) : (
                              <span className="inline-flex p-1.5 rounded-lg bg-slate-900 text-slate-600 border border-slate-800">
                                <X className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Connect Parent to Child Student Modal */}
      {isLinkParentModalOpen && selectedParentForLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Link2 className="h-4 w-4 text-purple-400" /> Connect Parent Account to Child Student
              </h3>
              <button onClick={() => setIsLinkParentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200">
              <p className="font-bold text-white">Parent: {selectedParentForLink.name}</p>
              <p className="text-[11px] text-purple-300 mt-0.5">{selectedParentForLink.email}</p>
            </div>

            <form onSubmit={handleSaveLinkParentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Connected Child Student</label>
                <select
                  value={selectedChildStudentId}
                  onChange={(e) => setSelectedChildStudentId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo}) — {s.classBatch}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkParentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <UserCheck className="h-4 w-4" /> Connect & Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && selectedUserForPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-400" /> Manage User Account Password
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <p className="font-bold text-white">{selectedUserForPassword.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedUserForPassword.email} • Role: <span className="text-rose-300 font-bold">{selectedUserForPassword.role}</span>
              </p>
            </div>

            <form onSubmit={handleSavePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-400 font-semibold">Set New Password</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Auto-Generate
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 pr-10 text-white font-mono"
                    placeholder="Enter new password..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordInput('admin123')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex-1"
                >
                  Reset to "admin123"
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-rose-400" /> Register New User Account
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Gupta"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.gupta@auraims.edu"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Emp ID / Roll No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-509"
                    value={newUser.empIdOrRollNo}
                    onChange={(e) => setNewUser({ ...newUser, empIdOrRollNo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">User Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    {MOCK_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {newUser.role === 'Parent' && (
                <div>
                  <label className="block text-purple-300 font-semibold mb-1">Connect Child Student</label>
                  <select
                    value={newUser.childStudentId}
                    onChange={(e) => setNewUser({ ...newUser, childStudentId: e.target.value })}
                    className="w-full bg-slate-800 border border-purple-500/50 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="">-- Select Child Student --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo}) — {s.classBatch}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Account Password</label>
                <input
                  type="text"
                  required
                  placeholder="Initial Password..."
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Branch Campus</label>
                <select
                  value={newUser.branch}
                  onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {MOCK_BRANCHES.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit className="h-4 w-4 text-rose-400" /> Edit User Account & Parent Link
              </h3>
              <button onClick={() => setIsEditUserModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Emp ID / Roll No</label>
                  <input
                    type="text"
                    required
                    value={editUserForm.empIdOrRollNo}
                    onChange={(e) => setEditUserForm({ ...editUserForm, empIdOrRollNo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Assigned Role</label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value as UserRole })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    {MOCK_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {editUserForm.role === 'Parent' && (
                <div>
                  <label className="block text-purple-300 font-semibold mb-1">Connected Child Student</label>
                  <select
                    value={editUserForm.childStudentId}
                    onChange={(e) => setEditUserForm({ ...editUserForm, childStudentId: e.target.value })}
                    className="w-full bg-slate-800 border border-purple-500/50 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="">-- Select Child Student --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo}) — {s.classBatch}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Password (Leave blank to keep unchanged)</label>
                <input
                  type="text"
                  placeholder="New password..."
                  value={editUserForm.password}
                  onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Branch Campus</label>
                <select
                  value={editUserForm.branch}
                  onChange={(e) => setEditUserForm({ ...editUserForm, branch: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {MOCK_BRANCHES.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
