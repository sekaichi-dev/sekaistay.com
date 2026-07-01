-- 紹介者台帳（Phase 1）
CREATE TABLE IF NOT EXISTS referrers (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                timestamptz NOT NULL DEFAULT now(),
  code                      text NOT NULL UNIQUE,
  name                      text NOT NULL,
  email                     text NOT NULL,
  phone                     text NOT NULL,
  is_owner                  boolean NOT NULL DEFAULT false,
  bank_name                 text NOT NULL,
  bank_code                 text,
  branch_name               text NOT NULL,
  branch_code               text,
  account_type              text NOT NULL,
  account_number_enc        text NOT NULL,
  account_holder_enc        text NOT NULL,
  account_holder_kana_enc   text NOT NULL,
  terms_version             text NOT NULL,
  terms_agreed_at           timestamptz NOT NULL,
  status                    text NOT NULL DEFAULT 'active',
  kind                      text NOT NULL DEFAULT 'real',
  client_ip                 text,
  user_agent                text
);

-- active な同一メールの重複登録を防ぐ（冪等登録の土台）
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrers_email_active
  ON referrers (lower(email)) WHERE status = 'active';
