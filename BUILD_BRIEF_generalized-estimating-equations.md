# Build Brief — Generalized Estimating Equations topic page

You are the **html-builder**. Follow this brief exactly. Read-only on the codebase except the ONE output file. No git, no `topics.ts`, nothing in `scripts/`.

## Output (exactly one file, exact path)
`/home/chanavee/Documents/project/AI_project/Git_page/packages/biostatistics-library/public/survival/generalized-estimating-equations.html`

The research content source is:
`/home/chanavee/Documents/project/AI_project/Git_page/RESEARCH_generalized-estimating-equations.md`

That file is **already complete and PM-verified** (36 KB, all sections present, worked-example math and DOIs re-checked). If it looks empty or missing when you first check it, poll with a plain `test -s <path>` check between turns (do NOT use any `for`/`$( )` shell loop — the security scanner blocks them); a single `sleep 120` then re-check is fine. It should have content immediately; if after ~20 minutes it still has none, STOP and report — do NOT invent content.

## Reference article to match (read it WHOLE first)
`/home/chanavee/Documents/project/AI_project/Git_page/packages/biostatistics-library/public/study-design/propensity-matching.html`

Match its overall structure, CSS (copy the page-level `<style>` block and the palette/classes so the new page looks like it belongs), TOC sidebar, section layout, equation styling, lab markup, quiz JS, and bottom nav. Also skim `public/survival/markov-models.html` for a same-section sibling tone.

## Content (must come from the research notes)
Every factual claim, threshold, and number must come from (or be consistent with) `RESEARCH_generalized-estimating-equations.md`. Reproduce the worked-example numbers EXACTLY as printed there — an auditor recomputes the arithmetic. Do not add study results it didn't verify.

Mirror the research notes' learning flow: core concept → the estimating equations + robust (sandwich) variance → distinguishing commonly-confused ideas (GEE vs mixed model, GEE vs naive pooled OLS, working-correlation structures, population-averaged vs subject-specific) → assumptions & limitations → ONE concrete worked example in the health-research domain (the "Hypertension Trial") → practical takeaways → a 10-question self-check quiz → References.

