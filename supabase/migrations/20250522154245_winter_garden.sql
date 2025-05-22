/*
  # Initial schema for DeAudit AI community platform

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `wallet_address` (text, unique)
      - `username` (text)
      - `reputation` (integer)
      - `created_at` (timestamp)
    
    - `questions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `code` (text)
      - `author_id` (uuid, references profiles)
      - `votes` (integer)
      - `created_at` (timestamp)
    
    - `answers`
      - `id` (uuid, primary key)
      - `question_id` (uuid, references questions)
      - `content` (text)
      - `code` (text)
      - `author_id` (uuid, references profiles)
      - `votes` (integer)
      - `is_accepted` (boolean)
      - `created_at` (timestamp)
    
    - `votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `target_type` (text)
      - `target_id` (uuid)
      - `value` (integer)
      - `created_at` (timestamp)
    
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
    
    - `question_tags`
      - `question_id` (uuid, references questions)
      - `tag_id` (uuid, references tags)
      - Primary key (question_id, tag_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  reputation integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  code text NOT NULL,
  author_id uuid REFERENCES profiles(id) NOT NULL,
  votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create answers table
CREATE TABLE answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) NOT NULL,
  content text NOT NULL,
  code text NOT NULL,
  author_id uuid REFERENCES profiles(id) NOT NULL,
  votes integer DEFAULT 0,
  is_accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('question', 'answer')),
  target_id uuid NOT NULL,
  value integer NOT NULL CHECK (value IN (-1, 1)),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

-- Create tags table
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text
);

-- Create question_tags junction table
CREATE TABLE question_tags (
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_tags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Questions policies
CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Answers policies
CREATE POLICY "Answers are viewable by everyone"
  ON answers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create answers"
  ON answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own answers"
  ON answers FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tags and question_tags policies
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Question tags are viewable by everyone"
  ON question_tags FOR SELECT
  TO public
  USING (true);

-- Insert initial tags
INSERT INTO tags (name, description) VALUES
  ('security', 'Security-related questions and vulnerabilities'),
  ('optimization', 'Code optimization and gas efficiency'),
  ('best-practices', 'Move programming best practices'),
  ('sui', 'Sui blockchain specific questions'),
  ('resources', 'Questions about Move resources'),
  ('generics', 'Questions about generic types in Move'),
  ('testing', 'Contract testing and verification');