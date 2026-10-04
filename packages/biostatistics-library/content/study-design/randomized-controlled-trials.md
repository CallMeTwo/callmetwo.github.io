---
title: Randomized controlled trials
summary: The gold-standard interventional design — random assignment to treatment or control balances known and unknown confounders and supports causal effect estimation.
---

## Overview and key ideas

A **randomized controlled trial (RCT)** allocates participants to treatment groups by a random mechanism (random number generator, randomization table) before any outcome information is available. Randomization is what distinguishes an RCT from an observational design: it is the only commonly used design feature that balances *unknown* prognostic factors across groups, not just the known ones that can be adjusted in a regression. The result is that any systematic difference in outcome between the groups is, in expectation, attributable to the treatment — which is what makes the RCT the strongest available basis for causal inference about an intervention.

Key components: a well-defined **intervention** and **control** (placebo, standard-of-care, or no treatment), a **randomization** mechanism, **blinding** (of participants, outcome assessors, or both), and a pre-specified **primary outcome** and **analysis population**.

## When to use it

| Setting | Example question |
| --- | --- |
| Phase III therapeutic trial | Does a new antihypertensive drug lower 10-year cardiovascular event rate compared with current standard therapy? |
| Surgical technique | Does a minimally invasive approach to appendectomy reduce post-operative infection versus laparotomy in children? |
| Diagnostic trial | Does a new rapid antigen test, compared with standard ELISA, change treatment decisions in community-acquired pneumonia? |
| Non-inferiority trial | Does a cheaper generic formulation of a chronic-disease drug maintain the same 24-week survival as the reference product? |
| Cluster-randomized trial | Does a school-based diet programme (assigned by school) reduce childhood obesity prevalence compared with usual curricula? |
| Pragmatic (practitioner-blinded) trial | In routine primary care, does structured follow-up by a care coordinator reduce 30-day hospital readmission after discharge? |

When a valid RCT is not feasible (rare disease, long latency, ethical or cost barriers), an observational design must be used and its limitations stated explicitly.

## Assumptions and limitations

- **Intention-to-treat (ITT) analysis.** The primary analysis must compare participants by the group to which they were *randomized*, not by the treatment they actually received. ITT preserves the confounding-balance property of randomization; per-protocol analysis is a sensitivity analysis, not a substitute.
- **Loss to follow-up.** Randomization only balances groups at baseline; if dropout or death is differential, late-stage ITT estimates can be biased. Pre-specified handling of missing outcomes is essential.
- **Randomization ≠ blinding.** Without blinding, differential assessment or behaviour (Hawthorne effect) can bias the outcome even when allocation was random.
- **External validity.** A highly selected trial population (strict inclusion/exclusion criteria) limits generalisability to real-world patients; a statistically significant result in a narrow population does not by itself apply to the broader population of interest.
- **Cluster randomisation changes the unit of analysis.** When schools or practices are randomised, observations within a cluster are correlated; the effective sample size is much smaller than the raw number of patients, and cluster-level methods (mixed models, GEE) must be used.
- **Non-inferiority trials** require a justified non-inferiority margin; an overly large margin can declare an inferior drug "non-inferior".
- **Assay and measurement validity.** The primary outcome must be measured reliably and consistently across groups; if the measurement instrument changes mid-trial, or is calibrated differently in different sites, apparent treatment differences may reflect measurement drift.

## Worked example

A double-blind RCT randomised 500 patients with stage 2 hypertension to a new drug (n = 250) and to standard therapy (n = 250). The primary outcome was mean change in systolic BP at 12 weeks.

- New drug group: mean change −18.4 mmHg, SD 9.2, n = 248 (2 withdrawn).
- Standard therapy group: mean change −12.1 mmHg, SD 8.9, n = 246 (4 withdrawn).

Difference = −6.3 mmHg. Pooled SD = sqrt((9.2² + 8.9²)/2) ≈ 9.05. SE = 9.05 × sqrt(1/248 + 1/246) ≈ 0.81. 95% CI = −6.3 ± 1.96 × 0.81 = **−7.9 to −4.7 mmHg**. The interval excludes 0, supporting a difference in mean change at the 0.05 level under this complete-case model. Clinical importance depends on a threshold set in advance; if 5 mmHg is the threshold, this interval includes effects smaller than 5 mmHg, so the analysis does not establish that the benefit exceeds that amount. The summaries include 494 of 500 randomized participants. Assigning participants to their randomized group defines the ITT estimand but does not provide missing outcomes; the analysis must state how missing data were handled and assess sensitivity to those assumptions. The small amount of missing data may limit its impact, but counts alone do not demonstrate this.

## Interpretation and common pitfalls

- **Confusing superiority with non-inferiority.** A trial designed to show that drug A is not worse than drug B by more than a margin is a different statistical exercise from showing that A is better than B; the null hypothesis, the confidence-interval interpretation, and the required sample size all differ.
- **Post-hoc subgroup analyses.** Splitting a sufficiently powered primary outcome into subgroups (e.g., by age, sex, genotype) generates many small, underpowered comparisons; a "significant" subgroup is most often a false positive unless pre-specified and tested with multiplicity correction.
- **Treating the null hypothesis as proven.** A non-significant p-value (e.g., p = 0.08) does not show equivalence; it only fails to reject the null. Equivalence or non-inferiority requires a pre-specified margin and a test designed for that hypothesis.
- **Multiple comparisons without correction.** Testing 20 secondary endpoints and reporting the single lowest p-value inflates the family-wise type I error rate dramatically; at least a Bonferroni or false-discovery-rate adjustment is required.
- **Ignoring the ITT principle in the primary analysis.** Excluding participants who crossed over, discontinued, or were non-adherent (per-protocol or as-treated analysis as the primary endpoint) selectively exposes the group that tolerated the drug, biasing the effect estimate in the direction of benefit.
- **Stopping early for significance.** An interim analysis that stops the trial as soon as the p-value crosses 0.05 tends to exaggerate the final effect size, because the stopping point is often a local fluctuation above the true effect; pre-specified stopping boundaries with alpha spending (e.g., O'Brien-Fleming) are the remedy.

## References and further reading

- Schulz KF, Altman DG, Moher D, for the CONSORT Group. [CONSORT 2010 statement](https://doi.org/10.1136/bmj.c332). *BMJ*. 2010;340:c332.
- [ICH E9(R1): Estimands and Sensitivity Analysis in Clinical Trials](https://www.ich.org/page/efficacy-guidelines), guidance on defining treatment effects and handling intercurrent events.
- [Cochrane Handbook, Chapter 8: Assessing risk of bias in a randomized trial](https://training.cochrane.org/handbook/current/chapter-08).
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Chow S, Lu W, Jiang H. *Sample Size Calculations in Clinical Research*. CRC Press.
- Agresti A. *Categorical Data Analysis*. Wiley.
- Higgins J, Thomas J, Chandler J, Cumpston M, Li T. *Cochrane Handbook for Systematic Reviews of Interventions*. Wiley.

The [bias and confounding article](/biostatistics-library/study-design/bias-and-confounding.html) explains how post-randomization deviations, missingness, and outcome measurement can still affect trial results.
