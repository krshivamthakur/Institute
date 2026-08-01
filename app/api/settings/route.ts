import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { INITIAL_SYSTEM_SETTINGS } from '@/lib/ims-data';

// In-memory backend settings cache for demo / API integration
let backendSettingsCache = { ...INITIAL_SYSTEM_SETTINGS };

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin'],
  });
  if (securityError) return securityError;

  return apiResponse(backendSettingsCache, 200, 'System settings retrieved successfully');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    backendSettingsCache = {
      ...backendSettingsCache,
      ...body,
    };

    return apiResponse(backendSettingsCache, 200, 'System settings updated successfully');
  } catch (err: any) {
    return apiError(`Failed to update system settings: ${err.message}`, 500);
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
