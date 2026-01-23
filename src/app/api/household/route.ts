import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { getHouseholdWithMembers } from '@/lib/household';

// GET - Get household info with members
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getHouseholdWithMembers(session.user.householdId);

    if (!result) {
      return NextResponse.json({ error: 'Household not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error reading household:', error);
    return NextResponse.json({ error: 'Failed to read household' }, { status: 500 });
  }
}

// PATCH - Update household name
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('households')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', session.user.householdId);

    if (error) {
      console.error('Error updating household:', error);
      return NextResponse.json({ error: 'Failed to update household' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating household:', error);
    return NextResponse.json({ error: 'Failed to update household' }, { status: 500 });
  }
}
