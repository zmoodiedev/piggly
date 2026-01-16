import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsStorage } from '@/lib/googleSheets';
import { Transaction } from '@/types';

// GET - Read all transactions
export async function GET() {
  try {
    const transactions = await googleSheetsStorage.getTransactions() as Transaction[];
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error reading transactions:', error);
    return NextResponse.json({ error: 'Failed to read transactions' }, { status: 500 });
  }
}

// POST - Save all transactions (replaces entire list)
export async function POST(request: NextRequest) {
  try {
    const transactions: Transaction[] = await request.json();

    // Convert dates to ISO strings for storage
    const transactionsForStorage = transactions.map(entry => ({
      ...entry,
      date: entry.date instanceof Date ? entry.date.toISOString() : entry.date,
      createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : entry.createdAt,
      updatedAt: entry.updatedAt instanceof Date ? entry.updatedAt.toISOString() : entry.updatedAt,
    }));

    await googleSheetsStorage.saveTransactions(transactionsForStorage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving transactions:', error);
    return NextResponse.json({ error: 'Failed to save transactions' }, { status: 500 });
  }
}