## Required elements
- Self-contained page: inline CSS + inline JS, NO runtime CDN `<script>`/`<link>`. The ONLY external references allowed are the DOI links in the References section, one Wikipedia background link, and the favicon. (The SVG namespace string `http://www.w3.org/2000/svg` is a constant, not a fetch — that's fine.)
- A TOC (on-this-page) with anchors that resolve to real `<section>` ids.
- An interactive teaching element appropriate to the topic: **a two-panel cluster-robust SE lab** (described precisely below). Explicit controls (labeled sliders), labeled SVG axes, a seeded deterministic RNG (mulberry32) where random draws are used, and a status line.
- A 10-question self-check quiz (a JS `const quizItems = [...]` array rendered by `renderQuiz()`; clicking locks all options, marks the correct one, shows the explanation, updates a live "Answered X of N · Score Y" status). Use the exact stems/options/answers from the research notes' §7 quiz plan.
- An `aria-live` status region for the lab readout and quiz.
- Keyboard focus (buttons/inputs are real `<button>`/`<input>`; no mouse-only interaction).
- A References section. Every in-text citation must be an `<a href="#ref-…">` link to a References entry. Every ref must have a resolvable DOI. NO orphan refs (every `<li id="ref-…">` cited at least once in prose) and NO unlinked in-text citations. Use the 8 verified references from the research notes' §8.
- Bottom nav (copy character-for-character, but VERIFY the sibling link resolves to a real file from this page's location before shipping):
  `<nav class="bottom-nav" aria-label="Article navigation"><a href="../#topic-index">← Back to the topic index</a><a href="../study-design/propensity-matching.html">Next: Propensity matching →</a></nav>`

## Non-negotiable invariants
1. **Formulas — PLAIN placeholders only.** Write `<div class="equation" role="math" aria-label="EXACT LABEL">readable version</div>`. The `aria-label` must match the `label` in `scripts/formulas-generalized-estimating-equations.json` **character-for-character** (the PM injects KaTeX post-build by matching on the label; a mismatch aborts the run). The file already exists and pins these 6 labels (copy them verbatim):
   - `The population-averaged mean model: the mean of the outcome given the covariates is μ, where the link function g of μ equals the linear predictor, the covariate row times the coefficient vector`
   - `The estimating equations: the sum over all subjects i of X transpose times the working weight W times the residual (observed minus expected) equals zero`
   - `The sandwich variance: the inverse of the bread matrix, times the meat (the sum over subjects of each subject's score vector times its transpose), times the bread again`
   - `The design effect for an exchangeable within-subject correlation: one plus (T minus one) times rho, where T is the number of visits and rho the intra-class correlation`
   - `The naive standard error of the treatment contrast, treating all n T observations as independent: the square root of two sigma squared over n T`
   - `The cluster-robust standard error of the treatment contrast under an exchangeable correlation: the square root of two sigma squared times (rho plus one-minus-rho over T), divided by n`
   Do NOT add KaTeX, runtime math JS, or a CDN. Do NOT edit the formulas JSON.
2. **Citations** — see Required elements above (every in-text `<a href="#ref-…">` resolves; every `<li id="ref-…">` is cited; every ref has a DOI).
3. **Quiz** — 10 items, each with 4 options and an `answer` index pointing at the intended correct option. Correct option must NOT be the longest in more than 2 of 10; vary the correct position (A/B/C/D); distractors clearly WRONG (unambiguous false misconceptions), and each `explanation` says why the tempting wrong option fails. The research notes' §7 already satisfies the length/position rules — use those options.
4. You must NOT touch `topics.ts`, anything in `scripts/`, or git.

## The two-panel lab (build exactly this)
This is the pedagogical heart: **clustering leaves the point estimate unchanged; only the SE and p-value move** (naive is anti-conservative).

**Panel A — closed-form design effect (deterministic, no RNG).** Controls: subjects-per-arm `n` (default 8), visits `T` (default 4), within-subject correlation `ρ` (default 0.6). Model: balanced two-arm, T-visit, n-per-arm; treatment contrast D = ȳ_treat − ȳ_ctrl. Read out (4 dp):
- Exchangeable DEFF = 1 + (T−1)ρ
- AR(1) DEFF = [ T + 2·Σ_{h=1}^{T−1}(T−h)ρʰ ] / T
- Naive SE² factor and robust SE = naive·√DEFF (you may show the inflation √DEFF and n_eff/arm = nT/DEFF)
- A tiny SVG bar/dumbbell comparing naive vs robust SE (labeled axes) is ideal.
Pins (verify against these): n=8,T=4,ρ=.6 → Exchangeable DEFF 2.8000, AR(1) 2.3680. ρ=0 → 1.0000 (both). ρ=1 → 4.0000 (both). ρ=.9,T=10 → Exchangeable 9.1000, AR(1) 7.2762.

**Panel B — seeded naive-vs-robust coverage simulation (mulberry32, deterministic).** Simulate a random-intercept (exchangeable) process, fit the arm contrast, build both 95% CIs, measure coverage over R trials (R=2000). Parameters: n-per-arm (default 8), T (default 4), ρ (default 0.6); fixed σ=12, drift=−2, true δ=6. For each of the 2n subjects: one random intercept bs ~ N(0, ρσ²); for each of T visits y = δ·treat + drift·visit + bs + N(0,(1−ρ)σ²).
- Naive CI: independent two-sample; est=mt−mc; s²=pooled residual variance; seNaive=√(2·s²/(nT)); CI=est±1.96·seNaive.
- Sandwich CI (cluster=subject): 2-param [intercept, treat] model. Per subject s0=Σ residual, s1=Σ treat·residual; meat=[[Σs0²,Σs0s1],[Σs0s1,Σs1²]]; XtX=[[N,nT],[nT,nT]] with closed-form inverse row XtX⁻¹[1]=[−1/(nT), 2/(nT)] (DO NOT hand-roll a general N×N inverse). v̂11=(XtX⁻¹[1])ᵀ·meat·XtX⁻¹[1]; small-sample df=(G/(G−1))·((N−1)/(N−p)), G=#subjects, p=2; seSandwich=√(max(v̂11,0)·df). CI=est±1.96·seSandwich.
- Coverage = fraction of R trials whose CI contains true δ. Show naive coverage (clearly < 95%) vs sandwich coverage (≈95%, a touch under at small n, rising with n). A "Re-draw" button advances the seed by 1 (deterministic; say so in the status line).
Anchor (independent Monte-Carlo): at n=8/T=4/ρ=0.6 expect naive ≈77%, sandwich ≈88–92%; at n=40 sandwich ≈94%. A builder reporting naive ≈95% or sandwich far off is wrong.

**Critical lab bugs to avoid (these cost ~6 iterations before):**
- Do NOT write a hand-rolled N×N inverse — use the closed-form 2×2 row above (or Gauss–Jordan with partial pivoting and assert A·A⁻¹==I). A wrong inverse makes the robust SE systematically too small and coverage get WORSE as n grows.
- The arm mean must divide by n·T (the arm's observation count), NOT n. Dividing by n inflates the contrast T-fold (est biased T×). The estimator must be unbiased (mean(est)≈true δ) BEFORE the SE is meaningful.
- The 3-dp/4-dp formatter must round BEFORE taking the sign or exact-zero cells print `−0.000`: `fmt=(v,dp)=>(v<0?'−':'')+Math.abs(v).toFixed(dp)`.
- mulberry32 canonical body: `a=(a+0x6D2B79F5)|0; t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(a^(t>>>7),61|a))^t; return ((t^(t>>>14))>>>0)/4294967296`. Add the constant EXACTLY ONCE inside the draw (no pre-mix at construction).

Verify the lab math in a throwaway `/tmp` Node script (transcribe the closed form + the sim) BEFORE finalizing the page; all Panel-A pins must match to 4 dp.

## Final summary (end with this)
Report: exact output path + byte size; a checklist confirming every required element (sections present, 6 formula placeholders with the exact aria-labels, 10-question quiz with the length/position rules, all 8 refs cited with no orphans, bottom nav verbatim + sibling link resolves, self-contained); the lab Panel-A pin results and Panel-B coverage at defaults; and any deviation from this brief (if you had to fix a broken mandated link, say so).
