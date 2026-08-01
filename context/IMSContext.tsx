'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  Student,
  Teacher,
  Course,
  TimetableSlot,
  AttendanceRecord,
  FeeTransaction,
  ExamRecord,
  LMSCourseMaterial,
  Book,
  HostelRoom,
  TransportRoute,
  LeadEnquiry,
  CertificateRecord,
  InventoryItem,
  FinancialEntry,
  NotificationItem,
  AuditLog,
  SystemSettings,
  AuthUser,
  PRESET_USERS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_FEE_TRANSACTIONS,
  INITIAL_EXAMS,
  INITIAL_LMS,
  INITIAL_BOOKS,
  INITIAL_HOSTEL,
  INITIAL_TRANSPORT,
  INITIAL_LEADS,
  INITIAL_CERTIFICATES,
  INITIAL_INVENTORY,
  INITIAL_FINANCIALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_SETTINGS,
  MOCK_BRANCHES,
} from '@/lib/ims-data';

interface IMSContextType {
  // Navigation & Authentication Context
  authUser: AuthUser | null;
  login: (idOrEmail: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  currentRole: UserRole;
  currentBranch: string;
  setCurrentBranch: (branch: string) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAiBotOpen: boolean;
  setIsAiBotOpen: (open: boolean) => void;
  isMobilePreviewOpen: boolean;
  setIsMobilePreviewOpen: (open: boolean) => void;

  // System Settings
  systemSettings: SystemSettings;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  resetSystemSettings: () => void;

  // Data Stores
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  timetable: TimetableSlot[];
  attendance: AttendanceRecord[];
  feeTransactions: FeeTransaction[];
  exams: ExamRecord[];
  lmsMaterials: LMSCourseMaterial[];
  books: Book[];
  hostelRooms: HostelRoom[];
  transportRoutes: TransportRoute[];
  leads: LeadEnquiry[];
  certificates: CertificateRecord[];
  inventoryItems: InventoryItem[];
  financials: FinancialEntry[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];

  // Mutators & Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updatedFields: Partial<Student>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  addFeeTransaction: (tx: Omit<FeeTransaction, 'id'>) => void;
  issueCertificate: (cert: Omit<CertificateRecord, 'id'>) => void;
  addLead: (lead: Omit<LeadEnquiry, 'id'>) => void;
  addAuditLog: (action: string, details: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const IMSContext = createContext<IMSContextType | undefined>(undefined);

export function IMSProvider({ children }: { children: ReactNode }) {
  // User Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_ims_auth_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved auth user', e);
        }
      }
    }
    // Default initial user: Super Admin
    return PRESET_USERS[0];
  });

  const currentRole: UserRole = authUser ? authUser.role : 'Student';

  const [currentBranch, setCurrentBranch] = useState<string>('Main Campus - New Delhi');
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiBotOpen, setIsAiBotOpen] = useState<boolean>(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);

  // Entities
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>(INITIAL_FEE_TRANSACTIONS);
  const [exams, setExams] = useState<ExamRecord[]>(INITIAL_EXAMS);
  const [lmsMaterials, setLmsMaterials] = useState<LMSCourseMaterial[]>(INITIAL_LMS);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(INITIAL_HOSTEL);
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>(INITIAL_TRANSPORT);
  const [leads, setLeads] = useState<LeadEnquiry[]>(INITIAL_LEADS);
  const [certificates, setCertificates] = useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [financials, setFinancials] = useState<FinancialEntry[]>(INITIAL_FINANCIALS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: authUser ? `${authUser.name} (${authUser.role})` : 'Anonymous User',
      role: currentRole,
      action,
      details,
      ipAddress: '192.168.1.100',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = (idOrEmail: string, passwordInput: string): { success: boolean; error?: string } => {
    const trimmedId = idOrEmail.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();

    if (!trimmedId) {
      return { success: false, error: 'User ID or Email is required.' };
    }
    if (!trimmedPass) {
      return { success: false, error: 'Password is required.' };
    }

    // Search in PRESET_USERS
    const foundUser = PRESET_USERS.find(
      (u) =>
        u.id.toLowerCase() === trimmedId ||
        u.email.toLowerCase() === trimmedId ||
        (u.empIdOrRollNo && u.empIdOrRollNo.toLowerCase() === trimmedId) ||
        u.name.toLowerCase().includes(trimmedId)
    );

    let authenticatedUser: AuthUser | null = foundUser || null;

    if (!authenticatedUser && trimmedId.length >= 3) {
      // Fallback for custom credentials
      const detectedRole: UserRole = trimmedId.includes('admin')
        ? 'Super Admin'
        : trimmedId.includes('tch') || trimmedId.includes('teacher')
        ? 'Teacher'
        : trimmedId.includes('stu') || trimmedId.includes('student')
        ? 'Student'
        : trimmedId.includes('acc') || trimmedId.includes('account')
        ? 'Accountant'
        : 'Student';

      authenticatedUser = {
        id: trimmedId.toUpperCase(),
        name: idOrEmail.includes('@') ? idOrEmail.split('@')[0] : idOrEmail,
        email: idOrEmail.includes('@') ? idOrEmail : `${trimmedId}@auraims.edu`,
        role: detectedRole,
        branch: 'Main Campus - New Delhi',
      };
    }

    if (authenticatedUser) {
      if (trimmedPass === 'admin123' || trimmedPass === 'password' || trimmedPass.length >= 4) {
        setAuthUser(authenticatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('aura_ims_auth_user', JSON.stringify(authenticatedUser));
        }
        addAuditLog('USER_LOGIN', `User ${authenticatedUser.name} (${authenticatedUser.role}) logged in successfully`);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password. (Hint: Use "admin123")' };
      }
    }

    return { success: false, error: 'User ID or Email not found.' };
  };

  const logout = () => {
    if (authUser) {
      addAuditLog('USER_LOGOUT', `User ${authUser.name} (${authUser.role}) logged out`);
    }
    setAuthUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura_ims_auth_user');
    }
  };

  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    setStudents((prev) => [{ id, ...newStudent }, ...prev]);
    addAuditLog('STUDENT_ADD', `Added student ${newStudent.name} (${id})`);
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    addAuditLog('STUDENT_UPDATE', `Updated student profile for ID: ${id}`);
  };

  const addTeacher = (newTeacher: Omit<Teacher, 'id'>) => {
    const id = `TCH-${Math.floor(200 + Math.random() * 800)}`;
    setTeachers((prev) => [{ id, ...newTeacher }, ...prev]);
    addAuditLog('TEACHER_ADD', `Added teacher ${newTeacher.name} (${id})`);
  };

  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const id = `ATT-${Date.now().toString().slice(-4)}`;
    setAttendance((prev) => [{ id, ...record }, ...prev]);
  };

  const addFeeTransaction = (tx: Omit<FeeTransaction, 'id'>) => {
    const id = `TXN-${Math.floor(9000 + Math.random() * 1000)}`;
    setFeeTransactions((prev) => [{ id, ...tx }, ...prev]);
    // Also update student feeStatus
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === tx.studentId) {
          const newFeeDue = Math.max(0, s.feeDue - tx.amount);
          return {
            ...s,
            feeDue: newFeeDue,
            feeStatus: newFeeDue === 0 ? 'Paid' : 'Partial',
          };
        }
        return s;
      })
    );
    addAuditLog('FEE_PAYMENT', `Processed payment ${tx.transactionId} of ₹${tx.amount} for ${tx.studentName}`);
  };

  const issueCertificate = (cert: Omit<CertificateRecord, 'id'>) => {
    const id = `CRT-${Math.floor(800 + Math.random() * 200)}`;
    setCertificates((prev) => [{ id, ...cert }, ...prev]);
    addAuditLog('CERTIFICATE_ISSUE', `Issued ${cert.type} (${cert.certificateNo}) to ${cert.studentName}`);
  };

  const addLead = (lead: Omit<LeadEnquiry, 'id'>) => {
    const id = `LD-${Math.floor(500 + Math.random() * 500)}`;
    setLeads((prev) => [{ id, ...lead }, ...prev]);
    addAuditLog('LEAD_ADD', `Recorded new enquiry from ${lead.studentName}`);
  };

  // System Settings State & Persistence
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_ims_system_settings');
      if (saved) {
        try {
          return { ...INITIAL_SYSTEM_SETTINGS, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to parse saved settings', e);
        }
      }
    }
    return INITIAL_SYSTEM_SETTINGS;
  });

  const updateSystemSettings = (newFields: Partial<SystemSettings>) => {
    setSystemSettings((prev) => {
      const updated = { ...prev, ...newFields };
      if (typeof window !== 'undefined') {
        localStorage.setItem('aura_ims_system_settings', JSON.stringify(updated));
      }
      return updated;
    });
    addAuditLog('SETTINGS_UPDATE', `Updated system settings (${Object.keys(newFields).join(', ')})`);
  };

  const resetSystemSettings = () => {
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura_ims_system_settings');
    }
    addAuditLog('SETTINGS_RESET', 'Reset all system settings to factory defaults');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <IMSContext.Provider
      value={{
        authUser,
        login,
        logout,
        currentRole,
        currentBranch,
        setCurrentBranch,
        activeModule,
        setActiveModule,
        searchQuery,
        setSearchQuery,
        isAiBotOpen,
        setIsAiBotOpen,
        isMobilePreviewOpen,
        setIsMobilePreviewOpen,
        systemSettings,
        updateSystemSettings,
        resetSystemSettings,
        students,
        teachers,
        courses,
        timetable,
        attendance,
        feeTransactions,
        exams,
        lmsMaterials,
        books,
        hostelRooms,
        transportRoutes,
        leads,
        certificates,
        inventoryItems,
        financials,
        notifications,
        auditLogs,
        addStudent,
        updateStudent,
        addTeacher,
        markAttendance,
        addFeeTransaction,
        issueCertificate,
        addLead,
        addAuditLog,
        markNotificationAsRead,
      }}
    >
      {children}
    </IMSContext.Provider>
  );
}

export function useIMS() {
  const context = useContext(IMSContext);
  if (!context) {
    throw new Error('useIMS must be used within an IMSProvider');
  }
  return context;
}
