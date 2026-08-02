import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { ExamRecord } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher', 'Student'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.exams, 200, 'Exams retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.examName || !body.subject) {
      return apiError('Missing required fields: examName and subject are mandatory', 400);
    }

    const db = getDb();
    const newExam: ExamRecord = {
      id: `EXM-${Date.now().toString().slice(-4)}`,
      examName: body.examName,
      course: body.course || 'General',
      batch: body.batch || 'General',
      date: body.date || new Date().toISOString().split('T')[0],
      subject: body.subject,
      totalMarks: Number(body.totalMarks || 100),
      passingMarks: Number(body.passingMarks || 40),
      results: [],
      published: Boolean(body.published),
    };

    saveDb({ exams: [newExam, ...db.exams] });
    return apiResponse(newExam, 201, 'Exam created');
  } catch (err: any) {
    return apiError(`Failed to create exam: ${err.message}`, 500);
  }
}
