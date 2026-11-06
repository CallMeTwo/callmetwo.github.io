# Audit — Generalized Estimating Equations topic page

**Target:** `packages/biostatistics-library/public/survival/generalized-estimating-equations.html`
**Method:** skill `lab_dom_stub.js` driver (re-seeded, not hand-built harness); from-scratch
closed-form + Monte-Carlo probes in `/tmp/gee_audit/`; `gee_fit.py` independent verifier;
full-table recompute in my own Gauss–Jordan; CSL-JSON DOI re-check.

## Verdict: NEEDS-REVISION

Everything reproduces exactly (worked example, Panel A, Panel B, DOIs, structure) **except one
quiz item (Q1)** whose correct-answer explanation is self-contradictory and whose distractor C is a
genuinely true statement — a defective item that marks a correct response wrong. This is the only
MAJOR; it is inherited from the research notes (fix-in-both).

---

## Findings

### 1. [MAJOR] Quiz Q1 — option C is a true statement AND the explanation contradicts it
Location: `<section id="quiz">`, Q1 (page lines 463–472); also RESEARCH_… §7 Q1.
- Question: "Which statement is TRUE about the assumptions required to fit a GEE?"
- Option C (line 467): *"The mean model alone must be correctly specified."*
- Option D (marked correct): *"Only the marginal mean model and a working correlation are
  specified; no full data-generating distribution is assumed."*
