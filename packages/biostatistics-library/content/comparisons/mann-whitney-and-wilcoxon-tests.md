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

The patient group's distribution lies well above the controls' (two-sided
p approximately 0.005),
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

## Mann–Whitney U as a probability-of-superiority estimator

For independent samples X and Y, the Mann–Whitney statistic can be
interpreted through all cross-group pairs. Define
\(\theta=P(X>Y)+\tfrac12P(X=Y)\). Its sample estimate is the proportion
of the \(n_Xn_Y\) cross-group pairs in which X is larger, counting ties as
half. Under identical distributions, theta is 0.5. A rank-sum statistic
and U statistic are affine transformations of one another; with no ties,
the null mean of U is \(n_Xn_Y/2\) and variance is
\(n_Xn_Y(n_X+n_Y+1)/12\). Tie corrections adjust variance because tied
ranks reduce the number of distinct arrangements.

Suppose a symptom score is lower after treatment. If theta defined as
\(P(Y_{treat}>Y_{control})+0.5P(tie)\) equals 0.35, then a randomly
selected treated participant has a lower score than a randomly selected
control participant with probability about 0.65, counting ties evenly.
This is not a 65% chance an individual patient benefits; it is a pairwise
population comparison. When distributions have similar shapes and spread,
a location shift can make the result interpretable as a median shift. If
shapes differ, significance may reflect distributional differences other
than medians.

```r
treated <- c(2, 3, 1, 4, 2, 5, 3, 2, 4, 1)
control <- c(4, 5, 3, 6, 4, 7, 5, 4, 6, 3)
wilcox.test(treated, control, paired = FALSE,
            exact = FALSE, conf.int = TRUE)
```

R's two-sample `wilcox.test` uses a rank-sum formulation and may report a
location-shift estimate and interval under a common-shift assumption; it
does not directly print the probability-of-superiority estimate. A
transparent estimator can be calculated by enumerating pairwise
comparisons:

```r
theta <- mean(outer(treated, control, function(x, y) {
  (x > y) + 0.5 * (x == y)
}))
theta
```

Interpret direction carefully: in this example, the function defines
theta as probability the treated score exceeds control. If lower is
better, a smaller theta indicates favorable treatment. For interval
estimation, use a bootstrap resampling participants within each independent
group or a suitable variance estimator; do not bootstrap all pairwise
comparisons as if they were independent because comparisons share
participants.

## Wilcoxon signed-rank test for paired data

For paired observations, calculate differences \(D_i=X_i-Y_i\), remove
zero differences under the chosen zero-handling convention, rank the
absolute differences, and sum ranks with positive and negative signs.
Under a null of a symmetric difference distribution centered at zero,
positive and negative signs are exchangeable conditional on the magnitudes.
The signed-rank test is not simply a test that the median difference is
zero unless symmetry is plausible. If differences are asymmetric, the
sign test tests the median direction with less power but weaker shape
assumptions. The paired t test instead targets the mean difference and
can be more efficient when its assumptions are reasonable.

```r
before <- c(8, 7, 9, 6, 8, 10, 7, 9, 6, 8)
after  <- c(6, 8, 7, 5, 6,  8, 6, 7, 7, 6)
wilcox.test(after, before, paired = TRUE,
            exact = FALSE, conf.int = TRUE)
```

With ties or zero differences, exact distributions may not be available
in the same way as in the no-tie case; software may use an approximation
or report a warning. Document the handling. The Hodges–Lehmann paired
estimate is the median of Walsh averages of differences and is a useful
location summary under the signed-rank model, but it is not always equal
to the sample median difference.

## Assumptions, design, and interpretation

## Null hypotheses and exact inference

The classical null is equality of distributions, under which group labels
are exchangeable. The Mann–Whitney statistic can also be tested against a
weaker null of \(\theta=0.5\), but interpretation and variance estimation
under alternatives with unequal shapes require care. A test calibrated for
identical distributions may reject when the probability-of-superiority
parameter is 0.5 but distributions differ in spread. Robust variance
estimators or a direct interval for theta are preferable when the sole
target is stochastic superiority rather than full distribution equality.

For small samples without ties, exact permutation distributions are
available by enumerating assignments of the pooled ranks to the two
groups. With ties, many software implementations cannot use the simple
exact calculation and switch to asymptotic approximations or conditional
enumeration. R may warn that exact p-values cannot be computed in the
presence of ties; setting `exact = FALSE` requests the normal
approximation with tie correction. This is not a reason to jitter the
observed data: artificial perturbation changes ranks and can make results
depend on arbitrary noise.

```r
small_x <- c(1, 2, 3, 4, 5)
small_y <- c(6, 7, 8, 9, 10)
wilcox.test(small_x, small_y, exact = TRUE,
            alternative = "less")
```

Here `less` means values in x tend to be lower than values in y. If lower
scores indicate improvement, this direction can represent benefit, but
that direction must be defined from the data coding and question before
analysis. One-sided rank tests have the same prespecification requirement
as one-sided t tests.

## Worked probability-of-superiority calculation

Consider treated scores (lower is better) of 2, 3, 1, 4 and control scores
of 4, 5, 3, 6. There are 20 cross-arm pairs. Count pairs for which treated
is lower: treated=1 beats all four controls (4); treated=2 beats all four
(4); treated=3 is lower than 4,5,6 (3) and ties 3 (half); treated=4 is
lower than 5,6 (2) and ties 4 (half). Thus favorable probability of
treated lower, counting ties half, is
\((4+4+3.5+2.5)/20=0.70\). This is a pairwise ranking effect, not the
proportion of patients who improve. Sampling uncertainty must account
for repeated reuse of each patient across multiple pairwise comparisons.

