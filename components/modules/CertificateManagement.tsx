'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { FileCheck, Printer, Plus, Award, CheckCircle, Lock, User, Download } from 'lucide-react';

export function CertificateManagement() {
  const { currentRole, certificates, students, issueCertificate } = useIMS();
  const isStudentRole = currentRole === 'Student';
  const myStudent = students[0];

  const [certType, setCertType] = useState<'Bonafide' | 'Character' | 'Transfer Certificate' | 'Course Completion' | 'Experience'>('Bonafide');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [purpose, setPurpose] = useState('Official Administrative Documentation');
  const [previewCert, setPreviewCert] = useState<any | null>(null);

  const selectedStudent = isStudentRole ? (myStudent || students[0]) : (students.find((s) => s.id === selectedStudentId) || students[0]);

  // Filter certificates for logged-in student
  const myCertificates = certificates.filter(
    (c) => c.studentId === selectedStudent.id || c.studentName === selectedStudent.name
  );

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const certificateNo = `AURA-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert = {
      certificateNo,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      type: certType,
      issueDate: new Date().toISOString().split('T')[0],
      purpose,
      issuedBy: 'Office of the Registrar',
    };
    issueCertificate(newCert);
    setPreviewCert(newCert);
  };

  // Default certificate preview for student
  const activeDisplayCert = previewCert || (myCertificates.length > 0 ? myCertificates[0] : {
    certificateNo: 'AURA-CERT-2026-9012',
    studentName: selectedStudent.name,
    type: 'Bonafide',
    issueDate: '2026-08-01',
    purpose: 'Official Student Academic Verification',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isStudentRole ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <User className="h-3 w-3 text-purple-400" /> Student Certificates & Verification Portal
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Registrar Scoped View
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-purple-400" /> Certificate Generation & Verification Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Instantly generate & print Bonafide, Character, Transfer Certificate (TC), Course Completion, and Experience certificates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Admin Form or Student Issued Certificates List */}
        {!isStudentRole ? (
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Generate Official Certificate</h3>
            <form onSubmit={handleGenerateCertificate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Certificate Type</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                >
                  <option value="Bonafide">Bonafide Certificate</option>
                  <option value="Character">Character Certificate</option>
                  <option value="Transfer Certificate">Transfer Certificate (TC)</option>
                  <option value="Course Completion">Course Completion Certificate</option>
                  <option value="Experience">Faculty Experience Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Student / Recipient</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Purpose of Certificate</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30"
              >
                Generate Certificate Preview
              </button>
            </form>
          </div>
        ) : (
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center justify-between">
              <span>My Issued Certificates</span>
              <Award className="h-4 w-4 text-purple-400" />
            </h3>
            <p className="text-xs text-slate-400">Select any certificate to preview and print.</p>

            <div className="space-y-3">
              <div
                onClick={() => setPreviewCert({
                  certificateNo: 'AURA-CERT-2026-1044',
                  studentName: selectedStudent.name,
                  type: 'Bonafide',
                  issueDate: '2026-08-01',
                  purpose: 'Official Academic Verification',
                })}
                className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/50 cursor-pointer text-xs space-y-1 hover:border-purple-400 transition"
              >
                <div className="flex justify-between font-bold text-white">
                  <span>Bonafide Certificate</span>
                  <span className="text-emerald-400 text-[10px]">Verified ✓</span>
                </div>
                <p className="text-slate-400 text-[11px]">Issued by Registrar • 2026-08-01</p>
              </div>

              <div
                onClick={() => setPreviewCert({
                  certificateNo: 'AURA-CERT-2026-2088',
                  studentName: selectedStudent.name,
                  type: 'Character',
                  issueDate: '2026-08-01',
                  purpose: 'Institutional Character Clearance',
                })}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs space-y-1 hover:border-purple-500/40 transition"
              >
                <div className="flex justify-between font-bold text-white">
                  <span>Character Certificate</span>
                  <span className="text-emerald-400 text-[10px]">Verified ✓</span>
                </div>
                <p className="text-slate-400 text-[11px]">Issued by Principal Office • 2026-08-01</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Printable Certificate Canvas Box */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-950 border-2 border-purple-500/40 text-slate-100 space-y-4 printable-area">
          <div className="border-4 border-amber-500/30 p-8 rounded-xl bg-slate-900/90 text-center space-y-4 relative">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>REF NO: {activeDisplayCert?.certificateNo || 'AURA-CERT-2026-9012'}</span>
              <span>DATE: {activeDisplayCert?.issueDate || new Date().toLocaleDateString()}</span>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-widest text-amber-300 uppercase">
                AURA INSTITUTE OF TECHNOLOGY
              </h3>
              <p className="text-xs text-purple-300 font-serif tracking-wide mt-0.5">
                (Approved by AICTE & Accredited NAAC Grade A++)
              </p>
            </div>

            <div className="my-6 py-2 border-y border-amber-500/40">
              <h4 className="text-lg font-extrabold text-white tracking-wider uppercase">
                {(activeDisplayCert?.type || certType).toUpperCase()} CERTIFICATE
              </h4>
            </div>

            <p className="text-xs leading-relaxed text-slate-200 font-serif max-w-lg mx-auto">
              This is to certify that <strong>{selectedStudent.name}</strong> (Roll No: <strong>{selectedStudent.rollNo}</strong>), a bonafide student of <strong>{selectedStudent.classBatch}</strong>, has been granted this certificate for the purpose of <strong>{activeDisplayCert?.purpose || purpose}</strong>.
            </p>

            <div className="pt-8 flex justify-between items-end text-xs font-sans text-slate-300">
              <div>
                <p className="font-mono text-[10px]">SEAL & STAMP</p>
                <div className="h-12 w-12 rounded-full border border-amber-500/40 flex items-center justify-center text-[9px] text-amber-400 font-bold">
                  AURA SEAL
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">Registrar / Authorized Signatory</p>
                <p className="text-[10px] text-slate-400">Aura Institute of Technology</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end no-print">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
            >
              <Printer className="h-4 w-4" /> Download / Print High-Res Certificate (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
