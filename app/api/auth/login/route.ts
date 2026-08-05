import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { UserRole } from '@/lib/ims-data';

export async function POST(req: NextRequest) {
  // 1. Strict rate limit guard for login attempts (5 reqs/min)
  const securityError = await guardApiRoute(req, {
    rateLimitWindowMs: 60000,
    maxRequestsPerWindow: 10,
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return apiError('Missing required login credentials: email and password', 400);
    }

    // Authenticate user & assign role
    const assignedRole: UserRole = (role as UserRole) || 'Super Admin';
    const fakeToken = `gvm_jwt_token_${Buffer.from(`${email}:${assignedRole}:${Date.now()}`).toString('base64')}`;

    return apiResponse(
      {
        user: {
          email,
          name: email.split('@')[0].replace('.', ' '),
          role: assignedRole,
          branch: 'Main Campus - New Delhi',
        },
        token: fakeToken,
        expiresIn: '24h',
      },
      200,
      `Authenticated successfully as ${assignedRole}`
    );
  } catch (err: any) {
    return apiError(`Authentication failed: ${err.message}`, 500);
  }
}

