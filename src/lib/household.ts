import { supabase } from './supabase';

export interface HouseholdMember {
  id: string;
  householdId: string;
  userId: string;
  email: string;
  role: 'owner' | 'member';
  joinedAt: Date;
}

export interface Household {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Gets or creates a household for a user.
 *
 * Logic:
 * 1. Check if user already has a household membership by user_id -> return that household
 * 2. Check if user has an existing membership by email -> update user_id and return that household
 * 3. Check if user has a pending invite (by email) -> convert to active and return that household
 * 4. Otherwise -> create a new household with user as owner
 */
export async function getOrCreateHouseholdForUser(
  userId: string,
  email: string
): Promise<string> {
  const normalizedEmail = email.toLowerCase();

  // 1. Check if user already has a household membership by user_id
  // Use limit(1) instead of single() to handle multiple rows gracefully
  const { data: membershipsByUserId, error: userIdError } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', userId)
    .limit(1);

  if (userIdError) {
    console.error('Error checking membership by user_id:', userIdError);
  }

  if (membershipsByUserId && membershipsByUserId.length > 0) {
    return membershipsByUserId[0].household_id;
  }

  // 2. Check if user has an existing active membership by email (different user_id)
  // This handles cases where user_id changed between sessions
  const { data: membershipsByEmail, error: emailError } = await supabase
    .from('household_members')
    .select('id, household_id, user_id')
    .eq('email', normalizedEmail)
    .not('user_id', 'like', 'pending:%')
    .limit(1);

  if (emailError) {
    console.error('Error checking membership by email:', emailError);
  }

  if (membershipsByEmail && membershipsByEmail.length > 0) {
    const existingMembership = membershipsByEmail[0];
    // Update the user_id to the current one
    await supabase
      .from('household_members')
      .update({ user_id: userId })
      .eq('id', existingMembership.id);

    return existingMembership.household_id;
  }

  // 3. Check for pending invite by email
  const { data: pendingInvites } = await supabase
    .from('household_members')
    .select('id, household_id')
    .eq('email', normalizedEmail)
    .like('user_id', 'pending:%')
    .limit(1);

  if (pendingInvites && pendingInvites.length > 0) {
    const pendingInvite = pendingInvites[0];
    // Convert pending invite to active membership
    await supabase
      .from('household_members')
      .update({ user_id: userId })
      .eq('id', pendingInvite.id);

    return pendingInvite.household_id;
  }

  // 4. Create a new household with user as owner
  const { data: newHousehold, error: householdError } = await supabase
    .from('households')
    .insert({ name: 'My Household' })
    .select('id')
    .single();

  if (householdError || !newHousehold) {
    throw new Error(`Failed to create household: ${householdError?.message}`);
  }

  // Create membership for the owner
  const { error: memberError } = await supabase
    .from('household_members')
    .insert({
      household_id: newHousehold.id,
      user_id: userId,
      email: normalizedEmail,
      role: 'owner',
    });

  if (memberError) {
    throw new Error(`Failed to create household membership: ${memberError.message}`);
  }

  return newHousehold.id;
}

/**
 * Gets household details with member list
 */
export async function getHouseholdWithMembers(householdId: string): Promise<{
  household: Household;
  members: HouseholdMember[];
} | null> {
  const { data: household, error: householdError } = await supabase
    .from('households')
    .select('*')
    .eq('id', householdId)
    .single();

  if (householdError || !household) {
    return null;
  }

  const { data: members, error: membersError } = await supabase
    .from('household_members')
    .select('*')
    .eq('household_id', householdId)
    .order('joined_at', { ascending: true });

  if (membersError) {
    return null;
  }

  return {
    household: {
      id: household.id,
      name: household.name,
      createdAt: new Date(household.created_at),
      updatedAt: new Date(household.updated_at),
    },
    members: members.map((m) => ({
      id: m.id,
      householdId: m.household_id,
      userId: m.user_id,
      email: m.email,
      role: m.role as 'owner' | 'member',
      joinedAt: new Date(m.joined_at),
    })),
  };
}

/**
 * Invites a member to a household by email.
 * Creates a pending membership that will be activated when the user logs in.
 */
export async function inviteMemberToHousehold(
  householdId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase();

  // Check if email is already a member
  const { data: existingMember } = await supabase
    .from('household_members')
    .select('id')
    .eq('household_id', householdId)
    .eq('email', normalizedEmail)
    .single();

  if (existingMember) {
    return { success: false, error: 'Email is already a member of this household' };
  }

  // Create pending membership
  const { error } = await supabase.from('household_members').insert({
    household_id: householdId,
    user_id: `pending:${normalizedEmail}`,
    email: normalizedEmail,
    role: 'member',
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Removes a member from a household
 */
export async function removeMemberFromHousehold(
  householdId: string,
  memberEmail: string,
  requestingUserId: string
): Promise<{ success: boolean; error?: string }> {
  // Check if requester is the owner
  const { data: requester } = await supabase
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', requestingUserId)
    .single();

  if (!requester || requester.role !== 'owner') {
    return { success: false, error: 'Only the household owner can remove members' };
  }

  // Prevent owner from removing themselves
  const { data: memberToRemove } = await supabase
    .from('household_members')
    .select('role, user_id')
    .eq('household_id', householdId)
    .eq('email', memberEmail.toLowerCase())
    .single();

  if (!memberToRemove) {
    return { success: false, error: 'Member not found' };
  }

  if (memberToRemove.role === 'owner') {
    return { success: false, error: 'Cannot remove the household owner' };
  }

  // Remove the member
  const { error } = await supabase
    .from('household_members')
    .delete()
    .eq('household_id', householdId)
    .eq('email', memberEmail.toLowerCase());

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
