import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsStorage } from '@/lib/googleSheets';
import { Income } from '@/types';

// GET - Read all income entries
export async function GET() {
  try {
    const income = await googleSheetsStorage.getIncome() as Income[];
    return NextResponse.json(income);
  } catch (error) {
    console.error('Error reading income:', error);
    return NextResponse.json({ error: 'Failed to read income' }, { status: 500 });
  }
}

// POST - Save all income entries (replaces entire list)
export async function POST(request: NextRequest) {
  try {
    const income: Income[] = await request.json();

    // Convert dates to ISO strings for storage
    const incomeForStorage = income.map(entry => ({
      ...entry,
      date: entry.date instanceof Date ? entry.date.toISOString() : entry.date,
      createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : entry.createdAt,
      updatedAt: entry.updatedAt instanceof Date ? entry.updatedAt.toISOString() : entry.updatedAt,
    }));

    await googleSheetsStorage.saveIncome(incomeForStorage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving income:', error);
    return NextResponse.json({ error: 'Failed to save income' }, { status: 500 });
  }
}
