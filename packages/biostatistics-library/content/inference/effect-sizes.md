---
title: Effect sizes
summary: Measures of how large an association or treatment effect is - risk differences, risk ratios, odds ratios, hazard ratios, and standardised mean differences.
---

## Overview

An effect size expresses the magnitude of a difference or association. Unlike a p-value, it does not combine magnitude with sample size into one thresholded signal. The right measure depends on the outcome scale, design, and decision: a risk difference answers absolute impact; a risk ratio compares relative risks; a mean difference preserves the original units; a standardized mean difference facilitates comparison across instruments but loses direct clinical meaning.

## Match the scale to the decision

Suppose 30 of 200 control participants and 20 of 200 treated participants are readmitted. Risks are 15% and 10%. The risk difference is −5 percentage points, risk ratio 0.67, and odds ratio (20/180)/(30/170)=0.63. The absolute reduction gives an NNT of 1/0.05=20 over the stated follow-up, while the relative measures describe proportional change. NNT is meaningful only with a defined population and time horizon; it is not a timeless property of a drug.

```r
control <- c(event = 30, nonevent = 170)
treated <- c(event = 20, nonevent = 180)
risk_c <- control[1] / sum(control)
risk_t <- treated[1] / sum(treated)
c(risk_difference = risk_t - risk_c,
  risk_ratio = risk_t / risk_c,
  odds_ratio = (treated[1] / treated[2]) /
               (control[1] / control[2]),
  nnt = 1 / (risk_c - risk_t))
```

This calculation is unadjusted. Random variation is substantial, so report confidence intervals, preferably using methods suited to the effect scale. For an adjusted trial estimate, distinguish model-based marginal risks from conditional odds ratios; logistic-regression coefficients are conditional and odds ratios are non-collapsible, so they can differ from crude ratios even without confounding.

## Continuous outcomes and standardized effects

For a continuous endpoint, the mean difference is usually easiest to interpret: a 3 mmHg reduction in pressure or a 1.2-point change on a validated scale. Cohen’s d divides the mean difference by a pooled SD and supports synthesis across scales, but conventions such as “small” or “large” are context dependent. Hedges’ g corrects small-sample bias in d. Standardization can conceal clinically meaningful units and can vary across populations when variability differs.

For binary outcomes, report absolute and relative measures together when feasible. Relative reduction may look impressive when baseline risk is tiny: reducing risk from 2 in 10,000 to 1 in 10,000 is a 50% relative reduction but only one fewer event per 10,000. Conversely, a moderate relative effect can have large absolute impact in a high-risk population.

### Uncertainty, heterogeneity, and interpretation

An effect estimate is not a property of the intervention independent of context. Baseline risk, adherence, co-interventions, follow-up, and outcome definition influence observed absolute effects. A single average may mask variation across clinically important groups; subgroup claims require interaction evidence and multiplicity awareness, not separate “significant / nonsignificant” labels.

Report direction explicitly, define the reference group, show units, interval, and analysis population. Do not infer importance from a standardized threshold or statistical significance. Compare the full interval with a prespecified minimal important difference and discuss both benefit and harm. For observational studies, an effect-size label such as “risk ratio” does not imply a causal effect: design and confounding control determine that interpretation.

## Effect measures encode different questions

For binary outcomes, risk difference (RD), risk ratio (RR), and odds ratio (OR) are mathematically related but not interchangeable. RD is additive and directly describes excess events per population. RR is multiplicative and often easier to compare across baseline risks. OR compares odds and is the natural parameter of logistic regression, but it approximates RR only when outcomes are uncommon. In a randomized study with risks 0.10 and 0.15, RD=−0.05 and RR=.67, while OR=.63; if risks were 0.40 and 0.60, the same RR of .67 would correspond to OR=.44. The apparent magnitude depends on scale.

For a time-to-event outcome, a hazard ratio compares instantaneous event rates among participants still event-free at each time; it is not generally a risk ratio at a fixed time. If hazards are not proportional, one summary HR can hide changing effects. Consider reporting standardized survival probabilities, restricted mean survival time difference, or risk difference at a clinically justified horizon. Competing risks alter cumulative incidence and must be reflected in the measure.

## Standardization and small-sample correction

