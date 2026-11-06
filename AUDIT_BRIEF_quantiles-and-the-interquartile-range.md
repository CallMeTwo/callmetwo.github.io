# Audit Brief — Quantiles and the interquartile range topic page

You are the **auditor**. Your job is to verify **CORRECTNESS**, not "does it work". The PM has
already run a functional gate (page loads, lab renders, quiz works, 0 console errors, DOIs resolve,
dist==source). A page that works perfectly can still teach the wrong thing — that is what you catch.

## Target
Page: `/home/chanavee/Documents/project/AI_project/Git_page/packages/biostatistics-library/public/describing-data/quantiles-and-the-interquartile-range.html`
Research notes: `/home/chanavee/Documents/project/AI_project/Git_page/RESEARCH_quantiles-and-the-interquartile-range.md`
Build brief (what the page was supposed to contain): `/home/chanavee/Documents/project/AI_project/Git_page/BUILD_BRIEF_quantiles-and-the-interquartile-range.md`

## Scope — READ-ONLY
- Read-only on the repo, EXCEPT your single output file:
  `/home/chanavee/Documents/project/AI_project/Git_page/AUDIT_quantiles-and-the-interquartile-range.md`
- Write probe scripts ONLY under `/tmp/`.
- No git, no edits to the article, no edits to scripts/.
- Trust the FILE, never the builder's summary. Re-verify every number/link/claim against the
  on-disk file and the research notes.

## You MUST test the interactive code, not just the prose
1. **Runtime smoke:** run the skill's proven runner (do NOT hand-build your own eval+DOM-stub
   harness):
   `node /home/chanavee/.hermes/skills/research/biostat-library-topic-pages/scripts/lab_dom_stub.js <page.html>`
   A throw or degenerate readout IS a finding. If the idle readout looks degenerate, it is often the
   stub's `Number('')===0` blind spot — re-seed via the driver
   (`require('.../lab_dom_stub.js')` exposes `setControl(id,value)` and `readout(id)`), or verify by
   independent recompute and label the check "partial — stub limitation".
2. **Brute-force the control space with a CLEAN INDEPENDENT reimplementation** (write your own
   from-scratch mulberry32 + Marsaglia lognormal + R-7 quantile + fence + mean/SD in a `/tmp`
   script; do NOT eval the page's script to extract its internals — the audit value is in the
   independence). Compare to the page's readouts at AT LEAST: n ∈ {10, 20, 40, 80, 100}, σ ∈ {0.2,
   0.35, 0.5, 0.75, 1.0}, C ∈ {0, 1, 3, 5} (a representative grid covering the defaults and the
   edges). Key pins (EXACT canonical-JS mulberry32 body — the page runs this exact JS): default
   n=40/σ=0.35/C=0 → min 14.187, Q1 31.550, med 42.632, Q3 54.690, max 104.664, IQR 23.140, lof
   −3.160, hif 89.400, wlo 14.187, whi 75.679, mean 44.814, SD 17.319, 1 outlier (104.664). C=1 →
   Q1 31.987, med 44.572, Q3 55.318, IQR 23.330, mean 46.639, SD 20.715, 2 outliers. C=3 → Q1
   32.370, med 46.181, Q3 56.450, IQR 24.080, mean 51.082, SD 28.734, 4 outliers. A readout off by
   more than 3-dp rounding is a finding.
3. **Recompute the worked example BY HAND / in a separate script** — independently. The worked
   example: 20 HbA1c values (4.7 … 13.8), R-7 quantiles, 1.5×IQR fences. Verify EVERY printed
   number on the page (Q1 5.200, median 5.600, Q3 6.025, IQR 0.825, fences 3.9625/7.2625, outlier
   13.8, whiskers 4.7/7.2, mean 6.045, SD 1.9228, and the without-13.8 row: mean 5.6368, SD 0.6211,
   median 5.600, Q1 5.200, Q3 5.950, IQR 0.750, upper fence 7.075). Flag any printed number off by
   more than ordinary display rounding.
