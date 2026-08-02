import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { InventoryItem } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Accountant', 'HR', 'Teacher', 'Academic Coordinator', 'Branch Head'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.inventoryItems, 200, 'Inventory items retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Accountant'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.name || !body.assetCode) {
      return apiError('Missing required fields: name and assetCode are mandatory', 400);
    }

    const db = getDb();
    const newItem: InventoryItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      assetCode: body.assetCode,
      name: body.name,
      category: body.category || 'IT Hardware',
      quantity: Number(body.quantity || 1),
      unitPrice: Number(body.unitPrice || 0),
      location: body.location || 'TBD',
      condition: body.condition || 'Good',
      lastInspected: body.lastInspected || new Date().toISOString().split('T')[0],
    };

    saveDb({ inventoryItems: [newItem, ...db.inventoryItems] });
    return apiResponse(newItem, 201, 'Inventory item added');
  } catch (err: any) {
    return apiError(`Failed to create inventory item: ${err.message}`, 500);
  }
}