```r
treated <- c(2, 3, 1, 4)
control <- c(4, 5, 3, 6)
prob_treated_lower <- mean(outer(treated, control, function(x, y) {
  (x < y) + 0.5 * (x == y)
}))
prob_treated_lower # 0.70
```

The two-sided p-value from the rank-sum test does not directly test that
this estimate equals 0.5 under all unequal-shape alternatives. If theta
is the primary estimand, report an interval for theta or a rank-biserial
correlation with a justified variance method. A stratified estimator may
be preferable if randomization was stratified or if covariate adjustment
is essential.

## Choosing among rank tests and models

## Bootstrap interval for probability of superiority

When reporting the rank-sum analysis, include the direction of comparison
and whether ties were counted as half in the stochastic effect. A statement
such as “theta=0.70 for treated lower than control” is clearer than an
unlabeled U statistic, whose orientation varies by software and group
ordering.

Because each participant contributes to many pairwise comparisons, treating
the nX×nY comparisons as independent gives an incorrect standard error.
A nonparametric bootstrap resamples participants within each independent
group, recomputes theta, and uses the empirical bootstrap distribution for
an interval. If the study is paired, clustered, stratified, or randomized
within blocks, resample or permute at the design unit and preserve the
structure. A percentile interval is simple but can have poor coverage with
small samples, ties, or a highly skewed sampling distribution; compare
with an appropriate analytic or BCa method when the estimate matters.

```r
set.seed(2026)
theta_fun <- function(x, y) {
  mean(outer(x, y, function(a, b) (a > b) + 0.5 * (a == b)))
}
B <- 5000
boot_theta <- replicate(B, {
  xb <- sample(treated, length(treated), replace = TRUE)
  yb <- sample(control, length(control), replace = TRUE)
  theta_fun(xb, yb)
})
quantile(boot_theta, c(.025, .5, .975))
```

This interval targets probability that a randomly selected treated score
is higher than control, counting ties halfway. Reverse the inequality if
lower values indicate benefit, or report both directions clearly. The
bootstrap is not a substitute for the rank-test p-value under every null;
it is an interval procedure for an effect estimator. With small samples,
the empirical support can be coarse, so avoid overinterpreting decimal
precision in the limits.

## Effect interpretation with ties and ordinal scales

For ordinal outcomes, ties are not incidental: many participants can share
the same category. Counting ties as one-half gives theta a probabilistic
interpretation, while a strict probability P(X>Y) ignores ties and may
change with category frequency. Report the tie proportion and specify the
convention. If categories are clinically ordered but distances are not
equal, rank methods preserve order; an ordinal regression can estimate a
cumulative odds ratio and adjust covariates if proportional odds is
reasonable. If that assumption fails, partial proportional-odds or
multinomial models may be considered, with added complexity and different
estimands.

For a continuous endpoint, medians and IQRs help describe skew, but do not
replace theta or the Hodges–Lehmann shift estimate. The Hodges–Lehmann
two-sample estimate is the median of all pairwise differences X−Y under a
common shift model; it is not generally the difference between sample
medians. When distributions have different shapes, report the probability
effect and distribution plots rather than forcing a single location-shift
summary.

For independent groups, Mann–Whitney uses all pairwise orderings. For
paired outcomes, Wilcoxon signed-rank uses signs and ranks of within-pair
differences and relies on symmetry; the sign test uses only direction and
is more robust but less powerful. Kruskal–Wallis extends rank-sum logic to
three or more independent groups. Friedman handles blocked or repeated
measures with ranks within blocks. These tests are not interchangeable;
select the procedure that follows the assignment and measurement design.

For ordinal outcomes with covariates, proportional-odds regression can
estimate a common cumulative odds ratio if the proportional-odds assumption
is reasonable. For continuous outcomes with skewness, quantile regression
can target a median difference while adjusting for covariates. A robust
mean model may preserve the arithmetic mean estimand. Each alternative
answers a different question. Rank-based inference is useful, but does
not remove the need to define the outcome contrast precisely.

Independence applies between participants or pairs, not within each pair.
Repeated observations cannot be fed into a two-sample rank-sum test as if
independent. For clustered data, the usual rank variance is invalid unless
the clustering is modeled or resampling respects clusters. Ordinal scores
are suitable because ranks use ordering, but extensive ties reduce
information and require tie-corrected inference. If a score has a small
number of categories, ordinal regression or a stratified method may answer
the question more directly.

The test does not estimate a treatment effect in the native outcome units.
Report group distributions (medians and IQRs if appropriate), an effect
measure such as probability of superiority or Hodges–Lehmann shift, and
an interval. Do not label the Mann–Whitney test a “test of medians” without
the similar-shape/location-shift assumption. Do not select a rank test
only because a normality test rejected; consider the estimand, robustness
of mean methods, and the clinical relevance of a rank-based effect.

## References and further reading

- Mann HB, Whitney DR. [On a test of whether one of two random variables is stochastically larger than the other](https://doi.org/10.2307/3001968). *The Annals of Mathematical Statistics*. 1947;18(1):50–60.
- Wilcoxon F. [Individual comparisons by ranking methods](https://doi.org/10.1214/aoms/1177730491). *Biometrics Bulletin*. 1945;1(6):80–83.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), statistical reporting guidance.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- Agresti A. *Categorical Data Analysis*. Wiley.
- The [Kruskal–Wallis article](/biostatistics-library/comparisons/kruskal-wallis-test.html) extends the rank approach to three or more groups.
