---
title: Reporting and interpreting results
summary: Present estimates, uncertainty, design context, and clinical meaning without overstating what a statistical analysis can establish.
---

## Overview

Statistical reporting is part of the analysis, not a final formatting step. The reader needs to know what was estimated, in whom, over what period, with what uncertainty, and under which assumptions. A small p-value cannot replace those details. A well-reported result connects design, estimand, model, effect size, uncertainty, and substantive interpretation without claiming more than the evidence supports.

The core is to separate three questions: What is the estimated effect or association? How uncertain is it? What does it mean for decisions or practice? These questions are related but not interchangeable. Statistical significance does not establish clinical importance; a wide interval does not prove no effect; and an adjusted association is not automatically causal.

## Start with the estimand and denominator

State the target contrast in plain language. “The intervention reduced mean symptom score by 2.4 points at 12 weeks among randomized participants” is more informative than “the treatment coefficient was significant.” Define the population, treatment conditions, outcome, follow-up, and handling of events such as discontinuation or rescue therapy. For observational studies, state the exposure contrast and adjustment target, and distinguish association from a causal estimate.

Show denominators at each stage: assessed, eligible, enrolled, randomized or included, analyzed, and with outcome data. For longitudinal studies, report follow-up at each visit; for survival studies, provide numbers at risk and event counts. Missingness and exclusions can change the population represented by the estimate. If the analysis is complete-case, say how many were excluded and why.

## Estimates with uncertainty, not just thresholds

Report the effect estimate and confidence or credible interval in original units whenever possible. A mean difference of −2.4 points with 95% CI −4.1 to −0.7 conveys direction, magnitude, and precision. A p-value such as 0.006 adds evidence against a specified null under a model; it does not say the effect is large, important, or likely to replicate. Report exact p-values to a useful precision, avoiding “p=0.000.”

For a risk ratio, include group risks so readers can assess absolute impact. If 12% versus 16% experience an outcome, the risk ratio is 0.75 and the risk difference is −4 percentage points. The corresponding number needed to treat is 25 over the stated horizon, but its uncertainty may be wide and it depends on the population's baseline risk. Relative effects often appear more impressive than their absolute impact.

```r
with(dat, c(
  risk_treat = mean(event[arm == "treatment"]),
  risk_control = mean(event[arm == "control"])
))
tab <- with(dat, table(arm, event))
prop.test(tab[, "1"], rowSums(tab), correct = FALSE)
```

The code assumes `event` is coded 0/1 and the table columns are labeled accordingly. For small samples, clustered allocation, stratification, or covariate-adjusted estimands, use the corresponding design-aware analysis rather than this simple comparison. The report should identify whether the effect is crude, adjusted, marginal, or conditional.

## Interpreting intervals and p-values

A 95% frequentist confidence interval arises from a procedure that would cover the fixed parameter in 95% of repeated samples under its assumptions. It is not a 95% posterior probability statement about the parameter. A Bayesian credible interval does have posterior probability interpretation conditional on the prior and model. Use the correct language, and do not switch interpretations for convenience.

A p-value is the probability, assuming a particular null model and analysis procedure, of data at least as incompatible with that null as those observed. It is not the probability the null is true, the probability results are “due to chance,” or a measure of clinical importance. The threshold 0.05 is conventional, not a scientific boundary. Estimates just above and below it can be nearly identical.

Confidence intervals also need careful interpretation. They summarize uncertainty under a model and sampling design. A narrow interval can be precisely biased if confounding or measurement error is ignored. A wide interval may include both meaningful benefit and harm, showing that evidence is inconclusive rather than demonstrating equivalence. Equivalence or noninferiority requires a prespecified margin and an analysis designed for that question.

## From statistical effect to clinical meaning

