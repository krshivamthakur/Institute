import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const student = db.students.find((s) => s.id === id || s.rollNo === id);

  if (!student) {
    return apiError(`Student with ID or Roll No '${id}' not found`, 404);
  }

  return apiResponse(student);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const db = getDb();
    const index = db.students.findIndex((s) => s.id === id);

    if (index === -1) {
      return apiError(`Student with ID '${id}' not found`, 404);
    }

    const updatedStudent = { ...db.students[index], ...body };
    const updatedStudents = [...db.students];
    updatedStudents[index] = updatedStudent;

    saveDb({ students: updatedStudents });

    return apiResponse(updatedStudent, 200, `Student record '${id}' updated successfully`);
  } catch (err: any) {
    return apiError(`Failed to update student: ${err.message}`, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Strictly restricted to Super Admin & Director
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director'],
  });
  if (securityError) return securityError;

  const db = getDb();
  const exists = db.students.some((s) => s.id === id);

  if (!exists) {
    return apiError(`Student with ID '${id}' not found`, 404);
  }

  const updatedStudents = db.students.filter((s) => s.id !== id);
  saveDb({ students: updatedStudents });

  return apiResponse({ id }, 200, `Student '${id}' permanently removed from system`);
}
