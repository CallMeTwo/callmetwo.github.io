---
title: Quantiles and the interquartile range
summary: Percentiles, quartiles and the IQR as robust summaries of position and spread, plus Tukey fences for outlier screening.
---

## Overview

A quantile is a value below which a specified fraction of observations falls. The median is the 50th percentile; quartiles divide a distribution into four parts; the interquartile range (IQR=Q3−Q1) measures the width of the middle half. Quantiles provide distribution summaries without assuming symmetry or a normal model and are especially useful for skewed clinical data, reference intervals, and ordinal outcomes.

## Sample quantiles and conventions

In a continuous population with cumulative distribution F, the pth quantile is often defined as inf{x:F(x)≥p}. In a finite sample, many conventions interpolate between ordered observations. Different software quantile types can yield small differences, especially in small samples. State the method for formal standards or reference intervals; for routine summaries, use a consistent documented software default.

For sorted values x(1)≤…≤x(n), a sample quantile may select or interpolate around rank (n−1)p+1, but alternative definitions exist. Thus quartiles in a small study need not correspond to a literal observation. The IQR remains Q3−Q1 under the chosen convention. Round only after calculating; rounding observations first can change ranks and ties.

```r
x <- c(2, 3, 3, 4, 5, 30)
quantile(x, probs = c(.25, .5, .75, .90), type = 7)
IQR(x, type = 7)
```

R’s default type 7 is common, not uniquely correct. Keep quantile conventions consistent across arms and reports.

## Why quantiles resist extremes

Changing one very large observation usually leaves Q1, median, Q3, and IQR nearly unchanged, whereas mean and SD can shift substantially. This resistance makes quantiles useful when data have long tails, assay outliers, or detection limits. It does not mean extremes should be ignored: upper-tail risk may drive ICU use, toxicity, or resource demand. Report high percentiles or tail counts when clinically important.

Tukey fences Q1−1.5×IQR and Q3+1.5×IQR flag possible outliers for review. They are exploratory conventions, not confidence limits or definitions of erroneous data. A point beyond a fence can be a valid patient. For heavy-tailed distributions, many valid observations may be flagged; verify records and investigate rather than delete automatically.

## Percentiles and reference intervals

A reference interval often targets central 95% of values in a defined healthy reference population, commonly the 2.5th and 97.5th percentiles. It is not a confidence interval for the mean and does not mean 95% of patients are healthy or that values outside are diseased. Partitioning by age, sex, pregnancy, assay, or other variables may be necessary if distributions differ, but partitions need adequate samples and clinical rationale. Establishing a reference interval requires careful recruitment, pre-analytical control, and validation; a small convenience sample’s quantiles are not automatically normative.

Percentile curves for growth or laboratory values often vary with age. Quantile regression models conditional percentiles as predictors change, unlike ordinary regression of the mean. These curves need external validation and careful handling of sparse regions at age extremes. A 95th percentile is a population position, not a diagnostic threshold unless validated for that decision.

## IQR versus other spread measures

The IQR covers the middle 50% and shares the measurement units, making it interpretable. It is not a standard deviation and cannot be converted to one without distribution assumptions. The range uses extremes and is highly unstable. Median absolute deviation (MAD) offers another robust spread estimate; scaled MAD can estimate SD under normality but is not itself an IQR. Choose a spread measure that matches shape and purpose.

### Comparing groups and uncertainty

Reporting medians and IQRs describes each group but does not estimate the median difference with uncertainty. For that question, use quantile regression or an appropriate bootstrap/interval method. The difference in sample medians may not estimate a common location shift if distributions have different shapes. Rank tests do not automatically test median equality. For a prespecified percentile contrast, estimate it directly and provide a confidence interval.

Bootstrap quantile intervals should resample independent units and respect clustering/stratification. Quantiles near distribution tails require larger samples because few observations determine them. A reference interval’s endpoints can be uncertain even when 95% of the population is the target; report confidence limits on the endpoints when establishing clinical ranges.

## Interpreting and reporting

