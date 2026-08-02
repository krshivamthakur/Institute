import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { Book } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Library Staff', 'Student'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.books, 200, 'Books retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Library Staff'],
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    if (!body.title || !body.isbn) {
      return apiError('Missing required fields: title and isbn are mandatory', 400);
    }

    const db = getDb();
    const newBook: Book = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      isbn: body.isbn,
      title: body.title,
      author: body.author || 'Unknown',
      category: body.category || 'General',
      copiesTotal: Number(body.copiesTotal || 1),
      copiesAvailable: Number(body.copiesAvailable || 1),
      rackLocation: body.rackLocation || 'TBD',
      status: body.status || 'Available',
      isDigital: Boolean(body.isDigital),
    };

    saveDb({ books: [newBook, ...db.books] });
    return apiResponse(newBook, 201, 'Book added');
  } catch (err: any) {
    return apiError(`Failed to create book: ${err.message}`, 500);
  }
}
