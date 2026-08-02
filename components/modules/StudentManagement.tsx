'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Student } from '@/lib/ims-data';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CreditCard,
  FileCheck,
  GraduationCap,
  Eye,
  Printer,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  Save,
  Lock,
  FileText,
  Building,
  User,
  ShieldAlert,
} from 'lucide-react';

export function StudentManagement() {
  const { authUser, currentRole, students, courses, addStudent, updateStudent, issueCertificate } = useIMS();

  const dynamicBatchOptions = Array.from(
    new Set([
      'B.Tech CS - Year 2',
      'B.Tech ECE - Year 2',
      'MBA - Year 1',
      'BCA - Year 1',
      ...courses.flatMap((c) => [
        `${c.code} - Year 1`,
        `${c.code} - Year 2`,
      ]),
      ...students.map((s) => s.classBatch),
    ])
  );

  const isStudentRole = currentRole === 'Student' || currentRole === 'Parent';
  const myStudent = currentRole === 'Parent'
    ? (students.find(
        (s) =>
          s.id === authUser?.childStudentId ||
          s.rollNo === authUser?.childStudentId ||
          (authUser?.name && s.parentName.toLowerCase().includes(authUser.name.toLowerCase().replace('(parent)', '').trim()))
      ) || students[0])
    : (students.find((s) => s.id === authUser?.empIdOrRollNo || s.rollNo === authUser?.empIdOrRollNo) || students[0]);

  // Admin View Filters
  const [filterBatch, setFilterBatch] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Active Selections
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);
  const [selectedStudentForTc, setSelectedStudentForTc] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'alumni' | 'allocation'>('all');

  // Student Profile Editing Form State
  const [profileForm, setProfileForm] = useState({
    name: myStudent?.name || '',
    email: myStudent?.email || '',
    phone: myStudent?.phone || '',
    parentName: myStudent?.parentName || '',
    parentPhone: myStudent?.parentPhone || '',
    gender: myStudent?.gender || 'Male',
    dob: myStudent?.dob || '2004-01-01',
    avatar: myStudent?.avatar || '',
  });

  // Success notifications
  const [saveNotification, setSaveNotification] = useState('');

  // New Student Admission Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classBatch: 'B.Tech CS - Year 2',
    branch: 'Main Campus - New Delhi',
    gender: 'Male' as const,
    dob: '2004-01-01',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'Active' as const,
    parentName: '',
    parentPhone: '',
    attendancePct: 100,
    feeStatus: 'Paid' as const,
    feeDue: 0,
    gpa: 3.8,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    documentsUploaded: { aadhar: false, marksheet: false, photo: false },
  });

  const handleOpenAdmissionModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      classBatch: 'B.Tech CS - Year 2',
      branch: 'Main Campus - New Delhi',
      gender: 'Male' as const,
      dob: '2004-01-01',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active' as const,
      parentName: '',
      parentPhone: '',
      attendancePct: 100,
      feeStatus: 'Paid' as const,
      feeDue: 0,
      gpa: 3.8,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      documentsUploaded: { aadhar: false, marksheet: false, photo: false },
    });
    setIsAddModalOpen(true);
  };

  // Filter students for admin view
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = filterBatch === 'All' || s.classBatch.includes(filterBatch);
    const matchesStatus =
      filterStatus === 'All'
        ? activeTab === 'alumni'
          ? s.status === 'Alumni'
          : true
        : s.status === filterStatus;
    return matchesSearch && matchesBatch && matchesStatus;
  });

  const handleSaveSelfProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myStudent) return;
    updateStudent(myStudent.id, {
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      parentName: profileForm.parentName,
      parentPhone: profileForm.parentPhone,
      gender: profileForm.gender as any,
      dob: profileForm.dob,
    });
    setSaveNotification('Profile updated successfully!');
    setTimeout(() => setSaveNotification(''), 3000);
  };

  const handleDocumentToggle = (studentId: string, docType: 'aadhar' | 'marksheet' | 'photo') => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;
    const updatedDocs = {
      ...target.documentsUploaded,
      [docType]: !target.documentsUploaded[docType],
    };
    updateStudent(studentId, { documentsUploaded: updatedDocs });
    setSaveNotification(`Document ${docType.toUpperCase()} status updated!`);
    setTimeout(() => setSaveNotification(''), 3000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const rollNo = `2026-REG-${Math.floor(100 + Math.random() * 900)}`;
    addStudent({
      ...formData,
      rollNo,
    });
    setIsAddModalOpen(false);
    setSaveNotification('New student registered successfully!');
    setTimeout(() => setSaveNotification(''), 3000);
  };

  const handleIssueTc = (student: Student) => {
    issueCertificate({
      certificateNo: `IMS-TC-${Date.now().toString().slice(-4)}`,
      studentId: student.id,
      studentName: student.name,
      type: 'Transfer Certificate',
      issueDate: new Date().toISOString().split('T')[0],
      purpose: 'Course Completion & Transfer',
      issuedBy: 'Principal Office',
    });
    updateStudent(student.id, { status: 'Transferred' });
    setSelectedStudentForTc(student);
  };

  const handleStatusChange = (studentId: string, newStatus: 'Active' | 'Inactive' | 'Alumni' | 'Transferred') => {
    updateStudent(studentId, { status: newStatus });
    setSaveNotification(`Student status updated to ${newStatus}`);
    setTimeout(() => setSaveNotification(''), 3000);
  };

  // -------------------------------------------------------------
  // 1. STUDENT SELF-SERVICE VIEW (Restricted to Own Profile)
  // -------------------------------------------------------------
  if (isStudentRole) {
    const student = myStudent || students[0];

    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-blue-500/30 glass-panel shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-400" /> Student Profile & Identity Hub
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Scoped to Your Account Only
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                My Student Profile & Documents
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Manage your personal profile details, upload identity verification documents, view allocated batch & class, and print your official Student ID Card.
              </p>
            </div>

            <button
              onClick={() => setSelectedStudentForIdCard(student)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> View & Print ID Card
            </button>
          </div>
        </div>

        {saveNotification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="h-4 w-4 text-emerald-400" /> {saveNotification}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Student Profile Management Form */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Edit className="h-4 w-4 text-blue-400" /> Student Profile Management
              </h3>
              <span className="text-xs text-slate-400 font-mono">Roll No: {student.rollNo}</span>
            </div>

            <form onSubmit={handleSaveSelfProfile} className="space-y-4 text-xs">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <img
                  src={profileForm.avatar || student.avatar}
                  alt={student.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-blue-500/40 shadow-lg"
                />
                <div className="flex-1 space-y-1">
                  <label className="block text-slate-400 font-semibold">Avatar Image URL</label>
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={profileForm.dob}
                    onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.parentName}
                    onChange={(e) => setProfileForm({ ...profileForm, parentName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Parent Contact Number</label>
                  <input
                    type="text"
                    required
                    value={profileForm.parentPhone}
                    onChange={(e) => setProfileForm({ ...profileForm, parentPhone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Column 3: Document Uploads & Batch Allocation Info */}
          <div className="space-y-6">
            {/* Document Upload Card (Aadhar, Marksheet, Photo) */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <h3 className="font-extrabold text-white text-base flex items-center justify-between">
                <span>Document Upload Center</span>
                <Upload className="h-5 w-5 text-blue-400" />
              </h3>
              <p className="text-xs text-slate-400">Upload and verify mandatory identity documents.</p>

              <div className="space-y-3">
                {/* Aadhar Upload */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-blue-400" /> Aadhar Card
                    </h4>
                    <p className="text-[10px] text-slate-400">Government Identity Proof</p>
                  </div>
                  <button
                    onClick={() => handleDocumentToggle(student.id, 'aadhar')}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                      student.documentsUploaded.aadhar
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                    }`}
                  >
                    {student.documentsUploaded.aadhar ? '✓ Verified' : '+ Upload Aadhar'}
                  </button>
                </div>

                {/* Marksheet Upload */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-purple-400" /> Class Marksheet
                    </h4>
                    <p className="text-[10px] text-slate-400">Previous Academic Certificate</p>
                  </div>
                  <button
                    onClick={() => handleDocumentToggle(student.id, 'marksheet')}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                      student.documentsUploaded.marksheet
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                    }`}
                  >
                    {student.documentsUploaded.marksheet ? '✓ Verified' : '+ Upload Marksheet'}
                  </button>
                </div>

                {/* Photo Upload */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-amber-400" /> Passport Photo
                    </h4>
                    <p className="text-[10px] text-slate-400">Official ID Photo</p>
                  </div>
                  <button
                    onClick={() => handleDocumentToggle(student.id, 'photo')}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                      student.documentsUploaded.photo
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                    }`}
                  >
                    {student.documentsUploaded.photo ? '✓ Verified' : '+ Upload Photo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Batch & Class Allocation Details Card */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-emerald-400" /> Batch & Academic Allocation
              </h3>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Allocated Batch:</span>
                  <span className="font-bold text-white">{student.classBatch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Campus Branch:</span>
                  <span className="font-bold text-blue-400">{student.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Enrollment Date:</span>
                  <span className="font-mono text-slate-300">{student.admissionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {student.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Transfer Certificate Card */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-purple-400" /> Transfer Certificate (TC)
              </h3>
              <p className="text-xs text-slate-400">View or download your issued institutional TC document.</p>

              {student.status === 'Transferred' ? (
                <button
                  onClick={() => setSelectedStudentForTc(student)}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <FileCheck className="h-4 w-4" /> Download / Print TC Document
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                  TC is issued upon course completion or formal exit request. Status: <span className="text-emerald-400 font-bold">Active Enrolment</span>.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ID Card Modal */}
        {selectedStudentForIdCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl printable-area">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 no-print">
                <h3 className="font-bold text-sm text-white">Student Identification Card</h3>
                <button onClick={() => setSelectedStudentForIdCard(null)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-900 via-slate-900 to-indigo-950 border-2 border-blue-500/50 shadow-2xl text-center space-y-3 relative overflow-hidden">
                <h4 className="font-black text-sm text-white tracking-wide uppercase">AURA INSTITUTE OF TECHNOLOGY</h4>
                <p className="text-[9px] text-blue-300 font-semibold tracking-wider">OFFICIAL STUDENT IDENTIFICATION</p>

                <img
                  src={selectedStudentForIdCard.avatar}
                  alt={selectedStudentForIdCard.name}
                  className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-blue-400 ring-4 ring-blue-500/20 shadow-md"
                />

                <div>
                  <h5 className="font-extrabold text-base text-white">{selectedStudentForIdCard.name}</h5>
                  <p className="text-xs font-mono font-bold text-blue-400">{selectedStudentForIdCard.rollNo}</p>
                  <p className="text-xs text-slate-300">{selectedStudentForIdCard.classBatch}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-0.5">
                  <p>DOB: {selectedStudentForIdCard.dob} • Gender: {selectedStudentForIdCard.gender}</p>
                  <p>Phone: {selectedStudentForIdCard.phone}</p>
                  <p className="font-bold text-emerald-400 mt-1">Status: ACTIVE STUDENT</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 no-print">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4" /> Print ID Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ADMIN & FACULTY MANAGEMENT SUITE (Full Institutional Control)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Admin & Staff Scoped View
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" /> Student Management & Admissions Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage registrations, edit profiles, process document uploads, assign batches, issue Transfer Certificates, and manage Alumni.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdmissionModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
          >
            <UserPlus className="h-4 w-4" /> + Register New Student
          </button>
        </div>
      </div>

      {saveNotification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-400" /> {saveNotification}
        </div>
      )}

      {/* Admin Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('alumni')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'alumni'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          🎓 Alumni Management ({students.filter((s) => s.status === 'Alumni').length})
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Batches</option>
            <option value="B.Tech CS">B.Tech CS</option>
            <option value="B.Tech ECE">B.Tech ECE</option>
            <option value="MBA">MBA</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Alumni">Alumni</option>
            <option value="Transferred">Transferred</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Student Info</th>
                <th className="p-3.5">Class / Batch Allocation</th>
                <th className="p-3.5">Document Uploads</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="h-10 w-10 rounded-full object-cover border border-slate-700" />
                      <div>
                        <p className="font-bold text-slate-100">{s.name}</p>
                        <p className="text-[10px] text-blue-400 font-mono">{s.rollNo}</p>
                        <p className="text-[10px] text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <p className="font-bold text-slate-200">{s.classBatch}</p>
                    <p className="text-[10px] text-slate-400">📍 {s.branch}</p>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDocumentToggle(s.id, 'aadhar')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                          s.documentsUploaded.aadhar
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                        title="Click to toggle Aadhar status"
                      >
                        Aadhar {s.documentsUploaded.aadhar ? '✓' : '✗'}
                      </button>
                      <button
                        onClick={() => handleDocumentToggle(s.id, 'marksheet')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                          s.documentsUploaded.marksheet
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                        title="Click to toggle Marksheet status"
                      >
                        Marksheet {s.documentsUploaded.marksheet ? '✓' : '✗'}
                      </button>
                      <button
                        onClick={() => handleDocumentToggle(s.id, 'photo')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                          s.documentsUploaded.photo
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                        title="Click to toggle Photo status"
                      >
                        Photo {s.documentsUploaded.photo ? '✓' : '✗'}
                      </button>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-slate-900 border ${
                        s.status === 'Active'
                          ? 'text-emerald-400 border-emerald-500/30'
                          : s.status === 'Alumni'
                          ? 'text-purple-400 border-purple-500/30'
                          : 'text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Transferred">Transferred</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingStudent(s)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Profile"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedStudentForIdCard(s)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-[10px] font-bold transition flex items-center gap-1"
                        title="Generate ID Card"
                      >
                        <CreditCard className="h-3 w-3" /> ID Card
                      </button>
                      <button
                        onClick={() => handleIssueTc(s)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-[10px] font-bold transition flex items-center gap-1"
                        title="Issue Transfer Certificate"
                      >
                        <FileCheck className="h-3 w-3" /> Issue TC
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal for Admins */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Edit Student Profile & Allocation</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStudent(editingStudent.id, editingStudent);
                setEditingStudent(null);
                setSaveNotification('Student profile updated successfully!');
                setTimeout(() => setSaveNotification(''), 3000);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Student Name</label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Class / Batch Allocation</label>
                <select
                  value={editingStudent.classBatch}
                  onChange={(e) => setEditingStudent({ ...editingStudent, classBatch: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                >
                  {dynamicBatchOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  {!dynamicBatchOptions.includes(editingStudent.classBatch) && (
                    <option value={editingStudent.classBatch}>{editingStudent.classBatch}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingStudent.phone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ID Card Generator Modal */}
      {selectedStudentForIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl printable-area">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 no-print">
              <h3 className="font-bold text-sm text-white">Student Official ID Card</h3>
              <button onClick={() => setSelectedStudentForIdCard(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-900 via-slate-900 to-indigo-950 border-2 border-blue-500/50 shadow-2xl text-center space-y-3 relative overflow-hidden">
              <h4 className="font-black text-sm text-white tracking-wide uppercase">AURA INSTITUTE OF TECHNOLOGY</h4>
              <p className="text-[9px] text-blue-300 font-semibold tracking-wider">OFFICIAL STUDENT IDENTIFICATION</p>

              <img
                src={selectedStudentForIdCard.avatar}
                alt={selectedStudentForIdCard.name}
                className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-blue-400 ring-4 ring-blue-500/20 shadow-md"
              />

              <div>
                <h5 className="font-extrabold text-base text-white">{selectedStudentForIdCard.name}</h5>
                <p className="text-xs font-mono font-bold text-blue-400">{selectedStudentForIdCard.rollNo}</p>
                <p className="text-xs text-slate-300">{selectedStudentForIdCard.classBatch}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-0.5">
                <p>DOB: {selectedStudentForIdCard.dob} • Gender: {selectedStudentForIdCard.gender}</p>
                <p>Phone: {selectedStudentForIdCard.phone}</p>
                <p className="font-bold text-emerald-400 mt-1">Status: ACTIVE STUDENT</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Print ID Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Certificate Modal */}
      {selectedStudentForTc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl printable-area">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 no-print">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-purple-400" /> Transfer Certificate (TC) Issued
              </h3>
              <button onClick={() => setSelectedStudentForTc(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs space-y-3 font-serif">
              <h4 className="text-center font-bold text-base text-amber-300">TRANSFER CERTIFICATE</h4>
              <p className="text-center text-[10px] text-slate-400">Aura Institute of Management & Technology</p>
              <p className="pt-2">This is to certify that <strong>{selectedStudentForTc.name}</strong> (Roll No: <strong>{selectedStudentForTc.rollNo}</strong>), son/daughter of <strong>{selectedStudentForTc.parentName}</strong>, was a student of <strong>{selectedStudentForTc.classBatch}</strong>.</p>
              <p>Character & Conduct: <strong>EXCELLENT</strong>. All dues cleared up to date.</p>
              <div className="pt-4 flex justify-between text-[10px] font-sans font-bold">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Authorized Signatory: Principal</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Download / Print TC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Student Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">New Student Admission Form</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Course / Batch</label>
                  <select
                    value={formData.classBatch}
                    onChange={(e) => setFormData({ ...formData, classBatch: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    {dynamicBatchOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Parent Name</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Register & Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