Give median (Q1, Q3) or median [IQR], define the notation and sample size, and state quantile method when material. For skewed trial endpoints, show group quantiles and an effect estimate that matches the target. Do not infer equivalence from similar medians or use IQR fences as an automatic exclusion rule. Quantiles describe positions in the observed distribution; design and sampling determine how well they generalize.

## Sample quantile uncertainty

For a continuous distribution with density f at quantile qₚ, the approximate variance of a sample quantile is p(1−p)/[n f(qₚ)²]. This explains why tail quantiles are imprecise: density is usually lower near the extremes. Large samples may be needed to estimate a 99th percentile reliably. Bootstrap intervals can be useful but may be unstable when few observations lie near the target quantile.

For an interval endpoint such as the 2.5th percentile, uncertainty includes sampling variability in the reference sample. Some laboratory guidance uses nonparametric order-statistic methods and requires a minimum sample size to estimate central 95% intervals. If sample size is inadequate, a parametric or robust approach may be considered, but assumptions and validation must be stated.

## Quantile regression

Ordinary linear regression models the conditional mean E(Y|X). Quantile regression models a conditional quantile Qₚ(Y|X), allowing predictors to affect the lower tail, median, and upper tail differently. For example, a treatment may reduce the median symptom score while having little effect on the 90th percentile. Coefficients are changes in the conditional quantile per predictor unit, not individual treatment effects.

```r
# Example using the quantreg package
# fit50 <- quantreg::rq(score ~ treatment + baseline, tau = .50, data = dat)
# fit90 <- quantreg::rq(score ~ treatment + baseline, tau = .90, data = dat)
# summary(fit50, se = "boot")
```

Bootstrap inference is common because quantile coefficients have nonstandard finite-sample distributions. The model still needs suitable functional form and independent-unit assumptions; cluster-robust or resampling methods should reflect the design. Quantile regression does not eliminate confounding or selection bias.

### IQR and robust scale

IQR is easy to interpret because it spans the middle half in original units. It is resistant to extreme tails but ignores them by design. Median absolute deviation is the median of |x−median(x)|; multiplying by about 1.4826 makes it consistent for SD under a normal model. These summaries are not interchangeable. For quality control or clinical thresholds, report whichever captures the relevant variability and state its definition.

## Outlier fences are not exclusion rules

Tukey fences flag observations beyond 1.5 IQR from the quartiles; “far out” fences may use 3 IQR. These were designed for exploratory box plots. Their false-flag rate depends on the distribution; a normal distribution has some valid points beyond 1.5 IQR. Review flagged records, investigate measurement process, and retain valid observations in primary summaries. Do not use fences as automatic inclusion/exclusion criteria unless a protocol defines a data-quality rule.

### Reference ranges and clinical cutoffs

A central 95% reference interval describes a distribution in a reference population. A clinical decision limit is chosen based on disease risk, treatment benefit, and harms; it may not correspond to a percentile. Confusing the two leads to misdiagnosis: 5% of healthy people fall outside a central 95% interval by construction, and disease can exist within it. Reference intervals may need partitioning or age-specific quantile curves, but extensive subgrouping needs adequate sample sizes and validation.

### Reporting quantiles

Give sample size, quantile levels, IQR definition, and method when material. State whether values are observed quantiles or model-based percentile estimates. For group comparisons, distinguish differences in sample medians from estimates of a population median contrast and include uncertainty. Include tail quantiles where safety or resource use depends on extremes. Quantiles are positions, not causal effects or measures of statistical significance.

### Quantile definitions and software

Sample quantiles differ by how empirical order statistics are interpolated. In a sample of four values, Q1 can be an observed point, a midpoint, or an interpolation depending on convention. Most large-sample reports are not materially affected, but small samples and regulatory reference ranges can be. Record software defaults in reproducible work and use a standard endorsed by the relevant laboratory or guideline.

Weighted quantiles require a definition of how survey weights accumulate across ordered observations. They are not generally obtained by applying an unweighted function to repeated values. For complex surveys, use design-aware routines and report the target population and uncertainty.

