import { NextRequest } from 'next/server';
import { apiResponse, guardApiRoute } from '@/lib/api-security';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher', 'Accountant', 'Student', 'Parent'],
  });
  if (securityError) return securityError;

  const db = getDb();

  return apiResponse(
    {
      students: db.students.length,
      teachers: db.teachers.length,
      attendance: db.attendance.length,
      feeTransactions: db.feeTransactions.length,
      pendingFees: db.students.reduce((sum, student) => sum + (student.feeDue || 0), 0),
      recentStudents: db.students.slice(0, 5),
      recentAttendance: db.attendance.slice(0, 5),
    },
    200,
    'Dashboard overview retrieved'
  );
}
