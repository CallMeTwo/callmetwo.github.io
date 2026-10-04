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

## Sources and consequences of heterogeneity

## Estimating and explaining τ²

## Forest and funnel plot construction

Order studies by prespecified characteristics such as year, setting, or risk of bias, not by effect size unless the display purpose is explicit. Forest plot axes should use a clinically meaningful range and identify the null. Show study estimates and intervals with clear weights and distinguish common-effect and random-effects pooled diamonds. A prediction interval is often best shown as a separate line or band so readers do not confuse it with uncertainty about the mean.

Funnel plots should use a measure with suitable sampling properties and label the precision axis clearly. For binary outcomes, plotting log OR against SE can create mathematical coupling and asymmetry; alternatives such as contour-enhanced plots can aid interpretation. A visually symmetric funnel is not proof of no selective reporting, especially with few studies. Always accompany plots with search/registry evidence and limitations.

## Certainty and heterogeneity

In GRADE, inconsistency judgments consider effect magnitude, direction, overlap of intervals, and prediction interval relative to decision thresholds. High statistical heterogeneity need not lower certainty if explained by clinically meaningful subgroups and the target population is specified; low I² need not ensure consistency when studies are imprecise. Explain heterogeneity in terms of effects and decisions, not a numeric label alone.

Tau-squared can be estimated by DerSimonian–Laird moments, REML, Paule–Mandel, or Bayesian models. Method choice matters with few studies. REML is often less biased than DerSimonian–Laird, but all estimates can hit zero when information is weak. A zero estimate does not prove studies share an identical effect. Report the estimator and sensitivity to plausible alternatives, especially when pooled conclusions depend on heterogeneity.

Tau is scale-specific: tau on log-RR cannot be interpreted as an SD of RRs without exponentiation. For tau=.25 on log scale, one SD multiplicative variation is exp(.25)=1.28. If mean RR is .82, a rough one-SD range is .64–1.05 before accounting for uncertainty in mean and tau. A prediction interval expands further. This translation helps contextualize variation but assumes normal random effects on log scale.

## Subgroup analysis without ecological overreach

Study-level moderators are subject to ecological bias. If trials enrolling older participants show a smaller effect, this does not demonstrate treatment is less effective in older individuals; study-level average age may correlate with dose, comparator, or era. Individual participant data meta-analysis can estimate participant-level interaction more directly but still requires harmonized data and assumptions about missing studies. Aggregate meta-regression should be limited, prespecified, and interpreted cautiously.

## Evidence missingness sensitivity

Assess publication bias by comparing registered and published trials, protocols and outcomes, and regulatory submissions. If registry records reveal completed unpublished studies, seek results rather than relying on funnel tests. Selection models can model probability of publication as a function of p-value or precision but are weakly identified; use as sensitivity scenarios. Report how strong selection must be to alter conclusion and avoid “no evidence of bias” when evidence is underpowered.

Between-study heterogeneity can arise from clinical differences (population, intervention dose, comparator, follow-up), methodological differences (allocation concealment, outcome ascertainment, missingness), or chance. Before pooling, compare eligibility, treatment versions, endpoint definitions, baseline risk, and analysis estimands. Statistical heterogeneity does not identify its cause: a large I² can reflect small within-study errors, while clinically important differences may exist despite low power to detect heterogeneity. Forest plots and prediction intervals help reveal dispersion that a single pooled effect conceals.

The Q statistic tests a common-effect hypothesis, but it has low power with few studies and excessive power with many. I² estimates the proportion of observed variation attributed to heterogeneity, but depends on precision and is not the magnitude of effect variation. Tau² estimates between-study variance on the chosen effect scale; its square root can be interpreted as the SD of true study effects. A prediction interval combines uncertainty in the mean and heterogeneity and estimates the range in which a future comparable study's true effect may lie. It is usually more useful for transport than I² alone.

### Worked interpretation