### Quantiles for skewed outcomes

Median and IQR are robust summaries for right-skewed costs, CRP, and length of stay. But the IQR can miss a long upper tail that dominates cost or safety burden. Add 90th/95th percentile, maximum, or proportion above a clinical threshold as appropriate. The maximum is highly sample-size-dependent, so it should not be compared without context.

### Reference interval versus decision threshold

A reference interval describes a central portion of a selected reference population. A clinical cutoff aims to distinguish states or trigger action and is selected using consequences, diagnostic accuracy, and values. A percentile can be a candidate threshold but needs external validation. State which concept applies; otherwise readers may mistake a statistical quantile for a disease boundary.

### Quantile differences and treatment effects

The difference between two sample medians is descriptive; its uncertainty requires a method for a quantile contrast. Quantile regression can adjust for baseline covariates and estimate conditional median differences, while bootstrap methods can estimate uncertainty for marginal quantiles. If the distributions differ in shape, there may be no common additive shift. Show more than the median when treatment affects lower and upper tails differently.

For skewed outcomes, report median and IQR by arm plus a prespecified effect such as a median difference, restricted mean, or probability index with interval. A rank test p-value is not a confidence interval for the median difference.

### Reference intervals require a reference population

A “normal range” is only meaningful relative to who was sampled, how the assay was performed, and which exclusions were applied. Reference individuals should represent the intended healthy population and pre-analytical conditions. Age, sex, pregnancy, ethnicity, altitude, and medication can alter distributions; partitioning should be supported by clinical and statistical evidence. A central 95% reference interval is not a universal disease threshold and should not be copied across assays without verification.

Reference interval endpoints are estimated quantiles. Bootstrap or order-statistic confidence limits can show endpoint uncertainty. With too few reference participants, a nonparametric 2.5th/97.5th percentile estimate is unstable. Report the method and sample size, and distinguish establishing, transferring, and verifying an interval.

### Outlier fences and sample size

The 1.5-IQR rule depends on sample quartiles; for small n, one observation can move the fence. Under a normal distribution, valid observations beyond the fence are expected. In very large samples, some extreme values are inevitable. Review clinical plausibility, instrument range, batch effects, and data-entry records. A flagged point should remain unless a documented error or prespecified exclusion criterion warrants removal.

### Group comparisons

For each arm, median and IQR provide separate distribution summaries but do not estimate a treatment effect. If a treatment changes the upper tail without changing the median, IQR may also miss the effect. Add clinically meaningful tail probabilities or quantiles. A quantile treatment effect compares corresponding population quantiles, but these are not necessarily effects on the same individuals because quantiles are rank-based population summaries.

### Censoring and detection limits

A laboratory value below assay detection is not an observed zero; it is known to lie in an interval. Substituting zero, the detection limit, or half the limit changes quantile estimates and can create artificial ties. If many values are censored, use methods for censored distributions or report the detectable fraction and range. Quantile methods assume observed ordering reflects the underlying values.

### Quantile summaries in publications

State median and quartiles with consistent precision, e.g. 4.2 (2.1, 8.7), and provide n. If an IQR width is shown instead, clarify that it is Q3−Q1. For a 95th percentile estimate, report uncertainty when it drives a clinical threshold or safety decision. Software interpolation details matter more in small samples and formal interval establishment.

### A concise selection guide

Use IQR for robust central spread, but add tail summaries when extreme outcomes matter. Use quantile regression for covariate-dependent percentiles, and a reference interval only when the source population is clinically appropriate. Keep reference percentiles distinct from diagnostic cutoffs and individual prediction intervals.

### Worked Tukey fence example

Suppose Q1=3 and Q3=7 days, so IQR=4. The lower fence is 3−1.5(4)=−3 and upper fence 7+1.5(4)=13. A 20-day stay is flagged in a box plot, but a negative lower fence is clinically impossible and the flagged long stay may be valid. The rule identifies a point relative to the central spread; it does not define biological plausibility or exclusion.

