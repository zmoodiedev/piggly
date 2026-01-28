import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { mapDbBillToBill, mapBillToDbBillUpdate } from '@/lib/supabaseMappers';
import { Bill } from '@/types';
import { DbBill } from '@/types/supabase';

// PUT - Update a single bill by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const billUpdate: Partial<Bill> = await request.json();
    const dbUpdate = mapBillToDbBillUpdate(billUpdate);

    const { data, error } = await supabase
      .from('bills')
      .update(dbUpdate)
      .eq('id', id)
      .eq('household_id', session.user.householdId)
      .select()
      .single();

    if (error) {
      console.error('Error updating bill:', error);
      return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json(mapDbBillToBill(data as DbBill));
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
  }
}

// DELETE - Delete a single bill by ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)
      .eq('household_id', session.user.householdId);

    if (error) {
      console.error('Error deleting bill:', error);
      return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
  }
}
