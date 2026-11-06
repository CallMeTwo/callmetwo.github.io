# Build Brief — Quantiles and the interquartile range topic page

You are the **html-builder**. Follow this brief exactly. Read-only on the codebase except the ONE
output file. No git, no `topics.ts`, nothing in `scripts/`.

## Output (exactly one file, exact path)
`/home/chanavee/Documents/project/AI_project/Git_page/packages/biostatistics-library/public/describing-data/quantiles-and-the-interquartile-range.html`
(Create the `describing-data/` directory — it does not exist yet.)

The research content source is:
`/home/chanavee/Documents/project/AI_project/Git_page/RESEARCH_quantiles-and-the-interquartile-range.md`

That file is being written by a teammate in parallel and **may be empty/missing when you start**.
Poll it with a plain `test -s <path>` check between turns (do NOT use any `for`/`$( )` shell loop —
the security scanner blocks them); a single `sleep 120` then re-check is fine. **Do NOT build until
it has real content.** If after ~20 minutes it still has none, STOP and report (what you read,
ground-truth pins you pre-verified, what is blocked) — do NOT invent content.

## Reference article to match (read it WHOLE first — use the wait productively)
`/home/chanavee/Documents/project/AI_project/Git_page/packages/biostatistics-library/public/study-design/propensity-matching.html`

Match its overall structure, page-level `<style>` block and palette/classes, TOC sidebar, section
layout, equation styling, lab markup, quiz JS, and bottom nav, so the page looks like it belongs.
Also skim `public/survival/generalized-estimating-equations.html` (the most recent page) for tone.

## Content (must come from the research notes)
Every factual claim, threshold, and number must come from (or be consistent with) the research
notes. Reproduce the worked-example numbers EXACTLY as printed there — an auditor recomputes the
arithmetic. Do not add study results it didn't verify.

Mirror the research notes' learning flow: core concept (quantiles, quartiles, IQR) → distinguishing
commonly-confused ideas (quantile vs percentile, IQR vs range/SD, median vs mean, the 9 quantile
conventions, 1.5× vs 3× fences) → assumptions & limitations → ONE concrete worked example (the
HbA1c n=20 example, with the robustness contrast table) → practical takeaways → interactive lab →
10-question self-check quiz → References.

## Required elements
- Self-contained page: inline CSS + inline JS, NO runtime CDN `<script>`/`<link>`. The ONLY external
  references allowed are the DOI links in the References section, one Wikipedia background link, and
  the favicon. (The SVG namespace string `http://www.w3.org/2000/svg` is a constant, not a fetch.)
- A TOC (on-this-page) with anchors that resolve to real `<section>` ids.
- An interactive teaching element: **the Quantile & IQR robustness lab** (described precisely below).
  Explicit labeled controls, labeled SVG axes, a seeded deterministic RNG (mulberry32), and a status
  line with `aria-live`.
- A 10-question self-check quiz (a JS `const quizItems = [...]` array rendered by `renderQuiz()`;
  clicking locks all options, marks the correct one `is-correct`, marks a wrong pick `is-incorrect`,
  shows the `explanation`, updates a live "Answered X of N · Score Y" status). Use the exact
  stems/options/answers from the research notes' quiz plan.
- An `aria-live` status region for the lab readout and quiz.
- Keyboard focus (buttons/inputs are real `<button>`/`<input>`; no mouse-only interaction).
- A References section. Every in-text citation must be an `<a href="#ref-…">` link to a References
  entry. Every ref must have a resolvable DOI. NO orphan refs (every `<li id="ref-…">` cited at least
  once in prose) and NO unlinked in-text citations. Use the 6 verified references from the notes'
  References section.