Compare effects with a clinically important threshold established independently of the observed estimate where possible. If a symptom scale has a minimally important difference of 3 points and the estimated benefit is 2.4 with interval 0.7 to 4.1, the data are compatible with a small effect and with a clinically important effect; a p-value alone conceals that uncertainty. Consider the duration of benefit, adverse effects, burden, costs, and affected subgroups.

For prognostic outcomes, report absolute risks at a meaningful horizon in addition to relative measures. Hazard ratios do not directly translate into risk ratios. For a time-to-event analysis, predicted survival curves or restricted mean survival time differences can be easier to interpret than a single hazard ratio, especially when proportional hazards is questionable. State the time horizon and censoring assumptions.

In prediction studies, performance should include calibration, discrimination, and clinical utility rather than only AUC. In diagnostic studies, sensitivity and specificity must be accompanied by prevalence-sensitive predictive values and the reference standard. In economic evaluations, report incremental costs, effects, uncertainty, and perspective. The measure should match the decision question.

## Multiplicity, subgroups, and selective reporting

When many outcomes, time points, subgroups, or model specifications are examined, the chance of at least one apparently unusual result increases. Identify the primary endpoint and analysis as prespecified or exploratory. If multiplicity control was planned, describe the family of hypotheses and method. For exploratory analyses, report the breadth of analyses rather than presenting the most favorable estimate as a confirmatory discovery.

Subgroup claims require a test of interaction, not one significant subgroup result and one nonsignificant result. A treatment effect being statistically significant in younger patients but not older patients does not establish that effects differ. Show subgroup-specific estimates and intervals, interaction estimate and interval, and caution about low power. Avoid causal claims from post hoc subgroup partitions unless the design and analysis support them.

## Tables and figures that serve the reader

Tables should show group-specific denominators and outcome summaries alongside contrasts. Avoid duplicating every number in prose. Label units, follow-up, adjustment variables, and reference categories. Distinguish standard deviation (variation among individuals) from standard error (precision of an estimate). A forest plot can display estimates and intervals across outcomes or studies, but axis limits should not exaggerate small differences.

Figures should include meaningful labels, uncertainty where relevant, and legible scales. Survival plots need numbers at risk; calibration plots need a reference line and preferably uncertainty; longitudinal trajectories should show sample counts if attrition changes composition. Do not truncate axes in a way that visually magnifies trivial changes without a clear cue.

## Reading results against the design

Interpretation begins with how observations entered the analysis. Random assignment supports an intention-to-treat contrast when outcomes are adequately ascertained, but missing outcome data and nonadherence can threaten the comparison. In a cohort, treatment choice may reflect severity, access, or clinician preference; a regression-adjusted contrast is only causal under exchangeability, positivity, consistency, and correct analysis assumptions. In a case-control study, the sampled ratio of cases to controls is set by design, so it cannot be read as population disease prevalence.

For repeated or clustered observations, the effective amount of independent information may be closer to the number of people or clusters than the number of rows. Standard errors that ignore dependence are often too small. State the analysis unit and covariance method. If a cluster-robust method has few clusters, small-sample corrections or randomization inference may be necessary; a large person-level sample does not compensate for only a handful of independent clinics.

Model diagnostics inform interpretation but do not prove a model is correct. Check functional form, influential observations, residual structure, proportional hazards where relevant, and calibration for prediction models. A model selected after inspecting the data has additional selection uncertainty. Show sensitivity analyses for plausible specifications, especially when the substantive conclusion changes.

## When the question is equivalence or noninferiority

A nonsignificant difference in a superiority test does not show treatments are equivalent. Equivalence requires a prespecified margin defining differences small enough to be clinically negligible and a confidence interval entirely within both bounds. Noninferiority asks whether a new intervention is not unacceptably worse than control by a margin; the one-sided interval must exclude losses beyond that margin. The margin should be clinically justified and preserve a meaningful fraction of established benefit.