```r
x <- c(2, 3, 3, 4, 5, 6, 7, 8, 20)
q <- quantile(x, c(.25, .75))
iqr_x <- diff(q)
upper <- q[2] + 1.5 * iqr_x
x[x > upper]
```

Review flagged observations against source records, instrument limits, and clinical context. Keep valid values in primary analysis and describe sensitivity if influential.

### Sample quantile method

R’s quantile default interpolates between ordered observations. Small-sample quartiles from other software may differ due to alternative definitions. This rarely changes broad interpretation but can affect a fence or formal reference interval endpoint. Keep the convention consistent and state it when precision is important.

### Reference intervals and decision limits in practice

For a central 95% reference interval, roughly 5% of healthy reference individuals fall outside by construction. That does not imply an abnormal clinical state. A decision limit is selected by balancing consequences of false positives/negatives, clinical outcomes, and treatment thresholds. State whether an endpoint is a reference interval, diagnostic cutoff, or percentile benchmark.

For monitoring change within an individual, population reference intervals can be less useful than reference change values that incorporate analytical and within-person biological variation. Quantile position alone does not account for assay precision or individual baseline.

### Interpreting percentile shifts

A treatment effect at the 90th percentile can reveal a change in the upper tail that the median misses, but quantiles at different treatment arms do not track the same individuals. Quantile treatment effects are contrasts between population distributions. They are useful for distributional impacts, but do not imply that every participant at percentile 90 experiences the estimated change. Present the estimand plainly and report uncertainty.

### Robust does not mean unbiased

Sample quartiles resist extreme observations but can still be biased for a target population under selection or measurement problems. The IQR does not protect against a sample that excludes severe patients or a scale with a floor effect. Robustness refers to sensitivity to contamination in the observed data, not representativeness or validity.

### Practical summary

Quantiles provide robust positions in a distribution, and IQR describes the middle half. They are valuable for skew and ordinal data, but tail estimates need adequate sample size and conventions can matter in small samples. Distinguish sample summaries, population reference intervals, decision thresholds, and quantile treatment effects. Report method and uncertainty when quantiles drive clinical decisions.

### Quantile plot interpretation

A quantile-quantile plot compares quantiles from two distributions. Points near a diagonal indicate similar shapes, while systematic curvature indicates differences in spread or tails. It can compare treatment arms without reducing the comparison to one test. Interpretation still depends on sample size and overlapping quantile ranges; extreme tail points are noisy. Use it as a diagnostic and pair with effect estimates.

### IQR under transformations

A monotone transformation preserves ordering and therefore transforms quantile positions, but the IQR width changes scale. The difference Q3−Q1 on a log scale represents multiplicative spread after back-transformation, not the raw-scale difference. Report the scale and avoid comparing IQRs across transformations as if they were the same quantity.

When the clinical question concerns a threshold, report the percentile and the proportion crossing the threshold with uncertainty. A percentile alone does not indicate sensitivity, specificity, or clinical utility. Validate cutoffs in a target population before using them for diagnosis or treatment.

### Quantiles and patient-level interpretation

A 90th percentile says that approximately 90% of the target distribution lies at or below that value under the population model. It does not guarantee that a specific patient has a 90% chance of being below it when covariates differ. Conditional percentiles from quantile regression may be more appropriate for age- or severity-specific interpretation, but require model validation.

When endpoint quantiles are reported, include the probability level, units, sample size, and estimation method so the value can be reproduced.

Use a consistent quantile convention across groups and clearly distinguish sample quartiles from model-based percentile estimates.

A narrow IQR describes central concentration but does not rule out clinically important rare events in either tail.

## References and further reading

- NIST/SEMATECH. [Quantiles](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm).
- Hyndman RJ, Fan Y. [Sample quantiles in statistical packages](https://doi.org/10.1080/00031305.1996.10473566). *The American Statistician*. 1996.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Greenland S, Rothman K, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.

The [histograms and box plots article](histograms-and-box-plots.html) shows
these quantities graphically.
