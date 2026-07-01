-- リードに紹介者 attribution を付与
ALTER TABLE lead_submissions
  ADD COLUMN IF NOT EXISTS referrer_code  text,
  ADD COLUMN IF NOT EXISTS referrer_name  text,
  ADD COLUMN IF NOT EXISTS referrer_id    uuid,
  ADD COLUMN IF NOT EXISTS referrer_match text;

CREATE INDEX IF NOT EXISTS idx_lead_submissions_referrer
  ON lead_submissions (referrer_id)
  WHERE referrer_id IS NOT NULL;
