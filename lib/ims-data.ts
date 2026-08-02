export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  classBatch: string;
  branch: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  admissionDate: string;
  status: 'Active' | 'Inactive' | 'Alumni' | 'Transferred';
  parentName: string;
  parentPhone: string;
  attendancePct: number;
  feeStatus: 'Paid' | 'Partial' | 'Overdue';
  feeDue: number;
  gpa: number;
  avatar: string;
  documentsUploaded: { aadhar: boolean; marksheet: boolean; photo: boolean };
}

export interface Teacher {
  id: string;
  empId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  subjectSpecialization: string[];
  branch: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Resigned';
  attendancePct: number;
  rating: number;
  joiningDate: string;
  avatar: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  durationMonths: number;
  semesters: number;
  fees: number;
  activeBatches: number;
  enrolledStudents: number;
  syllabus: { semester: number; topics: string[] }[];
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subject: string;
  classBatch: string;
  teacher: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  meetingLink?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  classBatch: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  timeIn?: string;
  method: 'Biometric' | 'QR Code' | 'Manual';
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classBatch: string;
  amount: number;
  feeType: 'Tuition Fee' | 'Exam Fee' | 'Hostel Fee' | 'Transport Fee' | 'Lab Fee';
  paymentMode: 'Online (Razorpay)' | 'UPI (PhonePe)' | 'Bank Transfer' | 'Cash' | 'Card';
  transactionId: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  receiptUrl?: string;
}

export interface ExamResult {
  studentId: string;
  studentName: string;
  rollNo: string;
  marksObtained: number;
  grade: string;
  rank: number;
}

export interface ExamRecord {
  id: string;
  examName: string;
  course: string;
  batch: string;
  date: string;
  subject: string;
  totalMarks: number;
  passingMarks: number;
  results: ExamResult[];
  published: boolean;
}

export interface LMSCourseMaterial {
  id: string;
  subject: string;
  classBatch: string;
  title: string;
  type: 'Video' | 'PDF Notes' | 'Assignment' | 'Quiz';
  author: string;
  date: string;
  url?: string;
  durationOrPages?: string;
  submissionsCount?: number;
  quizQuestionsCount?: number;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  copiesTotal: number;
  copiesAvailable: number;
  rackLocation: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  isDigital: boolean;
}

export interface HostelRoom {
  id: string;
  block: string;
  roomNo: string;
  capacity: number;
  occupied: number;
  feePerTerm: number;
  occupants: { studentId: string; name: string; bedNo: string }[];
  status: 'Full' | 'Available' | 'Maintenance';
}

export interface TransportRoute {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  studentsAssigned: number;
  stops: string[];
  currentLocationLatLong: { lat: number; lng: number };
  status: 'In Transit' | 'At Terminal' | 'Maintenance';
}

export interface LeadEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  interestedCourse: string;
  source: 'Website Form' | 'Walk-In' | 'Social Media' | 'Referral';
  status: 'New' | 'Contacted' | 'Counselled' | 'Approved' | 'Rejected';
  counsellor: string;
  date: string;
  notes: string;
}

export interface CertificateRecord {
  id: string;
  certificateNo: string;
  studentId: string;
  studentName: string;
  type: 'Bonafide' | 'Character' | 'Transfer Certificate' | 'Course Completion' | 'Experience';
  issueDate: string;
  purpose: string;
  issuedBy: string;
}

export interface InventoryItem {
  id: string;
  assetCode: string;
  name: string;
  category: 'Lab Equipment' | 'IT Hardware' | 'Stationery' | 'Furniture';
  quantity: number;
  unitPrice: number;
  location: string;
  condition: 'Good' | 'Needs Repair' | 'Scrapped';
  lastInspected: string;
}

export interface FinancialEntry {
  id: string;
  type: 'Income' | 'Expense';
  category: 'Tuition Fees' | 'Payroll' | 'Infrastructure' | 'Lab Supplies' | 'Utilities' | 'Events';
  description: string;
  amount: number;
  date: string;
  paymentMode: string;
  branch: string;
  gstAmount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'Fee Due' | 'Attendance' | 'Exam' | 'Announcement' | 'System';
  date: string;
  read: boolean;
  targetRole: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  empIdOrRollNo?: string;
  branch: string;
  password?: string;
  childStudentId?: string;
}

