import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { HostelRoom } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Hostel Warden', 'Student'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.hostelRooms, 200, 'Hostel rooms retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Hostel Warden'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.block || !body.roomNo) {
      return apiError('Missing required fields: block and roomNo are mandatory', 400);
    }

    const db = getDb();
    const newRoom: HostelRoom = {
      id: `HST-${Date.now().toString().slice(-4)}`,
      block: body.block,
      roomNo: body.roomNo,
      capacity: Number(body.capacity || 2),
      occupied: Number(body.occupied || 0),
      feePerTerm: Number(body.feePerTerm || 0),
      occupants: body.occupants || [],
      status: body.status || 'Available',
    };

    saveDb({ hostelRooms: [newRoom, ...db.hostelRooms] });
    return apiResponse(newRoom, 201, 'Hostel room added');
  } catch (err: any) {
    return apiError(`Failed to create hostel room: ${err.message}`, 500);
  }
}
