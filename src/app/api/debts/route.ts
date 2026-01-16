import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsStorage } from '@/lib/googleSheets';
import { Debt } from '@/types';

// GET - Read all debts
export async function GET() {
  try {
    const debts = await googleSheetsStorage.getDebts() as Debt[];
    return NextResponse.json(debts);
  } catch (error) {
    console.error('Error reading debts:', error);
    return NextResponse.json({ error: 'Failed to read debts' }, { status: 500 });
  }
}

// POST - Save all debts (replaces entire list)
export async function POST(request: NextRequest) {
  try {
    const debts: Debt[] = await request.json();

    // Convert dates to ISO strings for storage
    const debtsForStorage = debts.map(debt => ({
      ...debt,
      createdAt: debt.createdAt instanceof Date ? debt.createdAt.toISOString() : debt.createdAt,
      updatedAt: debt.updatedAt instanceof Date ? debt.updatedAt.toISOString() : debt.updatedAt,
    }));

    await googleSheetsStorage.saveDebts(debtsForStorage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving debts:', error);
    return NextResponse.json({ error: 'Failed to save debts' }, { status: 500 });
  }
}
