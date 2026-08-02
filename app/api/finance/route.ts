import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { FinancialEntry } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Accountant'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.financials, 200, 'Financial records retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Accountant'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.description || !body.amount) {
      return apiError('Missing required fields: description and amount are mandatory', 400);
    }

    const db = getDb();
    const newEntry: FinancialEntry = {
      id: `FIN-${Date.now().toString().slice(-4)}`,
      type: body.type || 'Expense',
      category: body.category || 'Utilities',
      description: body.description,
      amount: Number(body.amount),
      date: body.date || new Date().toISOString().split('T')[0],
      paymentMode: body.paymentMode || 'Cash',
      branch: body.branch || 'Main Campus - New Delhi',
      gstAmount: Number(body.gstAmount || 0),
    };

    saveDb({ financials: [newEntry, ...db.financials] });
    return apiResponse(newEntry, 201, 'Financial record added');
  } catch (err: any) {
    return apiError(`Failed to create financial record: ${err.message}`, 500);
  }
}
