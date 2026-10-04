---
title: Kruskal–Wallis test
summary: A rank-based omnibus test for whether three or more independent groups differ in distribution.
---

## Overview and key ideas

The Kruskal–Wallis test is the nonparametric counterpart of one-way ANOVA.
It asks whether three or more independent groups come from the same
distribution, using only the ranks of the observations rather than the raw
values.

The procedure is straightforward:

- Pool all N observations across the k groups and rank them 1 to N
  (assigning average ranks for ties).
- Sum the ranks within each group, giving rank sums R1, R2, ..., Rk.
- The test statistic H measures how unevenly those rank sums are spread
  relative to what chance would produce: H = (12 / N(N+1)) × Σ(Rj²/nj)
  − 3(N+1), where nj is the size of group j.
- Under the null hypothesis that all groups share the same distribution, H
  is approximately chi-square distributed with k − 1 degrees of freedom
  (exact tables or permutation p-values are preferred for small samples).

A large H means at least one group's values tend to occupy a different part
of the overall ordering than the others — for example, one group is
consistently higher than the rest. Like ANOVA, a significant result is only
an omnibus signal: it tells you the groups are not all alike, not which
pairs differ. Follow up with pairwise rank comparisons (e.g. Dunn's test
with a multiple-comparison adjustment) if the design justifies it.

For two groups the Kruskal–Wallis test is algebraically equivalent to the
Mann–Whitney test, so the choice between the two is simply k = 2 versus
k ≥ 3.

## When to use it

| Setting | Example question |
| --- | --- |
| Skewed continuous outcome, 3+ groups | Does viral load at week 4 differ across four treatment regimens? |
| Ordinal severity scale, multiple arms | Do three rehabilitation programmes produce different ordinal pain-severity ratings? |
| Outlier-prone biomarker | Does a liver enzyme differ across four BMI categories when values are heavily right-skewed? |
| Dose levels | Do the three dose levels of an antihypertensive differ in the magnitude of BP fall? |

Use the Kruskal–Wallis test when you have three or more independent groups
and the outcome is continuous but skewed, contains extreme outliers, or is
measured on an ordinal scale. For paired or repeated measurements use
Friedman's test instead; for exactly two groups the Mann–Whitney test is the
direct equivalent.

## Assumptions and limitations

- **Independence** — each subject belongs to exactly one group, and subjects
  are independent. Repeated measures, matched samples, or clustering
  (several patients per clinic) violate this and require Friedman's test,
  mixed models, or cluster-robust methods.
- **No normality required**, but the null hypothesis is that all k
  distributions are identical. If the groups differ in shape or spread as
  well as location, a significant H does not by itself mean the medians
  differ. When the distributions have similar shapes, the test is effectively
  a test of a common shift in location.
- **Small samples** — with very small groups (e.g. fewer than 5 per arm) the
  chi-square approximation is poor; use exact or permutation-based
  p-values, and be aware the test has limited power to separate more than
  one group from the rest.
- **Ties** — common in ordinal or rounded data; standard tie-corrected
  formulas handle them, but extensive tying reduces the effective sample
  size and the discrimination of the test.
- **The test is omnibus only.** It does not tell you which pairs of groups
  differ. Pre-specify pairwise follow-up comparisons (with a
  multiple-comparison adjustment such as Bonferroni or Holm) rather than
  exploring all pairs post hoc without correction.

## Worked example

A study randomised 36 patients to three smoking-cessation strategies
(n = 12 each). Six months later, the number of quit attempts (a skewed
count-like outcome, range 0–14) was recorded.

- Group A (counselling only): ranks sum R1 = 132
- Group B (nicotine patch): ranks sum R2 = 222
- Group C (combination therapy): ranks sum R3 = 312

H = (12 / (36 × 37)) × (132²/12 + 222²/12 + 312²/12) − 3 × 37
  = (12/1332) × (1452 + 4107 + 8112) − 111
  = (12/1332) × 13671 − 111
  ≈ 123.16 − 111 = 12.16 (before any tie correction)

With 2 degrees of freedom, H = 12.16 gives an asymptotic p-value of about
0.0023. The rank sums suggest that observations in group C tend to be higher,
but the omnibus result alone does not establish which pairs differ. A
prespecified Dunn comparison with Holm adjustment would be needed for those
claims; the rank sums here are illustrative rather than raw data from which
those adjusted pairwise results can be reconstructed.