export interface SystemSettings {
  // General & Branding
  projectName: string;
  projectTagline: string;
  logoUrl: string | null;
  logoPreset: 'Building2' | 'GraduationCap' | 'School' | 'Sparkles' | 'Shield' | 'Crown' | 'Custom';
  academicYear: string;
  defaultLanguage: string;
  timezone: string;
  currencySymbol: string;
  dateFormat: string;

  // Academics & Batches
  attendanceThreshold: number;
  gradingSystem: string;
  rollNumberPrefix: string;
  classDurationMinutes: number;
  autoPublishExams: boolean;

  // Fees & Finance
  lateFeeDailyRate: number;
  gstTaxPercentage: number;
  paymentGateways: {
    razorpay: boolean;
    stripe: boolean;
    upi: boolean;
    cash: boolean;
  };
  autoInvoiceGeneration: boolean;
  receiptHeaderNote: string;

  // Security & Access Control
  minPasswordLength: number;
  requireSpecialChar: boolean;
  sessionTimeoutMinutes: number;
  twoFactorAuth: boolean;
  auditLogRetentionDays: number;
  ipWhitelistEnabled: boolean;

  // Notifications & Gateways
  whatsappGatewayStatus: boolean;
  smsGateway: string;
  emailSmtpHost: string;
  notifyAbsenceInstant: boolean;
  notifyFeeDueReminder: boolean;
  notifyExamResults: boolean;

  // Data & System Maintenance
  autoBackupFrequency: string;
  maintenanceMode: boolean;
}

// -------------------------------------------------------------
// INITIAL MOCK DATASETS
// -------------------------------------------------------------

export const MOCK_BRANCHES = [
  { id: 'b1', name: 'Main Campus - New Delhi', code: 'DEL', address: 'Connaught Place, New Delhi' },
  { id: 'b2', name: 'North Campus - Bangalore', code: 'BLR', address: 'Koramangala, Bangalore' },
  { id: 'b3', name: 'Tech Campus - Pune', code: 'PUN', address: 'Hinjewadi, Pune' },
];

export const MOCK_ROLES = [
  'Super Admin',
  'Director',
  'Principal',
  'Branch Head',
  'Academic Coordinator',
  'Accountant',
  'HR',
  'Receptionist',
  'Teacher',
  'Student',
  'Parent',
  'Library Staff',
  'Transport Manager',
  'Hostel Warden',
] as const;

export type UserRole = typeof MOCK_ROLES[number];

