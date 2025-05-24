export const dynamic = 'force-dynamic';

// API route for questions: GET (list), POST (create)
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetch all questions with author profile and tags
export async function GET() {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      id, title, content, code, votes, created_at,
      author:profiles!questions_author_id_fkey (id, wallet_address, username, reputation),
      question_tags (tag_id, tags (name))
    `)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Flatten tags for frontend
  const questions = (data || []).map(q => ({
    ...q,
    tags: q.question_tags?.map((qt: any) => qt.tags?.name) || [],
  }));
  return NextResponse.json(questions);
}

// Create a new question (requires author_id and tags)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, content, code, wallet_address, tag_names, username } = body;
    // Use description if content is not provided (for backward compatibility)
    const questionContent = content || description || '';
    // Robust unique username logic
    let usernameCandidate = username || wallet_address?.slice(0, 8) || wallet_address;
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
    // Find profile by wallet_address (do not create)
    let { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('wallet_address', wallet_address)
      .single();
    if (profileErr || !profile) {
      return NextResponse.json({ error: 'User profile not found. Please connect your wallet.' }, { status: 400 });
    }
    // Insert question
    const { data: question, error } = await supabase
      .from('questions')
      .insert([{ title, content: questionContent, code: code || '', author_id: profile.id }])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    // Attach tags (create if missing)
    if (tag_names && Array.isArray(tag_names) && tag_names.length > 0) {
      for (const tagName of tag_names) {
        let { data: tag, error: tagErr } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();
        if (tagErr || !tag) {
          const { data: newTag, error: newTagErr } = await supabase
            .from('tags')
            .insert([{ name: tagName }])
            .select()
            .single();
          if (newTagErr || !newTag) continue;
          tag = newTag;
        }
        if (tag) {
          await supabase.from('question_tags').insert([{ question_id: question.id, tag_id: tag.id }]);
        }
      }
    }
    return NextResponse.json(question);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
