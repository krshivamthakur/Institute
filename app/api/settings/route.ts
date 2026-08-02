import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  return apiResponse(db.settings, 200, 'System settings retrieved successfully');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const db = getDb();
    const updatedSettings = {
      ...db.settings,
      ...body,
    };

    saveDb({ settings: updatedSettings });

    return apiResponse(updatedSettings, 200, 'System settings updated successfully');
  } catch (err: any) {
    return apiError(`Failed to update system settings: ${err.message}`, 500);
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

