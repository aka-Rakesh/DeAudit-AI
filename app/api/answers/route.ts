// API route for answers: GET (by question), POST (create)
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const question_id = searchParams.get('question_id');
  if (!question_id) return NextResponse.json({ error: 'Missing question_id' }, { status: 400 });
  const { data, error } = await supabase.from('answers').select('*').eq('question_id', question_id).order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question_id, content, code, author_id } = body;
  if (!author_id) {
    return NextResponse.json({ error: 'Missing author_id (profile id)' }, { status: 400 });
  }
  const { data, error } = await supabase.from('answers').insert([{ question_id, content, code: code || '', author_id }]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}
