export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Upsert a profile on wallet authentication
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet_address, username } = body;
    if (!wallet_address) {
      return NextResponse.json({ error: 'wallet_address required' }, { status: 400 });
    }
    // Robust unique username logic
    let usernameCandidate = username || wallet_address.slice(0, 8) || wallet_address;
    let uniqueUsername = usernameCandidate;
    let suffix = 1;
    while (true) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', uniqueUsername)
        .single();
      if (!existing) break;
      uniqueUsername = `${usernameCandidate}_${suffix++}`;
    }
    // Upsert profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert([{ wallet_address, username: uniqueUsername }], { onConflict: 'wallet_address' })
      .select()
      .single();
    if (error || !profile) {
      return NextResponse.json({ error: error?.message || 'Could not upsert profile' }, { status: 500 });
    }
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
