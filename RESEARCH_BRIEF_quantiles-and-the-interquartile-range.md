# Research Brief — Quantiles and the interquartile range (topic page)

You are the **researcher**. Do RESEARCH + NOTES ONLY: read-only on the codebase, write exactly ONE file.

## Single output file (exact path)
`/home/chanavee/Documents/project/AI_project/Git_page/RESEARCH_quantiles-and-the-interquartile-range.md`

No other file edits, no git, no HTML. Final message = short summary read from the produced file
(path, `wc -w` word count, list of `## ` headings covered). Target 3500–5000 words.

## Topic
- Section: **Describing & visualizing data** (`describing-data`)
- Group: **Descriptive statistics**
- Title: **Quantiles and the interquartile range**
- One-sentence scope: what a quantile is, the quartiles, the IQR, the boxplot, the 1.5×IQR outlier
  fence, and why the median/IQR are robust while the mean/SD are not.

## The PM has already computed the ground truth — REPRODUCE these numbers EXACTLY
An auditor recomputes every number below, so all arithmetic must hold to display rounding.
Verify them in code (a `/tmp` script via terminal; use `execute_code` if available) before writing,
but treat the pinned values as the spec. Do not substitute your own quantile method.

### Quantile definition (pin this method)
Linear interpolation, **R-7** (the default in R, NumPy, and most software). For the sorted data
`x_(1) ≤ … ≤ x_(n)` and `p` in (0,1):
`h = (n-1)p`, `j = floor(h)`, `q̂(p) = x_(j+1) + (h-j)·(x_(j+2) − x_(j+1))`.
Median = q̂(0.5), Q1 = q̂(0.25), Q3 = q̂(0.75). Cite Hyndman & Fan 1996 for why there are several
conventions (R-7 is the one this page uses).

### Worked example (n = 20) — HbA1c, a right-skewed lab value
20 adult diabetes outpatients, HbA1c (%), right-skewed with one extreme value (a probable
mislabelled/failed assay or a new-onset patient). Sorted values:
`4.7, 4.9, 5.0, 5.1, 5.2, 5.2, 5.3, 5.4, 5.5, 5.6, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.3, 6.6, 7.2, 13.8`

PM-verified five-number summary + diagnostics (reproduce exactly):
- n = 20, min = 4.7, max = 13.8
- (n−1)·0.25 = 4.75 → Q1 = x_(5) + 0.75·(x_(6)−x_(5)) = 5.2 + 0.75·(5.2−5.2) = **5.200**
- (n−1)·0.50 = 9.5 → median = x_(10) + 0.5·(x_(11)−x_(10)) = 5.6 + 0.5·(5.6−5.6) = **5.600**
- (n−1)·0.75 = 14.25 → Q3 = x_(15) + 0.25·(x_(16)−x_(15)) = 6.0 + 0.25·(6.1−6.0) = **6.025**
- IQR = Q3 − Q1 = **0.825**
- Lower fence = Q1 − 1.5·IQR = 5.2 − 1.2375 = **3.9625**
- Upper fence = Q3 + 1.5·IQR = 6.025 + 1.2375 = **7.2625**
- Values beyond a fence → flagged outliers = **{13.8}** (the only one)
- Whisker ends (most extreme data still inside the fences) = lower **4.7**, upper **7.2**
- Mean = **6.045**, SD = **1.9228**

Robustness contrast (the teaching point) — mean/SD vs median/IQR, WITH vs WITHOUT the extreme 13.8:
- WITH 13.8: mean 6.045, SD 1.9228, median 5.600, Q1 5.200, Q3 6.025, IQR 0.825
- WITHOUT 13.8 (n=19): mean 5.6368, SD 0.6211, median 5.600, Q1 5.200, Q3 5.950, IQR 0.750
- So the single extreme value raises the **mean by +0.408** (6.045→5.6368 gap) and the **SD from
  0.6211 to 1.9228 (~3.1×)** while leaving the **median exactly 5.600** and moving Q1 not at all.
- Interesting wrinkle (mention honestly): removing 13.8 shifts Q3 to 5.950 and upper fence to
  7.075, which then flags **7.2** as the new outlier — showing the fence itself is sensitive to the
  sample (a limitation, not a bug). Keep this as a short "limitation" note, do not lead with it.

### Interactive-lab ground-truth pins (the builder implements the JS; you document the method)
Lab = "Quantile & IQR robustness lab." Deterministic seeded sample; learner adds high contamination
and watches mean/SD move while median/IQR stay put. A live SVG boxplot updates.

