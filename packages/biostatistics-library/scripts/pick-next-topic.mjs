#!/usr/bin/env node
// pick-next-topic.mjs — deterministic "next topic without a page" picker for the
// daily topic-page cron. Walks the taxonomy in src/topics.ts and the on-disk page
// set (public/<section>/<slug>.html) and prints the next backlog topic in
// taxonomy order as a machine-readable block.
//
// Usage:  node scripts/pick-next-topic.mjs [--random] [--seed N]
//   --random   pick uniformly at random from the unfinished backlog instead of
//              taxonomy order (the daily cron uses this — fills all sections
//              evenly instead of grinding one section at a time).
//   --seed N   with --random: deterministic pick for that seed (reproducible,
//              for testing). Without --seed, uses entropy.
//   (Legacy: --skip N — take the Nth backlog topic in taxonomy order.)
//
// Prints (topic found):
//   TOPIC_FOUND
//   section_id=...   section_title=...   group_title=...
//   title=...        slug=...
//   path=public/<section>/<slug>.html
//   backlog_remaining=N
// or:  NO_TOPICS_LEFT
// Exit: 0 normal, 1 internal error.

import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PKG = join(here, "..");                       // packages/biostatistics-library
const SRC = join(PKG, "src", "topics.ts");
const PUB = join(PKG, "public");

const si = process.argv.indexOf("--skip");
const skip = Math.max(0, parseInt(process.argv[si + 1], 10) || 0);
const rand = process.argv.includes("--random");
const sei = process.argv.indexOf("--seed");
const seedArg = sei >= 0 ? process.argv[sei + 1] : undefined;

// mirror topicSlug() from topics.ts EXACTLY
function topicSlug(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2019\u2018]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const hasPage = (sectionId, slug) => {
  const p = join(PUB, sectionId, `${slug}.html`);
  return existsSync(p) && statSync(p).isFile();
};

// --- walk the taxonomy text in order, tracking the current section id/title ---
let src;
try { src = readFileSync(SRC, "utf8"); } catch (e) {
  console.error("ERROR reading topics.ts:", e.message); process.exit(1);
}

const backlog = [];
let secId = null, secTitle = null, groupTitle = null;
for (const raw of src.split("\n")) {
  const line = raw.trim();
  const secMatch = line.match(/id:\s*'([a-z0-9-]+)',\s*title:\s*'([^']*)'/);
  if (secMatch) { secId = secMatch[1]; secTitle = secMatch[2]; continue; }
  const grpMatch = line.match(/^\{\s*title:\s*'([^']*)',\s*topics:\s*\[([^\]]*)\]/);
  if (grpMatch) {
    groupTitle = grpMatch[1];
    const titles = [...grpMatch[2].matchAll(/'([^']+)'/g)].map(m => m[1]);
    for (const title of titles) {
      const slug = topicSlug(title);
      if (!hasPage(secId, slug)) {
        backlog.push({ section_id: secId, section_title: secTitle, group_title: groupTitle, title, slug });
      }
    }
    continue;
  }
}

if (backlog.length === 0) { console.log("NO_TOPICS_LEFT"); process.exit(0); }
let idx;
if (rand) {
  // mulberry32 — tiny seeded PRNG so --seed is reproducible; unseeded uses entropy
  let a = seedArg !== undefined ? (Number(seedArg) >>> 0) : (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
  const next = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  idx = Math.floor(next() * backlog.length);
} else {
  idx = Math.min(skip, backlog.length - 1);
}
const pick = backlog[idx];
console.log("TOPIC_FOUND");
console.log(`section_id=${pick.section_id}`);
console.log(`section_title=${pick.section_title}`);
console.log(`group_title=${pick.group_title}`);
console.log(`title=${pick.title}`);
console.log(`slug=${pick.slug}`);
console.log(`path=public/${pick.section_id}/${pick.slug}.html`);
console.log(`backlog_remaining=${backlog.length}`);
process.exit(0);