- Bottom nav (copy character-for-character; the sibling link is a real existing file — verify with
  `test -f` from this page's location before shipping):
  `<nav class="bottom-nav" aria-label="Article navigation"><a href="../#topic-index">← Back to the topic index</a><a href="../study-design/propensity-matching.html">Next: Propensity matching →</a></nav>`

## Non-negotiable invariants
1. **Formulas — PLAIN placeholders only.** Write `<div class="equation" role="math" aria-label="EXACT
   LABEL">readable version</div>`. The `aria-label` must match the `label` in
   `scripts/formulas-quantiles-and-the-interquartile-range.json` **character-for-character** (the PM
   injects KaTeX post-build by matching on the label; a mismatch aborts the run). The file already
   exists and pins these 5 labels (copy them verbatim):
   - `Linear interpolation quantile: h equals (n minus 1) times p; j is the floor of h; the estimated p-th quantile is the (j plus 1)-th order statistic plus (h minus j) times the difference between the (j plus 2)-th and (j plus 1)-th order statistics`
   - `The interquartile range: IQR = Q3 − Q1 — the width of the middle 50% of the distribution`
   - `Tukey's outlier fences: the lower fence is Q1 minus 1.5 times IQR, and the upper fence is Q3 plus 1.5 times IQR; observations beyond a fence are flagged as potential outliers`
   - `The arithmetic mean: x-bar equals one over n times the sum of the observations`
   - `The sample standard deviation: s equals the square root of the sum of squared deviations from the mean, divided by n minus 1`
   Do NOT add KaTeX, runtime math JS, or a CDN. Do NOT edit the formulas JSON.
2. **Citations** — see Required elements (every in-text `#ref-…` resolves; every `<li id="ref-…">`
   is cited; every ref has a DOI).
3. **Quiz** — 10 items, each 4 options + `answer` index pointing at the intended correct option.
   Correct option must NOT be the longest in more than 2 of 10; vary the correct position (A/B/C/D);
   spread the length rank (ideally {1:2,2:2,3:3,4:3}); distractors clearly WRONG; each `explanation`
   says why the tempting wrong option fails. The notes' quiz plan already satisfies the rules.
   **No unescaped apostrophes** in quiz strings (a stray `'` in a single-quoted JS string kills the
   whole IIFE — use the typographic ’ if needed).
4. You must NOT touch `topics.ts`, anything in `scripts/`, or git.

## The interactive lab (build exactly this)
Pedagogical heart: **one or a few extreme values move the mean and SD a lot, but barely move the
median and IQR** — the boxplot shows it live.

**Controls (labeled sliders/inputs):**
- Sample size `n` — default 40, range 10–100, step 10.
- Spread `σ` — default 0.35, range 0.2–1.0, step 0.05. (The data are lognormal.)
- Extreme values `C` — default 0, range 0–5, step 1 (high contamination).

**Deterministic data (the PM pins these exact values — the lab must match to 3 dp):**
- `mulberry32(42)` canonical body, add the constant EXACTLY ONCE inside the draw (no pre-mix).
  EXACT body (verified — the pins below are generated by THIS exact JS; the second `imul` line
  uses `t`, not `a` — `Math.imul(a^(t>>>7), …)` gives a DIFFERENT stream, do not "fix" it):
  `a=(a+0x6D2B79F5)|0; t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return
  ((t^(t>>>14))>>>0)/4294967296`
- Draw n standard normals by **Marsaglia polar, cos branch first**: `u1,u2; r=√(−2·ln u1);
  z0=r·cos(2π·u2); z1=r·sin(2π·u2)`; each datum = `exp(3.8 + σ·z)`.
- Contamination: for k = 1…C add one value at `max(base) + 15·k`.
- Quantiles by **R-7 linear interpolation**: `h=(n-1)p; j=floor(h); q̂(p)=x_(j+1)+(h-j)·(x_(j+2)−x_(j+1))`.
- Mean + sample SD (÷(n−1)) as the sensitive contrast.

**Readouts (3 dp) + a live SVG boxplot** (labeled: whisker ends, box = Q1–Q3, median line, outlier
dots beyond the fences, a faint fence marker if visible):
min, Q1, median, Q3, max, IQR, lower fence, upper fence, whisker lo, whisker hi, mean, SD,
outlier count (list the flagged values).

**Pins (verify against these — all PM-verified from the EXACT canonical-JS body; the auditor will re-check):**
- DEFAULT n=40, σ=0.35, C=0: min 14.187, Q1 31.550, median 42.632, Q3 54.690, max 104.664, IQR 23.140,
  lower fence −3.160, upper fence 89.400, whisker lo 14.187, whisker hi 75.679, mean 44.814, SD 17.319,
  1 outlier (104.664, above the upper fence 89.400).
- n=40, σ=0.35, C=1: Q1 31.987, median 44.572, Q3 55.318, max 119.664, IQR 23.330, upper fence 90.313,
  mean 46.639, SD 20.715, 2 outliers.
- n=40, σ=0.35, C=2: Q1 32.179, median 45.376, Q3 55.410, max 134.664, IQR 23.231, mean 48.735, SD 24.559, 3 outliers.
- n=40, σ=0.35, C=3: Q1 32.370, median 46.181, Q3 56.450, IQR 24.080, mean 51.082, SD 28.734, 4 outliers.
- n=40, σ=0.35, C=5: Q1 32.752, median 47.749, Q3 59.423, IQR 26.671, mean 56.464, SD 37.782, 6 outliers.
- n=10, σ=0.35, C=0: min 23.463, Q1 30.514, median 37.367, Q3 40.495, IQR 9.980, mean 36.713, SD 8.047, 0 outliers.
- n=20, σ=0.35, C=0: Q1 30.126, median 37.367, Q3 44.974, IQR 14.848, mean 38.712, SD 12.774, 1 outlier.
- n=80, σ=0.35, C=0: Q1 33.337, median 44.200, Q3 53.124, IQR 19.787, mean 45.692, SD 17.042, 3 outliers.
- n=100, σ=0.35, C=0: Q1 33.187, median 42.695, Q3 53.000, IQR 19.813, mean 44.971, SD 16.304, 3 outliers.
- n=40, σ=0.2, C=0: Q1 36.629, median 43.496, Q3 50.161, IQR 13.533, mean 44.001, SD 9.644, 1 outlier.
- n=40, σ=0.5, C=0: min 8.675, Q1 27.179, median 41.801, Q3 59.628, IQR 32.450, mean 46.792, SD 26.432, 1 outlier.
- n=40, σ=0.75, C=0: Q1 21.202, median 40.486, Q3 68.871, IQR 47.669, mean 53.058, SD 48.125, 1 outlier.
- n=40, σ=1.0, C=0: min 1.684, Q1 16.544, median 39.254, Q3 79.547, IQR 63.003, mean 64.220, SD 85.323, 2 outliers.

**Status-line honesty (the teaching claim):** at the default, "the data already contain a natural
high outlier (104.66) above the upper fence (89.40)." As C grows, say the mean and SD rise sharply
while the median and IQR move only modestly — e.g. C 0→3: mean +6.3, median +3.5, SD +11.4, IQR +0.9
(the IQR barely moves). Do NOT claim the median/IQR never move — they do, just far less. If C is added,
note the flagged outlier count rises.

**Lab implementation pitfalls (these cost iterations on prior pages):**
- Round BEFORE taking the sign in formatters or exact-zero cells print `−0.000`:
  `fmt=(v,dp)=>(v<0?'−':'')+Math.abs(v).toFixed(dp)`.
- The 3-dp formatter on readouts must round the full-precision value, not a pre-rounded one.
- Every `getElementById('X')` in the script must have a matching `id="X"` in the HTML (regex diff).
- No `for`/`$()` compound shell anywhere in your workflow (Tirith blocks it); JS loops are fine.
- The lab is fully deterministic at defaults — no "Re-draw"/random button needed; the C slider IS the
  interaction. (If you add a re-draw, it must advance a seed deterministically and say so.)

Verify the lab math in a throwaway `/tmp` Node script (transcribe the mulberry32 + Marsaglia +
R-7 quantile + fences + mean/SD) BEFORE finalizing the page; all pins must match to 3 dp.

## Final summary (end with this)
Report: exact output path + byte size; a checklist confirming every required element (sections
present, 5 formula placeholders with the exact aria-labels, 10-question quiz with the length/position
rules, all 6 refs cited with no orphans, bottom nav verbatim + sibling link resolves, self-contained);
the lab pin results (each pin vs your /tmp recompute) at the settings above; and any deviation from
this brief (if you had to fix a broken mandated link, say so).