Exact RNG recipe (builder must mirror bit-for-bit):
- `mulberry32(42)` canonical body (add the constant EXACTLY ONCE inside the draw, no pre-mix; the
  second `imul` line uses `t`, not `a` — `Math.imul(a^(t>>>7), …)` gives a different stream):
  `a=(a+0x6D2B79F5)|0; t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t;
   return ((t^(t>>>14))>>>0)/4294967296`
- Draw n standard normals by **Marsaglia polar** (cos branch first, then sin):
  `u1,u2; r=√(−2·ln u1); z0=r·cos(2π u2); z1=r·sin(2π u2)`; emit `exp(3.8 + σ·z)` each.
- Contamination: for c = 1…C add one value each at `max(base) + 15·c` (C = the "extreme values" slider).
- Quantiles by R-7 linear interpolation above.

PM-verified readouts (builder must match to 3 dp — these use the EXACT canonical-JS mulberry32 body):
- DEFAULT n=40, σ=0.35, C=0: min 14.187, Q1 31.550, median 42.632, Q3 54.690, max 104.664,
  IQR 23.140, lower fence −3.160, upper fence 89.400, whisker lo 14.187, whisker hi 75.679,
  mean 44.814, SD 17.319, **1 outlier (104.664, above the upper fence 89.400)**.
- n=40, σ=0.35, C=1: Q1 31.987, median 44.572, Q3 55.318, max 119.664, IQR 23.330, upper fence
  90.313, mean 46.639, SD 20.715, 2 outliers.
- n=40, σ=0.35, C=3: Q1 32.370, median 46.181, Q3 56.450, IQR 24.080, mean 51.082, SD 28.734, 4 outliers.
- n=40, σ=0.35, C=5: Q1 32.752, median 47.749, Q3 59.423, IQR 26.671, mean 56.464, SD 37.782, 6 outliers.
- n=10, σ=0.35, C=0: min 23.463, Q1 30.514, median 37.367, Q3 40.495, IQR 9.980, mean 36.713, SD 8.047, 0 outliers.
- n=80, σ=0.35, C=0: Q1 33.337, median 44.200, Q3 53.124, IQR 19.787, mean 45.692, SD 17.042, 3 outliers.
- n=40, σ=0.2, C=0: Q1 36.629, median 43.496, Q3 50.161, IQR 13.533, mean 44.001, SD 9.644, 1 outlier.
- n=40, σ=1.0, C=0: min 1.684, Q1 16.544, median 39.254, Q3 79.547, IQR 63.003, mean 64.220, SD 85.323, 2 outliers.

Robustness deltas the prose should state (C: 0→3, n=40, σ=0.35): mean 44.814→51.082 (Δ +6.269),
median 42.632→46.181 (Δ +3.549, ~1.8× smaller), SD 17.319→28.734 (Δ +11.415), IQR 23.140→24.080
(Δ +0.940, barely moves). Honest phrasing: "added extremes pull the mean ~2× as far as the median and
the SD ~12× as far as the IQR — the IQR barely moves at all." Note the natural (uncontaminated) sample
already carries a few high values above its fence (1 at n=40, 3 at n=80, 0 at n=10) — the fence is
sample-dependent; the lab's C slider adds extremes on top of the real tail.

## Required sections (clear `## ` headings, in this order)
1. **Core concept** — what a quantile is, p-th quantile, median = 50th percentile, quartiles Q1/Q2/Q3,
   IQR definition. (Cite Hyndman & Fan 1996 for the definition/convention; McGill, Tukey & Larsen 1978
   for the boxplot/five-number summary.)
