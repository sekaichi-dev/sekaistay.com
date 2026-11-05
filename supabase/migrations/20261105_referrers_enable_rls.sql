-- 2026-11-05 適用済み（記録用）。
-- referrers だけ RLS がオフで、公開キー（anon）から読み書きできた。
-- サーバーは service_role で読み書きするので、アプリの動きは変わらない。
--
-- 同日、このアプリの DB を Supabase プロジェクト competitor-intel（eorqerlewysynrnkdavc・東京）へ移した。
-- 旧プロジェクト sekai-stay-marketing（cswdzbmworwpzeihyicd）と移行先の両方に同じ内容を適用している。
-- 移行先では lead_submissions / lp_page_views / referrers とも anon・authenticated の権限を外してある。

alter table public.referrers enable row level security;

create policy referrers_service_all on public.referrers
  as permissive for all to service_role
  using (true) with check (true);
