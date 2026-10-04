---
title: Mann–Whitney and Wilcoxon tests
summary: Nonparametric tests for whether two groups differ in distribution, using ranks instead of raw values.
---

## Overview and key ideas

The Mann–Whitney test (independent samples) and the Wilcoxon signed-rank
test (paired samples) are the rank-based counterparts of the independent and
paired t-tests. Instead of comparing means, they rank all observations and
compare where one group tends to fall within the overall ordering.

For the **Mann–Whitney test** (also called the Wilcoxon rank-sum test), pool
both groups, rank all values from smallest to largest, and sum the ranks in
one group. The test statistic W measures how far that rank sum is from what
it would be if the groups were exchangeable. Under the null hypothesis the
groups have the same distribution, so a patient in group A is equally likely
to be larger or smaller than a patient in group B. The statistic P(X > Y) —
the probability that a randomly chosen group-A observation exceeds a
randomly chosen group-B observation — is often the most interpretable
summary: it is a stochastic effect size, sometimes called "common language"
effect size.

For the **Wilcoxon signed-rank test**, rank the absolute values of the
n within-pair differences, then sum the ranks of positive differences
versus negative ones. A large imbalance in rank sums indicates a consistent
direction of change within subjects.

Because only ranks are used, both tests are insensitive to outliers and do
not require normality. They test whether the distributions *differ*, not
whether the medians or means differ, though when the two distributions have
the same shape the tests reduce to a test of a shift in location.

## When to use it

| Setting | Example question |
| --- | --- |
| Skewed continuous outcome, two groups | Does the new regimen shorten time to remission in a small, skewed dataset? |
| Ordinal scale, two groups | Do two wound-classification systems assign different severity grades to the same wounds? |
| Paired skewed differences | Does a rehab programme improve a functional score (0–100) within the same patients when the gains are skewed? |
| Outlier-prone measurements | Does the biomarker differ between controls and patients when a few patients have extreme values? |

Use Mann–Whitney for two independent groups and Wilcoxon signed-rank for
paired data. For three or more independent groups use the Kruskal–Wallis
test; for paired data across three or more time points use Friedman's test.

## Assumptions and limitations

- **Independence** — the same as for the t-tests: independent subjects
  (Mann–Whitney) or independent pairs (Wilcoxon). Clusters and repeated
  measurements still violate this.
- **No normality required**, but the null hypothesis is that the two
  distributions are identical, not merely that the medians are equal. If the
  groups differ in shape (one is skewed, the other symmetric) the test can
  be significant even when the medians are the same, and it can be
  non-significant when the medians differ but the distributions cross.
- **Equal sample sizes help.** With very unequal group sizes the
  Mann–Whitney test is more sensitive to differences in shape than in
  location, so interpret the p-value cautiously and report the P(X > Y)
  effect size as well.
- **Small samples** — exact (permutation) p-values are available and are
  preferred over the normal approximation when either group has fewer than
  about 10–20 observations.
- **Ties** — common in ordinal data or rounded measurements; standard
  tie-corrected formulas handle them, but heavy tying (many identical
  values) reduces the effective sample size and the interpretability of the
  test.

Neither test reports a difference in medians or means; report the medians
(and interquartile ranges) of both groups alongside the test result.

## Worked example

In 10 patients with rheumatoid arthritis and 10 age-matched controls, a
skewed disease-activity score (median 12, IQR 8–19 in patients; median 3,
IQR 1–5 in controls) was recorded. Pooling and ranking all 20 values, the
rank sum for the patient group is W = 143.

- Under the null the expected rank sum is 10 × (20 + 1) / 2 = 105.
- With no ties, U = W − 10×11/2 = 88 and the normal approximation gives
  z ≈ 2.84 (with continuity correction), two-sided p ≈ 0.005.
- The stochastic effect size P(patient > control) = 0.88: a randomly chosen
  patient's score exceeds a randomly chosen control's score about 88% of the
  time.

The patient group's distribution lies well above the controls' (p < 0.001),
consistent with higher disease activity. Because the outcome is skewed and
sample sizes are small, the rank test is more trustworthy here than a
t-test, which would be sensitive to the upper-tail values.

**Paired variant.** In 9 COPD patients, an 8-point breathlessness scale was
measured before and after 6 weeks of pulmonary rehab. Assuming nine nonzero
differences with distinct absolute magnitudes, the signed-rank sum in the
improvement direction is 40 of a possible 45. The exact two-sided signed-rank
p-value is about 0.039. This is evidence of a directional within-patient
change under the test assumptions; the small sample still leaves the magnitude
of improvement imprecise.

## Interpretation and common pitfalls

- **This is not a "test of medians."** The null is identical distributions.
  Reporting "the medians were significantly different (Mann–Whitney
  p = ...)" overstates what the test shows; report the medians as
  descriptive summaries, not as the estimand.
- **Ranks discard magnitude.** Two datasets can give the same p-value with
  very different clinical differences. Always report the group medians, IQRs
  (or means if appropriate), and a P(X > Y) effect size.
- **Do not use the test just because n is small.** With large samples and
  roughly normal data, the t-test is more powerful. The rank tests are
  preferable when normality is genuinely doubtful or the outcome is ordinal.
- **Ties and rounding matter.** If many subjects share the same value (e.g.
  integer scores), the standard formulas still work but the effective
  information is lower; check the number of ties and consider whether the
  ordinal scale is carrying enough resolution.

## References and further reading

- Mann HB, Whitney DR. [On a test of whether one of two random variables is stochastically larger than the other](https://doi.org/10.2307/3001968). *The Annals of Mathematical Statistics*. 1947;18(1):50–60.
- Wilcoxon F. [Individual comparisons by ranking methods](https://doi.org/10.1214/aoms/1177730491). *Biometrics Bulletin*. 1945;1(6):80–83.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), statistical reporting guidance.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- Agresti A. *Categorical Data Analysis*. Wiley.
- The [Kruskal–Wallis article](/biostatistics-library/comparisons/kruskal-wallis-test.html) extends the rank approach to three or more groups.
