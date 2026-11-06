# Audit Brief — Generalized Estimating Equations topic page

You are the **auditor**. Your job is to verify **CORRECTNESS**, not "does it work". The PM has already run a functional gate (page loads, lab renders, quiz works, 0 console errors, DOIs resolve, dist==source). A page that works perfectly can still teach the wrong thing — that is what you catch.

## Target
Page: `/home/chanavee/Documents/project/AI_project/Git_page/packages/biostatistics-library/public/survival/generalized-estimating-equations.html`
Research notes: `/home/chanavee/Documents/project/AI_project/Git_page/RESEARCH_generalized-estimating-equations.md`
Build brief (what the page was supposed to contain): `/home/chanavee/Documents/project/AI_project/Git_page/BUILD_BRIEF_generalized-estimating-equations.md`

## Scope — READ-ONLY
- Read-only on the repo, EXCEPT your single output file: `/home/chanavee/Documents/project/AI_project/Git_page/AUDIT_generalized-estimating-equations.md`
- Write probe scripts ONLY under `/tmp/`.
- No git, no edits to the article, no edits to scripts/.
- Trust the FILE, never the builder's summary. Re-verify every number/link/claim against the on-disk file and the research notes.

## You MUST test the interactive code, not just the prose
1. **Runtime smoke:** run the skill's proven runner (do NOT hand-build your own eval+DOM-stub harness):
   `node /home/chanavee/.hermes/skills/research/biostat-library-topic-pages/scripts/lab_dom_stub.js <page.html>`
   A throw or degenerate readout IS a finding. If the idle readout looks degenerate, it is often the stub's `Number('')===0` blind spot — re-seed via the driver (`require('./lab_dom_stub.js')` exposes `setControl(id,value)` and `readout(id)`), or verify by independent recompute and label the check "partial — stub limitation".
2. **Brute-force the control space with a CLEAN INDEPENDENT reimplementation** (write your own from-scratch closed form + sim in a `/tmp` script; do NOT eval the page's script to extract its internals — the audit value is in the independence). For Panel A sweep at least: n ∈ {4,8,16,40}, T ∈ {2,4,10}, ρ ∈ {0, .25, .5, .6, .9, 1} and compare exchangeable DEFF = 1+(T−1)ρ and AR(1) DEFF = [T + 2·Σ_{h=1}^{T−1}(T−h)ρʰ]/T to the page's readouts (via the driver at each setting). For Panel B compare the page's coverage readout at the default design against your own R=2000 (or larger) independent sim at the same parameters; a page reporting naive coverage ≈ 95% or sandwich far from ~88–95% is CRITICAL (the lab would teach the opposite of its claim).
3. **Recompute the worked example BY HAND / in a separate script** — independently of the research notes. The worked example is the "Hypertension Trial": 16 subjects (8/arm), T=4, σ=12, ρ=0.6, δ=6, drift=−2, base=120, `random.Random(10)` Box–Muller cos-branch, Gauss–Jordan solve. The skill ships an independent verifier:
   `python3 /home/chanavee/.hermes/skills/research/biostat-library-topic-pages/scripts/gee_fit.py`
   Run it and compare EVERY printed number on the page (β̂, naive SE, sandwich SE, z, p, σ̂², DEFF, n_eff, the closed-form cross-check table) to display rounding. Flag any printed number off by more than ordinary display rounding.
4. **Quiz checks:** exactly 10 items, 4 options each, `answer` index correct; run `python3 /home/chanavee/.hermes/skills/research/biostat-library-topic-pages/scripts/quiz_length_audit.py <page.html>` (correct-is-longest ≤ 2/10) AND eyeball the printed rank distribution (no rank-2 concentration: ≤ 2 of any single rank is the ideal, ≤ 3 acceptable by pigeonhole — but rank 2 must be ≤ 2); correct positions varied; distractors clearly wrong (a "defensible but not quite" distractor is a finding); no unescaped apostrophes in the quiz strings (an odd number of `'` on a script line = SyntaxError that kills the whole IIFE — the stub run would show this as a throw).
5. **References:** independently re-verify a random ~4 of the 8 DOIs via `curl -sL https://doi.org/<doi> -H 'Accept: application/vnd.citationstyles.csl+json'` → title + first author + year must match (if curl is blocked, use the Crossref API `https://api.crossref.org/works/<doi>` in a browser). Confirm every in-text `#ref-` link resolves to a matching `id="ref-…"` entry AND every `id="ref-…"` is cited in-text at least once (no orphans in either direction), and every ref has a resolvable DOI. Also grep the page for the DROPPED DOIs from the research notes' drop log (10.1002/sim.4780070804, 10.2307/2531090, 10.1093/biomet/69.1.1, 10.1239/aap/1113904038, 10.1214/aoms/1177698612, 10.2307/1912519, 10.1186/1753-6561-9-S2-S11) — none may appear in a `<li id="ref-…">` or in-text link.
6. **Prose-vs-code / prose-vs-lab agreement:** read every prose claim about the lab (SE direction, DEFF interpretation, coverage behavior, curve/plot shape) and check it agrees with what the code actually computes/plots. A claim stated backwards (e.g. naive SE "usually too large") is CRITICAL. Audit on-screen LABELS too (marker labels, axis captions, status strings) — a label naming the wrong quantity is [MINOR]/[MAJOR] even when the numbers are right.
7. **Structure:** self-containment (only allowed external URLs: reference DOIs, Wikipedia, favicon, the SVG namespace constant); TOC anchors resolve; bottom nav uses `../#topic-index` + a real sibling; formula `aria-label`s match `scripts/formulas-generalized-estimating-equations.json` character-for-character; no U+00AD soft-hyphens or stray invisible chars outside KaTeX internals (there are no KaTeX internals yet — PM injects post-build — so any U+00AD anywhere is a finding); tag balance.
8. **The research notes may share a defect the page inherited** — when you find one, note that it is inherited from the notes (fix-in-both is the remedy).

## Budget guard
A partial report beats no report. If the probe phase is consuming ~15 min or many tool calls without producing numbers, STOP probing and write the report with what you have, labeling the lab brute-force "incomplete — harness issue". Do NOT re-loop on a broken harness. If you see yourself re-chasing a check you already resolved, write the report now.

## Output (exactly one file)
`/home/chanavee/Documents/project/AI_project/Git_page/AUDIT_generalized-estimating-equations.md` with:
- **Verdict:** PASS / PASS-WITH-MINORS / NEEDS-REVISION
- Numbered findings, each tagged **[CRITICAL]** / **[MAJOR]** / **[MINOR]**, with: location (section/line/element), why it matters, and a concrete fix (exact replacement text where possible).
- A number-verification table for the worked example (page claim | independent recompute | MATCH/MISMATCH) and for the Panel-A pins.
- Quiz-rule results (length-audit output + rank distribution + positions).
- DOI re-verification table (~4 refs: matched fields).
- **Top-5** issues (ranked) and a **"What's good"** list (so the builder preserves strengths in revision).
- Target < 900 words (the number tables may extend it modestly).

End with the final summary the brief requires: the verdict line, finding counts by severity, and the file path.
