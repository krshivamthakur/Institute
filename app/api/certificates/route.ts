import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { CertificateRecord } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Student', 'Parent'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.certificates, 200, 'Certificates list retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();

    if (!body.studentId || !body.type) {
      return apiError('Missing parameters: studentId and type (Bonafide/Character/TC/etc.) are mandatory', 400);
    }

    const db = getDb();
    const student = db.students.find((s) => s.id === body.studentId);

    if (!student) {
      return apiError(`Student with ID '${body.studentId}' not found`, 404);
    }

    const certificateNo = body.certificateNo || `GVM-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert: CertificateRecord = {
      id: `CRT-${Math.floor(800 + Math.random() * 200)}`,
      certificateNo,
      studentId: student.id,
      studentName: student.name,
      type: body.type,
      issueDate: body.issueDate || new Date().toISOString().split('T')[0],
      purpose: body.purpose || 'Official Documentation',
      issuedBy: body.issuedBy || 'Office of the Registrar',
    };

    const updatedCerts = [newCert, ...db.certificates];
    saveDb({ certificates: updatedCerts });

    return apiResponse(newCert, 201, `Official ${body.type} Certificate issued (${certificateNo})`);
  } catch (err: any) {
    return apiError(`Failed to generate certificate: ${err.message}`, 500);
  }
}

