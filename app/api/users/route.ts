import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { AuthUser } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'HR'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.users || [], 200, 'Users retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'HR'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.role) {
      return apiError('Missing mandatory fields: name, email, role', 400);
    }

    const db = getDb();
    const existingUsers = db.users || [];
    const newId = body.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: AuthUser = {
      id: newId,
      name: body.name,
      email: body.email,
      role: body.role,
      empIdOrRollNo: body.empIdOrRollNo || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      branch: body.branch || 'Main Campus - New Delhi',
      avatar: body.avatar || `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=150`,
      password: body.password || 'password123',
      childStudentId: body.childStudentId,
    };

    const updatedUsers = [newUser, ...existingUsers];
    saveDb({ users: updatedUsers });

    return apiResponse(newUser, 201, 'User account created successfully');
  } catch (err: any) {
    return apiError(`Failed to create user: ${err.message}`, 500);
  }
}

export async function PUT(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'HR'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.id) {
      return apiError('User ID is required for update', 400);
    }

    const db = getDb();
    const existingUsers = db.users || [];
    let targetFound = false;

    const updatedUsers = existingUsers.map((u) => {
      if (u.id === body.id) {
        targetFound = true;
        return { ...u, ...body };
      }
      return u;
    });

    if (!targetFound) {
      return apiError(`User account ID ${body.id} not found`, 404);
    }

    saveDb({ users: updatedUsers });
    const updatedUser = updatedUsers.find((u) => u.id === body.id);
    return apiResponse(updatedUser, 200, 'User account updated successfully');
  } catch (err: any) {
    return apiError(`Failed to update user: ${err.message}`, 500);
  }
}

export async function DELETE(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'HR'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.id) {
      return apiError('User ID is required for deletion', 400);
    }

    const db = getDb();
    const existingUsers = db.users || [];
    const updatedUsers = existingUsers.filter((u) => u.id !== body.id);

    saveDb({ users: updatedUsers });
    return apiResponse({ success: true, deletedId: body.id }, 200, 'User account deleted successfully');
  } catch (err: any) {
    return apiError(`Failed to delete user: ${err.message}`, 500);
  }
}
