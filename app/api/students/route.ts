import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { Student } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  // 1. RBAC Guard: Only administrative & faculty roles can view full student directory
  const securityError = await guardApiRoute(req, {
    allowedRoles: [
      'Super Admin',
      'Director',
      'Principal',
      'Branch Head',
      'Academic Coordinator',
      'Accountant',
      'HR',
      'Receptionist',
      'Teacher',
    ],
  });
  if (securityError) return securityError;

  const db = getDb();
  const search = req.nextUrl.searchParams.get('search')?.toLowerCase();
  const batch = req.nextUrl.searchParams.get('batch');

  let results = db.students;

  if (search) {
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.rollNo.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search)
    );
  }

  if (batch && batch !== 'All') {
    results = results.filter((s) => s.classBatch.includes(batch));
  }

  return apiResponse(results, 200, `Retrieved ${results.length} student records`);
}

export async function POST(req: NextRequest) {
  // 1. RBAC Guard: Restricted to Admission Desk & Admins
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Receptionist'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.phone) {
      return apiError('Missing required fields: name, email, and phone are mandatory', 400);
    }

    const db = getDb();

    // Check duplicate email
    if (db.students.some((s) => s.email === body.email)) {
      return apiError('Student with this email already exists', 409);
    }

    const id = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const rollNo = body.rollNo || `2026-REG-${Math.floor(100 + Math.random() * 900)}`;

    const newStudent: Student = {
      id,
      rollNo,
      name: body.name,
      email: body.email,
      phone: body.phone,
      classBatch: body.classBatch || 'B.Tech CS - Year 2',
      branch: body.branch || 'Main Campus - New Delhi',
      gender: body.gender || 'Male',
      dob: body.dob || '2004-01-01',
      admissionDate: body.admissionDate || new Date().toISOString().split('T')[0],
      status: body.status || 'Active',
      parentName: body.parentName || 'Parent Name',
      parentPhone: body.parentPhone || body.phone,
      attendancePct: 100.0,
      feeStatus: body.feeStatus || 'Paid',
      feeDue: body.feeDue || 0,
      gpa: body.gpa || 3.8,
      avatar: body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      documentsUploaded: body.documentsUploaded || { aadhar: true, marksheet: true, photo: true },
    };

    const updatedStudents = [newStudent, ...db.students];
    saveDb({ students: updatedStudents });

    return apiResponse(newStudent, 201, `Student ${newStudent.name} registered successfully with Roll No ${newStudent.rollNo}`);
  } catch (err: any) {
    return apiError(`Failed to process student registration: ${err.message}`, 500);
  }
}
