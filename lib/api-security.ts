import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/lib/ims-data';

// Rate Limiter Memory Store
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export interface ApiSecurityConfig {
  allowedRoles?: UserRole[];
  requireApiKey?: boolean;
  rateLimitWindowMs?: number; // e.g. 60000ms (1 min)
  maxRequestsPerWindow?: number; // e.g. 60 requests
}

/**
 * Standard API Success Response Wrapper
 */
export function apiResponse<T>(data: T, status = 200, message?: string) {
  return NextResponse.json(
    {
      success: true,
      message: message || 'Operation completed successfully',
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Standard API Error Response Wrapper
 */
export function apiError(message: string, status = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: details || null,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Comprehensive API Restriction & Security Guard
 */
export async function guardApiRoute(req: NextRequest, config: ApiSecurityConfig = {}) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

  // 1. Rate Limiting Check
  const windowMs = config.rateLimitWindowMs || 60000;
  const maxReqs = config.maxRequestsPerWindow || 100;
  const now = Date.now();

  const record = rateLimitMap.get(ip);
  if (record && record.expiresAt > now) {
    if (record.count >= maxReqs) {
      return apiError(`Too Many Requests. Rate limit exceeded (${maxReqs} reqs/min). Please try again later.`, 429);
    }
    record.count += 1;
  } else {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
  }

  // 2. API Key Authentication Check (if required)
  if (config.requireApiKey) {
    const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('apiKey');
    const validApiKey = process.env.IMS_API_KEY || 'aura_ims_live_secret_key_2026';

    if (!apiKey || apiKey !== validApiKey) {
      return apiError('Unauthorized: Invalid or missing API Key (x-api-key)', 401);
    }
  }

  // 3. Role-Based Access Control (RBAC) Verification
  if (config.allowedRoles && config.allowedRoles.length > 0) {
    const roleHeader = (req.headers.get('x-user-role') || 'Super Admin') as UserRole;

    if (!config.allowedRoles.includes(roleHeader)) {
      return apiError(
        `Forbidden: Role '${roleHeader}' does not have permission to access this endpoint. Allowed roles: ${config.allowedRoles.join(', ')}`,
        403
      );
    }
  }

  return null; // Passed all security checks
}

