import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { TransportRoute } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Transport Manager', 'Student'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.transportRoutes, 200, 'Transport routes retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Transport Manager'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.routeName || !body.busNumber) {
      return apiError('Missing required fields: routeName and busNumber are mandatory', 400);
    }

    const db = getDb();
    const newRoute: TransportRoute = {
      id: `TRP-${Date.now().toString().slice(-4)}`,
      routeName: body.routeName,
      busNumber: body.busNumber,
      driverName: body.driverName || 'TBD',
      driverPhone: body.driverPhone || '',
      capacity: Number(body.capacity || 40),
      studentsAssigned: Number(body.studentsAssigned || 0),
      stops: body.stops || [],
      currentLocationLatLong: body.currentLocationLatLong || { lat: 0, lng: 0 },
      status: body.status || 'In Transit',
    };

    saveDb({ transportRoutes: [newRoute, ...db.transportRoutes] });
    return apiResponse(newRoute, 201, 'Transport route added');
  } catch (err: any) {
    return apiError(`Failed to create transport route: ${err.message}`, 500);
  }
}