A standardized mean difference removes units by dividing the mean difference by a pooled SD. Cohen’s d is convenient for meta-analysis across instruments, but an SD depends on population heterogeneity, eligibility criteria, and measurement reliability. A change in d can reflect a changed denominator even if the raw treatment contrast is unchanged. Hedges’ g multiplies d by a small-sample correction, approximately J≈1−3/[4df−1], reducing upward bias in small samples. Neither converts a test statistic into a universal clinical scale.

For correlation, r summarizes linear association on a bounded scale, while regression coefficients describe expected change on the outcome scale per unit predictor, conditional on modeled covariates. A nonlinear or nonmonotone relationship can have low Pearson correlation despite a strong pattern. Explain the scale and shape; “effect size” is not one statistic.

### Intervals, baseline risk, and transportability

Uncertainty for an effect size should use a method compatible with its sampling distribution. For ratios, work on the log scale; for RD, account for the joint variance of the two proportions; for standardized effects, account for uncertainty in the pooled SD. Profile-likelihood, score, bootstrap, or Bayesian intervals may behave better than a simple Wald formula in small samples. If multiple groups or clusters are sampled, reflect that design.

Absolute benefit varies with baseline risk even if the relative effect is stable. For RR=.8, a baseline risk of 2% yields a treated risk of 1.6% and RD=−0.4 percentage points; baseline risk of 20% yields treated risk 16% and RD=−4 points. The implied NNTs are 250 and 25 over the same period. Transporting an effect to a new setting requires assessing baseline-risk distribution, eligibility, care, competing interventions, and whether the relative effect itself changes.

## Heterogeneity and subgroup interpretation

A pooled effect averages over participants and depends on how averaging is performed. Marginal and conditional effects can differ even without confounding: odds ratios are non-collapsible. Subgroup-specific effects should be interpreted using interaction contrasts, not the common error of declaring a difference because one subgroup’s p-value is below .05 and another’s is not. Prespecified subgroup effects with intervals and multiplicity awareness are preferable to an unplanned collection of point estimates.

## A reporting pattern

State the outcome frequency or distribution, contrast direction, estimand, measure, interval, follow-up horizon, and adjustment set. For instance: “At 12 months, admission occurred in 10% (20/200) under intervention and 15% (30/200) under usual care; marginal RD −5.0 percentage points (95% CI …), RR .67 (95% CI …).” Then discuss whether the absolute effect meets a patient-important threshold. NNT/NNH should be derived from absolute risks with the interval and horizon clear; when the RD interval crosses zero, the NNT interval is discontinuous and should not be reported as a deceptively simple finite range.

## Calculating uncertainty for absolute and relative effects

For independent binomial groups, the approximate standard error of a risk difference pT−pC is √[pT(1−pT)/nT+pC(1−pC)/nC]. A Wald interval uses this SE, although score-based intervals can have better coverage, particularly near boundaries. For a risk ratio, work on log(RR): its approximate variance is (1/a−1/nT)+(1/c−1/nC), where a and c are event counts in the treatment and control groups, then exponentiate the interval. Zero cells require methods beyond a direct plug-in formula.

```r
a <- 20; nT <- 200
c <- 30; nC <- 200
pT <- a / nT; pC <- c / nC
rd <- pT - pC
se_rd <- sqrt(pT * (1-pT) / nT + pC * (1-pC) / nC)
rd_ci <- rd + qnorm(c(.025, .975)) * se_rd
rr <- pT / pC
se_log_rr <- sqrt(1/a - 1/nT + 1/c - 1/nC)
rr_ci <- exp(log(rr) + qnorm(c(.025, .975)) * se_log_rr)
list(RD = rd, RD_CI = rd_ci, RR = rr, RR_CI = rr_ci)
```

These are large-sample intervals, not universal defaults. With sparse counts, use score or exact methods and report limitations. A confidence interval for NNT is not obtained by simply taking reciprocals of two RD endpoints when the interval crosses zero; the effect may include benefit and harm, producing disjoint ranges. Present the RD interval directly and explain this uncertainty.

## Clinical importance and minimal important differences

A minimal clinically important difference (MCID) is an interpretive benchmark, not a universal property of an instrument. Anchor-based approaches compare score changes with patient judgments or clinical events; distribution-based approaches relate change to measurement variability. MCIDs can vary by baseline severity, condition, treatment burden, and direction of change. If the estimated effect is smaller than an MCID but its interval includes larger benefit, the result is uncertain; if the entire interval lies below the threshold, a clinically important average benefit is less compatible with the data under the model.

