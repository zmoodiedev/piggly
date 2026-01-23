import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { inviteMemberToHousehold, removeMemberFromHousehold } from '@/lib/household';

// Get allowed emails from environment variable (comma-separated)
const getAllowedEmails = (): string[] => {
  const emails = process.env.ALLOWED_EMAILS || '';
  return emails.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
};

// POST - Invite a member by email
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if email is in the allowlist
    const allowedEmails = getAllowedEmails();
    if (!allowedEmails.includes(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Email is not in the allowed list. Contact admin to add this email.' },
        { status: 403 }
      );
    }

    const result = await inviteMemberToHousehold(session.user.householdId, email);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inviting member:', error);
    return NextResponse.json({ error: 'Failed to invite member' }, { status: 500 });
  }
}

// DELETE - Remove a member from household
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.householdId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await removeMemberFromHousehold(
      session.user.householdId,
      email,
      session.user.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