2. **Commonly-confused ideas** — (a) quantile vs percentile (terminology, same idea);
   (b) IQR vs range vs variance/SD (IQR robust, range/SD not — SD is squaring, very sensitive to one
   extreme); (c) median vs mean (breakdown point: you can corrupt up to ~half the data before the
   median is ruined, vs a single point for the mean — cite Huber & Ronchetti 2009); (d) the many
   sample-quantile conventions (Hyndman & Fan's 9 methods; R-7 default) — why two tools can give
   slightly different quartiles on the same data; (e) the 1.5×IQR "inner fence" vs 3×IQR "outer
   fence" (mild vs extreme) — cite Hoaglin & Iglewicz 1987, Iglewicz & Hoaglin 1987.
3. **Assumptions & limitations** — quantiles need ordered/continuous data and only summarize the
   middle (IQR is silent about the tails beyond Q1/Q3); the fence is a heuristic, not a statistical
   test, and is itself sample-sensitive (the worked-example wrinkle); sample quantiles are consistent
   but any single method is a convention, not "the" quantile; small n → noisy quartiles.
4. **ONE concrete worked example (health-research)** — the HbA1c n=20 example above, fully numeric,
   with the robustness contrast table and the fence flagging 13.8.
5. **Practical takeaways** — report **median (IQR)** for skewed/long-tailed health data (STROBE
   convention — cite von Elm 2007); pair the median with the IQR (not just SD) so readers see spread
   that is robust to outliers; the boxplot is the five-number summary drawn to scale; the fence flags
   candidates — **investigate, don't auto-delete**; know which quantile method your software uses
   (R-7) so reported quartiles are reproducible.
6. **Interactive lab plan** — describe the "Quantile & IQR robustness lab" (controls, readouts, the
   live boxplot, the mean/SD-vs-median/IQR contrast) exactly per the RNG recipe + pins above, so the
   builder can implement it and the auditor can re-verify it.
7. **10-question self-check quiz plan** — stems + 4 options + correct index + one-line explanation
   each (see the quiz rules below; options must satisfy the length/position rules).
8. **References** — the 6 verified references below, each with a resolvable DOI.

## Quiz rules (the recurring ask — must hold)
- Exactly 10 items, 4 options each, an `answer` index, and a one-line `explanation` that says why the
  tempting wrong option(s) fail.
- The correct option must **NOT be the longest in more than 2 of 10**; **diversify the length rank**
  (mix 2nd/3rd/4th-longest; do not make them all exactly 2nd-longest); vary the correct **position**
  (A/B/C/D). Aim for a spread like {rank1:2, rank2:2, rank3:3, rank4:3}.
- Distractors must be **clearly WRONG** (unambiguous false misconceptions), not "defensible but not
  quite."

## References (all 6 PM-verified via doi.org CSL-JSON — title + first author + year matched)
Use these EXACT bibliographic values (do not retype co-authors/volume/issue/pages from memory):
1. Hyndman, R. J., & Fan, Y. (1996). Sample Quantiles in Statistical Packages. The American
   Statistician, 50(4), 361–365. DOI: 10.1080/00031305.1996.10473566
2. McGill, R., Tukey, J. W., & Larsen, W. A. (1978). Variations of Box Plots. The American
   Statistician, 32(1), 12–16. DOI: 10.1080/00031305.1978.10479236
3. Hoaglin, D. C., & Iglewicz, B. (1987). Fine-Tuning Some Resistant Rules for Outlier Labeling.
   Journal of the American Statistical Association, 82(400), 1147–1149. DOI: 10.1080/01621459.1987.10478551
4. Iglewicz, B., & Hoaglin, D. C. (1987). Use of Boxplots for Process Evaluation. Journal of Quality
   Technology, 19(4), 180–190. DOI: 10.1080/00224065.1987.11979063
5. von Elm, E., Altman, D. G., Egger, M., Pocock, S. J., Gøtzsche, P. C., & Vandenbroucke, J. P. (2007).
   The Strengthening the Reporting of Observational Studies in Epidemiology (STROBE) Statement.
   PLoS Medicine, 4(10), e296. DOI: 10.1371/journal.pmed.0040296
6. Huber, P. J., & Ronchetti, E. M. (2009). Robust Statistics. Wiley Series in Probability and
   Statistics. Wiley. DOI: 10.1002/9780470434697

## Conventional thresholds (label as rule-of-thumb)
The 1.5×IQR inner-fence multiplier and 3×IQR outer-fence multiplier are Tukey/Hoaglin conventions,
not derived constants — say so. "Median (IQR)" as the default for skewed clinical data is the STROBE
reporting convention.

## Reference-verification rule
Every reference must have a resolvable DOI that **title-matches** (a resolving DOI can point at a
different paper — title + first author + year must all match). The 6 above are already verified. If you
need to add any, verify via `curl -sL https://doi.org/<doi> -H 'Accept: application/vnd.citationstyles.
csl+json'`; drop (and log the drop with the exact query/DOI + reason) anything that 404s or title-
mismatches. Do NOT cite a DOI you cannot title-verify.

## Definition of done (acceptance checklist)
- File at the exact path, non-empty, 3500–5000 words (`wc -w`).
- All 8 `## ` sections present.
- Worked example + lab pins reproduced EXACTLY (every printed number matches the values above to
  display rounding) — verified in code, not by eye.
- 6 references, each with a resolvable DOI; drop-log (if any) at the end under "Notes for the PM/
  auditor."
- 10 quiz items, each satisfying the length/position rules.
- Final message = summary read from the file (path, word count, headings).
