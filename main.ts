// Entry program for make.fun bounty "bring-the-humans-03" (Node 22, stdlib only).
//
// The entry is the TikTok video itself: an original 15-second vertical ad for
// make.fun, made in the agent session that built this repository, posted
// publicly on TikTok with the bounty's line and a play code in its caption.
// The house reads the video's views from TikTok; nothing this program writes
// about the video is scored.
//
// This program has one job: hand VIDEO.json from the repository to the grader.
// It reads the file, checks it is a JSON object with a url string, and writes
// the same bytes to the output directory. No network, no wall clock, no files
// outside the repository, so two runs write identical bytes.
//
// How the ad was made (see POSTMORTEM.md in the workspace, and the session
// transcripts): the agent decided the creative (hook, story, on-screen text,
// call to action), fetched make.fun's brand badge and referral end card from
// the press pack at https://make.fun/press/manifest.json, rendered the video
// with ffmpeg in the session, checked its first and last frames, and handed
// the finished file to the person to post as-is on TikTok.
//
// The rendered ad (workspace ad.mp4, not shipped in this repository): 15.0 s,
// 1080x1920, 30 fps. Badge on screen from the first frame; end card over the
// last 2.5 s with referral code 4eqvbahr typed into its field. First and last
// frames were looked at and fixed in the session (the middle scenes first
// rendered as black voids, then rebuilt as framed product shots on magenta).
//
// v2 (this session, 22 Nov 2026, after mase's explicit 18:36 WIB go-ahead):
// the first video was rejected by make.fun (read as a photo post) and its
// clip repost was removed by TikTok (generic Community Guidelines, First
// Warning on @bsvbox). The v2 ad (workspace ad-v2.mp4, not shipped here) was
// rendered fresh in this session with my own ffmpeg commands — no render.sh
// was used. It is 15.07 s, 1080x1920, 30 fps, same structure, new hook:
// "AI agents compete for real money on make.fun", and the $500 prize is
// stated once as a fact ("Top 20 share $500"), never as a personal
// money-win promise. Badge from the first frame, end card with 4eqvbahr
// over the last 2.5 s. First, middle and last frames were looked at in
// this session and all check out.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const NAME = 'VIDEO.json';

const source = join(BOT_DIR, NAME);
const target = join(OUTPUT_DIR, NAME);

// Fail loudly on a missing or malformed VIDEO.json instead of copying junk.
const text = readFileSync(source, 'utf8');
const parsed: unknown = JSON.parse(text);
if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  throw new Error(`${NAME} must hold a JSON object, got something else`);
}
if (typeof (parsed as { url?: unknown }).url !== 'string') {
  throw new Error(`${NAME} must hold an object with a string "url" field`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, target);
