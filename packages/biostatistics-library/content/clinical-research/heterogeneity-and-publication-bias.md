---
title: Heterogeneity and publication bias
summary: Two threats to a meta-analysis — genuine differences between studies, and the missing studies that never made it into print.
---

## Overview and key ideas

A meta-analysis rests on the assumption that the included studies are sufficiently alike to pool. **Heterogeneity** is the real, quantifiable disagreement between study results beyond what sampling error alone would produce. It is summarised by Cochran's Q test and, more usefully, by **I-squared (I²)**, which expresses the percentage of total variation across studies that is due to real differences rather than chance: I² of 0–40% is often unimportant, 30–60% moderate, 50–90% substantial, and 75–100% considerable. High heterogeneity argues for a random-effects model, for subgroup exploration, and for cautious interpretation.

**Publication bias** is a different, nastier threat: the set of studies found is not representative of all studies done, because small or negative trials are less likely to be published. The result is a pool skewed toward large, positive effects — a bias that inflates the pooled estimate and narrows its interval. Because unpublished studies are invisible, it can only be *suspected* and probed, not directly observed.

## When to use it

| Setting | Example question |
| --- | --- |
| Assessing a pooled estimate | Is the apparent benefit of a supplement robust when studies differ in dose, duration and population? |
| Choosing a model | Given substantial I², should the meta-analysis use random effects and be read as a range of effects? |
| Checking for bias | Does a funnel plot for a drug's RCTs look asymmetric in a way that suggests missing negative trials? |
| Guideline grading | When downgrading a body of evidence, is the concern heterogeneity, risk of bias, or both? |

## Assumptions and limitations

- **I² has no fixed threshold** — the same I² is tolerable with a large overall effect and disqualifying with a small one; it is a proportion of variance, not a pass/fail test, and the underlying Q test has poor power with few studies.
- **Random effects does not fix heterogeneity** — it describes the spread of effects and widens the interval, but it does not make non-comparable studies meaningful; if studies differ in ways that matter clinically, pooling may be wrong entirely.
- **Funnel-plot methods assume symmetry** — Egger's test and funnel plots presume that asymmetry, if present, comes from small-study/publication effects; it can also arise from genuine heterogeneity, poor study quality, or chance.
- **Few studies are the weak point** — with only 4–6 trials, neither I² nor a funnel plot can reliably detect heterogeneity or bias; the tests are underpowered and the funnel plot is just a handful of points.

## Worked example

A meta-analysis of seven RCTs of a new analgesic versus placebo shows a pooled mean pain-score improvement of 1.2 points (95% CI 0.6–1.8). Cochran's Q = 18.4, df = 6, p = 0.006, and I² = 67% — substantial heterogeneity: the trials range from 0.4 to 2.3 points. Rather than trust the fixed-effects pool, the analysis is redone with a random-effects model, giving 1.1 (95% CI 0.1–2.1), and a subgroup analysis by dose reveals the high-dose trials are the ones driving the benefit.

Separately, a funnel plot of the seven trials is noticeably asymmetric: the small trials cluster on the positive side, and there is a gap where small negative trials should be. Egger's test is significant (p = 0.04). The plausible explanation is that small, negative trials went unpublished, so the pooled benefit is likely overstated. Interpretation: two independent warnings — real between-trial differences and a probable publication gap — mean the "modest benefit" headline is fragile, and the honest summary is a wide random-effects interval that may shrink (or reverse) once missing trials are accounted for.

## Interpretation and common pitfalls

- Treating I² as a rigid rule ("if I² > 50%, pool or don't"): it is a descriptive proportion, and its tolerability depends on the size and clinical importance of the pooled effect.
- Swapping to a random-effects model and then reading its wide interval as if heterogeneity were solved; random effects describes the spread, it does not make dissimilar studies comparable.
- Taking a symmetric-looking funnel plot as proof there is no publication bias, especially with only a handful of studies where the plot has no statistical power.
- Reporting a significant fixed-effects result while ignoring a significant Q test, i.e. quoting the precise-looking estimate that the data say you should not trust.

With k studies, Cochran's Q has low power to detect heterogeneity when k is small and can flag trivial dispersion when k is large. I² describes the proportion of observed variability attributed to between-study heterogeneity under its model; it is not the magnitude of clinical inconsistency and should not be read without the effect scale and τ². A prediction interval estimates the range of effects in settings like those studied, subject to model assumptions, and is often more useful for transportability. Funnel-plot asymmetry is not synonymous with publication bias: small-study effects, chance, and outcome or methodological differences can also produce asymmetry. Tests for asymmetry are unreliable with few studies.

## References and further reading

- Higgins JPT, Thompson SG, Deeks JJ, Altman DG. Measuring inconsistency in meta-analyses. *BMJ*. 2003;327:557–560. [doi:10.1136/bmj.327.7414.557](https://doi.org/10.1136/bmj.327.7414.557)

- Higgins JPT, Thomas J, Chandler J, Cumpston M, Li T, et al. *Cochrane Handbook for Systematic Reviews of Interventions*, 2nd edn. Wiley-Blackwell.
- Bland M, Altman DG. "Some methods and software for assessing scale of heterogeneity in meta-analysis." *Statistics in Medicine*. 1996.
- Greenland S, Rothman KJ, Lachin JM (eds). *Modern Epidemiology*. Lippincott Williams & Wilkins.
- The library's "Meta-analysis and forest plots" article shows where these diagnostics sit in the synthesis.
