import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { mapDbIncomeToIncome, mapIncomeToDbIncome } from '@/lib/supabaseMappers';
import { Income } from '@/types';
import { DbIncome } from '@/types/supabase';

// GET - Read all income entries for the authenticated user's household
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('household_id', session.user.householdId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error reading income:', error);
      return NextResponse.json({ error: 'Failed to read income' }, { status: 500 });
    }

    const income = (data as DbIncome[]).map(mapDbIncomeToIncome);
    return NextResponse.json(income);
  } catch (error) {
    console.error('Error reading income:', error);
    return NextResponse.json({ error: 'Failed to read income' }, { status: 500 });
  }
}

// POST - Save all income entries (replaces entire list for the household)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const income: Income[] = await request.json();
    const userId = session.user.id;
    const householdId = session.user.householdId;

    // Delete existing income for this household
    const { error: deleteError } = await supabase
      .from('income')
      .delete()
      .eq('household_id', householdId);

    if (deleteError) {
      console.error('Error deleting existing income:', deleteError);
      return NextResponse.json({ error: 'Failed to delete existing income', details: deleteError.message }, { status: 500 });
    }

    // Insert new income if there are any
    if (income.length > 0) {
      const incomeForDb = income.map(entry => mapIncomeToDbIncome(entry, userId, householdId));

      const { error: insertError } = await supabase
        .from('income')
        .insert(incomeForDb);

      if (insertError) {
        console.error('Error inserting income:', insertError);
        return NextResponse.json({ error: 'Failed to save income', details: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving income:', error);
    return NextResponse.json({ error: 'Failed to save income' }, { status: 500 });
  }
}
