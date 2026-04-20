CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  relationship_status TEXT DEFAULT 'prefer_not',
  gender TEXT DEFAULT 'prefer_not',
  work_situation TEXT DEFAULT 'other',
  goals TEXT[] DEFAULT '{}',
  deck_preference TEXT DEFAULT 'majors_only',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  spread_id TEXT NOT NULL,
  spread_label TEXT NOT NULL,
  tone TEXT NOT NULL,
  cards JSONB NOT NULL,
  interpretation TEXT NOT NULL,
  question TEXT,
  note TEXT,
  favorite BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_draws_user_id ON draws(user_id);
CREATE INDEX IF NOT EXISTS idx_draws_created_at ON draws(created_at DESC);
