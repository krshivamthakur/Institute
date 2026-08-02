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
  isInitialized: boolean;
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
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

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
  users: AuthUser[];

  // Mutators & Actions
  addUser: (user: Omit<AuthUser, 'id'>) => void;
  updateUser: (id: string, updatedFields: Partial<AuthUser>) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, newRole: UserRole) => void;
  updateUserPassword: (id: string, newPassword: string) => void;
  linkParentToChild: (parentId: string, studentId: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updatedFields: Partial<Student>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updatedFields: Partial<Teacher>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updatedFields: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  addFeeTransaction: (tx: Omit<FeeTransaction, 'id'>) => void;
  issueCertificate: (cert: Omit<CertificateRecord, 'id'>) => void;
  addLead: (lead: Omit<LeadEnquiry, 'id'>) => void;
  updateLeadStatus: (id: string, status: string) => void;
  approveAdmission: (leadId: string) => void;
  addExam: (exam: Omit<ExamRecord, 'id'>) => void;
  updateExam: (id: string, updatedFields: Partial<ExamRecord>) => void;
  deleteExam: (id: string) => void;
  updateExamStudentResult: (examId: string, studentId: string, resultData: { marksObtained: number; grade: string; rank?: number }) => void;
  addLmsMaterial: (material: Omit<LMSCourseMaterial, 'id'>) => void;
  updateLmsMaterial: (id: string, updatedFields: Partial<LMSCourseMaterial>) => void;
  deleteLmsMaterial: (id: string) => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  issueBook: (bookId: string, studentName?: string) => void;
  addHostelRoom: (room: Omit<HostelRoom, 'id'>) => void;
  allocateHostelBed: (block: string, roomNo: string, bedNo: string, studentName: string) => void;
  addTransportRoute: (route: Omit<TransportRoute, 'id'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, delta: number) => void;
  editInventoryItem: (id: string, updatedFields: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  addFinancialEntry: (entry: Omit<FinancialEntry, 'id'>) => void;
  addAuditLog: (action: string, details: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const IMSContext = createContext<IMSContextType | undefined>(undefined);
const STORAGE_KEY = 'aura_ims_state_v1';

async function requestJson<T>(endpoint: string, options: RequestInit = {}, role?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(role ? { 'x-user-role': role } : {}),
  };

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload.data as T;
}

export function IMSProvider({ children }: { children: ReactNode }) {
  // User Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [currentBranch, setCurrentBranch] = useState<string>('Main Campus - New Delhi');
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiBotOpen, setIsAiBotOpen] = useState<boolean>(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
  const [users, setUsers] = useState<AuthUser[]>(PRESET_USERS);

  const loadRemoteData = async () => {
    if (!authUser) return;

    try {
      const results = await Promise.allSettled([
        requestJson<Student[]>('/api/students', {}, authUser.role),
        requestJson<Teacher[]>('/api/teachers', {}, authUser.role),
        requestJson<Course[]>('/api/courses', {}, authUser.role),
        requestJson<AttendanceRecord[]>('/api/attendance', {}, authUser.role),
        requestJson<FeeTransaction[]>('/api/fees', {}, authUser.role),
        requestJson<ExamRecord[]>('/api/exams', {}, authUser.role),
        requestJson<LMSCourseMaterial[]>('/api/lms', {}, authUser.role),
        requestJson<Book[]>('/api/books', {}, authUser.role),
        requestJson<HostelRoom[]>('/api/hostel', {}, authUser.role),
        requestJson<TransportRoute[]>('/api/transport', {}, authUser.role),
        requestJson<LeadEnquiry[]>('/api/leads', {}, authUser.role),
        requestJson<CertificateRecord[]>('/api/certificates', {}, authUser.role),
        requestJson<InventoryItem[]>('/api/inventory', {}, authUser.role),
        requestJson<FinancialEntry[]>('/api/finance', {}, authUser.role),
        requestJson<NotificationItem[]>('/api/notifications', {}, authUser.role),
        requestJson<SystemSettings>('/api/settings', {}, authUser.role),
      ]);

      const [
        studentsRes, teachersRes, coursesRes, attendanceRes, feeRes, examsRes,
        lmsRes, booksRes, hostelRes, transportRes, leadsRes, certsRes,
        inventoryRes, financeRes, notifsRes, settingsRes
      ] = results;

      if (studentsRes.status === 'fulfilled' && studentsRes.value?.length) setStudents(studentsRes.value);
      if (teachersRes.status === 'fulfilled' && teachersRes.value?.length) setTeachers(teachersRes.value);
      if (coursesRes.status === 'fulfilled' && coursesRes.value?.length) setCourses(coursesRes.value);
      if (attendanceRes.status === 'fulfilled' && attendanceRes.value?.length) setAttendance(attendanceRes.value);
      if (feeRes.status === 'fulfilled' && feeRes.value?.length) setFeeTransactions(feeRes.value);
      if (examsRes.status === 'fulfilled' && examsRes.value?.length) setExams(examsRes.value);
      if (lmsRes.status === 'fulfilled' && lmsRes.value?.length) setLmsMaterials(lmsRes.value);
      if (booksRes.status === 'fulfilled' && booksRes.value?.length) setBooks(booksRes.value);
      if (hostelRes.status === 'fulfilled' && hostelRes.value?.length) setHostelRooms(hostelRes.value);
      if (transportRes.status === 'fulfilled' && transportRes.value?.length) setTransportRoutes(transportRes.value);
      if (leadsRes.status === 'fulfilled' && leadsRes.value?.length) setLeads(leadsRes.value);
      if (certsRes.status === 'fulfilled' && certsRes.value?.length) setCertificates(certsRes.value);
      if (inventoryRes.status === 'fulfilled' && inventoryRes.value?.length) setInventoryItems(inventoryRes.value);
      if (financeRes.status === 'fulfilled' && financeRes.value?.length) setFinancials(financeRes.value);
      if (notifsRes.status === 'fulfilled' && notifsRes.value?.length) setNotifications(notifsRes.value);
      if (settingsRes.status === 'fulfilled' && settingsRes.value) setSystemSettings(settingsRes.value);
    } catch (error) {
      console.error('Failed to load remote IMS data', error);
    }
  };

  // Client-side hydration sync for saved localStorage state
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsInitialized(true);
      return;
    }

    try {
      const savedSnapshot = localStorage.getItem(STORAGE_KEY);
      if (savedSnapshot) {
        const parsed = JSON.parse(savedSnapshot);
        if (parsed.authUser) setAuthUser(parsed.authUser);
        if (parsed.currentBranch) setCurrentBranch(parsed.currentBranch);
        if (parsed.activeModule) setActiveModule(parsed.activeModule);
        if (parsed.searchQuery !== undefined) setSearchQuery(parsed.searchQuery);
        if (parsed.systemSettings) {
          setSystemSettings({ ...INITIAL_SYSTEM_SETTINGS, ...parsed.systemSettings });
        }
        if (parsed.students) setStudents(parsed.students);
        if (parsed.teachers) setTeachers(parsed.teachers);
        if (parsed.courses) setCourses(parsed.courses);
        if (parsed.timetable) setTimetable(parsed.timetable);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.feeTransactions) setFeeTransactions(parsed.feeTransactions);
        if (parsed.exams) setExams(parsed.exams);
        if (parsed.lmsMaterials) setLmsMaterials(parsed.lmsMaterials);
        if (parsed.books) setBooks(parsed.books);
        if (parsed.hostelRooms) setHostelRooms(parsed.hostelRooms);
        if (parsed.transportRoutes) setTransportRoutes(parsed.transportRoutes);
        if (parsed.leads) setLeads(parsed.leads);
        if (parsed.certificates) setCertificates(parsed.certificates);
        if (parsed.inventoryItems) setInventoryItems(parsed.inventoryItems);
        if (parsed.financials) setFinancials(parsed.financials);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.users && Array.isArray(parsed.users)) setUsers(parsed.users);
      }
    } catch (e) {
      console.error('Failed to restore IMS snapshot', e);
    }

    const savedUser = localStorage.getItem('aura_ims_auth_user');
    if (savedUser) {
      try {
        setAuthUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved auth user', e);
      }
    }

    const savedSettings = localStorage.getItem('aura_ims_system_settings');
    if (savedSettings) {
      try {
        setSystemSettings({ ...INITIAL_SYSTEM_SETTINGS, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!authUser) return;
    void loadRemoteData();
  }, [authUser]);

  const currentRole: UserRole = authUser ? authUser.role : 'Student';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const snapshot = {
      authUser,
      currentBranch,
      activeModule,
      searchQuery,
      systemSettings,
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
      users,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));

    if (authUser) {
      localStorage.setItem('aura_ims_auth_user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('aura_ims_auth_user');
    }

    localStorage.setItem('aura_ims_system_settings', JSON.stringify(systemSettings));
  }, [
    authUser,
    currentBranch,
    activeModule,
    searchQuery,
    systemSettings,
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
  ]);

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

    // Search in users state first, then fallback to PRESET_USERS
    const foundUser =
      users.find(
        (u) =>
          u.id.toLowerCase() === trimmedId ||
          u.email.toLowerCase() === trimmedId ||
          (u.empIdOrRollNo && u.empIdOrRollNo.toLowerCase() === trimmedId) ||
          u.name.toLowerCase().includes(trimmedId)
      ) ||
      PRESET_USERS.find(
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
      const customPassword = authenticatedUser.password;
      const isPasswordValid = customPassword
        ? trimmedPass === customPassword
        : (trimmedPass === 'admin123' || trimmedPass === 'password' || trimmedPass.length >= 4);

      if (isPasswordValid) {
        setAuthUser(authenticatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('aura_ims_auth_user', JSON.stringify(authenticatedUser));
        }
        addAuditLog('USER_LOGIN', `User ${authenticatedUser.name} (${authenticatedUser.role}) logged in successfully`);
        return { success: true };
      } else {
        return { success: false, error: customPassword ? 'Invalid password.' : 'Invalid password. (Hint: Use "admin123")' };
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

  const addUser = (newUser: Omit<AuthUser, 'id'>) => {
    const id = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: AuthUser = { id, ...newUser };
    setUsers((prev) => [created, ...prev]);
    addAuditLog('USER_ADD', `Created user account for ${newUser.name} (${newUser.role})`);
  };

  const updateUser = (id: string, updatedFields: Partial<AuthUser>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updatedFields } : u)));
    if (authUser?.id === id) {
      setAuthUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
    }
    addAuditLog('USER_UPDATE', `Updated user account ID: ${id}`);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog('USER_DELETE', `Deleted user account ID: ${id}`);
  };

  const updateUserRole = (id: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    if (authUser?.id === id) {
      setAuthUser((prev) => (prev ? { ...prev, role: newRole } : prev));
    }
    addAuditLog('USER_ROLE_UPDATE', `Updated role for user ${id} to ${newRole}`);
  };

  const updateUserPassword = (id: string, newPassword: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, password: newPassword } : u)));
    if (authUser?.id === id) {
      setAuthUser((prev) => (prev ? { ...prev, password: newPassword } : prev));
    }
    addAuditLog('USER_PASSWORD_UPDATE', `Updated password for user account ID: ${id}`);
  };

  const linkParentToChild = (parentId: string, studentId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === parentId ? { ...u, childStudentId: studentId } : u))
    );
    if (authUser?.id === parentId) {
      setAuthUser((prev) => (prev ? { ...prev, childStudentId: studentId } : prev));
    }
    const student = students.find((s) => s.id === studentId || s.rollNo === studentId);
    if (student) {
      const parentUser = users.find((u) => u.id === parentId);
      if (parentUser) {
        updateStudent(student.id, { parentName: parentUser.name });
      }
    }
    addAuditLog('PARENT_CHILD_LINK', `Linked parent user ${parentId} to child student ${studentId}`);
  };

  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const optimisticStudent = { id, ...newStudent };
    setStudents((prev) => [optimisticStudent, ...prev]);
    addAuditLog('STUDENT_ADD', `Added student ${newStudent.name} (${id})`);

    void requestJson<Student>('/api/students', {
      method: 'POST',
      body: JSON.stringify(newStudent),
    }, authUser?.role).then((savedStudent) => {
      if (savedStudent && savedStudent.id) {
        setStudents((prev) => [savedStudent, ...prev.filter((s) => s.id !== id)]);
      }
    }).catch((error) => {
      console.error('Student create failed', error);
    });
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    addAuditLog('STUDENT_UPDATE', `Updated student profile for ID: ${id}`);

    void requestJson<Student>(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields),
    }, authUser?.role).catch((error) => {
      console.error('Student update failed', error);
    });
  };

  const addTeacher = (newTeacher: Omit<Teacher, 'id'>) => {
    const id = `TCH-${Math.floor(200 + Math.random() * 800)}`;
    const optimisticTeacher = { id, ...newTeacher };
    setTeachers((prev) => [optimisticTeacher, ...prev]);
    addAuditLog('TEACHER_ADD', `Added teacher ${newTeacher.name} (${id})`);

    void requestJson<Teacher>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(newTeacher),
    }, authUser?.role).then((savedTeacher) => {
      if (savedTeacher && savedTeacher.id) {
        setTeachers((prev) => [savedTeacher, ...prev.filter((t) => t.id !== id)]);
      }
    }).catch((error) => {
      console.error('Teacher create failed', error);
    });
  };

  const updateTeacher = (id: string, updatedFields: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    addAuditLog('TEACHER_UPDATE', `Updated teacher profile for ID: ${id}`);
  };

  const addCourse = (newCourse: Omit<Course, 'id'>) => {
    const id = `CRS-${Math.floor(100 + Math.random() * 900)}`;
    const created: Course = { id, ...newCourse };
    setCourses((prev) => [created, ...prev]);
    addAuditLog('COURSE_ADD', `Created new degree program: ${newCourse.title}`);

    void requestJson<Course>('/api/courses', {
      method: 'POST',
      body: JSON.stringify(newCourse),
    }, authUser?.role).catch((error) => {
      console.error('Course add API failed', error);
    });
  };

  const updateCourse = (id: string, updatedFields: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    addAuditLog('COURSE_UPDATE', `Updated course details for ID: ${id}`);

    void requestJson<Course>('/api/courses', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updatedFields }),
    }, authUser?.role).catch((error) => {
      console.error('Course update API failed', error);
    });
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('COURSE_DELETE', `Deleted course ID: ${id}`);
  };

  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const id = `ATT-${Date.now().toString().slice(-4)}`;
    const optimisticRecord = { id, ...record };
    setAttendance((prev) => [optimisticRecord, ...prev]);

    void requestJson<AttendanceRecord>('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(record),
    }, authUser?.role).then((savedRecord) => {
      if (savedRecord && savedRecord.id) {
        setAttendance((prev) => [savedRecord, ...prev.filter((entry) => entry.id !== id)]);
      }
    }).catch((error) => {
      console.error('Attendance mark failed', error);
    });
  };

  const addFeeTransaction = (tx: Omit<FeeTransaction, 'id'>) => {
    const id = `TXN-${Math.floor(9000 + Math.random() * 1000)}`;
    const optimisticTx = { id, ...tx };
    setFeeTransactions((prev) => [optimisticTx, ...prev]);
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

    void requestJson<any>('/api/fees', {
      method: 'POST',
      body: JSON.stringify(tx),
    }, authUser?.role).then((savedPayload) => {
      const savedTx = savedPayload?.transaction || savedPayload;
      if (savedTx && savedTx.id) {
        setFeeTransactions((prev) => [savedTx, ...prev.filter((entry) => entry.id !== id)]);
      }
    }).catch((error) => {
      console.error('Fee transaction create failed', error);
    });
  };

  const issueCertificate = (cert: Omit<CertificateRecord, 'id'>) => {
    const id = `CRT-${Math.floor(800 + Math.random() * 200)}`;
    const optimisticCert = { id, ...cert };
    setCertificates((prev) => [optimisticCert, ...prev]);
    addAuditLog('CERTIFICATE_ISSUE', `Issued ${cert.type} (${cert.certificateNo}) to ${cert.studentName}`);

    void requestJson<CertificateRecord>('/api/certificates', {
      method: 'POST',
      body: JSON.stringify(cert),
    }, authUser?.role).then((savedCert) => {
      if (savedCert && savedCert.id) {
        setCertificates((prev) => [savedCert, ...prev.filter((entry) => entry.id !== id)]);
      }
    }).catch((error) => {
      console.error('Certificate create failed', error);
    });
  };

  const addLead = (lead: Omit<LeadEnquiry, 'id'>) => {
    const id = `LD-${Math.floor(500 + Math.random() * 500)}`;
    const optimisticLead = { id, ...lead };
    setLeads((prev) => [optimisticLead, ...prev]);
    addAuditLog('LEAD_ADD', `Recorded new enquiry from ${lead.studentName}`);

    void requestJson<LeadEnquiry>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    }, authUser?.role).catch((error) => {
      console.error('Lead create failed', error);
    });
  };

  const updateLeadStatus = (id: string, status: string) => {
    const validStatus = status as LeadEnquiry['status'];
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: validStatus } : l)));
    addAuditLog('LEAD_UPDATE', `Updated lead status for ID ${id} to ${status}`);
  };

  const approveAdmission = (leadId: string) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: 'Approved' as const } : l)));

    const rollNo = `2026-REG-${Math.floor(100 + Math.random() * 900)}`;
    addStudent({
      name: targetLead.studentName,
      email: targetLead.email,
      phone: targetLead.phone,
      classBatch: targetLead.interestedCourse || 'B.Tech CS - Sem 4',
      branch: 'Main Campus - New Delhi',
      gender: 'Male',
      dob: '2004-01-01',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      parentName: targetLead.parentName || 'Parent',
      parentPhone: targetLead.phone,
      attendancePct: 100,
      feeStatus: 'Paid',
      feeDue: 0,
      gpa: 3.8,
      rollNo,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      documentsUploaded: { aadhar: true, marksheet: true, photo: true },
    });

    addAuditLog('ADMISSION_APPROVE', `Approved admission for ${targetLead.studentName} (${targetLead.id})`);
  };

  const addExam = (exam: Omit<ExamRecord, 'id'>) => {
    const id = `EXM-${Math.floor(100 + Math.random() * 900)}`;
    const created: ExamRecord = { id, ...exam };
    setExams((prev) => [created, ...prev]);
    addAuditLog('EXAM_ADD', `Scheduled examination: ${exam.examName}`);

    void requestJson<ExamRecord>('/api/exams', {
      method: 'POST',
      body: JSON.stringify(exam),
    }, authUser?.role).catch((err) => console.error('Exam add API failed', err));
  };

  const updateExam = (id: string, updatedFields: Partial<ExamRecord>) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)));
    addAuditLog('EXAM_UPDATE', `Updated examination ID ${id}`);
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('EXAM_DELETE', `Deleted examination ID ${id}`);
  };

  const updateExamStudentResult = (
    examId: string,
    studentId: string,
    resultData: { marksObtained: number; grade: string; rank?: number }
  ) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        const studentObj = students.find((s) => s.id === studentId || s.rollNo === studentId);
        const existingIdx = exam.results.findIndex(
          (r) => r.studentId === studentId || r.rollNo === studentId || (studentObj && r.studentName === studentObj.name)
        );
        let updatedResults = [...exam.results];
        if (existingIdx >= 0) {
          updatedResults[existingIdx] = {
            ...updatedResults[existingIdx],
            ...resultData,
          };
        } else if (studentObj) {
          updatedResults.push({
            studentId: studentObj.id,
            studentName: studentObj.name,
            rollNo: studentObj.rollNo,
            marksObtained: resultData.marksObtained,
            grade: resultData.grade,
            rank: resultData.rank || 1,
          });
        }
        return { ...exam, results: updatedResults };
      })
    );
    addAuditLog('EXAM_MARKS_UPDATE', `Updated student marks for exam ID ${examId}`);
  };

  const addLmsMaterial = (material: Omit<LMSCourseMaterial, 'id'>) => {
    const id = `LMS-${Date.now().toString().slice(-4)}`;
    const created: LMSCourseMaterial = { id, ...material };
    setLmsMaterials((prev) => [created, ...prev]);
    addAuditLog('LMS_UPLOAD', `Uploaded courseware material: ${material.title}`);

    void requestJson<LMSCourseMaterial>('/api/lms', {
      method: 'POST',
      body: JSON.stringify(material),
    }, authUser?.role).catch((err) => console.error('LMS add API failed', err));
  };

  const updateLmsMaterial = (id: string, updatedFields: Partial<LMSCourseMaterial>) => {
    setLmsMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
    addAuditLog('LMS_UPDATE', `Updated courseware material ID ${id}`);
  };

  const deleteLmsMaterial = (id: string) => {
    setLmsMaterials((prev) => prev.filter((m) => m.id !== id));
    addAuditLog('LMS_DELETE', `Deleted courseware ID ${id}`);
  };

  const addBook = (book: Omit<Book, 'id'>) => {
    const id = `BK-${Math.floor(100 + Math.random() * 900)}`;
    const created: Book = { id, ...book };
    setBooks((prev) => [created, ...prev]);
    addAuditLog('LIBRARY_BOOK_ADD', `Added book to catalog: ${book.title}`);

    void requestJson<Book>('/api/books', {
      method: 'POST',
      body: JSON.stringify(book),
    }, authUser?.role).catch((err) => console.error('Book add API failed', err));
  };

  const issueBook = (bookId: string, studentName?: string) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const newAvail = Math.max(0, b.copiesAvailable - 1);
        const newStatus: Book['status'] = newAvail === 0 ? 'Out of Stock' : (newAvail <= 2 ? 'Low Stock' : 'Available');
        return {
          ...b,
          copiesAvailable: newAvail,
          status: newStatus,
        };
      })
    );
    addAuditLog('LIBRARY_BOOK_ISSUE', `Issued book ID ${bookId}${studentName ? ` to ${studentName}` : ''}`);
  };

  const addHostelRoom = (room: Omit<HostelRoom, 'id'>) => {
    const id = `RM-${Math.floor(100 + Math.random() * 900)}`;
    const created: HostelRoom = { id, ...room };
    setHostelRooms((prev) => [created, ...prev]);
    addAuditLog('HOSTEL_ROOM_ADD', `Added hostel room ${room.block} ${room.roomNo}`);

    void requestJson<HostelRoom>('/api/hostel', {
      method: 'POST',
      body: JSON.stringify(room),
    }, authUser?.role).catch((err) => console.error('Hostel add API failed', err));
  };

  const allocateHostelBed = (block: string, roomNo: string, bedNo: string, studentName: string) => {
    setHostelRooms((prev) =>
      prev.map((r) => {
        if (r.block === block && r.roomNo === roomNo) {
          const newOccupant = {
            studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
            name: studentName,
            bedNo,
          };
          const newOccupants = [...r.occupants.filter((o) => o.bedNo !== bedNo), newOccupant];
          const newStatus: HostelRoom['status'] = newOccupants.length >= r.capacity ? 'Full' : 'Available';
          return {
            ...r,
            occupants: newOccupants,
            occupied: newOccupants.length,
            status: newStatus,
          };
        }
        return r;
      })
    );
    addAuditLog('HOSTEL_ALLOCATION', `Allocated Bed ${bedNo} in ${block} ${roomNo} to ${studentName}`);
  };

  const addTransportRoute = (route: Omit<TransportRoute, 'id'>) => {
    const id = `TR-${Math.floor(100 + Math.random() * 900)}`;
    const created: TransportRoute = { id, ...route };
    setTransportRoutes((prev) => [created, ...prev]);
    addAuditLog('TRANSPORT_ADD', `Added bus route ${route.routeName} (${route.busNumber})`);

    void requestJson<TransportRoute>('/api/transport', {
      method: 'POST',
      body: JSON.stringify(route),
    }, authUser?.role).catch((err) => console.error('Transport add API failed', err));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const id = `INV-${Math.floor(100 + Math.random() * 900)}`;
    const created: InventoryItem = { id, ...item };
    setInventoryItems((prev) => [created, ...prev]);
    addAuditLog('INVENTORY_ADD', `Added asset ${item.name} (${item.assetCode})`);

    void requestJson<InventoryItem>('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    }, authUser?.role).catch((err) => console.error('Inventory add API failed', err));
  };

  const updateInventoryItem = (id: string, delta: number) => {
    setInventoryItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
    );
    addAuditLog('INVENTORY_UPDATE', `Updated stock quantity for asset ${id}`);
  };

  const editInventoryItem = (id: string, updatedFields: Partial<InventoryItem>) => {
    setInventoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    addAuditLog('INVENTORY_EDIT', `Updated asset details for ID ${id}`);
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('INVENTORY_DELETE', `Deleted asset item ID ${id}`);
  };

  const addFinancialEntry = (entry: Omit<FinancialEntry, 'id'>) => {
    const id = `FIN-${Math.floor(100 + Math.random() * 900)}`;
    const created: FinancialEntry = { id, ...entry };
    setFinancials((prev) => [created, ...prev]);
    addAuditLog('FINANCE_ADD', `Logged ${entry.type} entry of ₹${entry.amount} for ${entry.description}`);

    void requestJson<FinancialEntry>('/api/finance', {
      method: 'POST',
      body: JSON.stringify(entry),
    }, authUser?.role).catch((err) => console.error('Finance add API failed', err));
  };

  const updateSystemSettings = (newFields: Partial<SystemSettings>) => {
    const updated = { ...systemSettings, ...newFields };
    setSystemSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_ims_system_settings', JSON.stringify(updated));
    }
    addAuditLog('SETTINGS_UPDATE', `Updated system settings (${Object.keys(newFields).join(', ')})`);

    void requestJson<SystemSettings>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(newFields),
    }, authUser?.role).then((savedSettings) => {
      if (savedSettings) {
        setSystemSettings(savedSettings);
      }
    }).catch((error) => {
      console.error('Settings update failed', error);
    });
  };

  const resetSystemSettings = () => {
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura_ims_system_settings');
    }
    addAuditLog('SETTINGS_RESET', 'Reset all system settings to factory defaults');

    void requestJson<SystemSettings>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(INITIAL_SYSTEM_SETTINGS),
    }, authUser?.role).catch((error) => {
      console.error('Reset settings failed', error);
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <IMSContext.Provider
      value={{
        authUser,
        isInitialized,
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
        isMobileMenuOpen,
        setIsMobileMenuOpen,
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
        users,
        addUser,
        updateUser,
        deleteUser,
        updateUserRole,
        updateUserPassword,
        linkParentToChild,
        addStudent,
        updateStudent,
        addTeacher,
        updateTeacher,
        addCourse,
        updateCourse,
        deleteCourse,
        markAttendance,
        addFeeTransaction,
        issueCertificate,
        addLead,
        updateLeadStatus,
        approveAdmission,
        addExam,
        updateExam,
        deleteExam,
        updateExamStudentResult,
        addLmsMaterial,
        updateLmsMaterial,
        deleteLmsMaterial,
        addBook,
        issueBook,
        addHostelRoom,
        allocateHostelBed,
        addTransportRoute,
        addInventoryItem,
        updateInventoryItem,
        editInventoryItem,
        deleteInventoryItem,
        addFinancialEntry,
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
