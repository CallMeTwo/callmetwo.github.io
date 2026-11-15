# AUDIT — Random forests (machine-learning/random-forests)

**Auditor: PM (self-run) — independent recompute via /tmp Node scripts.** The page had already been
built and verified as-built in a prior (interrupted) run; this run's STEP 0.5 closeout re-verified it
and, in doing so, ran the correctness audit directly. A dispatched independent auditor pass is noted
at the end. All numbers below were recomputed from the documented recipe, not read off the page.

## Verdict: **PASS (after fix)** — 1 CRITICAL + 2 MINOR found in the as-built page; CRITICAL fixed and re-verified.

The page is self-consistent and *works* (the lab renders, the quiz runs, 0 console errors, all 5 DOIs
resolve). But a self-consistent page is not a correct one. The as-built page had a **reproducibility
defect** that a working-but-wrong audit must catch: the code did not implement the recipe it prints.

### [CRITICAL] The on-disk `mulberry32` was NOT canonical — the documented recipe did not reproduce the page's own numbers
- **Location:** the lab/worked-example `mulberry32` (the only RNG on the page, also printed verbatim in the prose as "the canonical mulberry32").
- **What:** the second mixing line read `t=(t+Math.imul(a^(t>>>7),61|t))^t` — a stray `a` where the
  canonical algorithm uses `t` (`t^(t>>>7)`). One character. The page labels this block *canonical* and
  the research notes pin it as "the auditor re-implements it."
- **Why it matters:** the code was internally self-consistent (it reproduced all 8 of its own lab pins
  and every static table), so a functional gate — and the researcher's own recompute — both "passed."
  But any reader/auditor who faithfully re-implements the *printed canonical* mulberry32 gets **different
  bags, different OOB, different pins**: under true canonical seed 42, K=3 OOB is **5/6 = 0.833** (not the
  printed 6/8 = 0.750), K=1 is 2/2, K=2 is 4/5, mtry=2/K=3 is 4/6 (not 7/8), and the K-curve reads
  1.000 → 0.800 → 0.833 → 0.750 (not 0.750/0.667/0.625/0.750). The worked example, K-curve, "confused
  ideas" (e)/(f), the assumptions bullet, and quiz Q9 all carried the non-canonical numbers. The
  **pinned permutation arrays** (`[7,2,3,6,1,5,4,0]`, `[5,4,7,6,0,2,1,3]`) *are* canonical Fisher–Yates
  outputs — proof the author's intent was canonical and the code had a one-char typo (which is also why
  the researcher's "can't reproduce the permutation pins" flag was an artifact: they were testing the
  buggy stream against canonical arrays).
- **Fix (applied):** (1) corrected the RNG to canonical `t^(t>>>7)`; (2) regenerated every static
  number from canonical ground truth — the 3-tree table (bags 4,3,6,5,1,4,2,4 / 7,2,4,0,0,5,0,0 /
  6,1,0,6,5,3,4,3; thresholds 9.25/9.8/9.8; Ginis 0.2143/0.0000/0.3000), the OOB table (5/6 = 0.833;
  patients 4 & 5 have no OOB votes → excluded; wrong on patient 6 only), the K-curve
  (2/2, 4/5, 5/6, 6/8, 6/8, 6/8, 6/8), the (e)/(f) prose (mtry=2 4/6 vs mtry=1 5/6), the assumptions
  bullet, the lab intro, and quiz Q9; (3) **re-verified**: the page's own (now-canonical) `growForest`
  reproduces all 8 canonical pins and the full static tables, and the lab DOM-stub idle readout is
  "OOB accuracy is 5/6 = 0.833 … wrong on 1 of its 6 out-of-bag predictions … All 3 trees … split on WBC."
- **Post-fix narrative (now honest):** at K=3 all three trees *still* split on WBC (the mtry=1 teaching
  beat survives). OOB is 5/6 = 0.833, wrong on patient 6. The permutation section is **coarse but
  directional** (not degenerate): base 6/8 → Age shuffle 5/8 (drop 0.125) → WBC shuffle 4/8 (drop 0.250),
  i.e. a WBC > Age hint at 1/8 resolution — the prose now states this plainly instead of claiming both
  drops are 0.000.

### [MINOR] "degenerate" overclaim in the permutation narrative (fixed with the CRITICAL)
The as-built page asserted shuffling *either* column "leaves the OOB accuracy at 6/8, so both drops are
0.000" and that the toy "cannot confirm the ranking." Under the corrected RNG the shuffles *do* move the
OOB (0.125 / 0.250). Reworded to "coarse but directional … a hint, not a ranking." (This was a symptom
of the same root cause; logged separately because the *honesty* of the claim is a distinct pedagogy point.)

### [MINOR] Quiz length-rank spread is optimal, not the brief's literal "≤2 per rank" (accepted)
Evaluated the real `quizItems`: 10 items, 4 options each. Correct-is-longest = **2/10** (Q5, Q10 — both
ties for longest, defensible); rank distribution {1:2, 2:3, 3:2, 4:3}; positions A×3/B×2/C×3/D×2. The
"≤2 correct answers in any single length rank" reading is unsatisfiable for 10 items (pigeonhole: a rank
holds ⌈10/4⌉=3 at minimum), so the achievable optimum was implemented and is met. No change.

## Top-5 checks performed
1. Independent canonical mulberry32 recompute of the 3-tree table + OOB table + K-curve — all match the
   post-fix page exactly (22/22 cell checks).
2. All 8 lab pins recomputed independently — all match.
3. Page's own inlined `<script>` executed under a Node `vm` sandbox with real slider defaults
   (K=3, S=42, mtry=1) — no throw, readouts consistent.
4. All 5 DOIs re-resolved via doi.org CSL-JSON (title + first author + year): Breiman 2001 Random Forests,
   Breiman 1996 Bagging Predictors, Ho 1995 Random decision forests (ICDAR; CSL year null, proceedings
   title/vol/pages confirm), Ho 1998 random subspace, Masters 2015 fibromyalgia EMR. 5/5 verified.
5. In-text citation ↔ reference integrity: 5 in-text `#ref-…` links, 5 `<li id="ref-…">`, no orphans/dead
   links; bottom nav `../#topic-index` + sibling `./multilayer-perceptrons.html` (file exists).

## What's good (preserve in any future revision)
- The honest small-N pedagogy is strong and specific (no OOB vote → excluded; OOB is a first estimate;
  greedy Gini; mtry as the de-correlation knob). The worked example is fully reproducible with a pinned
  seed + exact draw order.
- The "all three trees split on WBC even though mtry=1" beat is genuinely teachable and survives the fix.
- Clean self-contained page (KaTeX inlined at build, no runtime CDN), aria-live status, keyboard focus,
  TOC, 10-question quiz with lock/mark/score/retry.

## Discrepancy log (honesty)
- The as-built page's `mulberry32` was a non-canonical one-char variant; its "PM-verified" pins were
  verified against the *variant*, not the canonical algorithm the page documents. Corrected to canonical
  and every downstream number regenerated. The researcher's flagged permutation-pins gap is explained by
  this (their Fisher–Yates search was run on the buggy stream).
