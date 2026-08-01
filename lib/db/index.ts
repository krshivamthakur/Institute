import fs from 'fs';
import path from 'path';
import {
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
} from '@/lib/ims-data';

interface DatabaseSchema {
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
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'aura-ims-db.json');

function ensureDbFile() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      students: INITIAL_STUDENTS,
      teachers: INITIAL_TEACHERS,
      courses: INITIAL_COURSES,
      timetable: INITIAL_TIMETABLE,
      attendance: INITIAL_ATTENDANCE,
      feeTransactions: INITIAL_FEE_TRANSACTIONS,
      exams: INITIAL_EXAMS,
      lmsMaterials: INITIAL_LMS,
      books: INITIAL_BOOKS,
      hostelRooms: INITIAL_HOSTEL,
      transportRoutes: INITIAL_TRANSPORT,
      leads: INITIAL_LEADS,
      certificates: INITIAL_CERTIFICATES,
      inventoryItems: INITIAL_INVENTORY,
      financials: INITIAL_FINANCIALS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
}

export function getDb(): DatabaseSchema {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB file, returning initial datasets:', err);
    return {
      students: INITIAL_STUDENTS,
      teachers: INITIAL_TEACHERS,
      courses: INITIAL_COURSES,
      timetable: INITIAL_TIMETABLE,
      attendance: INITIAL_ATTENDANCE,
      feeTransactions: INITIAL_FEE_TRANSACTIONS,
      exams: INITIAL_EXAMS,
      lmsMaterials: INITIAL_LMS,
      books: INITIAL_BOOKS,
      hostelRooms: INITIAL_HOSTEL,
      transportRoutes: INITIAL_TRANSPORT,
      leads: INITIAL_LEADS,
      certificates: INITIAL_CERTIFICATES,
      inventoryItems: INITIAL_INVENTORY,
      financials: INITIAL_FINANCIALS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
  }
}

export function saveDb(data: Partial<DatabaseSchema>) {
  ensureDbFile();
  const current = getDb();
  const updated = { ...current, ...data };
  fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}
