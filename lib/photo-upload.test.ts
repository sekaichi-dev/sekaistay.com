import { test } from "node:test";
import assert from "node:assert/strict";

const { queryDriveUploadStatus, uploadPhoto } = await import("../components/guest-register/photo-upload.ts");

// fetch をローカルにモックして終わったら必ず戻す
function withFetch(mock: typeof globalThis.fetch, fn: () => Promise<void>) {
  const orig = globalThis.fetch;
  globalThis.fetch = mock;
  return fn().finally(() => { globalThis.fetch = orig; });
}

// --- queryDriveUploadStatus ---

test("queryDriveUploadStatus: 200 with id → returns id", () =>
  withFetch(async () => new Response(JSON.stringify({ id: "file-abc" }), { status: 200 }), async () => {
    assert.equal(await queryDriveUploadStatus("https://upload.googleapis.com/session?id=x", 1024), "file-abc");
  })
);

test("queryDriveUploadStatus: 201 with id → returns id", () =>
  withFetch(async () => new Response(JSON.stringify({ id: "file-xyz" }), { status: 201 }), async () => {
    assert.equal(await queryDriveUploadStatus("https://upload.googleapis.com/session?id=x", 2048), "file-xyz");
  })
);

test("queryDriveUploadStatus: 200 with no id → returns null", () =>
  withFetch(async () => new Response(JSON.stringify({}), { status: 200 }), async () => {
    assert.equal(await queryDriveUploadStatus("https://upload.googleapis.com/session?id=x", 1024), null);
  })
);

test("queryDriveUploadStatus: 308 (incomplete upload) → returns null", () =>
  withFetch(async () => new Response("", { status: 308, headers: { "Range": "bytes=0-99" } }), async () => {
    assert.equal(await queryDriveUploadStatus("https://upload.googleapis.com/session?id=x", 1024), null);
  })
);

test("queryDriveUploadStatus: fetch throws → returns null (never propagates)", () =>
  withFetch(async () => { throw new TypeError("Failed to fetch"); }, async () => {
    assert.equal(await queryDriveUploadStatus("https://upload.googleapis.com/session?id=x", 1024), null);
  })
);

test("queryDriveUploadStatus: sends PUT with correct Content-Range header", () =>
  withFetch(async (url, init) => {
    assert.equal(String(url), "https://upload.googleapis.com/session?id=abc");
    assert.equal((init as RequestInit).method, "PUT");
    assert.equal(((init as RequestInit).headers as Record<string, string>)["Content-Range"], "bytes */5000");
    return new Response(JSON.stringify({ id: "ok" }), { status: 200 });
  }, async () => {
    await queryDriveUploadStatus("https://upload.googleapis.com/session?id=abc", 5000);
  })
);

// --- uploadPhoto: PUT 応答失敗から状態照会で回収 ---

// fetch 呼び出し順: photo-session POST → drive PUT (TypeError) → drive PUT status-query (200 + id)
test("uploadPhoto: PUT throws TypeError, status-query 200 → uses recovered id without re-upload", async () => {
  const calls: { url: string; method: string; contentRange?: string }[] = [];
  let putCallCount = 0;

  await withFetch(async (url, init) => {
    const u = String(url);
    const m = ((init as RequestInit).method || "GET").toUpperCase();
    const headers = (init as RequestInit).headers as Record<string, string> | undefined;
    const cr = headers?.["Content-Range"];
    calls.push({ url: u, method: m, ...(cr ? { contentRange: cr } : {}) });

    if (u.includes("/photo-session")) {
      return new Response(JSON.stringify({ uploadUrl: "https://drive.googleapis.com/upload/session?id=test" }), { status: 200 });
    }
    if (u.includes("/upload/session")) {
      putCallCount++;
      if (cr?.startsWith("bytes */")) {
        // Status query: upload was received
        return new Response(JSON.stringify({ id: "recovered-file-id" }), { status: 200 });
      }
      // Main PUT: simulate "Failed to fetch" (body arrived, response didn't)
      throw Object.assign(new Error("Failed to fetch"), { name: "TypeError" });
    }
    throw new Error(`unexpected: ${m} ${u}`);
  }, async () => {
    const file = new File([new Uint8Array(100)], "photo.jpg", { type: "image/jpeg" });
    const id = await uploadPhoto(file, "TEST-REF");
    assert.equal(id, "recovered-file-id");

    // 3 fetch calls: photo-session → drive PUT → status-query
    assert.equal(calls.length, 3, `calls=${JSON.stringify(calls)}`);
    assert.ok(calls[0].url.includes("/photo-session"), "1st: session");
    assert.equal(calls[1].method, "PUT", "2nd: main PUT");
    assert.ok(!calls[1].contentRange, "2nd: no Content-Range (body PUT)");
    assert.equal(calls[2].contentRange, "bytes */100", "3rd: status-query header");
  });
});

// PUT throws TypeError, status-query 308 → falls through to retry loop (no early return)
test("uploadPhoto: PUT throws TypeError, status-query 308 → retries then falls to proxy", async () => {
  const calls: string[] = [];

  await withFetch(async (url, init) => {
    const u = String(url);
    const m = ((init as RequestInit).method || "GET").toUpperCase();
    const headers = (init as RequestInit).headers as Record<string, string> | undefined;
    const cr = headers?.["Content-Range"];
    calls.push(`${m}:${u.split("/").pop()}${cr ? `:${cr}` : ""}`);

    if (u.includes("/photo-session")) {
      return new Response(JSON.stringify({ uploadUrl: "https://drive.googleapis.com/upload/session?id=test" }), { status: 200 });
    }
    if (u.includes("/upload/session")) {
      if (cr?.startsWith("bytes */")) return new Response("", { status: 308 });
      throw Object.assign(new Error("Failed to fetch"), { name: "TypeError" });
    }
    if (u.includes("/api/guest-register/photo")) {
      return new Response(JSON.stringify({ id: "proxy-id" }), { status: 200 });
    }
    if (u.includes("/api/guest-register/telemetry")) {
      return new Response("{}", { status: 200 });
    }
    throw new Error(`unexpected: ${m} ${u}`);
  }, async () => {
    const file = new File([new Uint8Array(50)], "photo.jpg", { type: "image/jpeg" });
    const id = await uploadPhoto(file);
    assert.equal(id, "proxy-id", "should have used proxy after 2 direct failures");
  });
});
