const SLACK_TIMEOUT_MS = 5000;

export async function postToSlack(
  channelId: string,
  opts: { text: string; blocks?: Array<Record<string, unknown>>; threadTs?: string },
): Promise<{ ok: boolean; error?: string }> {
  const token = (process.env.SLACK_BOT_TOKEN || "").trim();
  if (!token || !channelId) {
    return { ok: true, error: "SLACK_BOT_TOKEN / channelId not configured (skipped)" };
  }
  const payload: Record<string, unknown> = {
    channel: channelId,
    text: opts.text,
    unfurl_links: false,
    unfurl_media: false,
  };
  if (opts.blocks) payload.blocks = opts.blocks;
  if (opts.threadTs) payload.thread_ts = opts.threadTs;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), SLACK_TIMEOUT_MS);
  try {
    const resp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    const json = (await resp.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!json?.ok) return { ok: false, error: `slack error: ${json?.error || resp.status}` };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.name === "AbortError" ? "timeout" : String(err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

const REFERRAL_CHANNEL = () => (process.env.SLACK_REFERRAL_CHANNEL_ID || "").trim();

export async function notifyReferralRegistered(input: {
  code: string;
  name: string;
  email: string;
  phone: string;
  isOwner: boolean;
}): Promise<void> {
  const lines = [
    `*🎁 新規紹介者登録*`,
    `*コード:* \`${input.code}\``,
    `*氏名:* ${input.name}`,
    `*メール:* ${input.email}`,
    `*電話:* ${input.phone}`,
    `*区分:* ${input.isOwner ? "既存オーナー(自己申告)" : "外部紹介者"}`,
  ];
  const res = await postToSlack(REFERRAL_CHANNEL(), {
    text: `🎁 新規紹介者登録: ${input.name}`,
    blocks: [{ type: "section", text: { type: "mrkdwn", text: lines.join("\n") } }],
  });
  if (!res.ok) console.warn(`[referral] slack notify (registered) failed: ${res.error}`);
}

export async function notifyReferredLead(input: {
  name: string;
  email: string;
  referrerCode?: string;
  referrerName?: string;
  match: string | null;
  leadId: string;
}): Promise<void> {
  const matchLabel =
    input.match === "code"
      ? "✅ コード一致"
      : input.match === "name_candidate"
        ? "🔎 名前のみ(要確認)"
        : input.match === "unmatched"
          ? "⚠️ コード不一致(要確認)"
          : "(紹介者情報なし)";
  const lines = [
    `*🤝 紹介付きリード*`,
    `*見込み客:* ${input.name} / ${input.email}`,
    `*紹介コード:* ${input.referrerCode || "(なし)"}`,
    `*紹介者名:* ${input.referrerName || "(なし)"}`,
    `*突合:* ${matchLabel}`,
  ];
  const res = await postToSlack(REFERRAL_CHANNEL(), {
    text: `🤝 紹介付きリード: ${input.name}`,
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: lines.join("\n") } },
      { type: "context", elements: [{ type: "mrkdwn", text: `Lead ID: \`${input.leadId}\`` }] },
    ],
  });
  if (!res.ok) console.warn(`[referral] slack notify (lead) failed: ${res.error}`);
}
