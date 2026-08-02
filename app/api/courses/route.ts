import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { Course } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher', 'Student'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.courses, 200, 'Courses retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.code || !body.title) {
      return apiError('Missing required fields: code and title are mandatory', 400);
    }

    const db = getDb();
    const newCourse: Course = {
      id: `CRS-${Date.now().toString().slice(-4)}`,
      code: body.code,
      title: body.title,
      department: body.department || 'General',
      durationMonths: Number(body.durationMonths || 12),
      semesters: Number(body.semesters || 2),
      fees: Number(body.fees || 0),
      activeBatches: Number(body.activeBatches || 1),
      enrolledStudents: Number(body.enrolledStudents || 0),
      syllabus: body.syllabus || [],
    };

    saveDb({ courses: [newCourse, ...db.courses] });
    return apiResponse(newCourse, 201, 'Course added');
  } catch (err: any) {
    return apiError(`Failed to create course: ${err.message}`, 500);
  }
}

export async function PUT(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Branch Head', 'Teacher'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.id) {
      return apiError('Missing required field: id is mandatory for updating course', 400);
    }

    const db = getDb();
    const updatedCourses = db.courses.map((c) => (c.id === body.id ? { ...c, ...body } : c));
    saveDb({ courses: updatedCourses });
    return apiResponse(body, 200, 'Course updated successfully');
  } catch (err: any) {
    return apiError(`Failed to update course: ${err.message}`, 500);
  }
}

export async function DELETE(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.id) {
      return apiError('Missing required field: id is mandatory for deleting course', 400);
    }

    const db = getDb();
    const updatedCourses = db.courses.filter((c) => c.id !== body.id && c.code !== body.id);
    saveDb({ courses: updatedCourses });
    return apiResponse({ success: true, deletedId: body.id }, 200, 'Course deleted successfully');
  } catch (err: any) {
    return apiError(`Failed to delete course: ${err.message}`, 500);
  }
}