## Interpretation and common pitfalls

- **Significant H ≠ all pairs differ.** With k = 4 groups, one elevated
  group can drive the omnibus result while the other three are
  indistinguishable. Report the group medians and IQRs, and follow up with
  pre-planned pairwise comparisons if the clinical question requires it.
- **This is not a test of medians.** The null is identical distributions.
  Reporting "the medians differ significantly (Kruskal–Wallis p = ...)"
  overstates the inference; present the medians as descriptive summaries and
  state the null hypothesis explicitly.
- **Do not use Kruskal–Wallis just because n is small.** With large samples
  and roughly normal data, one-way ANOVA is more powerful. The rank test is
  preferable when normality is genuinely doubtful or the outcome is ordinal.
- **Post hoc without adjustment inflates type I error.** Running k(k−1)/2
  unadjusted pairwise Mann–Whitney tests after a significant omnibus result
  can produce false positives; apply Bonferroni, Holm, or Dunn's corrected
  procedure.

## Rank statistic, tie correction, and effect size

Pool all N observations and assign ranks, averaging tied ranks. Let Rj be
the sum of ranks in group j. The Kruskal–Wallis statistic before tie
correction is
\(H=\frac{12}{N(N+1)}\sum_j R_j^2/n_j-3(N+1)\). When there are no ties,
H is approximately chi-square with k−1 degrees of freedom under the null
that group distributions are identical. With ties, divide by
\(C=1-\sum_g(t_g^3-t_g)/(N^3-N)\), where tg is the size of tie group g.
The correction matters for discrete or ordinal outcomes with many repeated
values. For small samples, an exact permutation distribution can be more
reliable than the chi-square approximation.

The null is equality of distributions, not invariably equality of medians.
If shapes and spreads are similar, a difference in location is a reasonable
interpretation. If distributions differ in variance or shape, H can reject
without median differences. Inspect group-specific distributions and
report the median and IQR, but do not claim the test is specifically a
median test unless the location-shift assumptions are defensible.

An effect-size summary can be epsilon-squared, often computed as
\((H-k+1)/(N-k)\), with variants in use; report the exact convention.
Rank-based pairwise contrasts or probability-of-superiority measures may
be more interpretable. A significant omnibus H does not identify which
groups differ; follow-up tests need multiplicity control.

## Worked example and implementation

Imagine pain scores in three independent treatment groups, with n=8 each.
If pooled ranks sum to 60, 100, and 140 (grand rank total 300; expected
rank sum per group is 100), then
\(H=12/[24(25)](60^2/8+100^2/8+140^2/8)-3(25)=8.0\)
before tie correction. With 2 degrees of freedom, the asymptotic p-value
is about 0.018. The
calculation says that the rank distributions differ overall; it does not
show whether group 1 differs from group 2 or whether the difference is
clinically meaningful.

```r
g1 <- c(1, 2, 2, 3, 3, 4, 4, 5)
g2 <- c(3, 4, 4, 5, 5, 6, 6, 7)
g3 <- c(4, 5, 6, 6, 7, 7, 8, 9)
y <- c(g1, g2, g3)
group <- factor(rep(c("A", "B", "C"), each = 8))
kruskal.test(y ~ group)
```

The code uses real individual-level observations and automatically applies
the tie correction. For sparse ordinal data, use a permutation test that
reassigns group labels according to the actual randomization scheme.
If follow-up pairwise comparisons are planned, use a method such as Dunn's
test with Holm adjustment or pairwise Wilcoxon tests with an explicit
adjustment. Base R can perform the latter:

```r
pairwise.wilcox.test(y, group, p.adjust.method = "holm",
                     exact = FALSE)
```

This pairwise procedure does not automatically estimate a median
difference. Provide effect estimates and intervals for the comparisons,
and avoid interpreting a sequence of rank-test p-values without the
underlying group distributions.

## Assumptions and alternatives

## Pairwise follow-up and adjusted inference

After a significant omnibus result, identify comparisons that answer the
study question. Dunn's test compares mean ranks between groups using the
pooled rank variance; Holm adjustment controls familywise error across
the chosen family. Pairwise Wilcoxon rank-sum tests are another option,
but their unadjusted p-values must be adjusted and their estimands are
pairwise distributional comparisons. If the follow-up is treatment versus
shared control, a control-focused rank procedure can be more efficient
than all pairs. Report estimates, intervals, and group summaries, not just
which pairs pass a threshold.