For example, if a noninferiority margin is 5 percentage points and the estimated risk difference (new minus standard) is 1 point with a 95% interval −2 to 4 points, the upper limit excludes a loss greater than 5 and supports noninferiority under the prespecified analysis. The same interval does not establish equality; it permits modest benefit or harm. Report the margin, direction, analysis populations, and sensitivity analyses, because departures from assigned treatment can bias toward no difference.

## More than one useful effect scale

The choice between absolute and relative scales is substantive. A constant risk ratio can imply very different risk differences for low- and high-risk populations. If baseline risk is 2%, a 25% relative reduction corresponds to 0.5 percentage points; if baseline risk is 20%, it corresponds to 5 points. Number needed to treat is the inverse of absolute risk difference, is horizon-specific, and becomes unstable near zero. Include uncertainty and avoid presenting a single NNT without its time frame.

For continuous outcomes, report the mean difference in native units and consider a standardized effect only when scales differ across studies. A standardized mean difference can conceal the real-world magnitude and depends on the chosen standard deviation. For skewed outcomes, a mean difference may be sensitive to outliers; report medians or quantiles as descriptive summaries but ensure the inferential estimand matches them. A ratio of means or log-scale difference may be preferable for multiplicative effects.

For survival endpoints, a hazard ratio is conditional on proportional hazards and compares instantaneous event rates among those still at risk. It is not a ratio of cumulative risks. If hazards are nonproportional, report time-specific effects or restricted mean survival time, such as average event-free time through a clinically chosen horizon. Absolute survival curves show how the difference evolves and support patient-centered interpretation.

## Uncertainty beyond the confidence interval

The reported interval typically quantifies sampling uncertainty under the selected model. It may not include uncertainty about confounding, outcome measurement, missing-data assumptions, model selection, transport to another setting, or implementation. State important non-sampling uncertainties separately. A precise estimate from a poorly measured endpoint or an unrepresentative convenience sample is not necessarily reliable.

Sensitivity analyses should be motivated by plausible threats, not used as a menu to find a preferred result. For unmeasured confounding, show how strong an omitted factor would need to be to change the conclusion. For missing outcomes, vary assumptions beyond MAR. For prediction, evaluate temporal and geographic transport. For meta-analysis, assess heterogeneity and small-study effects. If a result is robust across plausible assumptions, that is informative; if not, the unresolved assumptions belong in the conclusion.

Avoid describing a p-value as a measure of evidence strength without context. A p-value depends on the null, sample size, model, and analysis plan. A tiny effect in a huge dataset can produce a small p-value; an important effect in a small study can be uncertain. An interval shows a range of values compatible with the data under a procedure, though not a list of equally plausible truths. Prior evidence and study quality also shape scientific interpretation.

## A concise results checklist

Before writing the conclusion, verify that the reported population and estimand match the protocol; denominators and missingness are visible; estimates use a clear scale and unit; uncertainty is presented; the primary and exploratory analyses are distinguished; model adjustment and diagnostics are described; clinical importance and harms are considered; and the wording respects the design. Report deviations and multiplicity rather than hiding them in supplementary material. Make figures and tables interpretable without requiring the reader to infer the reference group or follow-up period.

The conclusion should summarize magnitude, uncertainty, applicability, and key limitations in that order. It should not repeat only whether a null-hypothesis threshold was crossed. If the interval remains broad, say what important benefit and harm remain plausible and what further evidence would resolve the question.

## Write conclusions that remain true when the estimate shifts

Readers often remember the headline rather than technical caveats. A useful conclusion states what the study found and the main uncertainty in a sentence that would still be accurate if the point estimate moved modestly. “The intervention reduced 90-day readmission” overstates the trial example, whose interval includes no difference. “Readmission was lower in the intervention group, but the estimate was imprecise and compatible with no difference” stays faithful to the evidence.

If an analysis was exploratory, name it as such near the result rather than only in the limitations section. If adjustment was chosen after looking at model diagnostics, describe that process. If data or code cannot be shared, explain the access route or restriction. Transparency gives readers enough information to distinguish a planned analysis from one selected after results were known.

