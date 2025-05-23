📄 DeAudit AI — Community DApp for Move Smart Contract Auditing
A community-driven platform where users can audit, generate, and discuss Move smart contracts — powered by AI, with full Sui wallet integration and gamified incentives.

🧩 Core Tech Stack
Feature	Technology Used
Framework	Next.js + TypeScript
Styling	TailwindCSS + shadcn/ui
State Management	Zustand
Wallet Auth	@mysten/dapp-kit, supports Walrus
Code Editor	@monaco-editor/react
Backend (DB)	Supabase (RLS enabled)
AI Engine	DeepSeek Coder via local analyze.py

🗂️ Directory Overview
Path	Description
app/layout.tsx	App shell, global layout
lib/store/wallet.ts	Zustand store for wallet and session state
components/wallet/connect.tsx	Wallet connect button (Sui + Walrus support)
components/questions/list.tsx	Feed of all questions
components/questions/view.tsx	Individual question page
components/questions/ask.tsx	Ask a new question (with Monaco editor)
components/answers/form.tsx	Submit an answer (Monaco + tags + submit)
components/vote/vote-buttons.tsx	Upvote/downvote buttons for questions/answers
components/reputation/badge.tsx	Shows reputation next to wallet address
components/tags/tag-filter.tsx	Filter question list by tag
components/features/ai/ai-audit-button.tsx	Calls /api/ai-audit for local LLM analysis
llm/analyze.py	Python script for AI auditing with DeepSeek
app/api/ai-audit/route.ts	Node-to-Python bridge to trigger analysis
supabase/migrations/*.sql	Supabase schema including: users, questions, answers, votes, reputation
.env.example	Supabase + local dev vars

🧠 AI Functionality
LLM Engine: DeepSeek Coder (or compatible open model)

Run locally with transformers and pipeline("text-generation")

Input: Move smart contract code

Output: Structured JSON with:

Summary

Vulnerabilities (title, severity, description)

Fix suggestions

Audit Flow:

User posts a question with Move code.

Others or AI can audit and post answers.

“AI Audit” button sends code to analyze.py and displays structured results.

🛠️ Feature Implementation Summary
✅ Wallet & Auth
@mysten/dapp-kit + Zustand to manage connection state.

Only logged-in users can post, vote, or answer.

✅ Community Q&A System
Ask Questions: title, tags, Monaco editor for Move code

Answer: threaded responses with code and commentary

Voting: Upvote/downvote with Supabase RLS to prevent abuse

Tags: clickable filters per question

✅ Reputation System
+10 for upvote on post

+2 for posting an answer

Displayed next to wallet on all posts

✅ AI Audit & Code Generation
DeepSeek-powered analyze.py script returns JSON with vulnerabilities

UI displays categorized audit report per snippet

Future expansion: "Generate Move code" from prompt

✅ Leaderboard
Supabase table: address, audits, upvotes, score

Viewable on /leaderboard

Updates after each vote or AI audit submission

🗃️ Supabase Schema Overview (DDL)
sql
Copy
Edit
-- Users
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  wallet TEXT UNIQUE,
  reputation INT DEFAULT 0
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  code TEXT,
  tags TEXT[],
  author TEXT REFERENCES profiles(wallet),
  created_at TIMESTAMP DEFAULT now()
);

-- Answers
CREATE TABLE answers (
  id UUID PRIMARY KEY,
  question_id UUID REFERENCES questions(id),
  content TEXT,
  author TEXT REFERENCES profiles(wallet),
  created_at TIMESTAMP DEFAULT now()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY,
  type TEXT CHECK (type IN ('question', 'answer')),
  target_id UUID,
  voter TEXT REFERENCES profiles(wallet),
  vote INT CHECK (vote IN (1, -1))
);

-- Reputation triggers (simplified logic)
-- Add on vote insert/update
🔧 .env Example
env
Copy
Edit
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
💡 Suggested Enhancements
Feature	Suggestion
Code Test Runner	Add Move playground integration or static checker
On-chain Storage	Use Sui JSON-RPC or Walrus object storage
AI Fine-tuning	Train model on real audit reports + Move specs
Upvote-Based Rewards	Gamify participation via NFTs or SUI tokens