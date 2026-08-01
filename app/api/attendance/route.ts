import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { AttendanceRecord } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: [
      'Super Admin',
      'Director',
      'Principal',
      'Academic Coordinator',
      'Teacher',
      'Student',
      'Parent',
    ],
  });
  if (securityError) return securityError;

  const db = getDb();
  const studentId = req.nextUrl.searchParams.get('studentId');

  let results = db.attendance;
  if (studentId) {
    results = results.filter((a) => a.studentId === studentId);
  }

  return apiResponse(results, 200, 'Attendance log retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();

    if (!body.studentId || !body.status) {
      return apiError('Missing parameters: studentId and status are mandatory', 400);
    }

    const db = getDb();
    const student = db.students.find((s) => s.id === body.studentId);

    if (!student) {
      return apiError(`Student with ID '${body.studentId}' not found`, 404);
    }

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now().toString().slice(-6)}`,
      date: body.date || new Date().toISOString().split('T')[0],
      studentId: student.id,
      studentName: student.name,
      classBatch: student.classBatch,
      status: body.status,
      timeIn: body.timeIn || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: body.method || 'Manual',
    };

    const updatedAttendance = [newRecord, ...db.attendance];
    saveDb({ attendance: updatedAttendance });

    return apiResponse(newRecord, 201, `Attendance for ${student.name} marked as ${body.status}`);
  } catch (err: any) {
    return apiError(`Failed to log attendance: ${err.message}`, 500);
  }
}