When space is limited, retain the estimate, interval, scale, population, and horizon in the main text; secondary diagnostics can move to a supplement. A compact but complete report is more useful than a short abstract that says only “significant” or “not significant.” Abstract conclusions deserve particular care because many readers will not see the full methods or limitations.

For two studies of the same treatment, one may estimate a 3-point benefit with a 95% interval of 0.2 to 5.8, while another estimates 2.8 points with an interval of −0.5 to 6.1. The estimates are nearly identical; their p-values differ because precision differs. Calling one positive and the other negative exaggerates the evidence of inconsistency. Compare estimates and intervals directly, and if the studies can be combined, use a synthesis that represents between-study heterogeneity rather than counting “significant” results.

Good reporting helps the next researcher plan a study: an effect estimate and interval provide more information about plausible magnitudes than a binary significance label. Sharing the analysis plan, outcome definitions, and code further supports replication and cumulative evidence.

Describe absolute effects over a stated time horizon.

Include units and denominator in every main result table.

## A worked reporting example

In a randomized trial of 400 adults, 24 of 200 assigned to a counseling intervention and 32 of 200 assigned to usual care were readmitted within 90 days. Risks are 12% and 16%; the risk difference is −4 percentage points, risk ratio 0.75. An approximate 95% interval for the risk difference is −10.8 to 2.8 percentage points. The result is compatible with a potentially useful reduction but also with little benefit or slight harm. It would be misleading to state simply that the intervention “reduced readmission by 25%” without noting the relative scale, absolute risks, interval, and follow-up.

A balanced report might say: “By 90 days, readmission occurred in 24/200 (12%) participants assigned to counseling and 32/200 (16%) assigned to usual care. The risk difference was −4.0 percentage points (95% CI −10.8 to 2.8), and the risk ratio was 0.75. The interval includes no difference and remains compatible with both a clinically relevant reduction and little benefit. Follow-up was complete for 97% and 96%, respectively.” This reports the contrast without converting uncertainty into certainty.

## Language, causal boundaries, and reproducibility

Use “associated with” for observational estimates unless a causal design and assumptions justify causal language. “After adjustment” does not mean “independent effect” in a causal sense. State covariates and explain why they were selected; adjusting for a mediator or collider can introduce bias. In trials, preserve the randomized comparison as primary when appropriate and explain departures from intention-to-treat.

Avoid “trend toward significance,” “almost significant,” “proved,” and “no effect” when intervals remain compatible with meaningful effects. Prefer “the estimate was…” and “the interval was compatible with…” If results conflict with prior evidence, consider differences in population, outcome, design, and chance rather than dismissing one result by significance status.

Reproducible reporting includes protocol or analysis-plan references, software and version, model specification, transformations, missing-data approach, and deviations from planned analyses. Share code and data where ethical and lawful, or explain access restrictions. Report enough detail for independent analysts to reproduce the estimate and understand analytic flexibility.

## References and further reading

- Wasserstein RL, Lazar NA. The ASA statement on p-values: context, process, and purpose. *The American Statistician*. 2016;70:129–133. [doi:10.1080/00031305.2016.1154108](https://doi.org/10.1080/00031305.2016.1154108)
- Altman DG, Bland JM. Absence of evidence is not evidence of absence. *BMJ*. 1995;311:485. [doi:10.1136/bmj.311.7003.485](https://doi.org/10.1136/bmj.311.7003.485)
- Cumming G. The new statistics: why and how. *Psychological Science*. 2014;25:7–29. [doi:10.1177/0956797613504966](https://doi.org/10.1177/0956797613504966)
- CONSORT 2010 Statement: updated guidelines for reporting parallel group randomised trials. [doi:10.1136/bmj.c332](https://doi.org/10.1136/bmj.c332)
- STROBE Statement for reporting observational studies. [strobe-statement.org](https://www.strobe-statement.org/)
