export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST /api/vote
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target_id, type, vote, wallet_address } = body;
    if (!target_id || !type || ![1, -1].includes(vote)) {
      return NextResponse.json({ error: 'Invalid vote payload' }, { status: 400 });
    }
    // Find or create profile by wallet_address (just like questions/answers)
    let user_id = null;
    if (wallet_address) {
      // Normalize wallet address to lowercase for consistency
      const normalizedWallet = wallet_address.toLowerCase();
      // Try to fetch profile directly from supabase first (avoid fetch loop)
      const { data: fallbackProfile, error: profileFetchErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', normalizedWallet)
        .single();
      if (profileFetchErr) {
        console.error('Supabase profile fetch error:', profileFetchErr);
      }
      if (fallbackProfile && fallbackProfile.id) {
        user_id = fallbackProfile.id;
      } else {
        // Upsert profile (create if not exists)
        const apiUrl = process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/profiles`
          : `/api/profiles`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet_address: normalizedWallet }),
        });
        if (!res.ok) {
          const errText = await res.text();
          console.error('Profile upsert API error:', errText);
          return NextResponse.json({ error: 'Profile upsert failed', details: errText }, { status: 500 });
        }
        const profile = await res.json();
        if (!profile.id) {
          console.error('Profile upsert returned no id:', profile);
          return NextResponse.json({ error: 'Profile upsert failed', details: profile }, { status: 500 });
        }
        user_id = profile.id;
      }
    }
    if (!user_id) {
      return NextResponse.json({ error: 'User profile not found. Please connect your wallet.' }, { status: 400 });
    }
    // Upsert vote (one per user per target)
    const { data: voteRow, error: voteErr } = await supabase
      .from('votes')
      .upsert([
        { user_id, target_type: type, target_id, value: vote }
      ], { onConflict: 'user_id,target_type,target_id' })
      .select()
      .single();
    if (voteErr) return NextResponse.json({ error: voteErr.message }, { status: 500 });
    // Update vote count on target
    const table = type === 'question' ? 'questions' : 'answers';
    // Get total votes for this target
    const { data: allVotes } = await supabase
      .from('votes')
      .select('value')
      .eq('target_type', type)
      .eq('target_id', target_id);
    const totalVotes = (allVotes || []).reduce((sum, v) => sum + (v.value || 0), 0);
    await supabase
      .from(table)
      .update({ votes: totalVotes })
      .eq('id', target_id);
    return NextResponse.json({ success: true, votes: totalVotes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
