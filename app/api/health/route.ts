import { NextRequest } from 'next/server';
import { apiResponse, guardApiRoute } from '@/lib/api-security';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, { maxRequestsPerWindow: 200 });
  if (securityError) return securityError;

  const db = getDb();

  return apiResponse({
    status: 'ONLINE',
    system: 'Aura Institute Management System API Server',
    version: 'v4.2.0',
    database: {
      connected: true,
      records: {
        students: db.students.length,
        teachers: db.teachers.length,
        courses: db.courses.length,
        feeTransactions: db.feeTransactions.length,
        attendance: db.attendance.length,
      },
    },
  });
}
