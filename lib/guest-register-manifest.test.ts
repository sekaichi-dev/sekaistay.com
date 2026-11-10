import { test } from "node:test";
import assert from "node:assert/strict";

const { buildRegisterManifest, registerManifestHref, registerStartUrl } = await import("./guest-register-manifest.ts");

test("名簿 manifest: 開き先に施設（p）と言語を残し、名簿ページの範囲に閉じる", () => {
  const m = buildRegisterManifest("T422", "ja");
  assert.equal(m.name, "宿泊者名簿");
  assert.equal(m.start_url, "/guest-register?p=T422&lang=ja");
  assert.equal(m.scope, "/guest-register");
  assert.ok(m.start_url.startsWith(m.scope));
  assert.equal(m.display, "browser");
  assert.equal(buildRegisterManifest("T422", "en").start_url, "/guest-register?p=T422&lang=en");
});

test("名簿 manifest: 不正な p は落とし、言語は ja/en だけ", () => {
  assert.equal(registerStartUrl("<script>", "xx"), "/guest-register?lang=ja");
  assert.equal(registerStartUrl("T422&b=1", "ja"), "/guest-register?lang=ja");
  assert.equal(registerStartUrl(undefined, undefined), "/guest-register?lang=ja");
  assert.equal(registerManifestHref("T422", "ja"), "/api/guest-register/manifest?p=T422&lang=ja");
});
