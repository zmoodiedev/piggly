import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { mapDbDebtToDebt, mapDebtToDbDebt } from '@/lib/supabaseMappers';
import { Debt } from '@/types';
import { DbDebt } from '@/types/supabase';

// GET - Read all debts for the authenticated user's household
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .eq('household_id', session.user.householdId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error reading debts:', error);
      return NextResponse.json({ error: 'Failed to read debts' }, { status: 500 });
    }

    const debts = (data as DbDebt[]).map(mapDbDebtToDebt);
    return NextResponse.json(debts);
  } catch (error) {
    console.error('Error reading debts:', error);
    return NextResponse.json({ error: 'Failed to read debts' }, { status: 500 });
  }
}

// POST - Save all debts (replaces entire list for the household)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const debts: Debt[] = await request.json();
    const userId = session.user.id;
    const householdId = session.user.householdId;

    // Delete existing debts for this household
    const { error: deleteError } = await supabase
      .from('debts')
      .delete()
      .eq('household_id', householdId);

    if (deleteError) {
      console.error('Error deleting existing debts:', deleteError);
      return NextResponse.json({ error: 'Failed to save debts' }, { status: 500 });
    }

    // Insert new debts if there are any
    if (debts.length > 0) {
      const debtsForDb = debts.map(debt => mapDebtToDbDebt(debt, userId, householdId));

      const { error: insertError } = await supabase
        .from('debts')
        .insert(debtsForDb);

      if (insertError) {
        console.error('Error inserting debts:', insertError);
        return NextResponse.json({ error: 'Failed to save debts' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving debts:', error);
    return NextResponse.json({ error: 'Failed to save debts' }, { status: 500 });
  }
}
