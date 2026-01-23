import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { mapDbSavingsGoalToSavingsGoal, mapSavingsGoalToDbSavingsGoal } from '@/lib/supabaseMappers';
import { SavingsGoal } from '@/types';
import { DbSavingsGoal } from '@/types/supabase';

// GET - Read all savings goals for the authenticated user's household
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('household_id', session.user.householdId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error reading savings:', error);
      return NextResponse.json({ error: 'Failed to read savings' }, { status: 500 });
    }

    const savings = (data as DbSavingsGoal[]).map(mapDbSavingsGoalToSavingsGoal);
    return NextResponse.json(savings);
  } catch (error) {
    console.error('Error reading savings:', error);
    return NextResponse.json({ error: 'Failed to read savings' }, { status: 500 });
  }
}

// POST - Save all savings goals (replaces entire list for the household)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savings: SavingsGoal[] = await request.json();
    const userId = session.user.id;
    const householdId = session.user.householdId;

    // Delete existing savings goals for this household
    const { error: deleteError } = await supabase
      .from('savings_goals')
      .delete()
      .eq('household_id', householdId);

    if (deleteError) {
      console.error('Error deleting existing savings:', deleteError);
      return NextResponse.json({ error: 'Failed to save savings' }, { status: 500 });
    }

    // Insert new savings goals if there are any
    if (savings.length > 0) {
      const savingsForDb = savings.map(goal => mapSavingsGoalToDbSavingsGoal(goal, userId, householdId));

      const { error: insertError } = await supabase
        .from('savings_goals')
        .insert(savingsForDb);

      if (insertError) {
        console.error('Error inserting savings:', insertError);
        return NextResponse.json({ error: 'Failed to save savings' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving savings:', error);
    return NextResponse.json({ error: 'Failed to save savings' }, { status: 500 });
  }
}
