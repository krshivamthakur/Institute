import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { LeadEnquiry } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Receptionist', 'Academic Coordinator', 'Teacher', 'Branch Head'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.leads, 200, 'Leads retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Receptionist', 'Academic Coordinator'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.studentName || !body.phone) {
      return apiError('Missing required fields: studentName and phone are mandatory', 400);
    }

    const db = getDb();
    const newLead: LeadEnquiry = {
      id: `LD-${Date.now().toString().slice(-4)}`,
      studentName: body.studentName,
      parentName: body.parentName || '',
      phone: body.phone,
      email: body.email || '',
      interestedCourse: body.interestedCourse || 'General',
      source: body.source || 'Website Form',
      status: body.status || 'New',
      counsellor: body.counsellor || 'Admission Desk',
      date: body.date || new Date().toISOString().split('T')[0],
      notes: body.notes || '',
    };

    saveDb({ leads: [newLead, ...db.leads] });
    return apiResponse(newLead, 201, 'Lead added');
  } catch (err: any) {
    return apiError(`Failed to create lead: ${err.message}`, 500);
  }
}