export const PRESET_USERS: AuthUser[] = [
  { id: 'ADM-001', name: 'Super Admin', email: 'admin@auraims.edu', role: 'Super Admin', empIdOrRollNo: 'ADM-001', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'DIR-001', name: 'Dr. Vikram Malhotra', email: 'director@auraims.edu', role: 'Director', empIdOrRollNo: 'DIR-001', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'PRN-001', name: 'Prof. Sunita Deshmukh', email: 'principal@auraims.edu', role: 'Principal', empIdOrRollNo: 'PRN-001', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'BH-101', name: 'Rajesh K. Varma', email: 'branchhead@auraims.edu', role: 'Branch Head', empIdOrRollNo: 'BH-101', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'AC-101', name: 'Dr. Anita Roy', email: 'academic@auraims.edu', role: 'Academic Coordinator', empIdOrRollNo: 'AC-101', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
  { id: 'TCH-201', name: 'Dr. Meenakshi Sundaram', email: 'meenakshi@auraims.edu', role: 'Teacher', empIdOrRollNo: 'EMP-201', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'STU-1001', name: 'Aarav Sharma', email: 'aarav.sharma@institute.edu', role: 'Student', empIdOrRollNo: '2026-CS-001', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' },
  { id: 'PAR-1001', name: 'Rajesh Sharma (Parent)', email: 'parent.sharma@gmail.com', role: 'Parent', empIdOrRollNo: 'PAR-STU-1001', branch: 'Main Campus - New Delhi', childStudentId: 'STU-1001', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'ACC-101', name: 'Ramesh Patel', email: 'accountant@auraims.edu', role: 'Accountant', empIdOrRollNo: 'ACC-101', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'HR-101', name: 'Kavita Singhania', email: 'hr@auraims.edu', role: 'HR', empIdOrRollNo: 'HR-101', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=150' },
  { id: 'RCP-101', name: 'Priya Sharma', email: 'reception@auraims.edu', role: 'Receptionist', empIdOrRollNo: 'RCP-101', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150' },
  { id: 'LIB-101', name: 'Sanjay Kumar', email: 'library@auraims.edu', role: 'Library Staff', empIdOrRollNo: 'LIB-101', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'TRP-101', name: 'Ramesh Chander', email: 'transport@auraims.edu', role: 'Transport Manager', empIdOrRollNo: 'TRP-101', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
  { id: 'HST-101', name: 'Col. Gurmeet Singh', email: 'hostel@auraims.edu', role: 'Hostel Warden', empIdOrRollNo: 'HST-101', branch: 'Main Campus - New Delhi', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU-1001',
    rollNo: '2026-CS-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@institute.edu',
    phone: '+91 98765 43210',
    classBatch: 'B.Tech CS - Sem 4',
    branch: 'Main Campus - New Delhi',
    gender: 'Male',
    dob: '2004-05-14',
    admissionDate: '2024-08-01',
    status: 'Active',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98765 00001',
    attendancePct: 92.5,
    feeStatus: 'Paid',
    feeDue: 0,
    gpa: 3.85,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    documentsUploaded: { aadhar: true, marksheet: true, photo: true },
  },
  {
    id: 'STU-1002',
    rollNo: '2026-CS-002',
    name: 'Ananya Verma',
    email: 'ananya.verma@institute.edu',
    phone: '+91 98765 43211',
    classBatch: 'B.Tech CS - Sem 4',
    branch: 'Main Campus - New Delhi',
    gender: 'Female',
    dob: '2004-09-22',
    admissionDate: '2024-08-01',
    status: 'Active',
    parentName: 'Suresh Verma',
    parentPhone: '+91 98765 00002',
    attendancePct: 88.0,
    feeStatus: 'Partial',
    feeDue: 25000,
    gpa: 3.92,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    documentsUploaded: { aadhar: true, marksheet: true, photo: true },
  },
  {
    id: 'STU-1003',
    rollNo: '2026-EC-015',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@institute.edu',
    phone: '+91 98765 43212',
    classBatch: 'B.Tech ECE - Sem 4',
    branch: 'North Campus - Bangalore',
    gender: 'Male',
    dob: '2004-11-10',
    admissionDate: '2024-08-01',
    status: 'Active',
    parentName: 'Vikram Gupta',
    parentPhone: '+91 98765 00003',
    attendancePct: 74.2,
    feeStatus: 'Overdue',
    feeDue: 45000,
    gpa: 3.12,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    documentsUploaded: { aadhar: true, marksheet: true, photo: false },
  },
  {
    id: 'STU-1004',
    rollNo: '2026-MBA-008',
    name: 'Priya Patel',
    email: 'priya.patel@institute.edu',
    phone: '+91 98765 43213',
    classBatch: 'MBA - Sem 2',
    branch: 'Tech Campus - Pune',
    gender: 'Female',
    dob: '2003-03-18',
    admissionDate: '2025-01-15',
    status: 'Active',
    parentName: 'Amit Patel',
    parentPhone: '+91 98765 00004',
    attendancePct: 96.0,
    feeStatus: 'Paid',
    feeDue: 0,
    gpa: 3.98,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    documentsUploaded: { aadhar: true, marksheet: true, photo: true },
  },
  {
    id: 'STU-1005',
    rollNo: '2025-CS-044',
    name: 'Kabir Singh',
    email: 'kabir.singh@institute.edu',
    phone: '+91 98765 43214',
    classBatch: 'B.Tech CS - Sem 6',
    branch: 'Main Campus - New Delhi',
    gender: 'Male',
    dob: '2003-07-04',
    admissionDate: '2023-08-01',
    status: 'Alumni',
    parentName: 'Harpreet Singh',
    parentPhone: '+91 98765 00005',
    attendancePct: 91.0,
    feeStatus: 'Paid',
    feeDue: 0,
    gpa: 3.75,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    documentsUploaded: { aadhar: true, marksheet: true, photo: true },
  },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'USR-5010',
    empId: 'TEH-001',
    name: 'Sumit Saourav',
    email: 'info@gyanvidyamandir.in',
    phone: '+91 98765 12345',
    department: 'Computer Science',
    designation: 'Professor & HOD',
    subjectSpecialization: ['Data Structures', 'Machine Learning', 'Artificial Intelligence', 'Software Engineering'],
    branch: 'Main Campus - New Delhi',
    salary: 150000,
    status: 'Active',
    attendancePct: 98.5,
    rating: 4.9,
    joiningDate: '2019-03-10',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'TCH-201',
    empId: 'EMP-101',
    name: 'Dr. Meenakshi Sundaram',
    email: 'meenakshi.s@institute.edu',
    phone: '+91 99887 11223',
    department: 'Computer Science',
    designation: 'Professor & HOD',
    subjectSpecialization: ['Data Structures', 'Machine Learning', 'Artificial Intelligence'],
    branch: 'Main Campus - New Delhi',
    salary: 145000,
    status: 'Active',
    attendancePct: 98.0,
    rating: 4.9,
    joiningDate: '2018-06-15',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'TCH-202',
    empId: 'EMP-102',
    name: 'Prof. Rajesh Khanna',
    email: 'rajesh.khanna@institute.edu',
    phone: '+91 99887 11224',
    department: 'Electronics & Comm.',
    designation: 'Associate Professor',
    subjectSpecialization: ['VLSI Design', 'Digital Signal Processing'],
    branch: 'North Campus - Bangalore',
    salary: 120000,
    status: 'Active',
    attendancePct: 95.5,
    rating: 4.7,
    joiningDate: '2020-01-10',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'TCH-203',
    empId: 'EMP-103',
    name: 'Dr. Kavita Reddy',
    email: 'kavita.reddy@institute.edu',
    phone: '+91 99887 11225',
    department: 'Management (MBA)',
    designation: 'Assistant Professor',
    subjectSpecialization: ['Financial Analytics', 'Strategic Management'],
    branch: 'Tech Campus - Pune',
    salary: 98000,
    status: 'Active',
    attendancePct: 94.0,
    rating: 4.8,
    joiningDate: '2021-09-01',
    avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=150',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'CRS-01',
    code: 'BTECH-CS',
    title: 'Bachelor of Technology in Computer Science',
    department: 'Computer Science & Engineering',
    durationMonths: 48,
    semesters: 8,
    fees: 120000,
    activeBatches: 4,
    enrolledStudents: 340,
    syllabus: [
      { semester: 1, topics: ['Mathematics I', 'Physics', 'Programming in C', 'Engineering Graphics'] },
      { semester: 2, topics: ['Mathematics II', 'Data Structures & Algorithms', 'Digital Logic', 'OOP with C++'] },
      { semester: 3, topics: ['Discrete Math', 'Operating Systems', 'Database Systems', 'Computer Networks'] },
      { semester: 4, topics: ['Software Engineering', 'Machine Learning', 'Web Development', 'Theory of Computation'] },
    ],
  },
  {
    id: 'CRS-02',
    code: 'BTECH-ECE',
    title: 'Bachelor of Technology in Electronics & Communication',
    department: 'Electronics & Comm.',
    durationMonths: 48,
    semesters: 8,
    fees: 110000,
    activeBatches: 4,
    enrolledStudents: 220,
    syllabus: [
      { semester: 1, topics: ['Mathematics I', 'Engineering Chemistry', 'Basic Electronics', 'C Programming'] },
      { semester: 2, topics: ['Network Analysis', 'Signals & Systems', 'Electromagnetics', 'Analog Electronics'] },
    ],
  },
  {
    id: 'CRS-03',
    code: 'MBA-FIN',
    title: 'Master of Business Administration (Finance & Analytics)',
    department: 'School of Management',
    durationMonths: 24,
    semesters: 4,
    fees: 180000,
    activeBatches: 2,
    enrolledStudents: 150,
    syllabus: [
      { semester: 1, topics: ['Managerial Economics', 'Financial Accounting', 'Organizational Behavior', 'Marketing Management'] },
      { semester: 2, topics: ['Corporate Finance', 'Investment Analysis', 'Business Analytics', 'HR Management'] },
    ],
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 'TT-1', day: 'Monday', time: '09:00 AM - 10:00 AM', subject: 'Data Structures', classBatch: 'B.Tech CS - Year 2', teacher: 'Dr. Meenakshi Sundaram', room: 'Hall 301', type: 'Lecture', meetingLink: 'https://zoom.us/j/mock123' },
  { id: 'TT-2', day: 'Monday', time: '10:15 AM - 11:15 AM', subject: 'Operating Systems', classBatch: 'B.Tech CS - Year 2', teacher: 'Prof. Rajesh Khanna', room: 'Lab 402', type: 'Lab', meetingLink: 'https://meet.google.com/mock-abc' },
  { id: 'TT-3', day: 'Tuesday', time: '11:30 AM - 12:30 PM', subject: 'Financial Analytics', classBatch: 'MBA - Year 1', teacher: 'Dr. Kavita Reddy', room: 'Hall 105', type: 'Lecture', meetingLink: 'https://zoom.us/j/mock456' },
  { id: 'TT-4', day: 'Wednesday', time: '02:00 PM - 03:30 PM', subject: 'Machine Learning Lab', classBatch: 'B.Tech CS - Year 2', teacher: 'Dr. Meenakshi Sundaram', room: 'AI Innovation Lab', type: 'Lab' },
  { id: 'TT-5', day: 'Thursday', time: '09:00 AM - 10:00 AM', subject: 'Database Systems', classBatch: 'B.Tech CS - Year 2', teacher: 'Prof. Rajesh Khanna', room: 'Hall 301', type: 'Lecture' },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'ATT-1', date: '2026-08-01', studentId: 'STU-1001', studentName: 'Aarav Sharma', classBatch: 'B.Tech CS - Year 2', status: 'Present', timeIn: '08:55 AM', method: 'Biometric' },
  { id: 'ATT-2', date: '2026-08-01', studentId: 'STU-1002', studentName: 'Ananya Verma', classBatch: 'B.Tech CS - Year 2', status: 'Present', timeIn: '08:58 AM', method: 'QR Code' },
  { id: 'ATT-3', date: '2026-08-01', studentId: 'STU-1003', studentName: 'Rohan Gupta', classBatch: 'B.Tech ECE - Year 2', status: 'Absent', method: 'Manual' },
  { id: 'ATT-4', date: '2026-08-01', studentId: 'STU-1004', studentName: 'Priya Patel', classBatch: 'MBA - Year 1', status: 'Present', timeIn: '08:50 AM', method: 'QR Code' },
];

export const INITIAL_FEE_TRANSACTIONS: FeeTransaction[] = [
  { id: 'TXN-9001', studentId: 'STU-1001', studentName: 'Aarav Sharma', rollNo: '2026-CS-001', classBatch: 'B.Tech CS - Year 2', amount: 60000, feeType: 'Tuition Fee', paymentMode: 'Online (Razorpay)', transactionId: 'pay_N8zL90kQx12', date: '2026-07-15', status: 'Completed', receiptUrl: '#' },
  { id: 'TXN-9002', studentId: 'STU-1002', studentName: 'Ananya Verma', rollNo: '2026-CS-002', classBatch: 'B.Tech CS - Year 2', amount: 35000, feeType: 'Tuition Fee', paymentMode: 'UPI (PhonePe)', transactionId: 'T26071899120', date: '2026-07-20', status: 'Completed', receiptUrl: '#' },
  { id: 'TXN-9003', studentId: 'STU-1004', studentName: 'Priya Patel', rollNo: '2026-MBA-008', classBatch: 'MBA - Year 1', amount: 90000, feeType: 'Tuition Fee', paymentMode: 'Bank Transfer', transactionId: 'NEFT88912300', date: '2026-07-25', status: 'Completed', receiptUrl: '#' },
];

export const INITIAL_EXAMS: ExamRecord[] = [
  {
    id: 'EXM-101',
    examName: 'Mid-Term Examinations 2026',
    course: 'B.Tech Computer Science',
    batch: 'B.Tech CS - Year 2',
    date: '2026-06-15',
    subject: 'Data Structures & Algorithms',
    totalMarks: 100,
    passingMarks: 40,
    published: true,
    results: [
      { studentId: 'STU-1001', studentName: 'Aarav Sharma', rollNo: '2026-CS-001', marksObtained: 94, grade: 'A+', rank: 1 },
      { studentId: 'STU-1002', studentName: 'Ananya Verma', rollNo: '2026-CS-002', marksObtained: 91, grade: 'A+', rank: 2 },
      { studentId: 'STU-1003', studentName: 'Rohan Gupta', rollNo: '2026-EC-015', marksObtained: 68, grade: 'B', rank: 14 },
    ],
  },
];

export const INITIAL_LMS: LMSCourseMaterial[] = [
  { id: 'LMS-1', subject: 'Data Structures', classBatch: 'B.Tech CS - Year 2', title: 'Advanced Graph Algorithms & Dijkstra DFS/BFS', type: 'Video', author: 'Dr. Meenakshi Sundaram', date: '2026-07-28', durationOrPages: '45 mins', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'LMS-2', subject: 'Data Structures', classBatch: 'B.Tech CS - Year 2', title: 'Comprehensive Tree & Heap Notes (PDF)', type: 'PDF Notes', author: 'Dr. Meenakshi Sundaram', date: '2026-07-29', durationOrPages: '34 Pages' },
  { id: 'LMS-3', subject: 'Operating Systems', classBatch: 'B.Tech CS - Year 2', title: 'Process Scheduling & Deadlock Prevention Assignment', type: 'Assignment', author: 'Prof. Rajesh Khanna', date: '2026-08-01', submissionsCount: 28 },
  { id: 'LMS-4', subject: 'Machine Learning', classBatch: 'B.Tech CS - Year 2', title: 'Quick Quiz: Neural Networks & Backpropagation', type: 'Quiz', author: 'Dr. Meenakshi Sundaram', date: '2026-08-02', quizQuestionsCount: 10 },
];

export const INITIAL_BOOKS: Book[] = [
  { id: 'BK-101', isbn: '978-0262033848', title: 'Introduction to Algorithms (CLRS 3rd Ed)', author: 'Cormen, Leiserson, Rivest, Stein', category: 'Computer Science', copiesTotal: 15, copiesAvailable: 9, rackLocation: 'Shelf CS-04', status: 'Available', isDigital: true },
  { id: 'BK-102', isbn: '978-0131103627', title: 'The C Programming Language', author: 'Brian W. Kernighan, Dennis M. Ritchie', category: 'Programming', copiesTotal: 20, copiesAvailable: 14, rackLocation: 'Shelf CS-01', status: 'Available', isDigital: true },
  { id: 'BK-103', isbn: '978-0073376097', title: 'Digital Design & Computer Architecture', author: 'David Harris, Sarah Harris', category: 'Electronics', copiesTotal: 8, copiesAvailable: 1, rackLocation: 'Shelf EC-02', status: 'Low Stock', isDigital: false },
  { id: 'BK-104', isbn: '978-0321125217', title: 'Financial Analytics & Valuation Principles', author: 'A. Damodaran', category: 'Management', copiesTotal: 10, copiesAvailable: 7, rackLocation: 'Shelf MG-05', status: 'Available', isDigital: true },
];

export const INITIAL_HOSTEL: HostelRoom[] = [
  { id: 'HST-101', block: 'Block A (Boys)', roomNo: '101', capacity: 2, occupied: 2, feePerTerm: 35000, occupants: [{ studentId: 'STU-1001', name: 'Aarav Sharma', bedNo: 'A1' }, { studentId: 'STU-1003', name: 'Rohan Gupta', bedNo: 'A2' }], status: 'Full' },
  { id: 'HST-102', block: 'Block A (Boys)', roomNo: '102', capacity: 2, occupied: 1, feePerTerm: 35000, occupants: [{ studentId: 'STU-1005', name: 'Kabir Singh', bedNo: 'A1' }], status: 'Available' },
  { id: 'HST-201', block: 'Block B (Girls)', roomNo: '201', capacity: 2, occupied: 2, feePerTerm: 35000, occupants: [{ studentId: 'STU-1002', name: 'Ananya Verma', bedNo: 'B1' }, { studentId: 'STU-1004', name: 'Priya Patel', bedNo: 'B2' }], status: 'Full' },
];

export const INITIAL_TRANSPORT: TransportRoute[] = [
  { id: 'TRP-1', routeName: 'Route 1: Rohini -> CP -> Campus', busNumber: 'DL-01-AB-1234', driverName: 'Ramesh Chander', driverPhone: '+91 98111 22334', capacity: 40, studentsAssigned: 34, stops: ['Rohini Sec 7', 'Pitampura', 'Rajouri Garden', 'Connaught Place', 'Campus Gate 1'], currentLocationLatLong: { lat: 28.6139, lng: 77.2090 }, status: 'In Transit' },
  { id: 'TRP-2', routeName: 'Route 2: Noida Sec 62 -> Mayur Vihar -> Campus', busNumber: 'UP-16-CD-5678', driverName: 'Suresh Kumar', driverPhone: '+91 98111 55667', capacity: 40, studentsAssigned: 38, stops: ['Noida Sec 62', 'Akshardham', 'Mayur Vihar Ph 1', 'Campus Gate 2'], currentLocationLatLong: { lat: 28.5700, lng: 77.3200 }, status: 'In Transit' },
];

export const INITIAL_LEADS: LeadEnquiry[] = [
  { id: 'LD-501', studentName: 'Vikramaditya Roy', parentName: 'Sunil Roy', phone: '+91 98990 11223', email: 'roy.vikram@gmail.com', interestedCourse: 'B.Tech Computer Science', source: 'Website Form', status: 'New', counsellor: 'Priya Sharma (Admission Desk)', date: '2026-08-01', notes: 'Interested in AI specialization and hostel facility.' },
  { id: 'LD-502', studentName: 'Neha Deshmukh', parentName: 'Prakash Deshmukh', phone: '+91 98990 44556', email: 'neha.d@gmail.com', interestedCourse: 'MBA Finance', source: 'Walk-In', status: 'Counselled', counsellor: 'Amit Joshi', date: '2026-07-30', notes: 'Scheduled campus tour and scholarship evaluation.' },
  { id: 'LD-503', studentName: 'Sameer Khan', parentName: 'Tariq Khan', phone: '+91 98990 77889', email: 'sameer.k@gmail.com', interestedCourse: 'B.Tech ECE', source: 'Social Media', status: 'Approved', counsellor: 'Priya Sharma (Admission Desk)', date: '2026-07-28', notes: 'Document verification cleared. Fee payment pending.' },
];

export const INITIAL_CERTIFICATES: CertificateRecord[] = [
  { id: 'CRT-801', certificateNo: 'IMS-2026-BON-091', studentId: 'STU-1001', studentName: 'Aarav Sharma', type: 'Bonafide', issueDate: '2026-07-20', purpose: 'Passport & Education Loan Application', issuedBy: 'Registrar Office' },
  { id: 'CRT-802', certificateNo: 'IMS-2026-TC-014', studentId: 'STU-1005', studentName: 'Kabir Singh', type: 'Transfer Certificate', issueDate: '2026-06-30', purpose: 'Course Completion & Higher Studies', issuedBy: 'Director Office' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-101', assetCode: 'AST-LAB-01', name: 'High-Performance AI Workstation Rig', category: 'IT Hardware', quantity: 30, unitPrice: 125000, location: 'AI & Robotics Lab 404', condition: 'Good', lastInspected: '2026-07-15' },
  { id: 'INV-102', assetCode: 'AST-LAB-09', name: 'Digital Oscilloscope 100MHz', category: 'Lab Equipment', quantity: 20, unitPrice: 45000, location: 'VLSI Hardware Lab 202', condition: 'Good', lastInspected: '2026-07-10' },
  { id: 'INV-103', assetCode: 'AST-FUR-50', name: 'Ergonomic Executive Seminar Chairs', category: 'Furniture', quantity: 150, unitPrice: 8500, location: 'Main Auditorium', condition: 'Good', lastInspected: '2026-06-01' },
];

export const INITIAL_FINANCIALS: FinancialEntry[] = [
  { id: 'FIN-1', type: 'Income', category: 'Tuition Fees', description: 'Year 2 Tuition Collection Batch CS-A', amount: 1850000, date: '2026-07-31', paymentMode: 'Online Payment Gateway', branch: 'Main Campus - New Delhi', gstAmount: 0 },
  { id: 'FIN-2', type: 'Expense', category: 'Payroll', description: 'Monthly Faculty & Staff Salary Disbursement', amount: 980000, date: '2026-07-30', paymentMode: 'Direct Bank NEFT Transfer', branch: 'Main Campus - New Delhi', gstAmount: 0 },
  { id: 'FIN-3', type: 'Expense', category: 'Lab Supplies', description: 'Procurement of High-End GPU Servers', amount: 375000, date: '2026-07-28', paymentMode: 'Corporate Account Transfer', branch: 'Main Campus - New Delhi', gstAmount: 67500 },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'NOTIF-1', title: 'Fee Due Reminder', message: 'Year 2 tuition installment is due for 14 students in B.Tech ECE.', type: 'Fee Due', date: '10 mins ago', read: true, targetRole: 'Accountant' },
  { id: 'NOTIF-2', title: 'Upcoming Mid-Term Schedule Published', message: 'Mid-term exams commence on August 20, 2026. Admit cards ready for download.', type: 'Exam', date: '1 hour ago', read: true, targetRole: 'Student' },
  { id: 'NOTIF-3', title: 'Low Attendance Alert', message: 'Student Rohan Gupta (2026-EC-015) has dropped below 75% attendance threshold.', type: 'Attendance', date: '3 hours ago', read: true, targetRole: 'Teacher' },
  { id: 'NOTIF-4', title: 'Annual Cultural Fest Circular', message: 'Submissions open for TechFest 2026 project exhibitions.', type: 'Announcement', date: '1 day ago', read: true, targetRole: 'All' },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'LOG-001', timestamp: '2026-08-02 01:15:00', user: 'Director Admin', role: 'Super Admin', action: 'ROLE_SWITCH', details: 'Switched session view context to Accountant', ipAddress: '192.168.1.45' },
  { id: 'LOG-002', timestamp: '2026-08-01 18:30:22', user: 'Dr. Meenakshi S.', role: 'Teacher', action: 'GRADE_SUBMIT', details: 'Updated marks for Mid-Term Exam (Data Structures)', ipAddress: '192.168.1.88' },
  { id: 'LOG-003', timestamp: '2026-08-01 14:10:12', user: 'Accountant Desk', role: 'Accountant', action: 'FEE_RECEIPT_GENERATE', details: 'Generated official receipt #TXN-9001 for Aarav Sharma', ipAddress: '192.168.1.12' },
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  projectName: 'AURA IMS',
  projectTagline: 'Next-Gen Institute Management Platform',
  logoUrl: null,
  logoPreset: 'Building2',
  academicYear: '2026 - 2027',
  defaultLanguage: 'English (US)',
  timezone: 'Asia/Kolkata (GMT+5:30)',
  currencySymbol: '₹',
  dateFormat: 'DD/MM/YYYY',

  attendanceThreshold: 75,
  gradingSystem: 'CGPA (10-Point Scale)',
  rollNumberPrefix: 'AUR-2026-',
  classDurationMinutes: 45,
  autoPublishExams: false,

  lateFeeDailyRate: 50,
  gstTaxPercentage: 18,
  paymentGateways: {
    razorpay: true,
    stripe: true,
    upi: true,
    cash: true,
  },
  autoInvoiceGeneration: true,
  receiptHeaderNote: 'Official Fee Receipt - Aura Educational Trust',

  minPasswordLength: 8,
  requireSpecialChar: true,
  sessionTimeoutMinutes: 30,
  twoFactorAuth: false,
  auditLogRetentionDays: 90,
  ipWhitelistEnabled: false,

  whatsappGatewayStatus: true,
  smsGateway: 'Fast2SMS API',
  emailSmtpHost: 'smtp.auraims.edu',
  notifyAbsenceInstant: true,
  notifyFeeDueReminder: true,
  notifyExamResults: true,

  autoBackupFrequency: 'Daily at 00:00 UTC',
  maintenanceMode: false,
};
