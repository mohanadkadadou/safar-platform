-- ═══════════════════════════════════════════════════════════
-- SAFAR PLATFORM — SUPABASE SCHEMA
-- افتح Supabase → SQL Editor → الصق هذا واضغط Run
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── EVENTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  subtitle      TEXT,
  description   TEXT,
  emoji         TEXT DEFAULT '◈',
  category      TEXT DEFAULT 'Adventure',
  status        TEXT DEFAULT 'draft'
                  CHECK (status IN ('draft','voting','published','closed')),
  date          DATE,
  time          TIME,
  meeting_point TEXT,
  pkg_name      TEXT DEFAULT 'Standard',
  price         NUMERIC(10,2) DEFAULT 0,
  items         TEXT,
  color_index   INT DEFAULT 0,
  capacity      INT DEFAULT 50,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REGISTRATIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registrations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id      UUID REFERENCES events(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  notes         TEXT,
  package_name  TEXT,
  chosen_date   DATE,
  chosen_time   TIME,
  ref_code      TEXT UNIQUE,
  status        TEXT DEFAULT 'confirmed'
                  CHECK (status IN ('confirmed','pending','cancelled')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── POLL VOTES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS poll_votes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_index  INT NOT NULL,
  voter_token   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_events_status    ON events(status);
CREATE INDEX IF NOT EXISTS idx_reg_event        ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_ref          ON registrations(ref_code);

-- ─── AUTO-UPDATE updated_at ───────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS events_updated_at ON events;
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────
ALTER TABLE events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes    ENABLE ROW LEVEL SECURITY;

-- Public: قراءة الفعاليات المنشورة فقط
DROP POLICY IF EXISTS "public_read_published" ON events;
CREATE POLICY "public_read_published"
  ON events FOR SELECT USING (status = 'published');

-- Public: تسجيل في فعالية
DROP POLICY IF EXISTS "public_insert_reg" ON registrations;
CREATE POLICY "public_insert_reg"
  ON registrations FOR INSERT WITH CHECK (true);

-- Public: قراءة التسجيلات (عشان يشوف بطاقته)
DROP POLICY IF EXISTS "public_read_reg" ON registrations;
CREATE POLICY "public_read_reg"
  ON registrations FOR SELECT USING (true);

-- Public: التصويت
DROP POLICY IF EXISTS "public_insert_vote" ON poll_votes;
CREATE POLICY "public_insert_vote"
  ON poll_votes FOR INSERT WITH CHECK (true);

-- Public: قراءة الأصوات
DROP POLICY IF EXISTS "public_read_votes" ON poll_votes;
CREATE POLICY "public_read_votes"
  ON poll_votes FOR SELECT USING (true);

-- ─── SERVICE ROLE: وصول كامل للداش بورد ──────────────────
-- Service role تلقائياً يتجاوز RLS، ما تحتاج policies إضافية

-- ─── تحقق إن كل شيء تمام ────────────────────────────────
SELECT 'events' as table_name, COUNT(*) as rows FROM events
UNION ALL
SELECT 'registrations', COUNT(*) FROM registrations
UNION ALL
SELECT 'poll_votes', COUNT(*) FROM poll_votes;