Permutation inference can calibrate H without relying on the asymptotic
chi-square approximation. Under random assignment, permute treatment
labels according to the actual randomization mechanism, recompute H each
time, and compare the observed statistic with the simulated null
distribution. If randomization was stratified or clustered, permutations
must preserve those restrictions. Arbitrarily permuting all labels can
break the design and yield invalid inference. The permutation test is
exact only when all allowed assignments are enumerated; Monte Carlo
permutation approximates the tail probability, with uncertainty depending
on the replicate count.

```r
set.seed(19)
obs <- unname(kruskal.test(y ~ group)$statistic)
B <- 20000
perm <- replicate(B, {
  perm_group <- sample(group)
  unname(kruskal.test(y ~ perm_group)$statistic)
})
(1 + sum(perm >= obs)) / (B + 1)
```

This unrestricted permutation code is suitable only for independent,
exchangeable group labels under the null. If observations were blocked or
cluster-randomized, permute within blocks or at the cluster level. The
plus-one correction avoids reporting a simulated p-value of zero; Monte
Carlo standard error near p is approximately \(\sqrt{p(1-p)/B}\).

## Rank effects and clinical interpretation

## Effect-size calculation for the worked study

In the smoking-cessation example, H=12.16, k=3, and N=36. Using the
common epsilon-squared estimate \((H-k+1)/(N-k)\) gives
\((12.16-3+1)/(36-3)=10.16/33\approx0.31\). This summarizes the rank
separation in the sample under that convention; it is not literally the
proportion of outcome variance explained in original quit-attempt units.
Bias-corrected alternatives can be negative in small samples and may be
truncated for presentation, but the formula should be named because
authors use different rank effect-size definitions. Pairwise stochastic
dominance or rank-biserial effects can better localize the differences.

The original rank sums also permit a rough location summary. Average
ranks are 11, 18.5, and 26 for the three groups, compared with the pooled
grand mean rank 18.5. Group C tends higher in the ordering, but the rank
sums alone do not reconstruct group medians, IQRs, or pairwise intervals.
The raw measurements are necessary for those summaries. This distinction
is important when an article presents only a Kruskal–Wallis H and then
makes detailed pairwise claims.

## Sample size, ties, and attainable information

## A reproducible analysis report

If the outcome has many zero values, ranks assign an extensive tie at the
bottom and the test may have little ability to distinguish groups. A
two-part analysis may be more meaningful: compare any-versus-none and,
among positive observations, compare amount. This changes the question
and requires a prespecified multiplicity plan, but can reflect a
zero-generating clinical process better than one omnibus rank statistic.

For very small randomized groups, a permutation p-value can align directly
with the assignment mechanism and avoid reliance on the chi-square tail
approximation. It still tests a sharp null under randomization and does not
by itself estimate a median shift. If assignment probabilities differ by
stratum, preserve each stratum's allocation when permuting; otherwise the
reference distribution no longer represents the actual design.

For ordered severity categories, present a stacked bar plot or cumulative
proportion plot in addition to medians. Medians can conceal distributional
changes when most observations occupy a small number of levels. If
category order is clinically meaningful, a proportional-odds model can
estimate the odds of being at or above each severity threshold; check the
proportional-odds assumption rather than assuming a single cumulative OR
fits all cut points. The rank-sum omnibus result remains a useful
distributional check, but does not adjust for baseline severity or other
prognostic factors.

For the smoking-cessation illustration, group medians and IQRs should be
calculated from raw observations, then presented with the omnibus result
and an effect measure. The following pattern gives the core summaries and
the common epsilon-squared estimate from a fitted H statistic:

```r
aggregate(y, list(group = group), function(z) {
  c(n = length(z), median = median(z),
    q1 = unname(quantile(z, .25)), q3 = unname(quantile(z, .75)))
})
kw <- kruskal.test(y ~ group)
H <- unname(kw$statistic)
k <- nlevels(group)
N <- length(y)
epsilon2 <- (H - k + 1) / (N - k)
c(H = H, df = unname(kw$parameter), p = kw$p.value,
  epsilon2 = epsilon2)
```

