import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { mapDbBillToBill, mapBillToDbBill } from '@/lib/supabaseMappers';
import { Bill } from '@/types';
import { DbBill } from '@/types/supabase';

// GET - Read all bills for the authenticated user's household
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('household_id', session.user.householdId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error reading bills:', error);
      return NextResponse.json({ error: 'Failed to read bills' }, { status: 500 });
    }

    const bills = (data as DbBill[]).map(mapDbBillToBill);
    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error reading bills:', error);
    return NextResponse.json({ error: 'Failed to read bills' }, { status: 500 });
  }
}

// POST - Save all bills (replaces entire list for the household)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bills: Bill[] = await request.json();
    const userId = session.user.id;
    const householdId = session.user.householdId;

    // Delete existing bills for this household
    const { error: deleteError } = await supabase
      .from('bills')
      .delete()
      .eq('household_id', householdId);

    if (deleteError) {
      console.error('Error deleting existing bills:', deleteError);
      return NextResponse.json({ error: 'Failed to save bills' }, { status: 500 });
    }

    // Insert new bills if there are any
    if (bills.length > 0) {
      const billsForDb = bills.map(bill => mapBillToDbBill(bill, userId, householdId));

      const { error: insertError } = await supabase
        .from('bills')
        .insert(billsForDb);

      if (insertError) {
        console.error('Error inserting bills:', insertError);
        return NextResponse.json({ error: 'Failed to save bills' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving bills:', error);
    return NextResponse.json({ error: 'Failed to save bills' }, { status: 500 });
  }
}
