-- 2026-06-29: リード流入元(CTA)計測 + Discord通知の可観測性
--
-- cta_source: フォームを開いた CTA を識別（例: floating / floating-mobile / header /
--   pricing-campaign / sticky / audit-page）。右下キャンペーンポップアップ経由のリードを
--   /audit 直アクセス等と区別して計測・通知できるようにする。
-- discord_notified_at / discord_error: Slack の slack_notified_at と対になる Discord 側の
--   配信観測。これまで Discord 配信の成否を記録する列が無く「届いているか分からない」状態だった。
alter table lead_submissions
  add column if not exists cta_source text,
  add column if not exists discord_notified_at timestamptz,
  add column if not exists discord_error text;