4. **Quiz checks:** exactly 10 items, 4 options each, `answer` index correct; run
   `python3 /home/chanavee/.hermes/skills/research/biostat-library-topic-pages/scripts/quiz_length_audit.py <page.html>`
   (correct-is-longest ≤ 2/10) AND eyeball the printed rank distribution (rank-2 concentration ≤ 2;
   pigeonhole allows one rank of 3). Correct positions varied. Distractors clearly WRONG (a
   "defensible but not quite" distractor is a finding). No unescaped apostrophes in the quiz
   strings (odd `'` count on a script line = SyntaxError that kills the whole IIFE — the stub run
   would show this as a throw).
5. **References:** independently re-verify a random ~4 of the 6 DOIs via
   `curl -sL https://doi.org/<doi> -H 'Accept: application/vnd.citationstyles.csl+json'` → title +
   first author + year must match (if curl is blocked, use the Crossref API
   `https://api.crossref.org/works/<doi>` in a browser). Confirm every in-text `#ref-` link resolves
   to a matching `id="ref-…"` entry AND every `id="ref-…"` is cited in-text at least once (no
   orphans in either direction), and every ref has a resolvable DOI. The 6 expected DOIs:
   10.1080/00031305.1996.10473566, 10.1080/00031305.1978.10479236, 10.1080/01621459.1987.10478551,
   10.1080/00224065.1987.11979063, 10.1371/journal.pmed.0040296, 10.1002/9780470434697. Grep the
   page for any DOI NOT in this set appearing in a `<li id="ref-…">` or in-text link (dropped
   candidates must not be cited).
6. **Prose-vs-code / prose-vs-lab agreement:** read every prose claim about the lab (which quantity
   moves how much, what the fence flags, "the median never moves"-type overclaims) and check it
   agrees with what the code actually computes/plots. A claim stated backwards or over-absolute is a
   finding (e.g. "the median never changes" is FALSE — it moves 42.632→46.181 at C=3; acceptable
   phrasing is "moves far less"). Audit on-screen LABELS too (boxplot labels, axis captions, status
   strings) — a label naming the wrong quantity is [MINOR]/[MAJOR] even when the numbers are right.
   Verify the boxplot geometry against the readouts (box = Q1–Q3, line at median, whisker ends =
   wlo/whi, dots = flagged outliers, scale covers min..max).
7. **Structure:** self-containment (only allowed external URLs: reference DOIs, Wikipedia, favicon,
   the SVG namespace constant); TOC anchors resolve; bottom nav uses `../#topic-index` + a real
   sibling; formula `aria-label`s match
   `scripts/formulas-quantiles-and-the-interquartile-range.json` character-for-character; no
   U+00AD soft-hyphens or stray invisible chars outside KaTeX internals (there are no KaTeX
   internals yet — the PM injects post-build — so any U+00AD anywhere is a finding); tag balance.
8. **The research notes may share a defect the page inherited** — when you find one, note that it is
   inherited from the notes (fix-in-both is the remedy).

## Budget guard
A partial report beats no report. If the probe phase is consuming ~15 min or many tool calls without
producing numbers, STOP probing and write the report with what you have, labeling the lab
brute-force "incomplete — harness issue". Do NOT re-loop on a broken harness. If you see yourself
re-chasing a check you already resolved, write the report now.

## Output (exactly one file)
`/home/chanavee/Documents/project/AI_project/Git_page/AUDIT_quantiles-and-the-interquartile-range.md`
with:
- **Verdict:** PASS / PASS-WITH-MINORS / NEEDS-REVISION
- Numbered findings, each tagged **[CRITICAL]** / **[MAJOR]** / **[MINOR]**, with: location
  (section/line/element), why it matters, and a concrete fix (exact replacement text where possible).
- A number-verification table for the worked example (page claim | independent recompute |
  MATCH/MISMATCH) and for the lab pins.
- Quiz-rule results (length-audit output + rank distribution + positions).
- DOI re-verification table (~4 refs: matched fields).
- **Top-5** issues (ranked) and a **"What's good"** list (so the builder preserves strengths in
  revision).
- Target < 900 words (the number tables may extend it modestly).

End with the final summary the brief requires: the verdict line, finding counts by severity, and the
file path.
