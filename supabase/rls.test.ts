import { describe, expect, it } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

describe('Supabase Database & RLS Tests', () => {
  it('connects to Supabase and verifies tables exist', async () => {
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await admin.from('documents').select('*').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('enforces RLS: User B / Anonymous cannot read User A documents', async () => {
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const emailA = `usera_${Date.now()}@test.local`;
    const emailB = `userb_${Date.now()}@test.local`;
    const password = 'TestPassword123!';

    // 1. Create real users in auth.users
    const { data: userAData, error: userAError } = await admin.auth.admin.createUser({
      email: emailA,
      password,
      email_confirm: true,
    });
    expect(userAError).toBeNull();
    const userA = userAData.user;
    expect(userA).toBeDefined();

    const { data: userBData, error: userBError } = await admin.auth.admin.createUser({
      email: emailB,
      password,
      email_confirm: true,
    });
    expect(userBError).toBeNull();
    const userB = userBData.user;
    expect(userB).toBeDefined();

    // 2. Insert document owned by userA
    const { data: docA, error: docError } = await admin
      .from('documents')
      .insert({
        user_id: userA!.id,
        title: 'Kajian Nahwu User A',
        source_text: 'ذهب أهل الدثور بالأجور',
        detail: 'full',
        status: 'draft',
      })
      .select()
      .single();

    expect(docError).toBeNull();
    expect(docA?.id).toBeDefined();

    // 3. Anonymous client cannot read userA document
    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: anonRead } = await anonClient.from('documents').select('*').eq('id', docA!.id);
    expect(anonRead?.length).toBe(0);

    // 4. User B signs in and attempts to read userA document
    const clientB = createClient(supabaseUrl, anonKey);
    const { error: signInError } = await clientB.auth.signInWithPassword({
      email: emailB,
      password,
    });
    expect(signInError).toBeNull();

    const { data: userBRead } = await clientB.from('documents').select('*').eq('id', docA!.id);

    // RLS blocks User B from reading User A's document
    expect(userBRead?.length).toBe(0);

    // 5. User A signs in and CAN read their own document
    const clientA = createClient(supabaseUrl, anonKey);
    await clientA.auth.signInWithPassword({
      email: emailA,
      password,
    });
    const { data: userARead } = await clientA.from('documents').select('*').eq('id', docA!.id);
    expect(userARead?.length).toBe(1);
    expect(userARead?.[0].id).toBe(docA!.id);

    // Clean up
    await admin.from('documents').delete().eq('id', docA!.id);
    await admin.auth.admin.deleteUser(userA!.id);
    await admin.auth.admin.deleteUser(userB!.id);
  });
});
