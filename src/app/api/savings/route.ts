import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsStorage } from '@/lib/googleSheets';
import { SavingsGoal } from '@/types';

// GET - Read all savings goals
export async function GET() {
  try {
    const savings = await googleSheetsStorage.getSavings() as SavingsGoal[];
    return NextResponse.json(savings);
  } catch (error) {
    console.error('Error reading savings:', error);
    return NextResponse.json({ error: 'Failed to read savings' }, { status: 500 });
  }
}

// POST - Save all savings goals (replaces entire list)
export async function POST(request: NextRequest) {
  try {
    const savings: SavingsGoal[] = await request.json();

    // Convert dates to ISO strings for storage
    const savingsForStorage = savings.map(goal => ({
      ...goal,
      deadline: goal.deadline instanceof Date ? goal.deadline.toISOString() : goal.deadline,
      createdAt: goal.createdAt instanceof Date ? goal.createdAt.toISOString() : goal.createdAt,
      updatedAt: goal.updatedAt instanceof Date ? goal.updatedAt.toISOString() : goal.updatedAt,
    }));

    await googleSheetsStorage.saveSavings(savingsForStorage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving savings:', error);
    return NextResponse.json({ error: 'Failed to save savings' }, { status: 500 });
  }
}
