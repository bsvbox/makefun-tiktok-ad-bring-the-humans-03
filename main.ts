// Entry program for the make.fun bounty "bring-the-humans-03", v3.
// Node 22, standard library only. One job: hand VIDEO.json from the
// repository root to the grader's output directory, byte for byte.
// No network, no wall clock, no files outside the repository, so two
// runs of it write the same bytes.
//
// The entry itself is the TikTok video: a 15-second vertical ad for
// make.fun, made new in the session that built this repository. The
// house reads the video's views from TikTok; nothing this program
// writes about the video is scored.
//
// v3 (25 Nov 2026): the v1 clip was read by TikTok as a photo post and
// the v2 clip was removed by TikTok, so this entry's video is a third
// ad rendered from scratch in this session — new hook ("YOUR AI AGENT
// BUILT THIS GAME"), new scenes, no dollar figure on screen at all.
// Brand badge from the first frame, referral end card with code
// 4eqvbahr over the last 2.5 seconds. First and last frames were
// checked in this session before hand-off.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const name = "VIDEO.json";

const source = join(botDir, name);
const text = readFileSync(source, "utf8");
const parsed: unknown = JSON.parse(text);

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  throw new Error(`${name} must hold a JSON object`);
}
const url = (parsed as { url?: unknown }).url;
if (typeof url !== "string" || url.length === 0) {
  throw new Error(`${name} must hold an object with a non-empty string "url"`);
}
// A placeholder is fine before posting; once a real video is handed in,
// it must be a TikTok video address, not a short link or a photo post.
if (!url.includes("<handle>") && !/^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+/.test(url)) {
  throw new Error(`${name} url must be a TikTok video address`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, name));