- **Why it matters:** C is a *true* statement (a GEE's validity does require a correct mean model).
  So two options are both true → the item has two correct answers and a learner picking C is
  marked wrong. The explanation (line 471) makes it worse: it says C "is tempting but **omits that
  the mean model must be right**" — but C *literally states* that the mean model must be correctly
  specified. The rationale contradicts its own option text.
- **Inherited from notes:** RESEARCH §7 Q1 carries the identical option C and the identical
  incoherent explanation ("C … fails because it omits that the mean model must be right"). Fix in
  both the page and the notes.
- **Concrete fix (page + notes):** replace option C with a clearly-false distractor, e.g.
  `The working correlation structure must be correctly specified, otherwise both the estimates and the standard errors are invalid.`
  (false — a misspecified working correlation only costs efficiency, never validity). Update the
  explanation to: *"C is the tempting trap: a wrong working correlation costs efficiency, not validity — the mean model is the one piece that must be correct. D is the complete statement."*
  This restores a single unambiguous correct answer (D) and keeps C's intended "trap" role.

### 2. [MINOR] `.sim-caveat` class used but not defined in CSS
Location: page line 201 `<p class="sim-caveat">`; the `<style>` block has no `.sim-caveat` rule.
Cosmetic only — the caveat renders as a normal paragraph (inherits `.article p`). No correctness
impact. **Fix:** add a `.sim-caveat{…}` rule (e.g. muted/italic) or drop the class name.

### 3. [MINOR / note] Idle DOM-stub run OOMs — stub limitation, not a page defect
`node lab_dom_stub.js <page>` (no seed) crashes with heap-OOM: the stub's default-seed regex only
matches **single-quoted** HTML attributes, but this page uses **double quotes**, so every slider
reads `''` → `Number('')===0` → n=0 → `drawSeChart` gets `xMax=Infinity` → infinite tick loop.
Per the brief this is the documented `Number('')===0` blind spot. **Re-seeded via the driver**
(`argv` JSON `pa-n/pa-T/pa-rho` = 8/4/0.6) the idle readouts are non-degenerate and correct
(DEFF 2.8000, robust SE 3.00→5.02). Labeled **partial — stub limitation**; not a page defect (n=0
is unreachable in-browser, min="4").

---

## Worked example — number verification (page claim | independent recompute | result)
Independent recompute = my own pure-Python Gauss–Jordan (`/tmp/gee_audit/full_recompute.py`,
one-hot visit indicators) **and** `gee_fit.py`. Seed 10, n=8, T=4, ρ=.6, σ=12, δ=6, drift=−2, base=120.

| Row (Model) | β̂ | SE naive | SE sand | z naive | p naive | z sand | p sand |
|---|---|---|---|---|---|---|---|
| M1 intercept | 117.8690 = 117.8690 | 3.1665=3.1665 | 3.3844=3.3844 | 37.22=37.22 | <1e-30=<1e-30 | 34.83=34.83 | <1e-30=<1e-30 |
| M1 treatment | −6.6076=−6.6076 | 2.8322=2.8322 | 4.3052=4.3052 | −2.3330=−2.3330 | 0.0196=0.0196 | −1.5348=−1.5348 | 0.1248=0.1248 |
| M1 visit2 | −0.4760=−0.4760 | 4.0054=4.0054 | 3.5107=3.5107 | −0.1188=−0.1188 | 0.9054=0.9054 | −0.1356=−0.1356 | 0.8922=0.8922 |
| M1 visit3 | −2.4582=−2.4582 | 4.0054=4.0054 | 1.7921=1.7921 | −0.6137=−0.6137 | 0.5394=0.5394 | −1.3717=−1.3717 | 0.1702=0.1702 |
| M1 visit4 | −2.1935=−2.1935 | 4.0054=4.0054 | 2.6027=2.6027 | −0.5476=−0.5476 | 0.5839=0.5839 | −0.8428=−0.8428 | 0.3993=0.3993 |
| M2 intercept | 116.5871=116.5871 | 1.9629=1.9629 | 2.8174=2.8174 | 59.40=59.40 | <1e-30=<1e-30 | 41.38=41.38 | <1e-30=<1e-30 |
| M2 treatment | −6.6076=−6.6076 | 2.7760=2.7760 | 4.3052=4.3052 | −2.3803=−2.3803 | 0.0173=0.0173 | −1.5348=−1.5348 | 0.1248=0.1248 |

Every cell **MATCH** (to display rounding). σ̂²: M1 128.34 ✓, M2 123.30 ✓. Closed-form table:
DEFF 2.8000 ✓, naive SE 3.0000 ✓, robust SE 5.0200 ✓, robust@σ̂² 4.6451 ✓, empirical DEFF 2.4053 ✓,
n_eff/arm 11.43, n_eff/tot 22.86 ✓. Prose ratios 1.55× / 2.41 / 7× (0.1248/0.0173) ✓. Treatment
β̂ and sandwich SE identical across M1/M2 ✓ (balanced-design orthogonality). **All MATCH.**

## Panel-A pins (brute-force, independent closed form)
Swept n∈{4,8,16,40} × T∈{2,4,10} × ρ∈{0,.25,.5,.6,.9,1} = **72 settings, 0 mismatches** for
exchangeable DEFF, AR(1) DEFF `[T+2Σ(T−h)ρʰ]/T`, √DEFF inflation, and n_eff. Default pin n=8,T=4,ρ=.6:
exchangeable **2.8000** ✓, AR(1) **2.3680** ✓, inflation **1.6733** ✓, n_eff **11.429** ✓.

## Panel-B coverage (page seed-42 vs my independent R=2000 sim, seed 77)
| Setting | page naive / sand / meanδ̂ | mine naive / sand / meanδ̂ | agree |
|---|---|---|---|
| n=8 T=4 ρ=.6 | 75.0 / 92.1 / 6.01 | 73.4 / 91.9 / 5.99 | ✓ |
| n=40 T=4 ρ=.6 | 75.3 / 94.2 / 6.03 | 76.2 / 95.3 / 5.94 | ✓ |
| n=8 T=4 ρ=.25 | — | 84.0 / 91.2 | (page not pinned) |
| n=8 T=10 ρ=.6 | — | 59.1 / 92.0 | (page not pinned) |

Direction is exactly as claimed: naive far under 95% (anti-conservative), sandwich on target and
rising with n, δ̂ unbiased. **No critical discrepancy.** Re-draw button increments seed (42→43)
and re-renders. Prose-vs-lab labels (SE/coverage/axis/status strings) all name the correct
quantities.

## Quiz rules
- `quiz_length_audit.py`: 10 items, 4 options each; **correct-is-longest 2/10** (Q3,Q7 — acceptable).
- Rank distribution **{1:2, 2:2, 3:3, 4:3}** — rank-2 (the "2nd-longest" tell) = 2, no concentration.
- Position distribution {A:3, B:2, C:2, D:3} — varied, all four used.
- No unescaped straight apostrophes (odd-quote scan clean; runtime `no throw`). All other distractors
  clearly wrong. **Only Q1 defective** (see Finding 1).

## DOI re-verification (all 8 re-resolved via doi.org CSL-JSON)
| ref | DOI | title match | 1st author | year |
|---|---|---|---|---|
| liang1986 | 10.1093/biomet/73.1.13 | ✓ | LIANG✓ | 1986✓ |
| zeger1988 | 10.2307/2531734 | ✓ | Zeger✓ | 1988✓ |
| zeger1986 | 10.2307/2531248 | ✓ | Zeger✓ | 1986✓ |
| lairdware1982 | 10.2307/2529876 | ✓ | Laird✓ | 1982✓ |
| huber1964 | 10.1214/aoms/1177703732 | ✓ | Huber✓ | 1964✓ |
| white1980 | 10.2307/1912934 | ✓ | White✓ | 1980✓ |
| ballinger2004 | 10.1177/1094428104263672 | ✓ | Ballinger✓ | 2004✓ |
| wang2014 | 10.1155/2014/303728 | ✓ | Wang✓ | 2014✓ |

Every in-text `#ref-` link resolves to a `<li id>` and every `<li>` is cited (no orphans either
way). All 8 refs carry a DOI. **None** of the 7 dropped DOIs (sim.4780070804, 2531090,
biomet/69.1.1, aap/1113904038, aoms/1177698612, 1912519, 1753-6561-9-S2-S11) appear in any
`<li>` or in-text link.

## Structure
TOC: all 9 anchors resolve. Bottom nav: `../#topic-index` + real sibling
(`study-design/propensity-matching.html` exists). 6 formula `aria-label`s match
`formulas-generalized-estimating-equations.json` **character-for-character**. No U+00AD anywhere;
the only invisible chars (U+200B) are KaTeX `vlist-s` scaffolding inside the equation blocks
(allowed — KaTeX was injected pre-build). Tag balance clean. Self-contained (only DOI/Wikipedia/
MathML-namespace/favicon external).

## Top-5 issues (ranked)
1. **[MAJOR]** Q1: option C is a true statement (two correct answers) and its explanation
   contradicts the option text. Fix page + notes (see Finding 1).
2. **[MINOR]** `.sim-caveat` class referenced but not styled.
3. **[note]** Idle DOM-stub OOM is a stub double-quote-seed limitation, not a page defect
   (re-seeded + independently recomputed).

(Only three substantive items — the page is otherwise clean.)

## What's good (preserve in revision)
- Worked example reproduces **to the last digit** across two independent implementations; the
  "two structural facts" (identical β̂ and identical sandwich SE across M1/M2) are genuine and correct.
- Panel A is a clean, exact closed form; 72/72 swept settings match independent math.
- Panel B's seeded sim is honest: naive 75% vs sandwich ~92%, δ̂ unbiased, on the right side of
  95% — confirmed by an independent R=2000 re-implementation.
- All prose claims about the lab (SE direction, √DEFF ratio, coverage, "estimate unchanged")
  agree with what the code computes. No backwards claim.
- References: 8/8 verified, no orphans either direction, no dropped-DOI leakage, aria-labels exact.
- Quiz length/position spread is optimal ({1:2,2:2,3:3,4:3}, 2/10 longest); Q2–Q10 distractors
  are cleanly wrong.

---

**FINAL SUMMARY**
- Verdict: **NEEDS-REVISION** (single, easily-fixable MAJOR + one cosmetic MINOR; everything else passes).
- Finding counts: **0 CRITICAL, 1 MAJOR (Q1 quiz item), 2 MINOR** (`.sim-caveat`; idle-stub OOM
  logged as a stub limitation, not a page defect).
- Report: `/home/chanavee/Documents/project/AI_project/Git_page/AUDIT_generalized-estimating-equations.md`
