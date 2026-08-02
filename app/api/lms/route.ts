import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { LMSCourseMaterial } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher', 'Student'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.lmsMaterials, 200, 'LMS materials retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.title || !body.subject) {
      return apiError('Missing required fields: title and subject are mandatory', 400);
    }

    const db = getDb();
    const newMaterial: LMSCourseMaterial = {
      id: `LMS-${Date.now().toString().slice(-4)}`,
      subject: body.subject,
      classBatch: body.classBatch || 'General',
      title: body.title,
      type: body.type || 'PDF Notes',
      author: body.author || 'System',
      date: body.date || new Date().toISOString().split('T')[0],
      url: body.url,
      durationOrPages: body.durationOrPages,
    };

    saveDb({ lmsMaterials: [newMaterial, ...db.lmsMaterials] });
    return apiResponse(newMaterial, 201, 'LMS material created');
  } catch (err: any) {
    return apiError(`Failed to create LMS material: ${err.message}`, 500);
  }
}