Suppose a random-effects synthesis estimates log RR −0.20 with SE 0.08 and tau=0.25. The pooled RR is exp(−.20)=0.82; an approximate 95% CI on log scale is −0.357 to −0.043, or RR 0.70 to 0.96. A rough prediction interval adds heterogeneity: \(-.20\pm1.96\sqrt{.08^2+.25^2}\), approximately −0.71 to 0.31, or RR 0.49 to 1.36. Thus the average suggests benefit, but a future study may plausibly find no effect or harm. This normal approximation to prediction intervals can be optimistic with few studies; use appropriate t-based methods and report the method.

## Funnel asymmetry is not synonymous with publication bias

## Choosing fixed versus random effects

The decision between common-effect and random-effects models should follow the scientific target, not an I² cutoff. A common-effect analysis targets a single effect under an assumption of no meaningful between-study variation; random effects estimate an average across a distribution of effects. If studies differ clinically, random effects may be more plausible, but the pooled average can still be unhelpful if variation spans benefit and harm. Report study-specific estimates, tau², and a prediction interval, and explain whether a new study resembles the included settings.

With only two or three studies, tau² is weakly estimated and prediction intervals are extremely uncertain. A fixed-effect result can be shown as a sensitivity analysis but does not solve heterogeneity. Bayesian random-effects models can stabilize tau² with a prior, which must be justified and sensitivity-tested. Robust variance approaches also need enough studies to estimate between-study structure.

## Heterogeneity in network and diagnostic reviews

## Practical synthesis workflow

## Worked publication-bias assessment

## Interpretation for readers

Separate observed heterogeneity from its interpretation: report the pooled average, prediction interval, and whether a future setting likely resembles included studies. Discuss clinical sources and publication processes without claiming tests have ruled them out. The most useful conclusion may be that average benefit exists but effect varies enough that local baseline risk, dose, or delivery context matters.

Imagine ten small trials with mostly favorable effects and one large registered trial with a null result that was never published. A funnel plot might be asymmetric, but the missingness mechanism is better established by registry-to-publication matching. Search registry ID, compare outcomes and analysis time points, contact investigators/sponsor where possible, and assess whether results can be obtained. If unpublished results remain unavailable, explain likely direction of bias and perform a sensitivity analysis varying the missing trial's effect and SE. Egger's test with ten studies has limited diagnostic power and cannot identify the missing trial's true result.

If unpublished evidence could plausibly move the pooled effect across a clinical decision threshold, downgrade confidence and avoid a definitive conclusion. Funnel asymmetry alone is not proof that positive results were preferentially published, and symmetry does not rule it out.

## Heterogeneity example with clinical subgroups

Assume a treatment has pooled RR .75 in trials using high doses and RR 1.02 in low-dose trials. A moderator test may suggest dose explains variation, but dose is confounded at study level with population severity and follow-up. Report subgroup estimates and interaction with intervals, assess overlap of other characteristics, and avoid asserting individual dose-response from aggregate data. If high-dose evidence comes from one small trial, inference is especially weak. Individual participant data or randomized dose-comparison studies are needed for stronger effect-modification claims.

When heterogeneity is substantial and unexplained, clinical guidance may need to state settings where benefit is supported and settings where evidence is uncertain. A pooled mean should not be used as a universal effect. Prediction intervals are uncertain with few studies; communicate them as a range of plausible true effects rather than as a guarantee for every future study.

Begin by tabulating study design, populations, interventions, outcome definitions, follow-up, and risk-of-bias domains. Decide whether effects estimate the same construct and horizon. Plot study estimates before choosing a model; investigate outliers against source articles for data extraction errors, overlapping cohorts, or materially different methods. Do not remove studies simply because their effect differs from expectation.

Report Q with degrees of freedom, I², tau² and its scale, and a prediction interval when appropriate. Confidence interval for pooled mean should be distinguished from prediction interval for true effect in a new study. Sensitivity analyses should compare estimator, fixed/common versus random effects, risk-of-bias restriction, and plausible missing-study assumptions. If the evidence base is too small for reliable heterogeneity estimates, say so directly.