This is descriptive and uses the same raw data as the test. Small-sample
epsilon-squared may be negative when H is small; that reflects correction
for chance and is not a meaningful negative proportion. If truncating at
zero for presentation, state that convention and preferably report the
untruncated estimate in supplementary material. A confidence interval for
rank effect size can be obtained by resampling subjects within groups,
although small samples and ties can make the bootstrap distribution
discrete and unstable.

The omnibus test is often used as a gatekeeper before pairwise tests, but
this is not the only valid testing plan. Preplanned contrasts can be tested
directly with appropriate multiplicity control even if the omnibus test is
not significant; a gatekeeping requirement changes the family-wise
procedure and may cost power. State the hierarchy in the protocol and
avoid post-hoc rules created after viewing H.

Power for Kruskal–Wallis depends on the alternative distribution, group
allocation, and probability of ties. Rank tests can be efficient under
heavy-tailed distributions, but numerous ties reduce the number of
possible rank arrangements and can make exact p-values coarse. If an
ordinal scale has only five levels, adding participants does not create
additional measurement resolution; a cumulative-link model may use the
ordered categories more directly and allow covariate adjustment.

For planning, simulate outcomes under plausible group distributions,
including skewness and tie frequencies, then apply the intended test and
post-hoc plan. A normal-theory ANOVA calculation may not characterize
power for an ordinal or zero-inflated outcome. If the primary estimand is
a difference in medians or a probability-of-superiority, plan and analyze
that target directly. Report assumptions about allocation, effect shape,
and missingness; “nonparametric” does not mean sample-size-free or
assumption-free.

For two groups, probability of superiority
\(P(Y_1>Y_0)+0.5P(tie)\) is an interpretable rank effect; the Mann–Whitney
article develops it in detail. For more groups, pairwise probabilities
and rank-biserial effects can describe which distributions differ. These
effects are not measured in the original outcome units and can be
invariant to monotone transformations, which is useful for ordinal
outcomes but limits direct clinical translation. Include medians and IQRs
and show distributions so the rank contrast remains grounded in the data.

Kruskal–Wallis can reject because one group has a much wider spread, even
if group medians coincide. For instance, two centered distributions with
different variances can have unequal pooled rank distributions. A
significant result then does not imply that one group tends to have higher
values in a simple location-shift sense. Compare empirical distribution
functions and quantiles, and consider a scale-sensitive model if spread
is itself the scientific endpoint.

The test also has limited power for subtle alternatives when the outcome
is truly Gaussian and the mean is the target; ANOVA uses magnitude
information that ranks discard. Conversely, ranks can be robust when
outliers or ordinal scales make mean comparisons inappropriate. The
choice is a trade-off between robustness and efficiency, not a contest in
which one method is universally assumption-free.

Independent groups are required. If the same individuals contribute
several conditions or matched observations, use Friedman test or a
repeated-measures model rather than Kruskal–Wallis. If there are covariates,
a simple rank test cannot adjust for them; consider quantile regression,
cumulative-link ordinal regression, or a model targeting the desired
contrast. If the outcome is continuous and assumptions for a mean model
are reasonable, Welch ANOVA can be preferable because it retains the
mean-difference estimand and handles unequal variances.

The test's robustness to non-normality should not be overstated. It is
robust to some distributional features because it uses ranks, but loses
information about distances between values and can have low power when
normal-model assumptions hold. Ties, different shapes, unequal sample
sizes, and post-hoc testing all affect behavior. Choose the method from the
scientific estimand and data-generating design, and report enough
descriptive information for readers to understand what changed.

## References and further reading

- Kruskal WH, Wallis WA. [Use of ranks in one-criterion variance analysis](https://doi.org/10.1080/01621459.1952.10483441). *Journal of the American Statistical Association*. 1952;47(260):583–621.
- Dunn OJ. [Multiple comparisons using rank sums](https://doi.org/10.1080/00401706.1964.10490181). *Technometrics*. 1964;6(3):241–252.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), statistical reporting guidance.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- Bland J, Altman D. *Statistics with Confidence*. BMJ Books.
- The [Mann–Whitney and Wilcoxon article](/biostatistics-library/comparisons/mann-whitney-and-wilcoxon-tests.html) covers the two-group counterpart.
