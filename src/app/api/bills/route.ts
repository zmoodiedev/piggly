import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsStorage } from '@/lib/googleSheets';
import { Bill } from '@/types';

// GET - Read all bills
export async function GET() {
  try {
    const bills = await googleSheetsStorage.getBills() as Bill[];
    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error reading bills:', error);
    return NextResponse.json({ error: 'Failed to read bills' }, { status: 500 });
  }
}

// POST - Save all bills (replaces entire list)
export async function POST(request: NextRequest) {
  try {
    const bills: Bill[] = await request.json();

    // Convert dates to ISO strings for storage
    const billsForStorage = bills.map(bill => ({
      ...bill,
      lastPaidDate: bill.lastPaidDate instanceof Date ? bill.lastPaidDate.toISOString() : bill.lastPaidDate,
      createdAt: bill.createdAt instanceof Date ? bill.createdAt.toISOString() : bill.createdAt,
      updatedAt: bill.updatedAt instanceof Date ? bill.updatedAt.toISOString() : bill.updatedAt,
    }));

    await googleSheetsStorage.saveBills(billsForStorage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving bills:', error);
    return NextResponse.json({ error: 'Failed to save bills' }, { status: 500 });
  }
}
