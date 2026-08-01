import { NextRequest } from 'next/server';
import { apiResponse, apiError, guardApiRoute } from '@/lib/api-security';
import { getDb, saveDb } from '@/lib/db';
import { FeeTransaction } from '@/lib/ims-data';

export async function GET(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Principal', 'Accountant', 'Student', 'Parent'],
  });
  if (securityError) return securityError;

  const db = getDb();
  return apiResponse(db.feeTransactions, 200, 'Fee transactions retrieved');
}

export async function POST(req: NextRequest) {
  const securityError = await guardApiRoute(req, {
    allowedRoles: ['Super Admin', 'Director', 'Accountant', 'Student', 'Parent'],
    rateLimitWindowMs: 60000,
    maxRequestsPerWindow: 20, // Rate limit fee payment submissions
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();

    if (!body.studentId || !body.amount) {
      return apiError('Missing required payment parameters: studentId and amount are mandatory', 400);
    }

    const db = getDb();
    const student = db.students.find((s) => s.id === body.studentId);

    if (!student) {
      return apiError(`Student with ID '${body.studentId}' not found`, 404);
    }

    const amount = Number(body.amount);
    const txnId = body.transactionId || `pay_${Math.random().toString(36).substring(2, 11)}`;

    const newTx: FeeTransaction = {
      id: `TXN-${Math.floor(9000 + Math.random() * 1000)}`,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      classBatch: student.classBatch,
      amount,
      feeType: body.feeType || 'Tuition Fee',
      paymentMode: body.paymentMode || 'Online (Razorpay)',
      transactionId: txnId,
      date: body.date || new Date().toISOString().split('T')[0],
      status: 'Completed',
    };

    // Update fee transactions list & student fee dues
    const updatedFeeTxns = [newTx, ...db.feeTransactions];
    const updatedStudents = db.students.map((s) => {
      if (s.id === student.id) {
        const newDue = Math.max(0, s.feeDue - amount);
        return {
          ...s,
          feeDue: newDue,
          feeStatus: (newDue === 0 ? 'Paid' : 'Partial') as any,
        };
      }
      return s;
    });

    saveDb({
      feeTransactions: updatedFeeTxns,
      students: updatedStudents,
    });

    return apiResponse(
      {
        transaction: newTx,
        remainingDue: Math.max(0, student.feeDue - amount),
      },
      201,
      `Payment of ₹${amount.toLocaleString()} processed successfully for ${student.name}`
    );
  } catch (err: any) {
    return apiError(`Payment processing error: ${err.message}`, 500);
  }
}
