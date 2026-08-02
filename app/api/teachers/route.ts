import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { Teacher } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'HR', 'Teacher'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.teachers, 200, 'Teachers retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'HR'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.department) {
      return apiError('Missing required fields: name, email, and department are mandatory', 400);
    }

    const db = getDb();
    const newTeacher: Teacher = {
      id: `TCH-${Date.now().toString().slice(-4)}`,
      empId: body.empId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      department: body.department,
      designation: body.designation || 'Faculty',
      subjectSpecialization: body.subjectSpecialization || [],
      branch: body.branch || 'Main Campus - New Delhi',
      salary: Number(body.salary || 0),
      status: body.status || 'Active',
      attendancePct: Number(body.attendancePct || 100),
      rating: Number(body.rating || 5),
      joiningDate: body.joiningDate || new Date().toISOString().split('T')[0],
      avatar: body.avatar || '',
    };

    saveDb({ teachers: [newTeacher, ...db.teachers] });
    return apiResponse(newTeacher, 201, 'Teacher added');
  } catch (err: any) {
    return apiError(`Failed to create teacher: ${err.message}`, 500);
  }
}
