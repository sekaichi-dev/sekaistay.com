-- 目的: フォーム送信→Slack 通知を即時から「10分遅延 + TimeRex 予約済みは抑制」に変更するため、
-- lead_submissions に Slack 通知の状態管理列を追加する。
--
-- 設計:
--   slack_notified_at       : 通知 or 抑制を確定した時刻（NULL なら未処理）
--   slack_suppressed_reason : 抑制した理由（'timerex_booked' など。通知した場合は NULL）
--   slack_attempt_count     : cron が試行した回数（無限ループ防止用 / 最大5回想定）
--   slack_last_error        : 最後の失敗内容（デバッグ用）
--
-- Partial index: cron は「未処理 & 本番リード」だけを対象にするので部分インデックスで十分。

ALTER TABLE lead_submissions
  ADD COLUMN IF NOT EXISTS slack_notified_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS slack_suppressed_reason TEXT NULL,
  ADD COLUMN IF NOT EXISTS slack_attempt_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS slack_last_error TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_lead_submissions_slack_pending
  ON lead_submissions (created_at)
  WHERE slack_notified_at IS NULL AND kind <> 'test';