Measurement reliability also affects standardized effects. Classical measurement error increases observed SD and can attenuate correlations and standardized mean differences. Conversely, a restricted-range population can inflate a standardized effect for the same raw contrast. Report raw units whenever possible and clarify the instrument version and scoring direction.

### Effects from observational data

In observational studies, a measure such as adjusted risk ratio remains an association unless assumptions for causal identification are justified. Confounding, selection, measurement error, and positivity violations can distort both point estimates and intervals. Narrow uncertainty around a biased association is not causal precision. If causal language is intended, state the target trial or estimand, adjustment strategy, and sensitivity analyses for unmeasured confounding. Absolute effects derived from adjusted models may depend strongly on the target population’s covariate distribution.

### Meta-analysis and heterogeneity

Standardized effects are commonly pooled when studies use different instruments, but the scale assumes constructs and population variabilities are sufficiently comparable. Random-effects meta-analysis distinguishes within-study uncertainty from between-study heterogeneity; a pooled average can conceal a wide distribution of effects. Report prediction intervals when enough studies support them, and interpret heterogeneity in relation to populations and methods rather than relying only on I². For binary outcomes, odds ratios are statistically convenient but may be difficult to interpret; translating to absolute risks requires an explicit baseline-risk assumption.

### Patient-level interpretation of a mean contrast

Suppose a symptom scale ranges from 0 to 100 and a randomized trial estimates a 4-point average improvement with a 95% CI from 1 to 7. If a patient-level MCID is 5 points, the interval includes effects below and above that threshold. The average effect does not imply that each patient improves by four points: responses vary, some may worsen, and the mean summarizes a distribution. Report the outcome distribution, responder proportions under a prespecified threshold, or quantiles if individual variation is clinically important. Responder analysis loses information and can be sensitive to the chosen cutoff, so it complements rather than replaces the continuous outcome.

### Standardized effects in planning

When sample size planning uses a standardized mean difference, d=δ/σ, the assumed SD is as important as δ. If scale reliability is lower or population heterogeneity larger than expected, the observed d shrinks and power falls. Pilot estimates of SD are noisy, especially in small pilots; conservative ranges and blinded sample-size re-estimation can reduce sensitivity to this uncertainty. Do not use the observed treatment effect from a small pilot as the sole planning target, as it is vulnerable to selection and exaggeration.

### Treatment benefit and harm on a common scale

Net clinical benefit can require comparing effects on outcomes with different scales, such as fewer hospitalizations against more adverse events. A single standardized effect is not enough; decision analysis needs weights or utility functions that reflect patient preferences and severity. Report each outcome’s absolute and relative effect with uncertainty, then make the value assumptions explicit. An NNT and NNH can be compared only with the same time horizon and comparable populations. Event severity and reversibility matter as much as numerical frequency.

### Effect-size reproducibility

Before extracting results for a review, record the exact contrast, scale, time, analysis population, and whether estimates are adjusted. A standardized effect calculated from change scores can differ from one calculated from endpoint scores because the SD denominator and correlation differ. Conversions between odds ratios, risk ratios, and standardized differences require assumptions; document them. Precision-weighted synthesis should not mix compatible-looking metrics that answer different causal or descriptive questions.

### Risk reduction example with uncertainty

Using the earlier counts, treated risk is 20/200=.10 and control risk is 30/200=.15. The risk difference is −.05, risk ratio .67, and approximate odds ratio .63. The NNT over one year is 1/.05=20. However, if a score interval for RD runs from −.11 to .01, the data are compatible with a benefit as large as 11 fewer events per 100 and a slight increase. Reciprocating those bounds does not produce one stable NNT interval: it spans possible harm and benefit. Report the risk-difference interval; discuss NNT only with proper transformation and sign convention.

Absolute and relative measures should be shown together when readers face a treatment choice. Relative measures help compare intervention effects across settings, while absolute effects reflect baseline risk and determine likely event reduction. If transporting a trial result to a high-risk population, provide standardized absolute risks under explicit assumptions rather than multiplying a relative effect without checking effect modification.

### Standardized response thresholds

