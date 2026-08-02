import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { NotificationItem } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher', 'Student', 'Parent', 'Accountant', 'HR'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.notifications, 200, 'Notifications retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher', 'Accountant', 'HR'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.title || !body.message) {
      return apiError('Missing required fields: title and message are mandatory', 400);
    }

    const db = getDb();
    const newNotification: NotificationItem = {
      id: body.id || `NOTIF-${Date.now().toString().slice(-4)}`,
      title: body.title,
      message: body.message,
      type: body.type || 'Announcement',
      date: body.date || 'Just now',
      read: false,
      targetRole: body.targetRole || 'All',
    };

    saveDb({ notifications: [newNotification, ...db.notifications] });
    return apiResponse(newNotification, 201, 'Notification created');
  } catch (err: any) {
    return apiError(`Failed to create notification: ${err.message}`, 500);
  }
}

export async function PUT(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Academic Coordinator', 'Teacher', 'Student', 'Parent', 'Accountant', 'HR'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const db = getDb();

    if (body.markAllRead) {
      const updated = db.notifications.map((n) => ({ ...n, read: true }));
      saveDb({ notifications: updated });
      return apiResponse(updated, 200, 'All notifications marked as read');
    }

    if (body.id) {
      const updated = db.notifications.map((n) => (n.id === body.id ? { ...n, read: true, ...body } : n));
      saveDb({ notifications: updated });
      return apiResponse(updated, 200, 'Notification status updated');
    }

    return apiError('Invalid payload: id or markAllRead required', 400);
  } catch (err: any) {
    return apiError(`Failed to update notification: ${err.message}`, 500);
  }
}