Publication bias is one possible small-study effect. Other explanations include poorer methods in small studies, early stopping, dose differences, and selective outcome reporting. Funnel plot asymmetry tests cannot distinguish these mechanisms. Evaluate the registry/protocol trail and discuss the likely direction of missing evidence. If unpublished results are located, include them according to prespecified eligibility and assess their risk of bias.

Network meta-analysis has within-comparison heterogeneity plus inconsistency between direct and indirect evidence. Node-splitting and design-by-treatment interactions can detect some inconsistency, but low power and sparse networks limit reassurance. Transitivity requires that effect modifiers be similarly distributed across comparisons; compare population, dose, and outcome context across the network. Treatment ranking probabilities can be unstable and should not replace absolute effects and certainty assessment.

Diagnostic accuracy reviews have paired sensitivity/specificity data and threshold variation. Separate univariate pooling ignores their correlation and threshold effects. Hierarchical summary ROC or bivariate random-effects models jointly synthesize sensitivity and specificity; explain summary operating point and prediction region. Variation in thresholds, reference standards, and clinical spectrum is often more informative than an I² statistic alone.

Funnel plots may be asymmetric because smaller studies differ in populations or methods, because chance is substantial, because effect measures correlate with standard error, or because selective publication/reporting occurred. Egger-type tests have low power with fewer than about ten studies and can have inflated false positives with substantial heterogeneity. Trim-and-fill estimates are highly assumption-dependent and should not be presented as definitive correction. Search trial registries, protocols, conference records, and regulatory sources; compare registered outcomes with publications; contact authors for missing results when feasible.

Selective outcome reporting within studies is distinct from nonpublication of whole studies. Compare methods sections, protocols, registry records, and outcome tables. Sensitivity analysis can vary assumed effects for missing studies or use selection models, but these models are weakly identified by published data. Present conclusions under several plausible assumptions and avoid claiming that a nonsignificant asymmetry test rules out bias.

## Meta-regression and subgroup hypotheses

Meta-regression relates study-level characteristics to effect estimates and is observational. With aggregate data, associations can be ecological and confounded; a study-level mean age association does not establish individual-level age modification. The number of studies, not participants, determines information for moderators. Prespecify few plausible moderators, avoid stepwise searching, and account for multiplicity. Study characteristics can be collinear (e.g. newer trials also use different comparators), making coefficients unstable. Report estimates and intervals, not only moderator p-values, and treat exploratory meta-regression as hypothesis-generating.

- Higgins JPT, Thompson SG, Spiegelhalter DJ. A re-evaluation of random-effects meta-analysis. *JRSS A*. 2009;172:137–159. https://doi.org/10.1111/j.1467-985X.2008.00552.x
- IntHout J, Ioannidis JPA, Rovers MM, Goeman JJ. Plea for routinely presenting prediction intervals in meta-analysis. *BMJ Open*. 2016;6:e010247. https://doi.org/10.1136/bmjopen-2015-010247
- Sterne JAC, Sutton AJ, Ioannidis JPA, et al. Recommendations for examining and interpreting funnel plot asymmetry. *BMJ*. 2011;343:d4002. https://doi.org/10.1136/bmj.d4002

- Higgins JPT, Thompson SG, Deeks JJ, Altman DG. Measuring inconsistency in meta-analyses. *BMJ*. 2003;327:557–560. [doi:10.1136/bmj.327.7414.557](https://doi.org/10.1136/bmj.327.7414.557)

- Higgins JPT, Thomas J, Chandler J, Cumpston M, Li T, et al. *Cochrane Handbook for Systematic Reviews of Interventions*, 2nd edn. Wiley-Blackwell.
- Bland M, Altman DG. "Some methods and software for assessing scale of heterogeneity in meta-analysis." *Statistics in Medicine*. 1996.
- Greenland S, Rothman KJ, Lachin JM (eds). *Modern Epidemiology*. Lippincott Williams & Wilkins.
- The library's "Meta-analysis and forest plots" article shows where these diagnostics sit in the synthesis.