A responder analysis classifies participants as improved by at least an MCID. This can make results clinically legible, but discards information and can create a sharp boundary where the underlying scale changes continuously. Report the threshold source, responder risk difference, and the continuous outcome contrast. Sensitivity analyses using plausible thresholds can show whether the conclusion depends on an arbitrary cutoff. Avoid selecting the threshold that yields the most favorable response rate after seeing data.

### Effect modification versus subgroup noise

Treatment effects may differ across baseline risk or disease severity. On the absolute scale, even a constant relative effect yields larger benefit in higher-risk patients. This is a predictable mathematical consequence, not necessarily biological effect modification. Decide which scale matters for treatment policy, test interactions on that scale, and report uncertainty. Do not infer heterogeneity from different subgroup significance labels; test the contrast of subgroup effects.

### Relative importance across populations

A treatment’s absolute effect depends on baseline risk and time horizon. A risk ratio of .75 applied to 4% risk corresponds to 1% absolute reduction and NNT=100; the same ratio at 24% risk corresponds to 6% reduction and NNT≈17. These figures assume the relative effect transports and that risk definitions match. If follow-up differs, cumulative risks are not directly comparable. Display baseline and treated risks at the same horizon and explain how estimates were standardized.

For continuous outcomes, a fixed mean difference may have different practical importance by age, baseline severity, or instrument version. Include baseline distributions and use validated thresholds cautiously. A population-level average can be useful for policy but does not substitute for individual response distributions when shared decision-making requires them.

### Odds ratios and interpretive scale

For a 2×2 table, odds are p/(1−p). An odds ratio compares those odds and is symmetric under exchanging outcome and exposure in a way the risk ratio is not. When outcome risk is low, OR approximates RR; as outcome becomes common, the gap widens. For example, if control risk is .30 and OR=.5, treatment risk is not .15. Solving pT/(1−pT)=.5×(.30/.70) gives pT≈.176, so RR≈.59. Use baseline risk to translate the OR into predicted absolute risk, and state that translation depends on the chosen baseline population.

### Continuous and binary effects together

For a continuous score, a mean difference of 4 points can be paired with a standardized mean difference for meta-analysis, but do not let the standardized number replace the original units. For binary responder outcomes, show risk differences to convey patients affected. Both summaries can coexist when they represent prespecified views of the endpoint; avoid selecting one based on significance. Sensitivity analyses on scales should be motivated by clinical meaning, not by result shopping.

### A final interpretation framework

For each effect estimate, ask four questions: what population and time does it describe; on what scale is it expressed; how precise is it; and what difference would matter to patients or decision-makers? A p-value cannot answer these alone. Absolute risk helps communicate impact, a relative effect supports comparisons, a mean contrast preserves clinical units, and a standardized measure may support synthesis. No measure is universally best.

Show estimates with intervals and the underlying group distributions or event counts. State whether an effect is adjusted and for which covariates. For observational associations, distinguish predictive from causal interpretation. Explain heterogeneity and generalizability; a precise average can conceal treatment variation across sites or baseline risks. This makes the effect-size section of a report useful beyond a binary “positive/negative” conclusion.

### Keep precision and importance distinct

A confidence interval describes sampling uncertainty around the estimated effect under the analysis assumptions. A clinically important threshold is a value judgement or evidence-based benchmark. An estimate may be statistically precise yet too small to matter, or large but too uncertain to support action. Describe both: where the estimate lies relative to the threshold and whether the interval includes values on either side. Avoid classifying an effect as “small” solely by a generic standardized cutoff.

When a measure is transformed or standardized, retain a bridge to the original units. Readers should be able to tell how many events, score points, or days correspond to the estimate in the population studied.

## References and further reading

- Cochrane. [Handbook, Chapter 6: Choosing effect measures and computing estimates of effect](https://training.cochrane.org/handbook/current/chapter-06).
- Altman DG, Andersen PK. [Calculating the number needed to treat for trials where the outcome is time to an event](https://doi.org/10.1136/bmj.319.7223.1492). *BMJ*. 1999;319:1492–1495.
- Agresti A. *Categorical Data Analysis*. Wiley.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Hedges LV, Olkin I. *Statistical Methods for Meta-Analysis*. Academic Press, 1985.
- Cummings P. The new statistics: why and how. *Journal of Child Psychology and Psychiatry*. 2012;53(10):1015–1024. [doi:10.1111/j.1469-7610.2012.02554.x](https://doi.org/10.1111/j.1469-7610.2012.02554.x)
